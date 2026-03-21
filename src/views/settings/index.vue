<script setup lang="ts">
import { h, ref } from 'vue'
import {
  Form,
  Input,
  Select,
  Switch,
  Slider,
  Button,
  Card,
  Typography,
  Divider,
  message,
} from 'ant-design-vue'
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons-vue'

// 表单数据
const formData = ref({
  apiKey: '',
  model: 'qwen3.5-flash',
  temperature: 0.7,
  theme: 'light',
  autoSave: true,
  maxTokens: 1000,
})

// 模型选项
const modelOptions = [
  { value: 'qwen3.5-flash', label: 'Qwen 3.5 Flash' },
  { value: 'qwen3.5', label: 'Qwen 3.5' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' },
]

// 主题选项
const themeOptions = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
]

// 保存设置
const handleSave = () => {
  // 这里可以添加保存逻辑，比如存储到本地存储
  message.success('设置保存成功')
}

// 清除本地数据
const handleClearData = () => {
  // 这里可以添加清除本地存储的逻辑
  message.success('本地数据已清除')
}
</script>

<template>
  <div class="settings-container">
    <div class="settings-header">
      <Typography.Title :level="2">设置</Typography.Title>
    </div>

    <Card class="settings-card">
      <Form layout="vertical">
        <!-- API 设置 -->
        <Typography.Title :level="4">API 设置</Typography.Title>
        <Divider />

        <Form.Item label="API 密钥" required>
          <Input.Password
            v-model:value="formData.apiKey"
            placeholder="请输入 API 密钥"
            style="width: 100%"
          />
        </Form.Item>

        <Form.Item label="模型选择">
          <Select v-model:value="formData.model" style="width: 100%">
            <Select.Option
              v-for="option in modelOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="温度参数">
          <Slider
            v-model:value="formData.temperature"
            :min="0"
            :max="1"
            :step="0.1"
          />
          <div class="slider-value">{{ formData.temperature }}</div>
        </Form.Item>

        <Form.Item label="最大 token 数">
          <Input.Number
            v-model:value="formData.maxTokens"
            :min="100"
            :max="4000"
            :step="100"
          />
        </Form.Item>

        <!-- 界面设置 -->
        <Typography.Title :level="4" style="margin-top: 24px"
          >界面设置</Typography.Title
        >
        <Divider />

        <Form.Item label="主题">
          <Select v-model:value="formData.theme" style="width: 100%">
            <Select.Option
              v-for="option in themeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="自动保存对话">
          <Switch v-model:checked="formData.autoSave" />
        </Form.Item>

        <!-- 数据管理 -->
        <Typography.Title :level="4" style="margin-top: 24px"
          >数据管理</Typography.Title
        >
        <Divider />

        <Form.Item>
          <Button type="danger" @click="handleClearData">
            <template #icon>
              <DeleteOutlined />
            </template>
            清除本地对话数据
          </Button>
        </Form.Item>

        <!-- 保存按钮 -->
        <Form.Item style="margin-top: 32px">
          <Button type="primary" @click="handleSave">
            <template #icon>
              <SaveOutlined />
            </template>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.settings-container {
  width: 100%;
  padding: 24px;
  margin: 0 auto;
  overflow: auto;
  .settings-header {
    margin-bottom: 24px;
  }

  .settings-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .slider-value {
    text-align: center;
    margin-top: 8px;
    font-size: 14px;
    color: #666;
  }
}
</style>
