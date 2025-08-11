'use client'

import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard'

const InterviewList = () => {
  const { user } = useUser()
  const [interviewList, setInterviewList] = useState([])

  useEffect(() => {
    if (user) GetInterviewList()
  }, [user])

  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(MockInterview.id))
    setInterviewList(result)
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-8">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6 border-b border-gray-200 pb-2">
        Previous Mock Interviews
      </h2>

      {interviewList.length === 0 ? (
        <p className="text-gray-600 text-center mt-12">No mock interviews found. Start by creating one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewList.map((interview, index) => (
            <div
              key={interview.mockId ?? index}
              className="transition-opacity duration-300 ease-in opacity-100"
            >
              <InterviewItemCard interview={interview} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default InterviewList
