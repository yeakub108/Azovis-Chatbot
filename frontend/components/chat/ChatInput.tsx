import { useState, FormEvent, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled: boolean
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const message = input.trim()
    if (message && !disabled) {
      onSendMessage(message)
      setInput('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const canSend = input.trim().length > 0 && !disabled

  return (
    <div className="bg-white border-t border-gray-200 p-4 sm:p-5">
      <form className="flex gap-2.5 items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          autoComplete="off"
          className="flex-1 p-3 sm:p-4 border-2 border-gray-200 rounded-xl text-sm font-medium outline-none transition-all bg-gray-50 focus:border-indigo-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-500"
        />
        <button
          type="submit"
          disabled={!canSend}
          className={`w-11 h-11 border-none rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
            disabled || !canSend ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-105 active:scale-95 cursor-pointer'
          }`}
          title="Send message"
        >
          <Send size={20} />
        </button>
      </form>
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500">Press Enter to send</span>
      </div>
    </div>
  )
}
