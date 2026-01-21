export interface Message {
  id: string
  content: string
  type: 'user' | 'bot'
  timestamp: Date
}

export interface ChatResponse {
  success: boolean
  data?: {
    message: string
    sessionId: string
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
