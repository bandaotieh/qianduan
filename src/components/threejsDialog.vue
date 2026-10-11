<template>
  <el-dialog width="50vw"  top="5vh" v-bind="$attrs" v-model="visible" :append-to-body="true" :close-on-click-modal="false" draggable>
    <!-- 内容插槽 -->
    <slot name="body"></slot>
    <div class="concent">
     
                 <CodeBlock 
      :code="daima" 
      language="javascript" 
      :show-run="true"
      @run="executeCode"
    />
    </div>
    
    <!-- 统一处理底部按钮 -->
    <template #footer>
      <slot name="footer">
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // 选择你喜欢的主题
import CodeBlock from './CodeBlock .vue';
import { ref, onMounted, computed } from 'vue';
// 组件挂载后高亮静态代码
onMounted(() => {
    highlightAll();
});
// 高亮所有代码块
const highlightAll = () => {
    // 注意：highlightAll 会查找页面中所有 <pre><code> 并高亮
    hljs.highlightAll();
};
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
};
// 1. 定义双向绑定的 props
const props = defineProps<{
  modelValue: boolean;
  daima: string
}>();

// 2. 定义事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
}>();

// 3. 计算属性实现双向绑定
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

// 4. 确定按钮事件
const handleConfirm = () => {
  emit('confirm');
};
</script>
<style lang="css" scoped>
.concent{
  overflow: auto;
}
</style>