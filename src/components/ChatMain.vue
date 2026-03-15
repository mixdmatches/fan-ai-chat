<script setup lang="ts">
import Header from '@/components/ChatHeader.vue'
import InputBox from '@/components/InputBox.vue'
import { Bubble, type BubbleProps } from 'ant-design-x-vue'
import { Flex, Typography } from 'ant-design-vue'
import { computed, h } from 'vue'
import WelComeBox from '@/components/WelComeBox.vue'
import { useConversationStore } from '@/stores/conversation'
import markdownit from 'markdown-it'
import { UserOutlined } from '@ant-design/icons-vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

const conversationStore = useConversationStore()

const currentConversation = computed(() =>
  conversationStore.conversations.find(
    conv => conv.id === conversationStore.currentConversationId,
  ),
)

const md = markdownit({
  html: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str, true).value
      } catch (__) {}
    }
    return ''
  },
})
const renderMarkdown: BubbleProps['messageRender'] = content =>
  h(Typography, null, {
    default: () => h('div', { innerHTML: md.render(content) }),
  })
</script>

<template>
  <div class="main">
    <Header />
    <div class="chat-box">
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
            <Bubble
              v-else
              variant="borderless"
              placement="start"
              :content="item.content"
              :message-render="renderMarkdown"
              :avatar="{ icon: h(UserOutlined) }"
            />
          </template>
        </Flex>
      </div>
    </div>
    <InputBox />
  </div>
</template>

<style scoped lang="scss">
.main {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  transition: all 0.3s ease;
  @include themify(
    (
      background-color: $bg-color,
    )
  );
}
@media screen and (max-width: 1024px) {
  body .chat-box {
    padding: $gap-l;
  }
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
  }
}
</style>
