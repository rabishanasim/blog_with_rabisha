const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  featuredImage: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
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
  commentsEnabled: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  readingTime: {
    type: Number // in minutes
  }
}, {
  timestamps: true
});

// Create slug from title before saving
postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }

  // Calculate reading time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Ensure unique slug
postSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    let slug = this.slug;
    let counter = 1;

    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${this.slug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

// Virtual for like count
postSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true
});

// Ensure virtual fields are serialized
postSchema.set('toJSON', { virtuals: true });

// Index for better search performance
postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ author: 1 });
postSchema.index({ category: 1 });

module.exports = mongoose.model('Post', postSchema);