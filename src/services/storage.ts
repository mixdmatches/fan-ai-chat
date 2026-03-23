import { openDB, addData, updateDB, cursorGetData } from '@/utils/indexDB'
import type { Conversation } from '@/types/conversation'
import { nanoid } from 'nanoid'

// 从 IndexedDB 加载数据
export async function loadConversationsFromDB() {
  try {
    const db = await openDB('fan-ai-chat', 1)
    const savedConversations = await cursorGetData(db, 'conversations')
    return savedConversations
  } catch (error) {
    console.error('加载数据失败:', error)
    return []
  }
}

// 初始化默认对话数据
export function initDefaultConversations() {
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
          thinkContent: '思考内容',
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
          thinkContent: '思考内容',
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
  const conversations: Conversation[] = []
  // 添加默认数据到 conversations
  defaultConversations.forEach(conv => conversations.push(conv))
  // 保存默认数据到 IndexedDB
  saveAllToDB(conversations)
}

// 保存所有对话到 IndexedDB
export async function saveAllToDB(conversations: Conversation[]) {
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
  } catch (error) {
    console.error('保存数据失败:', error)
  }
}

// 保存单个对话到 IndexedDB
export async function saveToDB(conversation: Conversation) {
  try {
    const db = await openDB('fan-ai-chat', 1)
    // 使用 JSON 序列化/反序列化来确保对象可以被正确存储
    const serializableConversation = JSON.parse(JSON.stringify(conversation))
    updateDB(db, 'conversations', serializableConversation)
  } catch (error) {
    console.error('保存数据失败:', error)
  }
}
