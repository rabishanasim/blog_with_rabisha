import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Eye, Database, Cookie, Users, Mail } from 'lucide-react'

const Privacy = () => {
  const lastUpdated = "October 22, 2025"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            We respect your privacy and are committed to protecting your personal data.
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
              <Eye className="h-6 w-6 mr-3 text-primary-600" />
              Information We Collect
            </h2>
            <p className="text-gray-600 mb-6">
              We collect information you provide directly to us, such as when you create an account, 
              write a post, or contact us. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>Name and email address</li>
              <li>Profile information and bio</li>
              <li>Posts, comments, and other content you create</li>
              <li>Communication preferences</li>
              <li>Technical information like IP address and browser type</li>
            </ul>

            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
              <Database className="h-6 w-6 mr-3 text-primary-600" />
              How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect and prevent fraudulent activities</li>
            </ul>

            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
              <Users className="h-6 w-6 mr-3 text-primary-600" />
              Information Sharing
            </h2>
            <p className="text-gray-600 mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist us (under strict confidentiality agreements)</li>
            </ul>

            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
              <Cookie className="h-6 w-6 mr-3 text-primary-600" />
              Cookies and Tracking
            </h2>
            <p className="text-gray-600 mb-8">
              We use cookies and similar technologies to enhance your experience, analyze site usage, 
              and assist in our marketing efforts. You can control cookie preferences through your 
              browser settings.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-6">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your personal data</li>
              <li>Restrict processing of your data</li>
              <li>Data portability</li>
              <li>Object to processing</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600 mb-8">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the Internet is 100% secure.
            </p>

            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
              <Mail className="h-6 w-6 mr-3 text-primary-600" />
              Contact Us
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@blogplatform.com<br />
                <strong>Address:</strong> 123 Blog Street, Content City, CC 12345
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="btn btn-primary"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Privacy