import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { nanoid } from 'nanoid'
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
  isTalking: boolean
  createdAt: number
  updatedAt: number
}

export const useConversationStore = defineStore('conversation', () => {
  const conversations = reactive<Conversation[]>([
    {
      id: '1',
      title: '新会话1',
      messages: [
        {
          id: nanoid(10),
          role: 'user',
          content: '你好',
          timestamp: Date.now(),
        },
        {
          id: nanoid(10),
          role: 'assistant',
          content: '你好，我是FanAI',
          timestamp: Date.now(),
        },
      ],
      isTalking: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: nanoid(10),
      title: '新会话2',
      messages: [
        {
          id: nanoid(10),
          role: 'user',
          content: '介绍一下自己',
          timestamp: Date.now(),
        },
        {
          id: nanoid(10),
          role: 'assistant',
          content: '你好，我是FanAI',
          timestamp: Date.now(),
        },
      ],
      isTalking: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: '3',
      title: '新会话3',
      messages: [],
      isTalking: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ])
  const currentConversationId = ref<string>('3')

  function setConversationTalking(convId: string, isTalking: boolean) {
    const conversation = conversations.find(conv => conv.id === convId)
    if (conversation) {
      conversation.isTalking = isTalking
    }
  }
  // 创建新会话
  function createConversation(title: string) {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title,
      messages: [],
      isTalking: false,
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
        id: nanoid(10),
        role,
        content,
        timestamp: Date.now(),
      }
      currentConversation.messages.push(newMessage)
      currentConversation.updatedAt = Date.now()
      return newMessage.id
    }
  }

  function updateMessage(messageId: string, content: string) {
    const currentConversation = conversations.find(
      conv => conv.id === currentConversationId.value,
    )
    if (currentConversation) {
      const message = currentConversation.messages.find(
        msg => msg.id === messageId,
      )
      if (message) {
        message.content = content
        message.timestamp = Date.now()
        currentConversation.updatedAt = Date.now()
      }
    }
  }

  function getMessage(messageId: string) {
    const currentConversation = conversations.find(
      conv => conv.id === currentConversationId.value,
    )
    if (currentConversation) {
      return currentConversation.messages.find(msg => msg.id === messageId)
    }
  }

  // 获取当前对话
  function getCurrentConversation() {
    return conversations.find(conv => conv.id === currentConversationId.value)
  }

  // 切换对话
  function switchConversation(conversationId: string) {
    currentConversationId.value = conversationId
  }

  // 删除会话
  function deleteConversation(conversationId: string) {
    conversations.splice(
      conversations.findIndex(conv => conv.id === conversationId),
      1,
    )
  }

  return {
    conversations,
    currentConversationId,
    setConversationTalking,
    createConversation,
    addMessage,
    getCurrentConversation,
    switchConversation,
    deleteConversation,
    updateMessage,
    getMessage,
  }
})
