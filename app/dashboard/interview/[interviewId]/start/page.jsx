'use client'

import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db.js'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import QuestionsSection from './_components/QuestionsSection'
import RecordAns from './_components/RecordAns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null)
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([])
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)

  const [saving, setSaving] = useState(false) // Loading state to block next

  // Fetch interview details & questions on mount
  useEffect(() => {
    async function fetchInterviewDetails() {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId))
      if (result[0]) {
        setInterviewData(result[0])
        const jsonMockResp = JSON.parse(result[0].jsonMockResp)
        setMockInterviewQuestion(jsonMockResp)
      }
    }
    fetchInterviewDetails()
  }, [params.interviewId])

  // Text-to-Speech: Speak question when activeQuestionIndex or questions change
  useEffect(() => {
    if (mockInterviewQuestion.length > 0) {
      const questionText =
        mockInterviewQuestion[activeQuestionIndex]?.Question ||
        mockInterviewQuestion[activeQuestionIndex]?.question

      if ('speechSynthesis' in window && questionText) {
        speechSynthesis.cancel() // Stop any ongoing speech
        const utterance = new SpeechSynthesisUtterance(questionText)
        speechSynthesis.speak(utterance)
      }
    }
  }, [activeQuestionIndex, mockInterviewQuestion])

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        <RecordAns
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
          setSaving={setSaving} // Pass saving state setter
        />
      </div>

      <div className="flex justify-end gap-6 mt-6">
        {activeQuestionIndex > 0 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
            disabled={saving}
          >
            Previous Question
          </Button>
        )}

        {activeQuestionIndex !== mockInterviewQuestion.length - 1 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            disabled={saving}
          >
            Next Question
          </Button>
        )}

        {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
            <Button disabled={saving}>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default StartInterview
