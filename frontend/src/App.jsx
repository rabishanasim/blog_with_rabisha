import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Category from './pages/Category'
import BlogPost from './pages/BlogPost'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import Profile from './pages/Profile'
import MyPosts from './pages/MyPosts'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/post/:slug" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/my-posts" element={
          <ProtectedRoute>
            <MyPosts />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute adminOnly>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/create-post" element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } />
        <Route path="/edit-post/:id" element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/posts/create" element={
          <ProtectedRoute adminOnly>
            <CreatePost />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/posts/edit/:id" element={
          <ProtectedRoute adminOnly>
            <EditPost />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App