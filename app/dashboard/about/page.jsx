'use client'
import React from 'react'
import { Brain, MessageSquare, Zap, Github, Linkedin, Mail } from 'lucide-react'

const AboutSection = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-16 px-6 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About <span className="text-indigo-600">AI Interview Coach</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          AI Interview Coach helps you prepare for interviews with real-time, AI-powered feedback,
          tailored questions, and performance insights — making sure you walk into your interview
          confident and ready.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
          <Brain className="h-10 w-10 text-indigo-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            AI-Generated Questions
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Get dynamically generated questions that match your skill level and role preferences.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
          <MessageSquare className="h-10 w-10 text-indigo-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Instant Feedback
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Receive detailed feedback on your answers, structure, and communication style instantly.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
          <Zap className="h-10 w-10 text-indigo-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Performance Tracking
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor your improvement over time with performance analytics and progress reports.
          </p>
        </div>
      </div>

      {/* Author's Note */}
      <div className="mt-16 max-w-4xl mx-auto text-center bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Author's Note</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Hi! I'm the creator of AI Interview Coach. My mission is to make interview preparation
          more accessible, engaging, and effective for everyone. Your feedback is what keeps this
          platform growing — thank you for being part of the journey!
        </p>

        {/* Contact Links */}
        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/Lohitha263"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition"
          >
            <Github className="w-5 h-5" /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/lohitha-garapati-393835345/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition"
          >
            <Linkedin className="w-5 h-5" /> LinkedIn
          </a>
          <a
            href="mailto:lohithagarapati28@gmail.com"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition"
          >
            <Mail className="w-5 h-5" /> Email
          </a>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
