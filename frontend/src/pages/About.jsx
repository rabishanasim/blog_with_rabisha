import React from 'react'
import { Users, Target, Heart, Award, BookOpen, Lightbulb } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Quality Content',
      description: 'Curated articles and tutorials from experienced writers and industry experts.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'A vibrant community of writers, readers, and learners sharing knowledge.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation Focus',
      description: 'Stay updated with the latest trends, technologies, and best practices.'
    },
    {
      icon: Heart,
      title: 'Passion for Learning',
      description: 'We believe in continuous learning and sharing knowledge with others.'
    }
  ]

  const team = [
    {
      name: 'Rabisha Nasim', // You can update this with your full name
      role: 'Founder & Admin',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', // You can replace with your photo
      bio: 'Blog platform creator and administrator. Passionate about sharing knowledge and building communities through technology.'
    }
    // Add more team members here as your blog grows
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="gradient-text">My Blog</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Welcome to my personal blog platform! I'm passionate about sharing knowledge, 
            experiences, and insights to help others learn and grow.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">My Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To create valuable content that helps others learn, grow, and succeed. 
              This blog is my space to share insights, experiences, and knowledge with the world.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center group">
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-4 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Impact</h2>
            <p className="text-xl text-gray-600">Growing community, growing knowledge</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold gradient-text mb-2">500+</div>
              <div className="text-gray-600">Articles Published</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-gray-600">Active Readers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold gradient-text mb-2">50+</div>
              <div className="text-gray-600">Expert Writers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold gradient-text mb-2">25+</div>
              <div className="text-gray-600">Topics Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The passionate people behind our platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center group">
                <div className="p-8">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-primary-100 group-hover:ring-primary-200 transition-all duration-300"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our <span className="gradient-text">Community</span>
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Start your journey with us today. Share your knowledge, learn from others, 
            and be part of something amazing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="btn btn-primary btn-lg">
              Start Writing
            </a>
            <a href="/contact" className="btn btn-outline btn-lg">
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About