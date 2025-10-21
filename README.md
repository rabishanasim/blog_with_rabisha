# Personal Blog Platform

# Personal Blog Platform

A modern, full-stack blog platform built with React, Node.js, Express, and MongoDB.

## 🌟 **Features**

- ✅ **User Authentication** - Register, login, JWT-based auth
- ✅ **Post Management** - Create, edit, delete blog posts and vlogs
- ✅ **Rich Text Editor** - Markdown support with syntax highlighting
- ✅ **Image Uploads** - Featured images for posts
- ✅ **Comment System** - Nested comments with likes
- ✅ **Categories & Tags** - Organize your content
- ✅ **User Dashboard** - Manage your posts and profile
- ✅ **Admin Panel** - Admin controls and analytics
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **SEO Optimized** - Meta tags, slugs, and search-friendly URLs

## 🚀 **Live Demo**

- **Frontend**: [https://your-blog.vercel.app](https://your-blog.vercel.app)
- **Backend API**: [https://your-api.railway.app](https://your-api.railway.app)

## 🛠️ **Tech Stack**

### **Frontend**
- React 18 + Vite
- Tailwind CSS
- React Router
- React Query
- React Hook Form
- Axios
- Lucide Icons

### **Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (File uploads)
- Express Validator
- Bcrypt

## 📦 **Quick Deploy**

### **One-Click Deployment**

**Frontend (Vercel):**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR-USERNAME/Personal-Blog-Platform)

**Backend (Railway):**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### **Manual Setup**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🏃‍♂️ **Local Development**

### **Prerequisites**
- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn

### **Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Personal-Blog-Platform.git
   cd Personal-Blog-Platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔑 **Environment Variables**

### **Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 **Project Structure**

```
Personal-Blog-Platform/
├── backend/                 # Node.js + Express API
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Entry point
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utilities
│   └── public/             # Static assets
└── README.md
```

**Happy Blogging! 🎉**

> Last updated: October 22, 2025

## Features

- 📝 Create, edit, and delete blog posts
- 👤 User authentication and authorization
- 💬 Comment system
- 🏷️ Categories and tags
- 📱 Responsive design
- 🔍 Search functionality
- 👨‍💼 Admin dashboard
- 📊 Analytics and statistics

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling

### Frontend
- **React** - Frontend library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Personal-Blog-Platform
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
```bash
# In backend directory, create .env file
cp .env.example .env
# Edit .env with your configuration
```

5. Start MongoDB service

6. Run the application
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
Personal-Blog-Platform/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)

### Comments
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment (auth required)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.