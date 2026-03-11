import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_AI_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  dangerouslyAllowBrowser: true,
})
