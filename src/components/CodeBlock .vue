<template>
  <div class="code-block-wrapper">
    <!-- 顶部工具栏 -->
    <div class="code-header" @click="toggleCollapse">
      <div class="left-section">
        <!-- 1. 收起/展开 箭头图标 -->
        <span class="arrow-icon" :class="{ 'collapsed': isCollapsed }">▼</span>
        <span class="language-label">{{ language }}</span>
      </div>
      
      <div class="actions" @click.stop>
        <!-- 运行按钮 -->
        <button v-if="showRun" class="action-btn run-btn" @click="$emit('run')">
          ▶ 运行代码
        </button>
        <!-- 复制按钮 -->
        <button class="action-btn copy-btn" @click="handleCopy">
          {{ copied ? '已复制' : '📋 复制代码' }}
        </button>
      </div>
    </div>

    <!-- 代码显示区域 -->
    <!-- 2. 动态绑定 class 控制高度 -->
    <div class="code-container" :class="{ 'is-collapsed': isCollapsed }">
      <pre><code ref="codeRef" :class="`language-${language}`"></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
// 引入 highlight.js 核心和常用语言包
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml'; // HTML
import css from 'highlight.js/lib/languages/css';
import 'highlight.js/styles/atom-one-dark.css'; // 引入高亮主题

// 注册语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);

const props = withDefaults(defineProps<{
  code: string;
  language?: string;
  showRun?: boolean;
}>(), {
  language: 'javascript',
  showRun: false
});

defineEmits<{
  (e: 'run'): void;
}>();

const codeRef = ref<HTMLElement | null>(null);
const copied = ref(false);
// 3. 定义收起状态，默认为 false (展开)
const isCollapsed = ref(false);

// 渲染高亮
const renderHighlight = () => {
  if (codeRef.value) {
    codeRef.value.textContent = props.code;
    hljs.highlightElement(codeRef.value);
  }
};

onMounted(renderHighlight);
watch(() => props.code, renderHighlight);

// 复制逻辑
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('复制失败', err);
  }
};

// 4. 切换收起/展开状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
.code-block-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa; /* 背景色 */
  margin-bottom: 20px;
  font-family: monospace;
}

/* 头部样式 */
.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f1f3f5;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer; /* 提示可点击 */
  user-select: none;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}

/* 箭头动画 */
.arrow-icon {
  display: inline-block;
  font-size: 10px;
  transition: transform 0.3s ease;
  color: #868e96;
}

/* 收起时箭头旋转 */
.arrow-icon.collapsed {
  transform: rotate(-90deg);
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
  color: #495057;
}

.action-btn:hover {
  background-color: #e9ecef;
}

.run-btn {
  color: #1971c2;
  font-weight: bold;
}

/* 代码容器样式 */
.code-container {
  max-height: 500px; /* 最大高度限制 */
  overflow-y: auto;
  transition: max-height 0.3s ease-out; /* 平滑过渡动画 */
  background-color: #282c34; /* 代码深色背景 */
}

/* 收起时的样式 */
.code-container.is-collapsed {
  max-height: 0; /* 高度变为0 */
  overflow: hidden;
}

/* 覆盖 highlight.js 的一些默认边距 */
pre {
  margin: 0;
  padding: 16px;
}
</style>