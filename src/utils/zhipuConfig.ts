/**接口地址 */
export const APIURL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
/**个人密钥 */
export const KEY = 'cf0041c01d6144d48ccbcd9da6b1c7c2.uUoHBDmxK4H28gR4'
/**模型类型 */
export const modelType = 'glm-4-plus'

/**
 * ai流式对话
 * @param {*} question 用户输入的问题
 * @returns
 */
export const generateConfigTalk = (question: string) => {
  return JSON.stringify({
    model: modelType,
    messages: [
      {
        role: 'system',
        content: '',
      },
      {
        role: 'user',
        content: question,
      },
    ],
    stream: true,
  })
}
