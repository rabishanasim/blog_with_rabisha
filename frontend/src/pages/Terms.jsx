import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Users, Shield, AlertTriangle, Scale, Mail } from 'lucide-react'

const Terms = () => {
  const lastUpdated = "October 22, 2025"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <FileText className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our service.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-8">
              By accessing and using BlogPlatform, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to these terms, you should not 
              use this service.
            </p>

            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
              <Users className="h-6 w-6 mr-3 text-primary-600" />
              User Accounts
            </h2>
            <p className="text-gray-600 mb-6">
              When you create an account with us, you must provide accurate, complete, and current 
              information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>Safeguarding your password and account security</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Maintaining accurate and up-to-date account information</li>
            </ul>

            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
              <FileText className="h-6 w-6 mr-3 text-primary-600" />
              Content Guidelines
            </h2>
            <p className="text-gray-600 mb-6">
              You retain ownership of content you post, but you grant us a license to use it. 
              Content must not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Contain hate speech, harassment, or discrimination</li>
              <li>Include spam, malware, or malicious content</li>
              <li>Violate privacy rights of others</li>
              <li>Be false, misleading, or defamatory</li>
            </ul>

            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
              <Shield className="h-6 w-6 mr-3 text-primary-600" />
              Intellectual Property
            </h2>
            <p className="text-gray-600 mb-8">
              The service and its original content, features, and functionality are owned by 
              BlogPlatform and are protected by international copyright, trademark, patent, 
              trade secret, and other intellectual property laws.
            </p>

            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
              <AlertTriangle className="h-6 w-6 mr-3 text-primary-600" />
              Prohibited Uses
            </h2>
            <p className="text-gray-600 mb-6">
              You may not use our service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>For any unlawful purpose or to solicit others to unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations or laws</li>
              <li>To transmit or procure the sending of advertising or promotional material</li>
              <li>To impersonate or attempt to impersonate the company or other users</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Availability</h2>
            <p className="text-gray-600 mb-8">
              We strive to maintain high availability but do not guarantee that the service will be 
              uninterrupted or error-free. We may suspend or terminate the service for maintenance, 
              updates, or other operational reasons.
            </p>

            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
              <Scale className="h-6 w-6 mr-3 text-primary-600" />
              Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-8">
              In no event shall BlogPlatform, nor its directors, employees, partners, agents, 
              suppliers, or affiliates, be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including without limitation, loss of profits, 
              data, use, goodwill, or other intangible losses.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-600 mb-8">
              We may terminate or suspend your account and bar access to the service immediately, 
              without prior notice or liability, under our sole discretion, for any reason 
              whatsoever including breach of the Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-600 mb-8">
              We reserve the right, at our sole discretion, to modify or replace these Terms at 
              any time. If a revision is material, we will provide at least 30 days notice prior 
              to any new terms taking effect.
            </p>

            <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
              <Mail className="h-6 w-6 mr-3 text-primary-600" />
              Contact Information
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@blogplatform.com<br />
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

export default Terms