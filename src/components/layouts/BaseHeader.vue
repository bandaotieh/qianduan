<script lang="ts" setup>
import { repository } from '~/../package.json'
import { isDark, toggleDark } from '~/composables'
</script>

<template>
  <header class="header-shell">
    <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false" router>
      <el-menu-item index="/home">
        <div class="flex items-center justify-center gap-2">
          <div class="text-xl" i-ep-element-plus />
          <span>Element Plus</span>
        </div>
      </el-menu-item>
      <!-- <el-sub-menu index="2">
        <template #title>Workspace</template>
        <el-menu-item index="2-1">Vue3</el-menu-item>
        <el-menu-item index="2-2">Ts</el-menu-item>
        <el-menu-item index="2-3">item three</el-menu-item>
      </el-sub-menu> -->
      <!-- <el-menu-item index="3" disabled>Info</el-menu-item> -->
      <!-- <el-menu-item index="4">Orders</el-menu-item> -->
      <!-- <el-menu-item index="repository">
        <a class="size-full flex items-center justify-center" :href="repository.url" target="_blank">
          <div i-ri-github-fill />
        </a>
      </el-menu-item> -->
    </el-menu>

    <el-button
      class="layout-theme-switch"
      text
      circle
      :aria-label="isDark ? 'Switch to day mode' : 'Switch to night mode'"
      :title="isDark ? 'Switch to day mode' : 'Switch to night mode'"
      @click="toggleDark()"
    >
      <i :class="isDark ? 'i-ep-sunny' : 'i-ep-moon'" />
    </el-button>
  </header>
</template>

<style lang="scss">
.header-shell {
  position: relative;
  z-index: 2;
}

.el-menu-demo {
  background-color: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(16px);

  &.ep-menu--horizontal > .ep-menu-item:nth-child(1) {
    margin-right: auto;
  }
}

html.dark .el-menu-demo {
  background-color: rgba(20, 24, 45, 0.56) !important;
}

.layout-theme-switch {
  position: absolute;
  top: 50%;
  right: 48px;
  z-index: 1;
  width: 42px;
  height: 42px;
  color: var(--ep-text-color-primary);
  font-size: 20px;
  transform: translateY(-50%);
}
</style>
