'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Message } from '@/lib/types'
import { sendMessage, resetConversation } from '@/lib/api'
import { generateSessionId } from '@/lib/utils'
import ChatHeader from '@/components/chat/ChatHeader'
import ChatMessage from '@/components/chat/ChatMessage'
import TypingIndicator from '@/components/chat/TypingIndicator'
import ChatInput from '@/components/chat/ChatInput'
import Toast from '@/components/chat/Toast'

const STORAGE_KEY_PREFIX = 'chat_history_'

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Hello! I'm the Azovis Project Assistant. I can help you with questions about Azovis features, setup, API usage, and troubleshooting. What would you like to know?",
      type: 'bot',
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'error',
  })

  const sessionIdRef = useRef<string>(generateSessionId())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Load chat history from localStorage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const key = STORAGE_KEY_PREFIX + sessionIdRef.current
        const historyJson = localStorage.getItem(key)
        if (historyJson) {
          const history = JSON.parse(historyJson)
          if (history.length > 0) {
            const loadedMessages: Message[] = []
            history.forEach((item: any) => {
              loadedMessages.push(
                {
                  id: `user_${item.timestamp}`,
                  content: item.userMessage,
                  type: 'user',
                  timestamp: new Date(item.timestamp),
                },
                {
                  id: `bot_${item.timestamp}`,
                  content: item.botMessage,
                  type: 'bot',
                  timestamp: new Date(item.timestamp),
                }
              )
            })
            setMessages((prev) => [...prev, ...loadedMessages])
          }
        }
      } catch (error) {
        console.warn('Could not load chat history:', error)
      }
    }

    loadHistory()
  }, [])

  // Save chat history to localStorage
  const saveChatHistory = useCallback((userMessage: string, botMessage: string) => {
    try {
      const key = STORAGE_KEY_PREFIX + sessionIdRef.current
      const history = JSON.parse(localStorage.getItem(key) || '[]')
      history.push({
        userMessage,
        botMessage,
        timestamp: new Date().toISOString(),
      })

      // Keep only last 50 messages
      if (history.length > 50) {
        history.splice(0, history.length - 50)
      }

      localStorage.setItem(key, JSON.stringify(history))
    } catch (error) {
      console.warn('Could not save chat history:', error)
    }
  }, [])

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'error') => {
    setToast({ show: true, message, type })
  }, [])

  // Handle sending message
  const handleSendMessage = useCallback(async (content: string) => {
    if (isSending) return

    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content,
      type: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Set loading state
    setIsSending(true)
    setIsTyping(true)

    try {
      const response = await sendMessage(content, sessionIdRef.current)

      if (response.success && response.data?.message) {
        const botMessage: Message = {
          id: `bot_${Date.now()}`,
          content: response.data.message,
          type: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        saveChatHistory(content, response.data.message)
      } else {
        const errorMsg = response.error?.message || 'Failed to send message'

        // Handle specific error types
        if (response.error?.type === 'INVALID_API_KEY') {
          showToast('Invalid API key. Please check your configuration.', 'error')
        } else if (response.error?.type === 'QUOTA_EXCEEDED') {
          showToast('API quota exceeded. Please check your OpenAI account.', 'error')
        } else if (response.error?.type === 'API_ERROR') {
          showToast('OpenAI API error. Please try again.', 'error')
        } else {
          showToast(errorMsg, 'error')
        }
      }
    } catch (error: any) {
      if (error.message?.includes('fetch') || error.name === 'TypeError') {
        showToast('Cannot connect to server. Please check if server is running.', 'error')
      } else {
        showToast('Network error. Please check your connection.', 'error')
      }
    } finally {
      setIsSending(false)
      setIsTyping(false)
    }
  }, [isSending, saveChatHistory, showToast])

  // Handle clear conversation
  const handleClearConversation = useCallback(async () => {
    if (isSending) return

    try {
      const response = await resetConversation(sessionIdRef.current)

      if (response.success) {
        // Reset to welcome message
        setMessages([
          {
            id: 'welcome',
            content: "Hello! I'm the Azovis Project Assistant. I can help you with questions about Azovis features, setup, API usage, and troubleshooting. What would you like to know?",
            type: 'bot',
            timestamp: new Date(),
          },
        ])

        // Clear local storage
        try {
          localStorage.removeItem(STORAGE_KEY_PREFIX + sessionIdRef.current)
        } catch (error) {
          console.warn('Could not clear localStorage:', error)
        }

        showToast('Conversation cleared', 'success')
      } else {
        showToast('Failed to clear conversation', 'error')
      }
    } catch (error) {
      console.error('Error clearing conversation:', error)
      showToast('Failed to clear conversation. Please try again.', 'error')
    }
  }, [isSending, showToast])

  return (
    <>
      <div className="w-full max-w-[500px] h-[700px] sm:h-[750px] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden relative">
        <ChatHeader onClear={handleClearConversation} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 scroll-smooth scrollbar-thin">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={handleSendMessage} disabled={isSending} />
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </>
  )
}
