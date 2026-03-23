export interface Message {
  id: string
  content: string
  timestamp: number
}

export interface UserMessage extends Message {
  role: 'user'
}

export interface AssistantMessage extends Message {
  role: 'assistant'
  thinkContent: string
  isStop?: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: (UserMessage | AssistantMessage)[]
  isTalking: boolean
  createdAt: number
  updatedAt: number
}
