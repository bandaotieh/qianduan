<template>
  <div style="padding: 20px;">
    <input type="text" v-model="text" placeholder="请输入问题..." />
    <button @click="callDifyApi" :disabled="isStreaming">
      {{ isStreaming ? '生成中...' : '调用 API' }}
    </button>

    <!-- 显示流式结果 -->
    <div v-if="result" style="margin-top: 20px; white-space: pre-wrap;">
      <strong>AI 回复：</strong> {{ result }}
    </div>

    <!-- 显示错误信息 -->
    <div v-if="errorMsg" style="margin-top: 20px; color: red; white-space: pre-wrap;">
      <strong>错误：</strong> {{ errorMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const API_URL = '/api/v1/workflows/run';
const API_KEY = 'app-MLnZhqwKKFS82YOuKt19C9YG';

const text = ref('你好');
const result = ref('');
const errorMsg = ref('');
const isStreaming = ref(false);

async function callDifyApi() {
  if (!text.value) return alert('请输入内容');

  isStreaming.value = true;
  result.value = '';
  errorMsg.value = '';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: { query: text.value },
        response_mode: "streaming",
        user: "user-js-001"
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // 按行分割处理
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // 跳过非 data 行
        if (!trimmed.startsWith('data:')) continue;

        const jsonStr = trimmed.substring(5).trim();
        if (!jsonStr) continue;

        try {
          const event = JSON.parse(jsonStr);
          console.log('收到事件:', event.event, event);

          // ✅ 工作流成功完成时，从 outputs 中提取文本
          if (event.event === 'workflow_finished') {
            if (event.data?.status === 'failed') {
              let errorText = '工作流执行失败';
              if (event.data?.error) {
                errorText = event.data.error;
                const cudaMatch = errorText.match(/cudaMalloc failed: (\w+)/);
                if (cudaMatch) {
                  errorText = `GPU显存不足: ${cudaMatch[1]}. 请更换更小的模型或减少上下文长度。`;
                }
              }
              errorMsg.value = errorText;
              console.error('工作流失败:', errorText);
            } else {
              console.log('工作流完成:', event.data);
              // 工作流完成的 outputs 中取文本
              if (event.data?.outputs) {
                // 尝试常见键名: answer, output, text 等
                const outputs = event.data.outputs;
                const textContent = outputs.answer || outputs.output || outputs.text || JSON.stringify(outputs);
                if (textContent && textContent !== '{}') {
                  result.value = textContent;
                }
              }
            }
          }
          // ✅ 节点完成时提取文本（流式显示的关键）
          else if (event.event === 'node_finished') {
            if (event.data?.status === 'succeeded') {
              console.log('节点完成:', event.data.title, event.data);
              // 工作流中各个节点的输出在 event.data.outputs 里
              if (event.data.outputs) {
                const outputs = event.data.outputs;
                // 遍历 outputs 中所有键值，拼接文本
                for (const key of Object.keys(outputs)) {
                  const val = outputs[key];
                  if (typeof val === 'string' && val.trim()) {
                    result.value += val;
                  } else if (typeof val === 'object' && val !== null) {
                    result.value += JSON.stringify(val);
                  }
                }
              }
            } else if (event.data?.status === 'failed') {
              console.warn('节点失败:', event.data.title, event.data.error);
              let errorText = `节点[${event.data.title}]执行失败: ${event.data.error || '未知错误'}`;
              const cudaMatch = errorText.match(/cudaMalloc failed: (\w+)/);
              if (cudaMatch) {
                errorText = `GPU显存不足: ${cudaMatch[1]}. 请更换更小的模型或减少上下文长度。`;
              }
              errorMsg.value = errorText;
            }
          }
          // 节点开始事件（调试用）
          else if (event.event === 'node_started') {
            console.log('节点开始:', event.data?.title, event.data?.node_type);
          }
          // 工作流开始事件（调试用）
          else if (event.event === 'workflow_started') {
            console.log('工作流开始:', event.data);
          }
        } catch (e) {
          console.warn('解析流数据失败:', e, jsonStr);
        }
      }
    }

  } catch (error:any) {
    console.error('调用失败:', error);
    errorMsg.value = `调用失败: ${error.message}`;
  } finally {
    isStreaming.value = false;
  }
}
</script>