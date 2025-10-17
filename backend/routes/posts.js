const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Category = require('../models/Category');
const { protect, admin, optionalAuth } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

const router = express.Router();

// @desc    Get all posts (with pagination and filtering)
// @route   GET /api/posts
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = { status: 'published' };
    
    // Status filter - allow users to see their own drafts
    if (req.query.status && req.user) {
      if (req.query.status === 'all' && req.query.author === req.user.id) {
        delete query.status; // Show all posts for the author
      }
    }
    
    // Category filter
    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        query.category = category._id;
      }
    }
    
    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Tag filter
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }
    
    // Author filter
    if (req.query.author) {
      query.author = req.query.author;
    }
    
    // Sort options
    let sort = { publishedAt: -1 }; // Default: newest first
    
    if (req.query.sort === 'oldest') {
      sort = { publishedAt: 1 };
    } else if (req.query.sort === 'views') {
      sort = { views: -1 };
    } else if (req.query.sort === 'likes') {
      sort = { 'likes.length': -1 };
    }
    
    const posts = await Post.find(query)
      .populate('author', 'username firstName lastName avatar')
      .populate('category', 'name slug color')
      .populate('commentCount')
      .select('-content') // Exclude full content for list view
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      posts,
      pagination: {
        current: page,
        total: totalPages,
        totalPosts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get featured posts
// @route   GET /api/posts/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const posts = await Post.find({ 
      status: 'published',
      featured: true 
    })
      .populate('author', 'username firstName lastName avatar')
      .populate('category', 'name slug color')
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(limit);
    
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findOne({ 
      slug: req.params.slug,
      status: 'published'
    })
      .populate('author', 'username firstName lastName bio avatar')
      .populate('category', 'name slug color')
      .populate('commentCount');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    // Check if user has liked the post
    let hasLiked = false;
    if (req.user) {
      hasLiked = post.likes.some(like => like.user.toString() === req.user.id);
    }
    
    res.json({
      ...post.toJSON(),
      hasLiked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (All authenticated users)
router.post('/', protect, upload.single('featuredImage'), [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('excerpt')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Excerpt cannot exceed 300 characters')
], handleMulterError, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, content, excerpt, category, tags, status, featured } = req.body;
    
    // Verify category exists if provided
    let categoryDoc = null;
    if (category) {
      categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }
    
    const postData = {
      title,
      content,
      excerpt,
      author: req.user.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: status || 'draft',
      featured: featured === 'true'
    };

    // Only add category if provided
    if (category) {
      postData.category = category;
    }
    
    if (req.file) {
      postData.featuredImage = `/uploads/${req.file.filename}`;
    }
    
    const post = await Post.create(postData);
    
    // Update category post count if category exists
    if (categoryDoc) {
      await categoryDoc.updatePostCount();
    }
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username firstName lastName')
      .populate('category', 'name slug color');
    
    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Admin or Author)
router.put('/:id', protect, upload.single('featuredImage'), [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .optional()
    .notEmpty()
    .withMessage('Content cannot be empty'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('excerpt')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Excerpt cannot exceed 300 characters')
], handleMulterError, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is admin or the author
    if (req.user.role !== 'admin' && post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    const { title, content, excerpt, category, tags, status, featured } = req.body;
    
    // Verify category exists if provided
    if (category) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }
    
    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (category) post.category = category;
    if (tags !== undefined) {
      post.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];
    }
    if (status) post.status = status;
    if (featured !== undefined) post.featured = featured === 'true';
    
    if (req.file) {
      post.featuredImage = `/uploads/${req.file.filename}`;
    }
    
    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username firstName lastName')
      .populate('category', 'name slug color');
    
    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Admin or Author)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is admin or the author
    if (req.user.role !== 'admin' && post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    
    // Update category post count
    const category = await Category.findById(post.category);
    if (category) {
      await category.updatePostCount();
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user.id
    );
    
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
      await post.save();
      res.json({ message: 'Post unliked', liked: false, likeCount: post.likes.length });
    } else {
      // Like
      post.likes.push({ user: req.user.id });
      await post.save();
      res.json({ message: 'Post liked', liked: true, likeCount: post.likes.length });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;