import { LightbulbIcon, Volume2 } from 'lucide-react'
import React from 'react'

const pastelColors = [
  'bg-pink-100 text-pink-800',
  'bg-purple-100 text-purple-800',
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-indigo-100 text-indigo-800',
  'bg-rose-100 text-rose-800',
]

const QuestionsSection = ({ mockInterviewQuestion = [], activeQuestionIndex, onQuestionSelect }) => {
  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(speech)
    } else {
      alert('Sorry, your browser does not support text to speech')
    }
  }

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Question Tabs */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {mockInterviewQuestion.map((_, index) => {
          const isActive = activeQuestionIndex === index
          const pastel = pastelColors[index % pastelColors.length]

          return (
            <button
              key={index}
              onClick={() => onQuestionSelect(index)}
              className={`
                px-4 py-2 rounded-full text-sm font-semibold 
                transition-all duration-300
                ${isActive ? `bg-cyan-400 text-white shadow-lg` : `${pastel} hover:brightness-90`}
                focus:outline-none focus:ring-2 focus:ring-cyan-300
              `}
              aria-label={`Select Question ${index + 1}`}
            >
              Q{index + 1}
            </button>
          )
        })}
      </div>

      {/* Question Text with Speech Button */}
      <div className="relative bg-cyan-50 rounded-xl p-8 shadow-inner">
        <p className="text-lg md:text-xl text-slate-900 font-medium leading-relaxed">
          {mockInterviewQuestion[activeQuestionIndex]?.Question || mockInterviewQuestion[activeQuestionIndex]?.question || 'No question available'}
        </p>

        <button
          onClick={() =>
            textToSpeech(
              mockInterviewQuestion[activeQuestionIndex]?.Question || mockInterviewQuestion[activeQuestionIndex]?.question
            )
          }
          aria-label="Listen to question"
          className="absolute top-6 right-6 p-2 bg-cyan-300 hover:bg-cyan-400 rounded-full text-white shadow-md transition-colors"
          title="Listen to question"
        >
          <Volume2 size={24} />
        </button>
      </div>

      {/* Notes Section */}
      <div className="mt-12 bg-pastel-note bg-gradient-to-tr from-cyan-200 via-cyan-100 to-cyan-50 rounded-xl p-6 shadow-md text-cyan-900">
        <div className="flex items-center gap-3 mb-3">
          <LightbulbIcon size={24} className="text-cyan-700" />
          <h3 className="text-xl font-semibold">Important Notes</h3>
        </div>

        <p className="mb-2 text-sm leading-relaxed">{process.env.NEXT_PUBLIC_IMP}</p>
        <p className="text-sm leading-relaxed opacity-90">{process.env.NEXT_PUBLIC_QUESTION_NOTE}</p>
      </div>
    </section>
  )
}

export default QuestionsSection
