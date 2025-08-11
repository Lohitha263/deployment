'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rocket, Clock, Mic } from 'lucide-react'

const upcomingFeatures = [
  {
    version: 'v1.2',
    title: 'Custom Interview Duration',
    description: 'Allow users to set a preferred time for interviews, with adaptive question generation.',
    releaseDate: 'August 25, 2025',
    status: 'In Progress'
  },
  {
    version: 'v1.3',
    title: 'AI Voice Feedback',
    description: 'Provide spoken feedback after each question to simulate a real interview environment.',
    releaseDate: 'September 10, 2025',
    status: 'Planned'
  },
  {
    version: 'v1.4',
    title: 'Realtime AI Voice Interview',
    description: 'Conduct full interviews with AI using voice — AI asks questions out loud and listens to your answers in real-time.',
    releaseDate: 'September 25, 2025',
    status: 'Planned'
  },
  {
    version: 'v2.0',
    title: 'Advanced Analytics Dashboard',
    description: 'Detailed analysis of interview performance, speed, accuracy, and topic coverage.',
    releaseDate: 'October 5, 2025',
    status: 'Planned'
  }
]

export default function UpcomingFeatures() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-yellow-500 text-white'
      case 'Planned':
        return 'bg-blue-500 text-white'
      case 'Released':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-4">
          <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Upcoming Features & Versions
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          Here’s a sneak peek at what’s coming soon to make your AI interview experience even better.
        </p>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {upcomingFeatures.map((feature, index) => (
            <Card
              key={index}
              className="border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  <Badge variant="outline" className="text-sm font-medium">
                    {feature.version}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{feature.releaseDate}</span>
                </div>
                <div className="mt-3">
                  <Badge className={getStatusColor(feature.status)}>
                    {feature.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
