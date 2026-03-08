import { createOpenAI } from '@ai-sdk/openai'
export const AIProviderType = {
  ALIBABA: 'alibaba',
}

export const AIProviderFactories = {
  [AIProviderType.ALIBABA]: createOpenAI,
}

export class AIProviderFactory {
  /**
   * 创建 AI Provider
   * @param {string} providerType - AI Provider 类型
   * @param {Object} config - AI Provider 配置
   * @returns {Object} - AI Provider 实例
   */
  static createProvider(
    providerType: string,
    config: { baseURL?: string; apiKey?: string },
  ) {
    const factory = AIProviderFactories[providerType]

    if (!factory) {
      throw new Error(`不支持的 AI Provider 类型: ${providerType}`)
    }

    const baseURL =
      providerType === AIProviderType.ALIBABA
        ? config.baseURL || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
        : config.baseURL || undefined
    return factory({
      baseURL,
      apiKey: config.apiKey || undefined,
    })
  }
}
