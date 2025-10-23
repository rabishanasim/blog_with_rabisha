const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
    // There should only be one admin settings document
    singleton: {
        type: Boolean,
        default: true,
        unique: true
    },

    // Personal Information
    firstName: {
        type: String,
        required: true,
        default: 'Admin'
    },
    lastName: {
        type: String,
        required: true,
        default: 'User'
    },
    title: {
        type: String,
        default: 'Blog Admin & Content Creator'
    },
    bio: {
        type: String,
        default: 'Welcome to my blog! I\'m passionate about sharing knowledge and connecting with like-minded individuals.'
    },

    // Contact Information
    email: {
        type: String,
        required: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },

    // Social Media
    socialMedia: {
        twitter: {
            type: String,
            default: ''
        },
        linkedin: {
            type: String,
            default: ''
        },
        github: {
            type: String,
            default: ''
        },
        instagram: {
            type: String,
            default: ''
        }
    },

    // Blog Settings
    blogTitle: {
        type: String,
        default: 'My Personal Blog'
    },
    blogSubtitle: {
        type: String,
        default: 'Sharing knowledge and experiences'
    },
    blogDescription: {
        type: String,
        default: 'A place where I share my thoughts, insights, and experiences on various topics that matter to me.'
    },

    // Profile Image
    avatarUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
    },

    // Skills/Expertise
    skills: [{
        type: String
    }],

    // Metadata
    joinDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure only one admin settings document exists
adminSettingsSchema.pre('save', async function (next) {
    if (this.isNew) {
        const existingSettings = await this.constructor.findOne({});
        if (existingSettings) {
            const error = new Error('Admin settings already exist. Use update instead.');
            return next(error);
        }
    }
    next();
});

// Static method to get or create admin settings
adminSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne({});

    if (!settings) {
        // Create default settings if none exist
        settings = await this.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            skills: ['Content Writing', 'Blog Management', 'Community Building', 'Digital Marketing']
        });
    }

    return settings;
};

// Static method to update settings
adminSettingsSchema.statics.updateSettings = async function (updateData) {
    let settings = await this.findOne({});

    if (!settings) {
        // Create with the update data if none exist
        settings = await this.create(updateData);
    } else {
        // Update existing settings
        Object.assign(settings, updateData);
        await settings.save();
    }

    return settings;
};

// Virtual for full name
adminSettingsSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
adminSettingsSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.singleton;
        return ret;
    }
});

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);