<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
import ChatMain from '@/components/ChatMain.vue'
</script>

<template>
  <div class="app">
    <SideBar />
    <ChatMain />
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  height: 100vh;
  @include themify(
    (
      background-color: $bg-color,
    )
  );
}
</style>
