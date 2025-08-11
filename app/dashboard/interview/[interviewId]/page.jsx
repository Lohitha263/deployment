'use client'

import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db.js'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Lightbulb, WebcamIcon } from 'lucide-react'

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null)
  const [webcamActive, setWebcamActive] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId))
      setInterviewData(result[0] ?? null)
    }
    fetchData()
  }, [params.interviewId])

  return (
    <main className="max-w-5xl mx-auto p-6 flex flex-col gap-12 min-h-screen">
      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Ready to Begin?</h1>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          Review your interview details and enable your webcam to get started.
        </p>
      </header>

      {/* Content Grid */}
      <section
        aria-label="Interview Details and Webcam"
        className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start"
      >
        {/* Interview Details */}
        <article className="space-y-8 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-pink-700 border-b border-pink-200 pb-2 mb-4">
            Interview Details
          </h2>

          {/* Job Info List */}
          <dl className="space-y-6">
            <div>
              <dt className="text-lg font-medium text-gray-700">Job Position</dt>
              <dd className="mt-1 text-gray-900">{interviewData?.jobPosition || 'Loading...'}</dd>
            </div>
            <div>
              <dt className="text-lg font-medium text-gray-700">Job Description / Tech Stack</dt>
              <dd className="mt-1 text-gray-900">{interviewData?.jobDesc || 'Loading...'}</dd>
            </div>
            <div>
              <dt className="text-lg font-medium text-gray-700">Years of Experience</dt>
              <dd className="mt-1 text-gray-900">{interviewData?.jobExperience || 'Loading...'}</dd>
            </div>
          </dl>

          {/* Additional Information Box */}
          <aside className="mt-8 bg-cyan-50 border border-cyan-300 rounded-lg p-4 shadow-inner">
            <h3 className="flex items-center gap-2 text-cyan-700 font-semibold mb-2">
              <Lightbulb size={20} aria-hidden="true" />
              <span>Important Information</span>
            </h3>
            <p className="text-cyan-900 text-sm leading-relaxed">
              {process.env.NEXT_PUBLIC_INFORMATION || 'No additional information provided.'}
            </p>
          </aside>
        </article>

        {/* Webcam & Controls */}
        <aside className="flex flex-col items-center justify-center gap-6">
          {webcamActive ? (
            <Webcam
              mirrored
              className="w-72 h-72 rounded-xl shadow-lg border border-gray-300"
              onUserMedia={() => setWebcamActive(true)}
              onUserMediaError={() => setWebcamActive(false)}
              aria-label="User Webcam"
            />
          ) : (
            <div
              className="w-72 h-72 flex flex-col justify-center items-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 text-gray-400 select-none"
              role="alert"
              aria-live="polite"
              aria-atomic="true"
            >
              <WebcamIcon size={72} aria-hidden="true" />
              <p className="mt-4 text-center font-medium px-6">
                Your webcam and microphone are currently disabled.
              </p>
              <p className="text-sm mt-1 text-center px-6">
                Click the button below to enable them.
              </p>
            </div>
          )}

          {!webcamActive && (
            <Button
              onClick={() => setWebcamActive(true)}
              aria-label="Enable webcam and microphone"
              className="bg-slate-800 hover:bg-slate-900 transition-colors rounded-md px-6 py-3 text-white font-semibold"
            >
              Enable Webcam & Microphone
            </Button>
          )}
        </aside>
      </section>

      {/* Footer - Start Interview */}
      <footer className="flex justify-end">
        <Link href={`/dashboard/interview/${params.interviewId}/start`} passHref>
          <Button
            className="bg-pink-700 hover:bg-pink-900 transition-colors rounded-md px-8 py-3 text-white font-bold shadow-lg"
            aria-label="Start Interview"
          >
            Start Interview
          </Button>
        </Link>
      </footer>
    </main>
  )
}

export default Interview
