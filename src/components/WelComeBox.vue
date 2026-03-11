<script setup lang="ts">
import { h } from 'vue'
import { Welcome, Prompts } from 'ant-design-x-vue'
import {
  BulbOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  SmileOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue'
import type { PromptsProps } from 'ant-design-x-vue'
import { ConfigProvider, theme } from 'ant-design-vue'

const items: PromptsProps['items'] = [
  {
    key: '1',
    icon: h(BulbOutlined, { style: { color: '#FFD700' } }),
    label: '激发你的创造力',
    description: '有什么新项目的灵感吗？',
  },
  {
    key: '2',
    icon: h(InfoCircleOutlined, { style: { color: '#1890FF' } }),
    label: '了解背景信息',
    description: '帮助我理解这个主题的背景。',
  },
  {
    key: '3',
    icon: h(RocketOutlined, { style: { color: '#722ED1' } }),
    label: '提高工作效率',
    description: '如何更快更好地工作？',
  },
  {
    key: '4',
    icon: h(SmileOutlined, { style: { color: '#52C41A' } }),
    label: '讲个笑话',
    description: '为什么蚂蚁不会生病？因为它们有小小的蚂蚁身体！',
  },
  {
    key: '5',
    icon: h(WarningOutlined, { style: { color: '#FF4D4F' } }),
    label: '常见问题解决方案',
    description: '如何解决常见问题？分享一些技巧！',
  },
]
</script>

<template>
  <div class="wel-box">
    <ConfigProvider :theme="{ algorithm: theme.defaultAlgorithm }">
      <Welcome
        :style="{
          backgroundImage: 'linear-gradient(97deg, #f2f9fe 0%, #f7f3ff 100%)',
          borderStartStartRadius: 4,
          marginBottom: '20px',
        }"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm Fan AI Chat"
        description="Base on Ant Design, AGI
        product interface solution, create a better intelligent vision~"
      />
    </ConfigProvider>
    <Prompts
      title="✨ 灵感火花和精彩提示"
      :items="items"
      wrap
      :styles="{
        item: {
          flex: 'none',
          width: 'calc(50% - 6px)',
        },
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.wel-box {
  margin-top: 100px;
}
</style>
