import { defineStore } from 'pinia'
import { computed, reactive, ref, onMounted } from 'vue'
import { nanoid } from 'nanoid'
import { addData, openDB, updateDB, cursorGetData } from '@/utils/indexDB'
import type { Conversation, Message } from '@/types/conversation'

export const useConversationStore = defineStore('conversation', () => {
  const conversations = reactive<Conversation[]>([])
  const currentConversationId = ref<string>('3')
  const currentConversation = computed(() =>
    conversations.find(conv => conv.id === currentConversationId.value),
  )

  // 从 IndexedDB 加载数据
  async function loadFromDB() {
    try {
      const db = await openDB('fan-ai-chat', 1)
      const savedConversations = await cursorGetData(db, 'conversations')

      if (savedConversations && savedConversations.length > 0) {
        // 清空现有数据
        conversations.length = 0
        savedConversations.forEach(conv => conversations.push(conv))
        if (savedConversations.length > 0) {
          currentConversationId.value = savedConversations[0].id
        }
      } else {
        // 如果没有保存的数据，初始化默认数据
        initDefaultConversations()
      }
      return true
    } catch (error) {
      console.error('加载数据失败:', error)
      // 加载失败时初始化默认数据
      initDefaultConversations()
      return false
    }
  }

  // 初始化默认对话数据
  function initDefaultConversations() {
    // 生成合理的时间戳
    const now = Date.now()
    const yesterday = now - 24 * 60 * 60 * 1000
    const twoDaysAgo = now - 48 * 60 * 60 * 1000

    const defaultConversations: Conversation[] = [
      {
        id: '1',
        title: '新会话1',
        messages: [
          {
            id: nanoid(10),
            role: 'user',
            content: '你好',
            timestamp: twoDaysAgo + 10 * 60 * 1000, // 两天前的10分钟后
          },
          {
            id: nanoid(10),
            role: 'assistant',
            content: '你好，我是FanAI',
            isStop: false,
            timestamp: twoDaysAgo + 15 * 60 * 1000, // 两天前的15分钟后
          },
        ],
        isTalking: false,
        createdAt: twoDaysAgo, // 两天前
        updatedAt: twoDaysAgo + 15 * 60 * 1000, // 两天前的15分钟后
      },
      {
        id: nanoid(10),
        title: '新会话2',
        messages: [
          {
            id: nanoid(10),
            role: 'user',
            content: '介绍一下自己',
            timestamp: yesterday + 30 * 60 * 1000, // 昨天的30分钟后
          },
          {
            id: nanoid(10),
            role: 'assistant',
            content: '你好，我是FanAI',
            isStop: false,
            timestamp: yesterday + 35 * 60 * 1000, // 昨天的35分钟后
          },
        ],
        isTalking: false,
        createdAt: yesterday, // 昨天
        updatedAt: yesterday + 35 * 60 * 1000, // 昨天的35分钟后
      },
      {
        id: '3',
        title: '新会话3',
        messages: [],
        isTalking: false,
        createdAt: now, // 现在
        updatedAt: now, // 现在
      },
    ]

    // 添加默认数据到 conversations
    defaultConversations.forEach(conv => conversations.push(conv))
    // 保存默认数据到 IndexedDB
    saveAllToDB()
  }

  // 保存所有对话到 IndexedDB
  async function saveAllToDB() {
    try {
      const db = await openDB('fan-ai-chat', 1)
      // 清空现有数据
      const clearRequest = db
        .transaction('conversations', 'readwrite')
        .objectStore('conversations')
        .clear()

      clearRequest.onsuccess = function () {
        // 保存所有对话
        conversations.forEach(conversation => {
          const serializableConversation = JSON.parse(
            JSON.stringify(conversation),
          )
          addData(db, 'conversations', serializableConversation)
        })
      }

      clearRequest.onerror = function () {
        console.error('清空数据失败')
      }
    } catch (error) {
      console.error('保存数据失败:', error)
    }
  }

  // 保存单个对话到 IndexedDB
  async function saveToDB(conversation: Conversation) {
    try {
      const db = await openDB('fan-ai-chat', 1)
      // 使用 JSON 序列化/反序列化来确保对象可以被正确存储
      const serializableConversation = JSON.parse(JSON.stringify(conversation))
      updateDB(db, 'conversations', serializableConversation)
    } catch (error) {
      console.error('保存数据失败:', error)
    }
  }

  // 组件挂载时加载数据
  onMounted(() => {
    loadFromDB()
  })

  function setMessageStop(messId: string, isStop: boolean) {
    // 遍历所有对话，找到对应的消息
    for (const conversation of conversations) {
      const message = conversation.messages.find(mess => mess.id === messId)
      if (message) {
        message.isStop = isStop
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
      const newMessage: Message =
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

  function updateMessage(messageId: string, content: string) {
    if (currentConversation.value) {
      const message = currentConversation.value.messages.find(
        msg => msg.id === messageId,
      )
      if (message) {
        message.content = content
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
      await saveAllToDB()
    }
  }

  return {
    conversations,
    currentConversationId,
    currentConversation,
    setMessageStop,
    setConversationTalking,
    createConversation,
    addMessage,
    switchConversation,
    deleteConversation,
    updateMessage,
    getMessage,
    loadFromDB,
    saveAllToDB,
  }
})
