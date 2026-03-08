import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export const useConversationStore = defineStore('conversation', () => {
  const conversations = reactive<Conversation[]>([])
  const currentConversationId = ref<string>('')

  // 创建新会话
  function createConversation(title: string) {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    conversations.unshift(newConversation)
    currentConversationId.value = newConversation.id

    return newConversation
  }

  // 添加消息到当前对话
  function addMessage(content: string, role: 'user' | 'assistant') {
    const currentConversation = conversations.find(
      conv => conv.id === currentConversationId.value,
    )
    if (currentConversation) {
      const newMessage: Message = {
        id: Date.now().toString(),
        role,
        content,
        timestamp: Date.now(),
      }
      currentConversation.messages.push(newMessage)
      currentConversation.updatedAt = Date.now()
    }
  }

  return {
    conversations,
    currentConversationId,
    createConversation,
    addMessage,
  }
})
