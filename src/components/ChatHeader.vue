<script setup lang="ts">
// import { storeToRefs } from 'pinia'
import { useConversationStore } from '@/stores/conversation'
import { useSidebarStore } from '@/stores/sidebar'
import { computed } from 'vue'
// import { useThemeStore } from '@/stores/theme'

const conversationStore = useConversationStore()
const currentConversation = computed(() =>
  conversationStore.conversations.find(
    conversation => conversation.id === conversationStore.currentConversationId,
  ),
)
const sidebarStore = useSidebarStore()
// const themeStore = useThemeStore()

const { toggleSidebar } = sidebarStore
// const { switchTheme } = themeStore
// const { isLight } = storeToRefs(themeStore)
</script>

<template>
  <div class="header-box">
    <div v-if="!sidebarStore.isSidebarOpen" v-tooltip="'展开'" class="more">
      <i class="i-icon" @click="toggleSidebar">
        <font-awesome-icon icon="bars" />
      </i>
    </div>
    <div v-show="conversationStore.conversations.length > 0" class="title">
      <p>{{ currentConversation?.title }}</p>
      <i class="i-icon">
        <font-awesome-icon icon="angle-down" />
      </i>
    </div>
    <!-- <div class="dark-light">
      <i
        class="i-icon"
        v-tooltip="isLight ? '深色' : '浅色'"
        @click="switchTheme(isLight ? 'dark' : 'light')"
      >
        <font-awesome-icon :icon="isLight ? 'moon' : 'sun'" size="lg" />
      </i>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.header-box {
  display: flex;
  align-items: center;
  gap: $gap-m;
  width: 100%;
  height: 60px;
  padding: 0 $gap-l;
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fff;
  z-index: 999;
  transition: all 0.3s ease;
  .title {
    display: flex;
    align-items: center;
    gap: $gap-m;
    p {
      @include themify(
        (
          color: $title-color,
        )
      );
    }
    &:hover {
      cursor: pointer;
    }
  }
  .more {
    &:hover {
      cursor: pointer;
    }
  }
  .dark-light {
    margin-left: auto;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
