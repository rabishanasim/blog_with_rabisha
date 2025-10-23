const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDir = './uploads';
const imageDir = './uploads/images';
const videoDir = './uploads/videos';
const thumbDir = './uploads/thumbnails';

[uploadDir, imageDir, videoDir, thumbDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filters
const imageFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

const videoFilter = (req, file, cb) => {
  const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  if (allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files (MP4, MPEG, MOV, AVI, WebM) are allowed'), false);
  }
};

// Multer configurations
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: process.env.MAX_IMAGE_SIZE || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: imageFilter
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: process.env.MAX_VIDEO_SIZE || 100 * 1024 * 1024 // 100MB default
  },
  fileFilter: videoFilter
});

// Combined upload for content with both image and video
const contentUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, imageDir);
      } else if (file.mimetype.startsWith('video/')) {
        cb(null, videoDir);
      } else {
        cb(new Error('Invalid file type'), false);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        return process.env.MAX_IMAGE_SIZE || 5 * 1024 * 1024; // 5MB
      } else if (file.mimetype.startsWith('video/')) {
        return process.env.MAX_VIDEO_SIZE || 100 * 1024 * 1024; // 100MB
      }
      return 1024 * 1024; // 1MB default
    }
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
    }
  }
});

// Legacy upload for backward compatibility
const upload = imageUpload;

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field' });
    }
  }

  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({ message: error.message });
  }

  next(error);
};

module.exports = {
  upload, // Legacy - for images only
  imageUpload,
  videoUpload,
  contentUpload, // For mixed content uploads
  handleMulterError
};