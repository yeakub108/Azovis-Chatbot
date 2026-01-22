import { Message } from '@/lib/types'

interface ChatMessageProps {
  message: Message
  onQuestionClick?: (question: string) => void
}

// Function to remove markdown formatting
function formatMessage(content: string): string {
  return content
    // Remove bold markdown (**)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Remove italic markdown (*)
    .replace(/\*(.*?)\*/g, '$1')
    // Remove code markdown (`)
    .replace(/`(.*?)`/g, '$1')
    // Remove code blocks (```)
    .replace(/```[\s\S]*?```/g, '')
    // Remove headers (#)
    .replace(/^#+\s/gm, '')
}

export default function ChatMessage({ message, onQuestionClick }: ChatMessageProps) {
  const isUser = message.type === 'user'
  const formattedContent = formatMessage(message.content)

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-slide-in`}>
      <div className={`flex gap-2.5 items-end ${isUser ? 'flex-row-reverse' : ''}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm bg-gradient-to-br from-indigo-500 to-indigo-400 text-white overflow-hidden p-0">
            <img
              src="/images/robot.png"
              alt="Bot"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className={`px-3 py-2 sm:px-4 sm:py-2 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-500 text-white rounded-br-sm max-w-[85%] sm:max-w-[80%]'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm max-w-[75%] sm:max-w-[70%]'
        }`}>
          <p className={`m-0 ${isUser ? 'whitespace-normal break-normal' : 'whitespace-pre-wrap break-words'}`}>{formattedContent}</p>
        </div>
      </div>

      {/* Related Questions */}
      {!isUser && message.relatedQuestions && message.relatedQuestions.length > 0 && onQuestionClick && (
        <div className="ml-10 mt-2 flex flex-wrap gap-2 items-start">
          {message.relatedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(question)}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs rounded-full border border-indigo-200 transition-colors duration-200 cursor-pointer text-left"
            >
              {question}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
