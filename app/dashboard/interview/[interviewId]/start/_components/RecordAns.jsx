'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'

const RecordAns = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
  setSaving, // parent setter for saving state
}) => {
  const [userAnswer, setUserAnswer] = useState('')
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: false,
    useLegacyResults: false,
  })

  useEffect(() => {
    if (interimResult) {
      console.log('Interim Result:', interimResult)
    }
  }, [interimResult])

  useEffect(() => {
    results?.forEach((result) => {
      console.log('Speech to Text transcript chunk:', result?.transcript)
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    })
  }, [results])

  useEffect(() => {
    if (!isRecording && userAnswer?.length > 10) {
      UpdatedUserAnswer()
    }
  }, [userAnswer, isRecording])

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText()
    } else {
      startSpeechToText()
    }
  }

  const UpdatedUserAnswer = async () => {
    setLoading(true)
    setSaving(true) // Notify parent: saving started

    try {
      const feedbackPrompt =
        'Question: ' +
        mockInterviewQuestion[activeQuestionIndex]?.question +
        ', User Answer: ' +
        userAnswer +
        '. Please provide ONLY a JSON response with exactly two fields: ' +
        '`rating` (an integer between 1 and 10) and `feedback` (a concise 3-5 line constructive feedback). ' +
        'Example response: {"rating":7,"feedback":"Your answer is good but can be improved with examples."}'

      const result = await chatSession.sendMessage(feedbackPrompt)
      const mockJsonResp = result.response
        .text()
        .replace('```json', '')
        .replace('```', '')
        .trim()

      const JsonFeedbackResp = JSON.parse(mockJsonResp)

      // Parse rating as number, fallback to 0 if invalid
      const numericRating = Number(JsonFeedbackResp.rating)
      const safeRating = isNaN(numericRating) ? 0 : numericRating

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: safeRating.toString(), // store as string per your schema
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy'),
      })

      if (resp) {
        toast.success('User Answer Recorded Successfully')
        setUserAnswer('')
        setResults([])
      }
    } catch (e) {
      console.error('Error saving answer:', e)
      toast.error('Failed to save answer. Try again.')
    }

    setLoading(false)
    setSaving(false) // Notify parent: saving finished
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-40 justify-center items-center rounded-lg p-5 relative">
        <Image
          src={'/webcam.jpg'}
          width={400}
          height={400}
          alt="Webcam background"
          className="absolute top-0 left-0 opacity-20 rounded-lg"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
            borderRadius: 12,
          }}
        />
      </div>

      <Button disabled={loading} className="mt-10 bg-pink-700" onClick={StartStopRecording}>
        {isRecording ? (
          <h2 className="text-white animate-pulse flex gap-2 items-center">
            <StopCircle />
            Stop Recording
          </h2>
        ) : (
          <h2 className="text-white flex gap-2 items-center">
            <Mic />
            Record Answer
          </h2>
        )}
      </Button>
    </div>
  )
}

export default RecordAns
