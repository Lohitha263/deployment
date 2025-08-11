import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'
import { ChatBubbleLeftEllipsisIcon, PlayIcon } from '@heroicons/react/24/outline'

function InterviewItemCard({ interview }) {
  const router = useRouter()

  const onStart = () => {
    router.push('/dashboard/interview/' + interview?.mockId)
  }

  const onFeedbackPress = () => {
    router.push('/dashboard/interview/' + interview.mockId + '/feedback')
  }

  const createdDate = new Date(interview.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="bg-white rounded-xl border border-gray-300 p-5 hover:shadow-md transition-shadow duration-300 cursor-pointer">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{interview?.jobPosition}</h2>

      <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
        <span className="font-medium bg-gray-100 px-3 py-1 rounded-full select-none">
          {interview?.jobExperience} yr{interview?.jobExperience > 1 ? 's' : ''}
        </span>
        <span className="italic select-none">Created: {createdDate}</span>
      </div>

      <div className="flex gap-4">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2 border-gray-500 text-gray-700 hover:bg-gray-100 transition"
          onClick={onFeedbackPress}
        >
          <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
          Feedback
        </Button>

        <Button
          size="sm"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white transition"
          onClick={onStart}
        >
          <PlayIcon className="h-5 w-5" />
          Start
        </Button>
      </div>
    </div>
  )
}

export default InterviewItemCard
