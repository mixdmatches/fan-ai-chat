<script setup lang="ts">
import Header from '../header/index.vue'
import InputBox from '../InputBox.vue'
import { Bubble } from 'ant-design-x-vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { Flex } from 'ant-design-vue'
import { h, type CSSProperties } from 'vue'
import WelComeBox from '@/components/WelComeBox.vue'
const fooAvatar: CSSProperties = {
  color: '#f56a00',
  backgroundColor: '#fde3cf',
}
</script>

<template>
  <div class="main">
    <Header />
    <div class="chat-box">
      <WelComeBox />
      <div class="messages" style="display: none">
        <Flex gap="middle" vertical>
          <Bubble
            placement="end"
            content="Good morning, how are you?"
            :avatar="{ icon: h(UserOutlined), style: fooAvatar }"
          />
          <Bubble
            :typing="{ step: 2, interval: 50 }"
            placement="start"
            content="Hi, good morning, I'm fine!"
          >
          </Bubble>
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
    .works {
      display: flex;
      align-items: center;
      gap: $gap-m;
    }
  }
}
</style>
