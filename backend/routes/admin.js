const express = require('express');
const AdminSettings = require('../models/AdminSettings');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// @route   GET /api/admin/settings
// @desc    Get admin settings (public - for displaying admin info)
// @access  Public
router.get('/settings', async (req, res) => {
    try {
        const settings = await AdminSettings.getSettings();
        res.json(settings);
    } catch (error) {
        console.error('Error fetching admin settings:', error);
        res.status(500).json({
            message: 'Server error while fetching admin settings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   PUT /api/admin/settings
// @desc    Update admin settings
// @access  Private (Admin only)
router.put('/settings', [protect, admin], async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            title,
            bio,
            email,
            phone,
            location,
            website,
            socialMedia,
            blogTitle,
            blogSubtitle,
            blogDescription,
            avatarUrl,
            skills
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                message: 'First name, last name, and email are required'
            });
        }

        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Please provide a valid email address'
            });
        }

        // Prepare update data
        const updateData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            title: title?.trim() || '',
            bio: bio?.trim() || '',
            email: email.trim().toLowerCase(),
            phone: phone?.trim() || '',
            location: location?.trim() || '',
            website: website?.trim() || '',
            socialMedia: {
                twitter: socialMedia?.twitter?.trim() || '',
                linkedin: socialMedia?.linkedin?.trim() || '',
                github: socialMedia?.github?.trim() || '',
                instagram: socialMedia?.instagram?.trim() || ''
            },
            blogTitle: blogTitle?.trim() || 'My Personal Blog',
            blogSubtitle: blogSubtitle?.trim() || 'Sharing knowledge and experiences',
            blogDescription: blogDescription?.trim() || '',
            avatarUrl: avatarUrl?.trim() || '',
            skills: Array.isArray(skills) ? skills.filter(skill => skill.trim()) : []
        };

        const updatedSettings = await AdminSettings.updateSettings(updateData);

        res.json({
            message: 'Admin settings updated successfully',
            settings: updatedSettings
        });
    } catch (error) {
        console.error('Error updating admin settings:', error);

        if (error.message.includes('Admin settings already exist')) {
            return res.status(400).json({ message: error.message });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Validation error',
                errors
            });
        }

        res.status(500).json({
            message: 'Server error while updating admin settings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/admin/settings/reset
// @desc    Reset admin settings to defaults (admin only)
// @access  Private (Admin only)
router.post('/settings/reset', [protect, admin], async (req, res) => {
    try {
        // Delete existing settings
        await AdminSettings.findOneAndDelete({});

        // Create new default settings
        const defaultSettings = await AdminSettings.getSettings();

        res.json({
            message: 'Admin settings reset to defaults successfully',
            settings: defaultSettings
        });
    } catch (error) {
        console.error('Error resetting admin settings:', error);
        res.status(500).json({
            message: 'Server error while resetting admin settings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/admin/content/pending
// @desc    Get pending content for moderation
// @access  Private (Admin only)
router.get('/content/pending', [protect, admin], async (req, res) => {
    try {
        const UserContent = require('../models/UserContent');

        const pendingContent = await UserContent.getPendingForModeration();

        res.json({
            content: pendingContent,
            count: pendingContent.length
        });
    } catch (error) {
        console.error('Error fetching pending content:', error);
        res.status(500).json({
            message: 'Server error while fetching pending content',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   PUT /api/admin/content/:id/approve
// @desc    Approve user content
// @access  Private (Admin only)
router.put('/content/:id/approve', [protect, admin], async (req, res) => {
    try {
        const UserContent = require('../models/UserContent');
        const { notes = '', featured = false } = req.body;

        const content = await UserContent.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        if (content.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending content can be approved' });
        }

        await content.approve(req.user._id, notes);

        // Set as featured if requested
        if (featured) {
            content.featured = true;
            await content.save();
        }

        await content.populate('author', 'firstName lastName email');

        res.json({
            message: 'Content approved successfully',
            content
        });
    } catch (error) {
        console.error('Error approving content:', error);
        res.status(500).json({
            message: 'Server error while approving content',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   PUT /api/admin/content/:id/reject
// @desc    Reject user content
// @access  Private (Admin only)
router.put('/content/:id/reject', [protect, admin], async (req, res) => {
    try {
        const UserContent = require('../models/UserContent');
        const { notes = '' } = req.body;

        if (!notes.trim()) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }

        const content = await UserContent.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        if (content.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending content can be rejected' });
        }

        await content.reject(req.user._id, notes);
        await content.populate('author', 'firstName lastName email');

        res.json({
            message: 'Content rejected',
            content
        });
    } catch (error) {
        console.error('Error rejecting content:', error);
        res.status(500).json({
            message: 'Server error while rejecting content',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/admin/content/stats
// @desc    Get content moderation statistics
// @access  Private (Admin only)
router.get('/content/stats', [protect, admin], async (req, res) => {
    try {
        const UserContent = require('../models/UserContent');

        const stats = await Promise.all([
            UserContent.countDocuments({ status: 'pending' }),
            UserContent.countDocuments({ status: 'approved' }),
            UserContent.countDocuments({ status: 'rejected' }),
            UserContent.countDocuments({ status: 'published' }),
            UserContent.countDocuments({ contentType: 'text', status: { $in: ['approved', 'published'] } }),
            UserContent.countDocuments({ contentType: 'video', status: { $in: ['approved', 'published'] } }),
            UserContent.countDocuments({ featured: true, status: { $in: ['approved', 'published'] } })
        ]);

        res.json({
            pending: stats[0],
            approved: stats[1],
            rejected: stats[2],
            published: stats[3],
            textContent: stats[4],
            videoContent: stats[5],
            featured: stats[6],
            total: stats[1] + stats[2] + stats[3]
        });
    } catch (error) {
        console.error('Error fetching content stats:', error);
        res.status(500).json({
            message: 'Server error while fetching content statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;