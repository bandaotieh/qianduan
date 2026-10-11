<script setup lang="ts">
// App-level imports are documented on their source lines.
import LocalAiChat from './components/LocalAiChat.vue' // 全站统一挂载本地 AI 对话组件。
</script>

<template>
  <!-- 根应用模板声明。 -->
  <RouterView /> <!-- 保留现有页面路由出口。 -->
  <LocalAiChat /> <!-- 在所有页面显示本地 AI 悬浮入口。 -->
</template>

<style>
/* 根应用的全局样式。 */
#app {
  /* 设置应用根容器的默认样式。 */
  text-align: center; /* 保留原有页面的居中文本布局。 */
  color: var(--ep-text-color-primary); /* 使用 Element Plus 主题文字颜色。 */
} /* 根应用样式规则结束。 */
</style>
