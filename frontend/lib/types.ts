export interface Message {
  id: string
  content: string
  type: 'user' | 'bot'
  timestamp: Date
  relatedQuestions?: string[]
}

export interface ChatResponse {
  success: boolean
  data?: {
    message: string
    sessionId: string
    tokensUsed?: number
    relatedQuestions?: string[]
  }
  error?: {
    type: string
    message: string
  }
}

export interface ChatHistory {
  userMessage: string
  botMessage: string
  timestamp: string
}
