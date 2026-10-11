<script setup lang="ts">
import { isDark } from '~/composables'
import HdrBackground from '../HdrBackground.vue'
import SunHdrBackground from '../SunHdrBackground.vue'
</script>

<template>
  <el-config-provider namespace="ep">
    <div class="app-layout" :class="{ 'is-day': !isDark }">
      <!-- Three.js 背景层（可拖动） -->
      <div class="app-layout__background" :class="{ 'is-active': !isDark }">
        <SunHdrBackground />
      </div>
      <div class="app-layout__background" :class="{ 'is-active': isDark }">
        <HdrBackground />
      </div>

      <!-- 内容层：pointer-events:none 让鼠标事件穿透到背景 -->
      <div class="app-layout__content">
        <BaseHeader />
        <div class="main-container">
          <BaseSide />
          <main class="page-container">
            <RouterView />
          </main>
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<style>
/* ========== Layout 容器：占满视口，禁止外层滚动 ========== */
.app-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #111429;
  transition: background-color 700ms ease;
  color: #ffffff;
}
.app-layout.is-day {
  background: #dff5f3;
  color: #17212b;
}

/* 锁死 html/body 避免出现多余滚动条 */
html, body {
  overflow: hidden;
  height: 100%;
}

/* ========== Three.js 背景层 ========== */
.app-layout__background {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 900ms cubic-bezier(0.22, 1, 0.36, 1);
}
.app-layout__background.is-active {
  opacity: 1;
  pointer-events: auto;
}

/* ========== 内容层：事件穿透 ========== */
.app-layout__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent;
  pointer-events: none;
}

/* 结构性容器恢复 pointer-events，内部所有元素自然可交互 */
.app-layout__content .header-shell,
.app-layout__content .main-container,
.app-layout__content .page-container,
.app-layout__content .el-scrollbar,
.app-layout__content .el-menu,
.app-layout__content .el-menu-item,
.app-layout__content .el-menu-item-group,
.app-layout__content .el-sub-menu,
.app-layout__content .el-sub-menu__title,
.app-layout__content .ep-menu,
.app-layout__content .ep-menu-item,
.app-layout__content .ep-menu-item-group,
.app-layout__content .ep-sub-menu,
.app-layout__content .ep-sub-menu__title,
.app-layout__content .el-icon,
.app-layout__content .el-button,
.app-layout__content a {
  pointer-events: auto;
}

/* ========== 主区域：header + 内容自适应撑满 ========== */
.app-layout .main-container {
  display: flex;
  flex: 1;
  min-height: 0;
  background: transparent;
}

/* ========== 页面内容容器：完全透明，内部滚动 ========== */
.page-container {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  background: transparent;
  color: #ffffff;
  transition: color 350ms ease;
}
.app-layout.is-day .page-container {
  color: #17212b;
}

/* ========== 文字颜色：夜间白色 / 日间黑色 ========== */
.app-layout .ep-menu-item,
.app-layout .el-menu-item,
.app-layout .el-sub-menu__title,
.app-layout .ep-sub-menu__title {
  transition: color 350ms ease, background-color 350ms ease;
}
.app-layout:not(.is-day) .ep-menu-item,
.app-layout:not(.is-day) .el-menu-item,
.app-layout:not(.is-day) .el-sub-menu__title,
.app-layout:not(.is-day) .ep-sub-menu__title {
  color: #ffffff;
}
.app-layout.is-day .ep-menu-item,
.app-layout.is-day .el-menu-item,
.app-layout.is-day .el-sub-menu__title,
.app-layout.is-day .ep-sub-menu__title {
  color: #17212b;
}

/* ========== 侧边栏菜单：透明背景 ========== */
.app-layout .el-menu-vertical-demo {
  background-color: transparent !important;
  border-right: none;
}

/* 菜单展开/下拉：夜间透明，日间半透明白 */
.app-layout .el-menu--vertical .el-menu,
.app-layout .el-menu .el-menu-item-group,
.app-layout .el-sub-menu .el-menu,
.app-layout .ep-menu--vertical .ep-menu,
.app-layout .ep-menu .ep-menu-item-group,
.app-layout .ep-sub-menu .ep-menu {
  background-color: transparent !important;
}
.app-layout.is-day .el-menu--vertical .el-menu,
.app-layout.is-day .el-menu .el-menu-item-group,
.app-layout.is-day .el-sub-menu .el-menu,
.app-layout.is-day .ep-menu--vertical .ep-menu,
.app-layout.is-day .ep-menu .ep-menu-item-group,
.app-layout.is-day .ep-sub-menu .ep-menu {
  background-color: rgba(255, 255, 255, 0.35) !important;
}

/* 菜单项 hover */
.app-layout:not(.is-day) .el-menu-item:hover,
.app-layout:not(.is-day) .el-sub-menu__title:hover,
.app-layout:not(.is-day) .ep-menu-item:hover,
.app-layout:not(.is-day) .ep-sub-menu__title:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
}
.app-layout.is-day .el-menu-item:hover,
.app-layout.is-day .el-sub-menu__title:hover,
.app-layout.is-day .ep-menu-item:hover,
.app-layout.is-day .ep-sub-menu__title:hover {
  background-color: rgba(0, 0, 0, 0.06) !important;
}

/* 菜单项 active */
.app-layout:not(.is-day) .el-menu-item.is-active,
.app-layout:not(.is-day) .ep-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.12) !important;
}
.app-layout.is-day .el-menu-item.is-active,
.app-layout.is-day .ep-menu-item.is-active {
  background-color: rgba(0, 0, 0, 0.08) !important;
}

/* ========== Header 栏 ========== */
.app-layout .header-shell {
  flex-shrink: 0;
  color: inherit;
}
.app-layout .el-menu-demo {
  background-color: transparent !important;
  backdrop-filter: none;
  border-bottom: none;
}
.app-layout.is-day .el-menu-demo {
  background-color: rgba(255, 255, 255, 0.35) !important;
}

/* ========== 滚动条美化 ========== */
.page-container::-webkit-scrollbar {
  width: 6px;
}
.page-container::-webkit-scrollbar-track {
  background: transparent;
}
.page-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}
.app-layout.is-day .page-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
}
</style>
/* 首页内容区不产生滚动条，保持背景 Three.js 交互 */
.app-layout__content .main-container > .page-container {
  overflow-y: hidden;
}
