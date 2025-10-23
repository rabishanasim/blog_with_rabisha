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

module.exports = router;