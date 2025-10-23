const mongoose = require('mongoose');
const slugify = require('slugify');

const userContentSchema = new mongoose.Schema({
    // Basic Information
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Content Type
    contentType: {
        type: String,
        enum: ['text', 'video'],
        required: [true, 'Content type is required']
    },

    // Text Content (for articles)
    textContent: {
        type: String,
        required: function () {
            return this.contentType === 'text';
        }
    },

    // Video Content (for vlogs)
    videoFile: {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        path: String,
        url: String, // For external video URLs (YouTube, Vimeo, etc.)
        duration: Number, // in seconds
        thumbnail: String // thumbnail image path
    },

    // Author Information
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },

    // Content Metadata
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'technology',
            'lifestyle',
            'travel',
            'food',
            'business',
            'health',
            'education',
            'entertainment',
            'sports',
            'gaming',
            'music',
            'art',
            'science',
            'politics',
            'other'
        ]
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],

    // Featured Image/Thumbnail
    featuredImage: {
        type: String,
        default: ''
    },

    // Status and Moderation
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected', 'published'],
        default: 'pending'
    },
    moderationNotes: {
        type: String,
        default: ''
    },
    moderatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    moderatedAt: {
        type: Date
    },

    // Publishing
    publishedAt: {
        type: Date
    },
    featured: {
        type: Boolean,
        default: false
    },

    // Engagement Metrics
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Comments
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters']
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    // SEO
    metaTitle: {
        type: String,
        maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
        type: String,
        maxlength: [160, 'Meta description cannot exceed 160 characters']
    },

    // Analytics
    readingTime: {
        type: Number, // in minutes
        default: 0
    },

    // External Links
    externalLinks: [{
        title: String,
        url: String,
        description: String
    }]
}, {
    timestamps: true
});

// Generate slug before saving
userContentSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });
    }
    next();
});

// Calculate reading time for text content
userContentSchema.pre('save', function (next) {
    if (this.contentType === 'text' && this.textContent) {
        const wordsPerMinute = 200;
        const wordCount = this.textContent.split(/\s+/).length;
        this.readingTime = Math.ceil(wordCount / wordsPerMinute);
    }
    next();
});

// Auto-populate author info
userContentSchema.pre('save', async function (next) {
    if (this.isModified('author')) {
        try {
            const User = mongoose.model('User');
            const user = await User.findById(this.author);
            if (user) {
                this.authorName = user.fullName || `${user.firstName} ${user.lastName}`;
                this.authorEmail = user.email;
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Index for search functionality
userContentSchema.index({
    title: 'text',
    description: 'text',
    textContent: 'text',
    tags: 'text'
});

// Index for filtering
userContentSchema.index({ status: 1, publishedAt: -1 });
userContentSchema.index({ category: 1, status: 1 });
userContentSchema.index({ author: 1, status: 1 });
userContentSchema.index({ featured: 1, status: 1 });

// Virtual for like count
userContentSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

// Virtual for comment count (approved only)
userContentSchema.virtual('commentCount').get(function () {
    return this.comments.filter(comment => comment.status === 'approved').length;
});

// Virtual for content URL
userContentSchema.virtual('url').get(function () {
    return `/content/${this.slug}`;
});

// Static method to get published content
userContentSchema.statics.getPublished = function (filters = {}) {
    return this.find({
        status: 'published',
        ...filters
    }).populate('author', 'firstName lastName email avatar');
};

// Static method to get pending content for moderation
userContentSchema.statics.getPendingForModeration = function () {
    return this.find({ status: 'pending' })
        .populate('author', 'firstName lastName email avatar')
        .sort({ createdAt: -1 });
};

// Method to approve content
userContentSchema.methods.approve = function (moderatorId, notes = '') {
    this.status = 'approved';
    this.publishedAt = new Date();
    this.moderatedBy = moderatorId;
    this.moderatedAt = new Date();
    this.moderationNotes = notes;
    return this.save();
};

// Method to reject content
userContentSchema.methods.reject = function (moderatorId, notes = '') {
    this.status = 'rejected';
    this.moderatedBy = moderatorId;
    this.moderatedAt = new Date();
    this.moderationNotes = notes;
    return this.save();
};

// Method to add like
userContentSchema.methods.addLike = function (userId) {
    const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
    if (!existingLike) {
        this.likes.push({ user: userId });
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to remove like
userContentSchema.methods.removeLike = function (userId) {
    this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
    return this.save();
};

// Method to add comment
userContentSchema.methods.addComment = function (userId, username, content) {
    this.comments.push({
        user: userId,
        username,
        content,
        status: 'pending' // Comments need approval
    });
    return this.save();
};

// Ensure virtual fields are serialized
userContentSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        // Don't return sensitive moderation info to non-admins
        if (ret.status === 'pending' || ret.status === 'rejected') {
            delete ret.moderationNotes;
            delete ret.moderatedBy;
        }
        return ret;
    }
});

module.exports = mongoose.model('UserContent', userContentSchema);