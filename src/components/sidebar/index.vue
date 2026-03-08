<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSidebarStore } from '@/stores/sidebar'
const sidebarStore = useSidebarStore()
const { toggleSidebar } = sidebarStore
const { isSidebarOpen } = storeToRefs(sidebarStore)
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
      <button class="btn">
        <font-awesome-icon icon="plus" />
        添加新对话
      </button>
      <div class="talk-historys">
        <ul class="history-talk-group">
          <li class="talk-title">今天</li>
          <li class="t-item">
            对话内容对话内容对话内对话内容对话 内容对话内容容
          </li>
          <li class="t-item">
            对话内容对话对话内容对话内容对话内容内容对话内容
          </li>
        </ul>
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
    overflow-y: auto;
    margin-top: $gap-s;
    .talk-title {
      margin-bottom: $gap-s;
      font-weight: bold;
      font-size: $fs-s;
    }
    .t-item {
      position: relative;
      border-radius: $rad-m;
      padding: $gap-s;
      font-size: $fs-m;
      cursor: pointer;
      white-space: nowrap; // 文本不换行
      overflow: hidden; // 溢出内容隐藏
      text-overflow: ellipsis; // 溢出部分用省略号表示
      &:hover {
        @include themify(
          (
            background-color: $hover-color,
          )
        );
        transition: all 0.3s ease;
        .in-icon {
          display: block; // 鼠标悬停时显示图标
        }
      }
      .in-icon {
        display: none;
        position: absolute;
        right: $gap-s;
        top: 50%;
        transform: translateY(-50%); // 垂直居中
        cursor: pointer; // 鼠标悬停时显示指针
        &:hover {
          @include themify(
            (
              background-color: $hover-color,
            )
          );
        }
      }
    }
  }
}
</style>
