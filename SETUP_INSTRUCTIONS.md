# Personal Blog Platform

A complete full-stack blog platform built with modern technologies.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation & Setup

1. **Clone and navigate to the project**
```bash
cd Personal-Blog-Platform
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d
MAX_FILE_SIZE=1000000
FILE_UPLOAD_PATH=./uploads
```

Start MongoDB and run backend:
```bash
npm run dev
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Health Check: http://localhost:5000/api/health

## 🔐 Demo Accounts

To test the platform, you can create these demo accounts or register new ones:

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: Admin (can manage all posts and users)

### Regular User Account  
- **Email**: user@example.com
- **Password**: user123
- **Role**: User (can comment and like posts)

## ✨ Features

### 🌟 User Features
- **Authentication**: Secure JWT-based login/register
- **Blog Reading**: Browse and read blog posts
- **Search & Filter**: Search posts by title/content, filter by categories
- **Comments**: Add, edit, delete comments on posts
- **Likes**: Like/unlike posts and comments
- **User Profiles**: View author profiles and their posts
- **Responsive Design**: Works on mobile, tablet, and desktop

### 👨‍💼 Admin Features
- **Dashboard**: Overview of posts, users, and site statistics
- **Post Management**: Create, edit, delete, and publish posts
- **User Management**: View, edit, activate/deactivate users
- **Comment Moderation**: Approve/reject comments
- **Category Management**: Create and manage post categories
- **File Upload**: Upload and manage post featured images
- **Analytics**: View post views, likes, and user engagement

### 🛠️ Technical Features
- **RESTful API**: Well-structured API endpoints
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Image upload for post featured images
- **Validation**: Frontend and backend data validation
- **Error Handling**: Comprehensive error handling
- **Security**: Password hashing, JWT tokens, input sanitization
- **Performance**: Pagination, query optimization, image compression

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Posts
- `GET /api/posts` - Get all posts (with pagination/filters)
- `GET /api/posts/featured` - Get featured posts
- `GET /api/posts/:slug` - Get single post by slug
- `POST /api/posts` - Create new post (admin)
- `PUT /api/posts/:id` - Update post (admin/author)
- `DELETE /api/posts/:id` - Delete post (admin/author)
- `POST /api/posts/:id/like` - Like/unlike post

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment (author/admin)
- `DELETE /api/comments/:id` - Delete comment (author/admin)
- `POST /api/comments/:id/like` - Like/unlike comment

### Users (Admin)
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)
- `GET /api/users/stats/overview` - Get user statistics (admin)

## 🏗️ Project Structure

```
Personal-Blog-Platform/
├── backend/
│   ├── controllers/          # Route handlers
│   ├── middleware/          # Authentication, file upload, etc.
│   ├── models/             # MongoDB/Mongoose models
│   ├── routes/             # API route definitions
│   ├── uploads/            # Uploaded files storage
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express server entry point
├── frontend/
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions (API, etc.)
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   └── tailwind.config.js # Tailwind CSS configuration
└── README.md              # Project documentation
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **express-validator** - Request validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library
- **date-fns** - Date utility library
- **DOMPurify** - HTML sanitization
- **Marked** - Markdown parser

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for auto-restart
```

### Frontend Development  
```bash
cd frontend
npm run dev  # Runs with Vite dev server
```

### Building for Production
```bash
# Backend (ready for production)
cd backend
npm start

# Frontend
cd frontend
npm run build  # Creates optimized build in dist/
npm run preview  # Preview production build
```

## 📝 Usage Examples

### Creating Your First Post
1. Register an admin account or use demo admin credentials
2. Login and navigate to Dashboard
3. Click "Create New Post"
4. Fill in title, content, select category
5. Upload featured image (optional)
6. Set status to "Published" 
7. Click "Create Post"

### Managing Users
1. Login as admin
2. Go to Dashboard → Manage Users
3. View user list with stats
4. Edit user details or deactivate accounts
5. Monitor user activity and post contributions

### Moderating Comments
1. Go to Dashboard
2. View recent activity
3. Navigate to posts with pending comments
4. Approve or reject comments as needed

## 🚀 Deployment

### Backend Deployment
- Set environment variables in production
- Use MongoDB Atlas for cloud database
- Deploy to platforms like Railway, Render, or DigitalOcean
- Configure file storage (local or cloud storage)

### Frontend Deployment
- Build the frontend: `npm run build`
- Deploy to Netlify, Vercel, or similar platforms
- Update API_URL environment variable to production backend

### Environment Variables
Ensure all production environment variables are set:
- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong, unique JWT secret
- `NODE_ENV=production`
- Frontend `VITE_API_URL` pointing to production API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify MongoDB is running
3. Ensure all environment variables are set
4. Check that all dependencies are installed
5. Verify ports 3000 and 5000 are available

For additional help, please open an issue in the repository.

---

**Happy Blogging! 🎉**