export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStop?: boolean
  timestamp: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  isTalking: boolean
  createdAt: number
  updatedAt: number
}
