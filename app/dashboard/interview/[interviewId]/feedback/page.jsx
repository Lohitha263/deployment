'use client'

import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import { ChevronsUpDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

ChartJS.register(ArcElement, Tooltip, Legend)

const Feedback = ({ params }) => {
  const [feedbackList, setFeedbackList] = useState([])
  const router = useRouter()

  // Counts for each rating category
  const [counts, setCounts] = useState({
    needsImprovement: 0, // 1-4
    keepGoing: 0,        // 5-7
    good: 0,             // 8-9
    awesome: 0           // 10
  })

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id)

    setFeedbackList(result)

    // Categorize counts dynamically based on rating
    const countsObj = {
      needsImprovement: 0,
      keepGoing: 0,
      good: 0,
      awesome: 0,
    }

    result.forEach((item) => {
      const rating = Number(item.rating)
      if (rating >= 1 && rating <= 4) countsObj.needsImprovement++
      else if (rating >= 5 && rating <= 7) countsObj.keepGoing++
      else if (rating >= 8 && rating <= 9) countsObj.good++
      else if (rating === 10) countsObj.awesome++
      // else ignore or unknown
    })

    setCounts(countsObj)
  }

  const totalQuestions = Object.values(counts).reduce((a, b) => a + b, 0)

  // Chart data & options
  const data = {
    labels: [
      `Needs Improvement (${counts.needsImprovement})`,
      `Keep Going (${counts.keepGoing})`,
      `Good (${counts.good})`,
      `Awesome (${counts.awesome})`,
    ],
    datasets: [
      {
        label: 'Interview Ratings',
        data: [
          counts.needsImprovement,
          counts.keepGoing,
          counts.good,
          counts.awesome,
        ],
        backgroundColor: [
          '#fca5a5', // pastel red
          '#fde68a', // pastel yellow
          '#a5b4fc', // pastel indigo
          '#86efac', // pastel green
        ],
        borderColor: [
          '#b91c1c',
          '#a16207',
          '#4338ca',
          '#15803d',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 15, padding: 15, font: { size: 14 } },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `${context.parsed} question(s)`,
        },
      },
    },
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      {feedbackList.length === 0 ? (
        <h2 className="font-light text-xl text-gray-500 text-center mt-20">
          No Interview Feedback Record Found
        </h2>
      ) : (
        <>
          <h1 className="text-4xl font-semibold text-slate-900 mb-2">
            Congratulations!
          </h1>
          <p className="text-2xl font-light text-gray-900 mb-6">
            Here is your interview feedback summary
          </p>

          <div className="max-w-md mx-auto mb-10">
            <Pie data={data} options={options} />
          </div>

          {/* Legend with explanations */}
          <div className="mb-10 flex flex-col md:flex-row md:justify-center md:gap-10 text-center">
            <LegendItem
              color="#fca5a5"
              title="Needs Improvement (1-4)"
              description="Focus on fundamentals and clarity."
              count={counts.needsImprovement}
            />
            <LegendItem
              color="#fde68a"
              title="Keep Going (5-7)"
              description="Good effort, keep practicing."
              count={counts.keepGoing}
            />
            <LegendItem
              color="#a5b4fc"
              title="Good (8-9)"
              description="Strong answers, well done!"
              count={counts.good}
            />
            <LegendItem
              color="#86efac"
              title="Awesome (10)"
              description="Excellent! You're interview ready."
              count={counts.awesome}
            />
          </div>

          <h2 className="text-xl font-light text-gray-600 mb-4">
            Detailed Feedback Per Question
          </h2>

          {feedbackList.map((item, idx) => (
            <Collapsible key={idx} className="mb-4">
              <CollapsibleTrigger className="p-3 bg-secondary rounded-lg flex justify-between items-center cursor-pointer text-left">
                <span className="font-semibold" style={{ color: '#5B21B6' }}>
                  {item.question}
                </span>
                <ChevronsUpDownIcon className="w-5 h-5 text-gray-500" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-5 bg-white rounded-b-lg text-gray-700 space-y-3">
                <p className="inline-block p-3 rounded-lg bg-green-100 text-green-800 font-semibold">
                  <strong>Rating:</strong> {item.rating}
                </p>
                <p className="inline-block p-3 rounded-lg bg-blue-100 text-blue-900 font-semibold">
                  <strong>Your Answer:</strong> {item.userAns}
                </p>
                <p className="inline-block p-3 rounded-lg bg-yellow-100 text-yellow-900 font-semibold">
                  <strong>Correct Answer:</strong> {item.correctAns}
                </p>
                <p className="inline-block p-3 rounded-lg bg-purple-100 text-purple-900 font-semibold">
                  <strong>Feedback:</strong> {item.feedback}
                </p>
              </CollapsibleContent>
            </Collapsible>
          ))}

          <div className="mt-10 flex justify-center">
            <Button onClick={() => router.replace('/dashboard')} className="bg-slate-800">
              Go Home
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function LegendItem({ color, title, description, count }) {
  return (
    <div className="flex flex-col items-center gap-1 max-w-[180px]">
      <div
        className="w-8 h-8 rounded-full border-2"
        style={{ backgroundColor: color, borderColor: darkenColor(color, 0.3) }}
      />
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-sm mt-1 font-medium">{count} question{count !== 1 ? 's' : ''}</p>
    </div>
  )
}

// Helper to darken color for border (basic)
function darkenColor(hex, amount) {
  let col = hex.replace('#', '')
  if (col.length === 3) {
    col = col
      .split('')
      .map((x) => x + x)
      .join('')
  }
  const num = parseInt(col, 16)
  let r = (num >> 16) - amount * 255
  let g = ((num >> 8) & 0x00ff) - amount * 255
  let b = (num & 0x0000ff) - amount * 255

  r = r < 0 ? 0 : Math.floor(r)
  g = g < 0 ? 0 : Math.floor(g)
  b = b < 0 ? 0 : Math.floor(b)

  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}

export default Feedback
