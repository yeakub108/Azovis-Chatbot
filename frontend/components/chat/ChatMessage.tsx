import { Message } from '@/lib/types'

interface ChatMessageProps {
  message: Message
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

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user'
  const formattedContent = formatMessage(message.content)

  return (
    <div className={`flex gap-2.5 items-end ${isUser ? 'flex-row-reverse' : ''} animate-slide-in`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${
        isUser ? 'text-gray-600 p-1' : 'bg-gradient-to-br from-indigo-500 to-indigo-400 text-white overflow-hidden p-0'
      }`}>
        {isUser ? (
          <img
            src="/images/user-icons.svg"
            alt="User"
            className="w-full h-full drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]"
            style={{ filter: 'contrast(1.2) brightness(0.9)' }}
          />
        ) : (
          <img
            src="/images/robot.png"
            alt="Bot"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className={`max-w-[75%] sm:max-w-[70%] px-3 py-2 sm:px-4 sm:py-2 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-indigo-500 text-white rounded-br-sm'
          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
      }`}>
        <p className="m-0 whitespace-pre-wrap break-words">{formattedContent}</p>
      </div>
    </div>
  )
}
