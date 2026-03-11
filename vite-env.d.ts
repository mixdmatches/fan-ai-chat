/// <reference types="vite/client" />

// 声明 CSS 模块
declare module '*.css' {
  const content: Record<string, string>
  export default content
}
