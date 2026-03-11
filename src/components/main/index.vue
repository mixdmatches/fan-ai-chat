<script setup lang="ts">
import Header from '../header/index.vue'
import InputBox from '../InputBox.vue'
import { Bubble } from 'ant-design-x-vue'
import { Flex } from 'ant-design-vue'
import { computed } from 'vue'
import WelComeBox from '@/components/WelComeBox.vue'
import { useConversationStore } from '@/stores/conversation'

const conversationStore = useConversationStore()

const currentConversation = computed(() =>
  conversationStore.conversations.find(
    conv => conv.id === conversationStore.currentConversationId,
  ),
)
</script>

<template>
  <div class="main">
    <Header />
    <div class="chat-box">
      <WelComeBox v-if="currentConversation?.messages.length === 0" />
      <div v-else class="messages">
        <Flex gap="middle" vertical>
          <Bubble
            v-for="item in currentConversation?.messages"
            :key="item.id"
            :placement="item.role === 'user' ? 'end' : 'start'"
            :content="item.content"
            :class="{
              'assistant-msg': item.role === 'assistant',
              'user-msg': item.role === 'user',
            }"
          />
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
  overflow-y: auto;
  scrollbar-gutter: stable;
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
    .assistant-msg {
      max-width: 80%;
    }
    .works {
      display: flex;
      align-items: center;
      gap: $gap-m;
    }
  }
}
</style>
