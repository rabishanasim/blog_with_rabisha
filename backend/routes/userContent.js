const express = require('express');
const UserContent = require('../models/UserContent');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
const { contentUpload, handleMulterError } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// @route   GET /api/user-content
// @desc    Get all published user content (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            contentType,
            search,
            featured,
            author
        } = req.query;

        // Build filter object
        const filter = { status: 'published' };

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (contentType && contentType !== 'all') {
            filter.contentType = contentType;
        }

        if (featured === 'true') {
            filter.featured = true;
        }

        if (author) {
            filter.author = author;
        }

        // Build query
        let query = UserContent.find(filter);

        // Add text search if provided
        if (search) {
            query = UserContent.find({
                ...filter,
                $text: { $search: search }
            });
        }

        // Get total count for pagination
        const total = await UserContent.countDocuments(filter);

        // Execute query with pagination and population
        const content = await query
            .populate('author', 'firstName lastName email avatar')
            .sort({ publishedAt: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        res.json({
            content,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
                totalItems: total
            }
        });
    } catch (error) {
        console.error('Error fetching user content:', error);
        res.status(500).json({
            message: 'Server error while fetching content',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/user-content/:slug
// @desc    Get single user content by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const content = await UserContent.findOne({
            slug: req.params.slug,
            status: 'published'
        }).populate('author', 'firstName lastName email avatar');

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        // Increment view count
        content.views += 1;
        await content.save();

        res.json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({
            message: 'Server error while fetching content',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/user-content
// @desc    Create new user content (text or video)
// @access  Private (Authenticated users)
router.post('/', [
    protect,
    contentUpload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'featuredImage', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    handleMulterError
], async (req, res) => {
    try {
        const {
            title,
            description,
            contentType,
            textContent,
            category,
            tags,
            videoUrl, // For external video URLs
            metaTitle,
            metaDescription,
            externalLinks
        } = req.body;

        // Validation
        if (!title || !description || !contentType || !category) {
            return res.status(400).json({
                message: 'Title, description, content type, and category are required'
            });
        }

        if (contentType === 'text' && !textContent) {
            return res.status(400).json({
                message: 'Text content is required for text articles'
            });
        }

        if (contentType === 'video' && !req.files?.video && !videoUrl) {
            return res.status(400).json({
                message: 'Video file or video URL is required for video content'
            });
        }

        // Process uploaded files
        const videoFile = req.files?.video?.[0];
        const featuredImageFile = req.files?.featuredImage?.[0];
        const thumbnailFile = req.files?.thumbnail?.[0];

        // Prepare content data
        const contentData = {
            title: title.trim(),
            description: description.trim(),
            contentType,
            textContent: contentType === 'text' ? textContent : undefined,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim().toLowerCase()) : [],
            author: req.user._id,
            metaTitle: metaTitle?.trim(),
            metaDescription: metaDescription?.trim(),
            externalLinks: externalLinks ? JSON.parse(externalLinks) : [],
            status: 'pending' // All user content needs approval
        };

        // Handle video file upload
        if (videoFile) {
            contentData.videoFile = {
                filename: videoFile.filename,
                originalName: videoFile.originalname,
                mimetype: videoFile.mimetype,
                size: videoFile.size,
                path: videoFile.path,
                url: `/uploads/videos/${videoFile.filename}`
            };
        } else if (videoUrl) {
            contentData.videoFile = {
                url: videoUrl.trim()
            };
        }

        // Handle featured image
        if (featuredImageFile) {
            contentData.featuredImage = `/uploads/images/${featuredImageFile.filename}`;
        }

        // Handle thumbnail for videos
        if (thumbnailFile) {
            contentData.videoFile = {
                ...contentData.videoFile,
                thumbnail: `/uploads/images/${thumbnailFile.filename}`
            };
        }

        // Create content
        const content = new UserContent(contentData);
        await content.save();

        // Populate author info for response
        await content.populate('author', 'firstName lastName email avatar');

        res.status(201).json({
            message: 'Content uploaded successfully and is pending approval',
            content
        });
    } catch (error) {
        console.error('Error creating user content:', error);

        // Clean up uploaded files on error
        if (req.files) {
            Object.values(req.files).flat().forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation error',
                errors
            });
        }

        res.status(500).json({
            message: 'Server error while creating content',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/user-content/my/content
// @desc    Get current user's content
// @access  Private
router.get('/my/content', protect, async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const filter = { author: req.user._id };
        if (status && status !== 'all') {
            filter.status = status;
        }

        const total = await UserContent.countDocuments(filter);

        const content = await UserContent.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        res.json({
            content,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
                totalItems: total
            }
        });
    } catch (error) {
        console.error('Error fetching user content:', error);
        res.status(500).json({
            message: 'Server error while fetching your content',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   PUT /api/user-content/:id
// @desc    Update user content (only by author or admin)
// @access  Private
router.put('/:id', [protect], async (req, res) => {
    try {
        const content = await UserContent.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        // Check if user is author or admin
        if (content.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this content' });
        }

        // Only allow updates to pending or draft content (unless admin)
        if (['approved', 'published'].includes(content.status) && req.user.role !== 'admin') {
            return res.status(400).json({ message: 'Cannot edit approved or published content' });
        }

        const updates = req.body;

        // If content was rejected and being updated, reset to pending
        if (content.status === 'rejected' && req.user.role !== 'admin') {
            updates.status = 'pending';
            updates.moderationNotes = '';
        }

        Object.assign(content, updates);
        await content.save();

        res.json({
            message: 'Content updated successfully',
            content
        });
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({
            message: 'Server error while updating content',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   DELETE /api/user-content/:id
// @desc    Delete user content (only by author or admin)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const content = await UserContent.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        // Check if user is author or admin
        if (content.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this content' });
        }

        // Clean up uploaded files
        if (content.videoFile?.path && fs.existsSync(content.videoFile.path)) {
            fs.unlinkSync(content.videoFile.path);
        }
        if (content.featuredImage && fs.existsSync(path.join('./uploads', content.featuredImage))) {
            fs.unlinkSync(path.join('./uploads', content.featuredImage));
        }

        await UserContent.findByIdAndDelete(req.params.id);

        res.json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({
            message: 'Server error while deleting content',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/user-content/:id/like
// @desc    Toggle like on content
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
    try {
        const content = await UserContent.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        const existingLike = content.likes.find(
            like => like.user.toString() === req.user._id.toString()
        );

        if (existingLike) {
            await content.removeLike(req.user._id);
            res.json({ message: 'Like removed', liked: false, likeCount: content.likeCount });
        } else {
            await content.addLike(req.user._id);
            res.json({ message: 'Content liked', liked: true, likeCount: content.likeCount });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Server error while toggling like' });
    }
});

// @route   POST /api/user-content/:id/comment
// @desc    Add comment to content
// @access  Private
router.post('/:id/comment', protect, async (req, res) => {
    try {
        const { content: commentContent } = req.body;

        if (!commentContent || !commentContent.trim()) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const content = await UserContent.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        const username = req.user.fullName || `${req.user.firstName} ${req.user.lastName}`;
        await content.addComment(req.user._id, username, commentContent.trim());

        res.status(201).json({
            message: 'Comment added successfully and is pending approval',
            commentCount: content.commentCount
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            message: 'Server error while adding comment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;