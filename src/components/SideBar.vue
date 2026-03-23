<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSidebarStore } from '@/stores/sidebar'
import { useConversationStore } from '@/stores/conversation'
import { computed } from 'vue'
import dayjs from 'dayjs'
import { DeleteOutlined } from '@ant-design/icons-vue'
import type { Conversation } from '@/types/conversation'
import router from '@/routers'

const sidebarStore = useSidebarStore()
const { toggleSidebar } = sidebarStore
const { isSidebarOpen } = storeToRefs(sidebarStore)

const conversationStore = useConversationStore()
const { conversations, currentConversationId } = storeToRefs(conversationStore)

const groupedConversations = computed(() => {
  const groups: Record<string, Conversation[]> = {}

  conversations.value.forEach(conversation => {
    const date = dayjs(conversation.createdAt).format('YYYY-MM-DD')
    const today = dayjs().format('YYYY-MM-DD')
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    const sevenDaysAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD')

    let groupKey
    if (date === today) {
      groupKey = '今天'
    } else if (date === yesterday) {
      groupKey = '昨天'
    } else if (date >= sevenDaysAgo) {
      groupKey = '七天前'
    } else {
      groupKey = dayjs(conversation.createdAt).format('YYYY-MM')
    }
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(conversation)
  })

  const orderedGroups: Record<string, Conversation[]> = {}

  if (groups['今天']) {
    orderedGroups['今天'] = groups['今天']
  }

  if (groups['昨天']) {
    orderedGroups['昨天'] = groups['昨天']
  }

  Object.keys(groups).forEach(key => {
    if (key !== '今天' && key !== '昨天') {
      orderedGroups[key] = groups[key]
    }
  })

  return orderedGroups
})

const onChangeTalk = (conversationId: string) => {
  router.push(`/chat/${conversationId}`)
  conversationStore.switchConversation(conversationId)
}
</script>

<template>
  <transition mode="out-in" name="sidebar-fade">
    <div v-if="isSidebarOpen" class="sidebar">
      <span class="top">
        <h3 class="sidebar-title">历史对话</h3>
        <span v-tooltip="'收起侧边栏'" class="i-icon" @click="toggleSidebar">
          <font-awesome-icon icon="circle-chevron-left" size="lg" />
        </span>
      </span>
      <a-button
        type="primary"
        ghost
        @click="conversationStore.createConversation('新对话')"
        >添加新对话</a-button
      >
      <div class="talk-histories">
        <ul
          v-for="(group, date) in groupedConversations"
          :key="date"
          class="history-talk-group"
        >
          <li class="talk-title">{{ date }}</li>
          <li
            v-for="conversation in group"
            :key="conversation.id"
            :class="{
              't-item': true,
              'current-t': conversation.id === currentConversationId,
            }"
            @click.stop="onChangeTalk(conversation.id)"
          >
            <span>{{ conversation.title }}</span>
            <DeleteOutlined
              @click.stop="
                conversationStore.deleteConversation(conversation.id)
              "
            />
          </li>
        </ul>
      </div>

      <div class="bottom">
        <router-link to="/settings">
          <a-button style="width: 100%" type="primary" ghost> 设置 </a-button>
        </router-link>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
// 定义过渡动画样式
.sidebar-fade-enter-active,
.sidebar-fade-leave-active,
.sidebar-fade-m-enter-active,
.sidebar-fade-m-leave-active {
  transition: all 0.3s ease;
}

.sidebar-fade-enter-from,
.sidebar-fade-leave-to,
.sidebar-fade-m-enter-from,
.sidebar-fade-m-leave-to {
  transform: translateX(-100%);
}

@media screen and (max-width: 768px) {
  body .sidebar {
    position: fixed;
    z-index: 9999;
  }
}

.sidebar {
  width: $sidebar-w-max;
  display: flex;
  flex-direction: column;
  gap: $gap-m;
  height: 100%;
  padding: $gap-m;
  background-color: #f9fbfc;
  @include themify(
    (
      background-color: $sidebar-color,
      color: $text-color,
    )
  );
  transition: all 0.3s ease;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .history-talk-group {
    display: flex;
    flex-direction: column;
    gap: $gap-s;
    overflow-y: auto;
    margin-top: $gap-s;
    .talk-title {
      margin-bottom: $gap-s;
      font-weight: bold;
      font-size: $fs-s;
    }
    .t-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      border-radius: $rad-m;
      padding: $gap-s;
      font-size: $fs-m;
      cursor: pointer;
      white-space: nowrap; // 文本不换行
      overflow: hidden; // 溢出内容隐藏
      text-overflow: ellipsis; // 溢出部分用省略号表示
      transition: background-color 0.3s ease;
      &:hover:not(.current-t) {
        background-color: $hover-color;
      }
      .in-icon {
        display: none;
        position: absolute;
        right: $gap-s;
        top: 50%;
        transform: translateY(-50%); // 垂直居中
        cursor: pointer; // 鼠标悬停时显示指针
        // &:hover {
        //   @include themify(
        //     (
        //       background-color: $hover-color,
        //     )
        //   );
        // }
      }
    }
    .current-t {
      background-color: $primary-color;
      color: $text-color-hover;
    }
  }
  .bottom {
    margin-top: auto;
  }
}
</style>
