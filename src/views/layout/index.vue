<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
import ChatHeader from '@/components/ChatHeader.vue'
</script>

<template>
  <div class="chat-container">
    <SideBar />
    <div class="chat-main">
      <ChatHeader />
      <div class="chat-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-container {
  display: flex;
  height: 100vh;

  .chat-main {
    flex: 1;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .chat-main > router-view {
    flex: 1;
    overflow-y: auto;
  }
  .chat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-top: 1px solid #e4e7ed;
    border-left: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: $gap-m;
  }
}
</style>
