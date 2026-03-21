<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
</script>

<template>
  <div class="chat-container">
    <SideBar />
    <div class="chat-main">
      <ChatHeader />
      <router-view></router-view>
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
}
</style>
