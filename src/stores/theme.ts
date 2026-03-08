import { defineStore } from 'pinia'
import { ref, watch, watchEffect } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 检测系统默认主题
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)')
  const isLight = ref(prefersLight.matches)

  // 监听系统主题变化
  const handleThemeChange = (event: MediaQueryListEvent) => {
    isLight.value = event.matches
  }

  // 初始化监听
  watchEffect(() => {
    prefersLight.addEventListener('change', handleThemeChange)
    return () => {
      prefersLight.removeEventListener('change', handleThemeChange)
    }
  })

  const switchTheme = (theme: string) => {
    isLight.value = theme === 'light'
    window.document.documentElement.setAttribute('data-theme', theme)
  }

  watchEffect(() => {
    switchTheme(isLight.value ? 'light' : 'dark')
  })

  return {
    isLight,
    switchTheme,
  }
})
