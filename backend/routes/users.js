const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Post = require('../models/Post');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Search by username, email, or name
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { username: searchRegex },
        { email: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex }
      ];
    }

    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Filter by active status
    if (req.query.active !== undefined) {
      query.isActive = req.query.active === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Add post count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const postCount = await Post.countDocuments({
          author: user._id,
          status: 'published'
        });
        return {
          ...user.toJSON(),
          postCount
        };
      })
    );

    res.json({
      users: usersWithStats,
      pagination: {
        current: page,
        total: totalPages,
        totalUsers: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's published posts count
    const postCount = await Post.countDocuments({
      author: user._id,
      status: 'published'
    });

    // Get user's recent posts
    const recentPosts = await Post.find({
      author: user._id,
      status: 'published'
    })
      .select('title slug excerpt featuredImage publishedAt views')
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(5);

    res.json({
      user: {
        ...user.toJSON(),
        postCount
      },
      recentPosts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private (Admin)
router.put('/:id', protect, admin, [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('username')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('firstName')
    .optional()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .trim(),
  body('lastName')
    .optional()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .trim(),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
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

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { email, username, firstName, lastName, bio, role, isActive } = req.body;

    // Check for duplicate email or username if they're being changed
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    // Update other fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Delete user's posts or transfer them (optional)
    // For now, we'll just delete the user and keep posts
    // You might want to implement a different strategy

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats/overview
// @access  Private (Admin)
router.get('/stats/overview', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const admins = await User.countDocuments({ role: 'admin' });

    // Users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Monthly user registration stats
    const monthlyStats = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      admins,
      newUsers,
      monthlyStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;