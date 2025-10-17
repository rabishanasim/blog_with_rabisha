const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect, admin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get comments for a specific post
// @route   GET /api/comments/post/:postId
// @access  Public
router.get('/post/:postId', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get top-level comments (no parent)
    const comments = await Comment.find({ 
      post: req.params.postId,
      parentComment: null,
      isApproved: true
    })
      .populate('author', 'username firstName lastName avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username firstName lastName avatar'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Comment.countDocuments({ 
      post: req.params.postId,
      parentComment: null,
      isApproved: true
    });
    
    const totalPages = Math.ceil(total / limit);
    
    // Add user's like status for each comment
    const commentsWithLikeStatus = comments.map(comment => {
      const commentObj = comment.toJSON();
      if (req.user) {
        commentObj.hasLiked = comment.likes.some(
          like => like.user.toString() === req.user.id
        );
        // Also check replies
        if (commentObj.replies) {
          commentObj.replies = commentObj.replies.map(reply => {
            reply.hasLiked = reply.likes.some(
              like => like.user.toString() === req.user.id
            );
            return reply;
          });
        }
      } else {
        commentObj.hasLiked = false;
        if (commentObj.replies) {
          commentObj.replies = commentObj.replies.map(reply => {
            reply.hasLiked = false;
            return reply;
          });
        }
      }
      return commentObj;
    });
    
    res.json({
      comments: commentsWithLikeStatus,
      pagination: {
        current: page,
        total: totalPages,
        totalComments: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
router.post('/', protect, [
  body('content')
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  body('post')
    .isMongoId()
    .withMessage('Valid post ID is required'),
  body('parentComment')
    .optional()
    .isMongoId()
    .withMessage('Valid parent comment ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { content, post, parentComment } = req.body;
    
    // Verify post exists and comments are enabled
    const postDoc = await Post.findById(post);
    if (!postDoc) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (!postDoc.commentsEnabled) {
      return res.status(400).json({ message: 'Comments are disabled for this post' });
    }
    
    // Verify parent comment exists if provided
    if (parentComment) {
      const parentCommentDoc = await Comment.findById(parentComment);
      if (!parentCommentDoc) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
      
      // Ensure parent comment belongs to the same post
      if (parentCommentDoc.post.toString() !== post) {
        return res.status(400).json({ message: 'Parent comment does not belong to this post' });
      }
    }
    
    const comment = await Comment.create({
      content,
      post,
      author: req.user.id,
      parentComment: parentComment || null
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username firstName lastName avatar');
    
    res.status(201).json({
      message: 'Comment created successfully',
      comment: populatedComment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private (Author or Admin)
router.put('/:id', protect, [
  body('content')
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is admin or the comment author
    if (req.user.role !== 'admin' && comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }
    
    comment.content = req.body.content;
    await comment.save();
    
    const updatedComment = await Comment.findById(comment._id)
      .populate('author', 'username firstName lastName avatar');
    
    res.json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Author or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is admin or the comment author
    if (req.user.role !== 'admin' && comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    // Delete all replies if this is a parent comment
    if (comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }
    
    // Remove this comment from parent's replies array if it's a reply
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(
        comment.parentComment,
        { $pull: { replies: comment._id } }
      );
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Like/Unlike comment
// @route   POST /api/comments/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const likeIndex = comment.likes.findIndex(
      like => like.user.toString() === req.user.id
    );
    
    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
      await comment.save();
      res.json({ 
        message: 'Comment unliked', 
        liked: false, 
        likeCount: comment.likes.length 
      });
    } else {
      // Like
      comment.likes.push({ user: req.user.id });
      await comment.save();
      res.json({ 
        message: 'Comment liked', 
        liked: true, 
        likeCount: comment.likes.length 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all comments (Admin only)
// @route   GET /api/comments
// @access  Private (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Filter by approval status
    if (req.query.approved !== undefined) {
      query.isApproved = req.query.approved === 'true';
    }
    
    // Search in content
    if (req.query.search) {
      query.content = new RegExp(req.query.search, 'i');
    }
    
    const comments = await Comment.find(query)
      .populate('author', 'username firstName lastName')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Comment.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      comments,
      pagination: {
        current: page,
        total: totalPages,
        totalComments: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Approve/Disapprove comment (Admin only)
// @route   PUT /api/comments/:id/approve
// @access  Private (Admin)
router.put('/:id/approve', protect, admin, async (req, res) => {
  try {
    const { isApproved } = req.body;
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    comment.isApproved = isApproved;
    await comment.save();
    
    res.json({
      message: `Comment ${isApproved ? 'approved' : 'disapproved'} successfully`,
      comment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;