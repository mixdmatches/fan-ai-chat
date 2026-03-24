<script setup lang="ts">
import InputBox from '@/components/InputBox.vue'
import { Bubble, type BubbleProps } from 'ant-design-x-vue'
import { Flex, Typography, Space, Button, FloatButton } from 'ant-design-vue'
import { h, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import WelComeBox from '@/components/WelComeBox.vue'
import { useConversationStore } from '@/stores/conversation'
import markdownit from 'markdown-it'
import {
  UserOutlined,
  BulbOutlined,
  UpOutlined,
  DownOutlined,
  LoadingOutlined,
} from '@ant-design/icons-vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import { storeToRefs } from 'pinia'

const conversationStore = useConversationStore()
const route = useRoute()

const { currentConversation, currentConversationId, lastMessage } =
  storeToRefs(conversationStore)

const md = markdownit({
  html: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(lang, str, true).value
    }
    return ''
  },
})
const renderMarkdown: BubbleProps['messageRender'] = content =>
  h(Typography, null, {
    default: () => h('div', { innerHTML: md.render(content) }),
  })

const thinkRenderMarkdown: BubbleProps['messageRender'] = content =>
  h(Typography, null, {
    default: () => h('div', { innerHTML: md.render(content) }),
  })

// 对话滚动到底部
const scrollBox = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (scrollBox.value) {
    scrollBox.value.scrollTop = scrollBox.value.scrollHeight
  }
}

watch(
  [
    () => lastMessage.value.content,
    () => lastMessage.value.thinkContent,
    () => currentConversationId.value,
  ],
  () => {
    scrollToBottom()
  },
  { deep: true },
)

const isThinking = ref(false)
const changeIsThinking = (v: boolean) => {
  isThinking.value = v
  if (!isThinking.value) collapseStates.value[lastMessage.value.id] = false
}

const collapseStates = ref<Record<string, boolean>>({})
const onTopClick = () => {
  scrollToBottom()
}
</script>

<template>
  <div
    v-if="route.params.id === 'new' || currentConversationId === ''"
    class="middle_title_main"
  >
    <div class="title">FAN_AI_CHAT</div>
    <InputBox></InputBox>
  </div>
  <div v-else class="middle_main">
    <div ref="scrollBox" class="chat-box">
      <FloatButton @click="onTopClick" />
      <WelComeBox v-if="currentConversation?.messages.length === 0" />
      <div v-else class="messages">
        <Flex gap="middle" vertical>
          <template
            v-for="item in currentConversation?.messages"
            :key="item.id"
          >
            <Bubble
              v-if="item.role === 'user'"
              variant="filled"
              placement="end"
              :content="item.content"
            />
            <template v-if="item.role === 'assistant'">
              <Bubble
                variant="borderless"
                placement="start"
                :avatar="{ icon: h(UserOutlined) }"
              >
                <template #message>
                  <Space align="baseline">
                    <BulbOutlined />
                    <span>{{ isThinking ? '思考中...' : '已深度思考' }}</span>
                    <Button
                      type="text"
                      size="small"
                      style="background: transparent"
                      :icon="
                        collapseStates[item.id]
                          ? h(UpOutlined)
                          : h(DownOutlined)
                      "
                      @click="
                        () =>
                          (collapseStates[item.id] = !collapseStates[item.id])
                      "
                    />
                  </Space>
                </template>
                <template #footer>
                  <Space direction="vertical">
                    <Bubble
                      v-show="collapseStates[item.id]"
                      variant="borderless"
                      :content="item.thinkContent"
                      :message-render="thinkRenderMarkdown"
                    />
                    <LoadingOutlined v-if="isThinking" />
                    <Bubble
                      variant="borderless"
                      style="margin-top: -24px"
                      :content="item.content"
                      :message-render="renderMarkdown"
                    />
                  </Space>
                  <div v-if="item.isStop" class="info">已停止输出</div>
                </template>
              </Bubble>
            </template>
          </template>
        </Flex>
      </div>
    </div>
    <InputBox
      :is-thinking="isThinking"
      :collapse-states="collapseStates"
      @change-is-thinking="changeIsThinking"
    />
  </div>
</template>

<style scoped lang="scss">
@media screen and (max-width: 1024px) {
  body .chat-box {
    padding: $gap-l;
  }
}
.middle_title_main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding-bottom: 200px;
}
.middle_main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 80px;
}
.chat-box {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 $gap-l * 8;
  padding-top: $gap-l;
  transition: all 0.3s ease;
  overflow-y: auto;
  scrollbar-gutter: stable;

  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
  h2 {
    font-weight: 400;
    @include themify(
      (
        color: $text-color,
      )
    );
  }
  .description {
    font-size: $fs-m;
    @include themify(
      (
        color: $text-color,
      )
    );
  }
  .messages {
    flex: 1;
    width: 100%;
    .left-msg {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding: 0 $gap-m;
      .left-text {
        padding: $gap-s;
        @include themify(
          (
            background-color: $message-bg-color,
            color: $text-color,
          )
        );
        border-radius: $rad-m;
        transition: all 0.3s ease;
      }
    }
    .right-msg {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: $gap-m;
      .right-text {
        @include themify(
          (
            color: $text-color,
          )
        );
      }
    }
    .works {
      display: flex;
      align-items: center;
      gap: $gap-m;
    }
    .info {
      color: #4e5969;
    }
  }
}
.title {
  font-size: 3rem;
}
</style>
