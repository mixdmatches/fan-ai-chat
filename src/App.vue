<script setup lang="ts">
import SideBar from './components/sidebar/index.vue'
import Main from './components/main/index.vue'
</script>

<template>
  <div class="app">
    <SideBar />
    <Main />
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
