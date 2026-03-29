import { defineStore } from 'pinia'
import { computed, reactive, ref, onMounted } from 'vue'
import { nanoid } from 'nanoid'
import type {
  AssistantMessage,
  Conversation,
  UserMessage,
} from '@/types/conversation'
import {
  loadConversationsFromDB,
  saveAllToDB,
  saveToDB,
} from '@/services/storage'

export const useConversationStore = defineStore('conversation', () => {
  const conversations = reactive<Conversation[]>([]) // 所有对话
  const currentConversationId = ref<string>('') // 当前对话id
  const currentConversation = computed(() =>
    conversations.find(conv => conv.id === currentConversationId.value),
  ) // 当前对话
  const lastMessage = computed(() => {
    const length = currentConversation.value?.messages.length || 0
    if (length)
      return currentConversation.value?.messages[length - 1] as AssistantMessage
    return {} as AssistantMessage
  }) // 当前对话的最后一条消息

  // 更新对话
  async function updateConversation(newConv: Conversation) {
    const oldConv = conversations.find(conv => conv.id === newConv.id)
    if (oldConv) {
      newConv.updatedAt = Date.now()
      Object.assign(oldConv, newConv)
      await saveToDB(oldConv)
    }
  }

  // 切换对话
  function switchConversation(conversationId: string) {
    currentConversationId.value = conversationId
  }

  // 删除会话
  async function deleteConversation(conversationId: string) {
    const index = conversations.findIndex(conv => conv.id === conversationId)
    if (index > -1) {
      conversations.splice(index, 1)
      // 如果删除的是当前会话，切换到第一个会话
      if (
        currentConversationId.value === conversationId &&
        conversations.length > 0
      ) {
        currentConversationId.value = conversations[0].id
      }
      // 保存到 IndexedDB
      await saveAllToDB(conversations)
    }
  }

  function setCurrentConversationId(convId: string) {
    currentConversationId.value = convId
  }

  function setMessageStop(messId: string, isStop: boolean) {
    // 遍历所有对话，找到对应的消息
    for (const conversation of conversations) {
      const message = conversation.messages.find(mess => mess.id === messId)
      if (message) {
        ;(message as AssistantMessage).isStop = isStop
        // 确保更新对话的 updatedAt 时间，触发响应式更新
        conversation.updatedAt = Date.now()
        break
      }
    }
  }

  function setConversationTalking(convId: string, isTalking: boolean) {
    const conversation = conversations.find(conv => conv.id === convId)
    if (conversation) {
      conversation.isTalking = isTalking
    }
  }
  // 创建新会话
  async function createConversation(title: string) {
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
    // 保存到 IndexedDB
    await saveToDB(newConversation)
    return newConversation
  }

  // 添加消息到当前对话
  function addMessage(content: string, role: 'user' | 'assistant') {
    if (currentConversation.value) {
      const newMessage: UserMessage | AssistantMessage =
        role === 'user'
          ? {
              id: nanoid(10),
              role,
              content,
              timestamp: Date.now(),
            }
          : {
              id: nanoid(10),
              role,
              content,
              thinkContent: '',
              isStop: false,
              timestamp: Date.now(),
            }
      currentConversation.value.messages.push(newMessage)
      currentConversation.value.updatedAt = Date.now()
      // 保存到 IndexedDB
      saveToDB(currentConversation.value)
      return newMessage.id
    }
  }

  function updateMessage(
    messageId: string,
    newMessage: AssistantMessage | UserMessage,
  ) {
    if (currentConversation.value) {
      const message = currentConversation.value.messages.find(
        msg => msg.id === messageId,
      )
      if (message) {
        Object.assign(message, {
          ...newMessage,
        })
        message.timestamp = Date.now()
        currentConversation.value.updatedAt = Date.now()
        // 保存到 IndexedDB
        saveToDB(currentConversation.value)
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

  // 加载数据
  async function loadData() {
    const savedConversations = await loadConversationsFromDB()
    if (savedConversations.length > 0) {
      savedConversations.forEach(conv => {
        conversations.push(conv)
      })
      currentConversationId.value = savedConversations[0].id
    } else {
      initDefaultConversations()
    }
  }

  // 初始化默认数据
  function initDefaultConversations() {
    // 创建默认对话数据
    const defaultConversations: Conversation[] = []
    defaultConversations.forEach(conv => {
      conversations.push(conv)
    })
    currentConversationId.value = defaultConversations[0]
      ? defaultConversations[0].id
      : ''
    // 保存到数据库
    saveAllToDB(defaultConversations)
  }

  // 组件挂载时加载数据
  onMounted(() => {
    loadData()
  })

  return {
    conversations,
    currentConversationId,
    currentConversation,
    lastMessage,
    updateConversation,
    setMessageStop,
    setCurrentConversationId,
    setConversationTalking,
    createConversation,
    addMessage,
    switchConversation,
    deleteConversation,
    updateMessage,
    getMessage,
  }
})
