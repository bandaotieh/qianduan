<script setup lang="ts">
// 使用 Vue 组合式 API 实现聊天与流式传输。
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue' // 导入响应式、生命周期和监听工具。

const API_URL = '/api/v1/workflows/run' // 使用现有 Vite 代理转发到本地 Dify 服务。
const STORAGE_KEY = 'local-ai-chat-history-v1' // 区分版本地会话历史数据。
const MAX_CONVERSATIONS = 20 // 限制历史会话数量以控制本地存储占用。
const READ_IDLE_TIMEOUT_MS = 120_000 // 允许弱网下单个流数据块最多等待两分钟。
const API_KEY = 'app-MLnZhqwKKFS82YOuKt19C9YG' // 从本地环境变量读取密钥，不将密钥写入组件。

type MessageStatus = 'streaming' | 'completed' | 'interrupted' | 'error' | 'stopped' // 定义 AI 回复的完整性状态。
interface ChatMessage { id: string, role: 'user' | 'assistant', content: string, status?: MessageStatus, error?: string, createdAt: number } // 定义可持久化的消息结构。
interface Conversation { id: string, title: string, updatedAt: number, messages: ChatMessage[] } // 定义可持久化的会话结构。
interface WorkflowData { status?: string, error?: string, message?: string, title?: string, text?: string, node_type?: string, outputs?: Record<string, unknown> } // 声明 Dify 工作流和节点事件的有效负载结构。
interface SseEvent { event?: string, answer?: string, message?: string, data?: WorkflowData } // 声明本组件处理的 Dify SSE 事件字段。

const isOpen = ref(false) // 控制悬浮对话窗口的显示。
const isStreaming = ref(false) // 控制当前会话是否正在生成回复。
const draft = ref('') // 保存输入框中的草稿内容。
const conversations = ref<Conversation[]>([]) // 保存全部本地历史会话。
const activeConversationId = ref('') // 保存当前选中的会话标识。
const storageError = ref('') // 显示浏览器本地存储错误。
const scrollContainer = ref<HTMLElement | null>(null) // 引用消息滚动容器。
const isSlowConnection = ref(false) // 标识等待数据时间较长但尚未超时的连接。
const activeConversation = computed(() => conversations.value.find(item => item.id === activeConversationId.value)) // 获取当前选中的会话。
const connectionLabel = computed(() => isStreaming.value ? (isSlowConnection.value ? '连接较慢，仍在等待数据' : '正在接收流式回复') : '本地历史已启用') // 显示当前对话状态及弱网等待提示。
let currentController: AbortController | null = null // 保存当前请求控制器以便用户中止。
let persistTimer: ReturnType<typeof setTimeout> | undefined // 保存历史写入定时器以合并高频流片段。
let slowTimer: ReturnType<typeof setTimeout> | undefined // 保存用于提示用户慢连接的计时器。
let historyReady = false // 避免读取本地历史前覆盖已有记录。

function createId(): string { // 生成当前浏览器内唯一的会话或消息 ID。
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}` // 优先使用浏览器 UUID 并提供兼容回退。
} // ID 生成函数结束。

function createConversation(): void { // 创建并切换到一个新的空会话。
  const conversation: Conversation = { id: createId(), title: '新对话', updatedAt: Date.now(), messages: [] } // 初始化新会话数据。
  conversations.value.unshift(conversation) // 将新会话放到历史列表最前面。
  conversations.value = conversations.value.slice(0, MAX_CONVERSATIONS) // 丢弃超出保留上限的最旧会话。
  activeConversationId.value = conversation.id // 切换到新会话。
} // 新建会话函数结束。

function deleteConversation(): void { // 删除当前会话并保留其他历史会话。
  if (isStreaming.value || conversations.value.length < 2) // 正在生成或没有其他会话时拒绝删除。
    return // 避免删除进行中的会话或造成没有可选会话。
  conversations.value = conversations.value.filter(item => item.id !== activeConversationId.value) // 从本地历史列表移除当前会话。
  activeConversationId.value = conversations.value[0]?.id ?? '' // 切换到剩余列表中的最新会话。
} // 删除会话函数结束。

function statusLabel(status: Exclude<MessageStatus, 'completed' | 'streaming'>): string { // 将回复状态转换为清晰的中文提示。
  const labels: Record<Exclude<MessageStatus, 'completed' | 'streaming'>, string> = { interrupted: '连接中断', error: '请求失败', stopped: '已停止' } // 定义各类非完成状态的界面文案。
  return labels[status] // 返回当前状态对应的提示文案。
} // 状态文案函数结束。

function isRecord(value: unknown): value is Record<string, unknown> { // 检查未知 JSON 值是否为对象记录。
  return typeof value === 'object' && value !== null && !Array.isArray(value) // 排除 null、数组和基本类型。
} // JSON 对象检查函数结束。

function isStoredConversation(value: unknown): value is Conversation { // 校验从浏览器读取的会话数据结构。
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.title !== 'string' || typeof value.updatedAt !== 'number' || !Array.isArray(value.messages)) // 校验会话必需字段。
    return false // 校验会话必需字段。
  return value.messages.every((message: unknown) => isRecord(message) && typeof message.id === 'string' && (message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string' && typeof message.createdAt === 'number' && (message.status === undefined || message.status === 'streaming' || message.status === 'completed' || message.status === 'interrupted' || message.status === 'error' || message.status === 'stopped') && (message.error === undefined || typeof message.error === 'string')) // 校验消息字段、允许的回复状态及错误详情。
} // 会话数据校验函数结束。

function loadHistory(): void { // 读取并验证浏览器中保存的本地历史记录。
  try { // 捕获本地存储不可用或历史数据损坏的错误。
    const raw = window.localStorage.getItem(STORAGE_KEY) // 读取版本化历史记录字符串。
    if (raw) { // 仅在确有历史数据时执行 JSON 解析。
      const parsed: unknown = JSON.parse(raw) // 将 JSON 作为未知数据进行结构校验。
      if (!Array.isArray(parsed) || !parsed.every(isStoredConversation)) // 拒绝无法识别的历史数据结构。
        throw new Error('历史记录格式无效，请删除旧数据后重试。') // 拒绝无法识别的历史数据结构。
      conversations.value = parsed.slice(0, MAX_CONVERSATIONS).map(conversation => ({ ...conversation, messages: conversation.messages.map(message => message.status === 'streaming' ? { ...message, status: 'interrupted', error: '页面重新加载后无法续传原始连接。' } : message) })) // 将刷新前遗留的流式回复恢复为明确的中断状态。
    } // 已有历史数据的载入分支结束。
  } // 历史读取尝试结束。
  catch (error) { // 显式反馈读取或解析失败。
    storageError.value = error instanceof Error ? error.message : '浏览器存储不可用。' // 将失败原因展示给用户。
  } // 本地历史载入异常处理结束。
  if (conversations.value.length === 0) // 没有可用历史时创建一个初始会话。
    createConversation() // 无可用历史时确保存在一个可用的新会话。
  if (!activeConversationId.value || !conversations.value.some(item => item.id === activeConversationId.value)) // 当前会话失效时选取最新会话。
    activeConversationId.value = conversations.value[0].id // 恢复默认会话选择。
  historyReady = true // 标记历史载入完成后再允许监听器保存。
} // 历史记录载入函数结束。

function schedulePersist(): void { // 合并流式消息更新并将历史写入浏览器本地存储。
  if (!historyReady) // 避免在读完本地历史之前覆盖现有数据。
    return // 阻止本地数据载入之前触发保存。
  if (persistTimer) // 合并同一批流式更新的保存操作。
    clearTimeout(persistTimer) // 取消尚未触发的旧保存任务。
  persistTimer = setTimeout(() => { // 延迟写入以避免每个流片段都同步占用主线程。
    try { // 捕获配额耗尽或浏览器禁用本地存储错误。
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.value)) // 持久化完整会话和已接收的回复片段。
      storageError.value = '' // 清除此前已恢复的保存错误。
    } // 本地存储写入尝试结束。
    catch (error) { // 明确向用户反馈本地历史无法写入。
      storageError.value = error instanceof Error ? error.message : '浏览器存储空间不足或不可用。' // 显示历史持久化失败原因。
    } // 本地历史保存异常处理结束。
  }, 400) // 保留足够短的写入间隔并合并连续片段。
} // 历史记录延迟保存函数结束。

function updateSlowConnectionTimer(): void { // 在暂时没有新数据时显示弱网等待提示。
  if (slowTimer) { // 收到新数据后清除上一次慢网计时。
    clearTimeout(slowTimer) // 重置等待提示的计时起点。
  } // 慢网计时重置结束。
  isSlowConnection.value = false // 清除上一次等待阶段的慢网状态。
  slowTimer = setTimeout(() => { // 较短等待后提示仍在等待而不判定请求失败。
    isSlowConnection.value = true // 让用户知道连接较慢且仍未超时。
  }, 10_000) // 使用十秒阈值区分普通生成和慢速连接。
} // 弱网状态定时函数结束。

function dispatchSseData(lines: string[], onEvent: (event: SseEvent) => void): void { // 解析并分发一个 SSE 事件块中的 data 字段。
  if (lines.length === 0) // 忽略不含数据的 SSE 心跳块。
    return // 忽略只包含注释或心跳的 SSE 事件块。
  const payload = lines.join('\n') // 按 SSE 规范合并同一事件的多行 data。
  if (payload === '[DONE]') // DONE 标记不能代替工作流完成事件。
    return // 结束标记不代表 Dify 工作流已经确认完成。
  let event: SseEvent // 保存验证后的 Dify 事件对象。
  try { // 将 SSE 数据载荷解析为 JSON。
    event = JSON.parse(payload) as SseEvent // 按声明的 Dify 事件字段读取 JSON。
  } // SSE JSON 解析尝试结束。
  catch { // 将损坏事件显式作为协议错误呈现而非静默丢弃。
    throw new Error('收到格式无效的流式数据，回复可能不完整。') // 保留已收到的文本并标记当前回复异常。
  } // SSE 事件 JSON 解析处理结束。
  onEvent(event) // 将完整事件交由流处理逻辑处理。
} // SSE 事件载荷解析函数结束。

function extractOutputText(outputs: Record<string, unknown>): string { // 从工作流节点或完成事件中提取最终可显示文本。
  for (const key of ['answer', 'output', 'text']) { // 优先使用常见的最终回答字段。
    const value = outputs[key] // 读取当前候选输出字段。
    if (typeof value === 'string' && value.trim()) { // 优先返回有效的文本答案。
      return value // 返回找到的非空文本回答。
    } // 候选文本字段处理结束。
  } // 常见文本字段检查结束。
  return Object.values(outputs).map((value) => { // 兼容工作流以其他输出字段名返回结果的情况。
    if (typeof value === 'string') { // 对于文本字段保留原始输出。
      return value // 返回字符串输出。
    } // 字符串字段处理结束。
    if (value !== null && typeof value === 'object') { // 对象输出也转换成可显示文本。
      return JSON.stringify(value) // 将对象输出转换为可读 JSON 文本。
    } // 对象字段处理结束。
    return '' // 忽略数字、布尔值及空输出。
  }).filter(value => value.trim()).join('\n') // 丢弃空内容并以换行连接多个输出。
} // 工作流输出文本提取函数结束。

function appendSseText(chunk: string, buffer: { value: string }, dataLines: string[], onEvent: (event: SseEvent) => void): void { // 跨网络分块缓存并解析 SSE 行。
  buffer.value += chunk // 将新到达的文本拼接到尚未处理的行缓冲区。
  const lines = buffer.value.split('\n') // 仅按完整换行符拆分数据行。
  buffer.value = lines.pop() ?? '' // 保留末尾未完整的行供后续网络块继续拼接。
  for (const rawLine of lines) { // 按顺序处理当前块内所有完整行。
    const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine // 同时兼容 SSE 的 CRLF 和 LF 行结尾。
    if (line === '') // 空行用于界定 SSE 事件块。
      dispatchSseData(dataLines.splice(0), onEvent) // 空行表示当前 SSE 事件块结束并可以分发。
    else if (line.startsWith('data:')) // 仅缓存 SSE 标准数据字段。
      dataLines.push(line.slice(5).replace(/^ /, '')) // 缓存 data 字段并去除规范规定的一个空格。
  } // 当前完整行处理结束。
} // SSE 跨分块行解析函数结束。

function finishSseParser(buffer: { value: string }, dataLines: string[], onEvent: (event: SseEvent) => void): void { // 处理流正常结束时残留的最后一行或事件块。
  if (buffer.value) { // 若最后一个事件没有以换行符结尾则补充处理。
    const line = buffer.value.endsWith('\r') ? buffer.value.slice(0, -1) : buffer.value // 去除可能残留的 CRLF 回车符。
    if (line.startsWith('data:')) // 收集最后一条未换行的数据字段。
      dataLines.push(line.slice(5).replace(/^ /, '')) // 收集尚未遇到换行符的最后一条 data 行。
    buffer.value = '' // 清空已完成解析的尾部缓存。
  } // 最后一条未换行数据处理结束。
  dispatchSseData(dataLines.splice(0), onEvent) // 分发即使没有尾随空行的最后一个事件。
} // SSE 尾部解析函数结束。

async function readWithIdleTimeout(reader: ReadableStreamDefaultReader<Uint8Array>, controller: AbortController): Promise<ReadableStreamReadResult<Uint8Array>> { // 为单次网络读取设置可配置的弱网空闲超时。
  let timedOut = false // 区分空闲超时和用户主动取消。
  const timeout = setTimeout(() => { // 设置单次读取允许的最长空闲时间。
    timedOut = true // 记录本次读取由空闲超时触发。
    controller.abort() // 中止底层 fetch 和响应流。
  }, READ_IDLE_TIMEOUT_MS) // 采用弱网容忍的两分钟阈值。
  try { // 等待流读取并在取消后统一清理计时器。
    return await reader.read() // 使用可中止的底层读取避免遗留 Promise 竞争。
  } // 单次读取尝试结束。
  catch (error) { // 将超时和其他网络错误区分开来。
    if (timedOut) { // 将空闲超时转换成可显示的错误状态。
      throw new Error('连续两分钟未收到新数据，连接已超时。') // 保留此前接收内容并明确报告超时。
    } // 超时错误转换结束。
    throw error // 继续交由上层处理用户取消或网络故障。
  } // 本次流读取错误处理结束。
  finally { // 清理本次读取的临时计时器。
    clearTimeout(timeout) // 防止已完成的读取留下无效计时器。
  } // 单次流读取收尾结束。
} // 带空闲超时的流读取函数结束。

async function runGeneration(question: string, assistantMessage: ChatMessage, conversation: Conversation): Promise<void> { // 发起单次 Dify 工作流请求并逐片段保存回复。
  const controller = new AbortController() // 为当前生成任务创建可取消的请求控制器。
  currentController = controller // 保存控制器供停止按钮使用。
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined // 保存响应流读取器以便正确释放锁。
  let requestTimeout: ReturnType<typeof setTimeout> | undefined // 保存首次响应等待的超时计时器。
  let handshakeTimedOut = false // 标记服务端未能及时返回响应头。
  let hasReceivedData = false // 跟踪是否收到任何应用层回复片段。
  let receivedMessageChunks = false // 标记答案是否已通过 message 事件直接流式返回。
  let receivedTextChunks = false // 标记答案是否已通过 Dify text_chunk 事件流式返回。
  let workflowFinished = false // 只有收到工作流完成事件才确认回答完整。
  const buffer = { value: '' } // 缓存跨网络块的未完整 SSE 行。
  const dataLines: string[] = [] // 累积同一 SSE 事件块内的 data 字段。
  try { // 处理请求、流式数据、超时和网络中断。
    if (!API_KEY) { // 检查是否已配置本地服务密钥。
      throw new Error('未配置 VITE_DIFY_API_KEY，请在本地环境变量中设置 Dify API Key。') // 缺少密钥时明确报错并确保最终状态得到清理。
    } // 密钥配置检查结束。
    updateSlowConnectionTimer() // 请求握手阶段也向用户显示持续等待状态。
    requestTimeout = setTimeout(() => { // 为等待响应头的连接设置弱网超时。
      handshakeTimedOut = true // 记录握手超时状态以提供准确提示。
      controller.abort() // 取消无响应的网络请求。
    }, READ_IDLE_TIMEOUT_MS) // 等待两分钟后判定连接建立失败。
    const response = await fetch(API_URL, { method: 'POST', headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ inputs: { query: question }, response_mode: 'streaming', user: 'user-js-001' }), signal: controller.signal }) // 使用现有工作流接口并显式传入中止信号。
    if (requestTimeout) { // 收到响应后结束握手阶段的超时监控。
      clearTimeout(requestTimeout) // 防止流式读取期间触发握手超时。
      requestTimeout = undefined // 标记握手计时器已清理。
    } // 握手超时监控结束。
    if (!response.ok) // HTTP 错误不能被当作有效 SSE 响应。
      throw new Error(`本地 AI 服务返回 HTTP ${response.status}。`) // 对 HTTP 错误状态给出明确提示。
    if (!response.body) // 没有流式响应体时明确报错。
      throw new Error('本地 AI 服务没有返回可读取的流。') // 明确报告浏览器或代理未提供响应流。
    reader = response.body.getReader() // 获取响应体的流式读取器。
    const handleEvent = (event: SseEvent): void => { // 将 Dify 事件映射为消息内容和完成状态。
      if (event.event === 'message' || event.event === 'agent_message') { // 处理 Dify 工作流及 Agent 的文本片段。
        if (typeof event.answer === 'string') // 忽略无文本内容的事件。
          assistantMessage.content += event.answer // 追加有效文本片段并保留此前已接收的内容。
        receivedMessageChunks = true // 保留 message 流式回复，避免结束事件输出重复追加。
        hasReceivedData = true // 标记已收到应用层数据以便识别中断状态。
        conversation.updatedAt = Date.now() // 更新会话时间以便历史记录排序。
        schedulePersist() // 定期持久化当前已接收的文本片段。
      } // 文本事件处理分支结束。
      else if (event.event === 'text_chunk' && typeof event.data?.text === 'string') { // Dify 工作流使用 text_chunk.data.text 逐片段返回回答。
        assistantMessage.content += event.data.text // 将文本片段立即写入当前 AI 消息并触发界面更新。
        receivedTextChunks = true // 避免后续节点和完成事件重复追加整段回答。
        hasReceivedData = true // 记录已经收到应用层回复内容。
        conversation.updatedAt = Date.now() // 更新会话时间以便历史列表反映最新活动。
        schedulePersist() // 定期持久化当前已经显示的文本片段。
      } // Dify text_chunk 处理结束。
      else if (event.event === 'node_finished') { // 工作流模式通常在节点完成事件中返回节点输出。
        if (event.data?.status === 'failed') { // 节点执行失败时不把回复误标为完成。
          throw new Error(`节点${event.data.title ? `「${event.data.title}」` : ''}执行失败：${event.data.error ?? '未知错误'}`) // 告知用户具体失败节点和错误信息。
        } // 节点失败处理结束。
        if (!receivedTextChunks && event.data?.status === 'succeeded' && event.data.outputs && ['llm', 'end'].includes(event.data.node_type ?? '')) { // 仅在无流式文本时读取成功的 LLM 或结束节点输出。
          const output = extractOutputText(event.data.outputs) // 读取该节点可以显示的文本内容。
          if (output) { // 忽略无文本输出的节点事件。
            assistantMessage.content += output // 将节点输出追加到对话回复中。
            hasReceivedData = true // 记录已经取得实际回复文本。
            conversation.updatedAt = Date.now() // 更新会话时间以便历史列表反映最新活动。
            schedulePersist() // 保存当前节点输出，降低网络中断导致的数据损失。
          } // 节点输出内容处理结束。
        } // 成功节点输出处理结束。
      } // 节点完成事件处理结束。
      else if (event.event === 'workflow_finished') { // 仅将工作流明确结束事件视为完整回复。
        if (event.data?.status === 'failed') { // 工作流失败事件即使正常关闭连接也不能标记为成功。
          throw new Error(event.data.error ?? event.data.message ?? '本地 AI 工作流执行失败。') // 展示服务端提供的工作流错误信息。
        } // 工作流失败处理结束。
        if (!receivedMessageChunks && !receivedTextChunks && event.data?.outputs) { // 某些工作流仅在结束事件返回最终答案。
          const output = extractOutputText(event.data.outputs) // 从工作流最终输出中提取回答文本。
          if (output) { // 有最终输出时作为回复显示。
            assistantMessage.content = output // 显示工作流结束事件中的完整回答。
            hasReceivedData = true // 记录已收到实际回答文本。
            conversation.updatedAt = Date.now() // 更新会话的最后活动时间。
            schedulePersist() // 将工作流最终回答及时持久化。
          } // 最终输出内容处理结束。
        } // 工作流最终答案回退提取结束。
        workflowFinished = true // 记录服务端确认工作流已完成。
      } // 工作流完成事件分支结束。
      else if (event.event === 'error') { // 处理服务端按 SSE 事件发送的显式错误。
        throw new Error(event.message ?? event.data?.message ?? '本地 AI 工作流返回错误。') // 展示服务端错误信息。
      } // 服务端错误事件分支结束。
    } // Dify SSE 事件处理器结束。
    const decoder = new TextDecoder() // 创建 UTF-8 解码器以处理跨字节边界字符。
    while (true) { // 持续读取响应直到连接结束或超时中止。
      const result = await readWithIdleTimeout(reader, controller) // 等待下一段数据并检测持续无数据的弱网连接。
      if (result.done) // 连接关闭后检查尾部事件及完成状态。
        break // 服务端关闭流时转入最终事件完整性检查。
      updateSlowConnectionTimer() // 每收到一个数据块就重置弱网等待提示。
      const decoded = decoder.decode(result.value, { stream: true }) // 保留跨网络分块 UTF-8 字符并增量解码。
      appendSseText(decoded, buffer, dataLines, handleEvent) // 缓冲并处理完整 SSE 数据行。
      await nextTick() // 让新消息片段先更新到 DOM。
      scrollToLatest() // 收到新片段后保持最新回复可见。
    } // 响应流读取循环结束。
    appendSseText(decoder.decode(), buffer, dataLines, handleEvent) // 刷新解码器并处理最后可能残留的文本字符。
    finishSseParser(buffer, dataLines, handleEvent) // 解析最后一个没有尾随空行的 SSE 事件。
    if (!workflowFinished) // 缺少服务端完成事件时不伪装为成功。
      throw new Error(hasReceivedData ? '连接结束时未收到工作流完成事件，无法确认回复完整。' : '连接结束前未收到有效回复数据。') // 将数据缺失或未完成明确标记为异常。
    assistantMessage.status = 'completed' // 仅在确认收到工作流完成事件后标记回答完成。
  } // 流请求与数据校验尝试结束。
  catch (error) { // 保存失败或中断前已经到达的回复内容。
    if (controller.signal.aborted && currentController === null) // 只把用户主动停止标记为 stopped。
      assistantMessage.status = 'stopped' // 用户主动停止时保留文本并标记为已停止。
    else assistantMessage.status = hasReceivedData ? 'interrupted' : 'error' // 区分流中断与未取得回复的请求失败。
    assistantMessage.error = handshakeTimedOut ? '连接建立超时，请检查网络和本地 AI 服务。' : error instanceof Error ? error.message : '发生未知网络或流式传输错误。' // 将超时或异常原因呈现在对应回复下方。
  } // 流请求错误状态处理结束。
  finally { // 不论完成、失败或中断都释放请求资源并更新会话。
    if (requestTimeout) { // 异常结束时清理尚未完成的握手监控。
      clearTimeout(requestTimeout) // 避免已结束请求触发延迟中止。
    } // 握手计时器清理结束。
    if (slowTimer) { // 请求结束后清理弱网等待提示。
      clearTimeout(slowTimer) // 停止已不再需要的计时器。
    } // 慢网计时器清理结束。
    isSlowConnection.value = false // 恢复默认连接状态。
    if (reader) // 仅在成功获取读取器后释放锁。
      reader.releaseLock() // 释放响应流读取锁。
    if (currentController === controller) // 防止清除其他请求的控制器。
      currentController = null // 清除当前请求控制器引用。
    isStreaming.value = false // 恢复输入框与会话操作。
    conversation.updatedAt = Date.now() // 更新会话最后活动时间。
    schedulePersist() // 立即安排最终状态和错误信息持久化。
    await nextTick() // 等待最终消息状态呈现到界面。
    scrollToLatest() // 将最终状态和回复滚动到可见位置。
  } // 请求资源清理结束。
} // 单次流式生成函数结束。

async function sendMessage(): Promise<void> { // 保存用户问题并开始一次新的回复生成。
  const question = draft.value.trim() // 去除输入首尾空白。
  const conversation = activeConversation.value // 固定本次请求所属会话，避免写入其他会话。
  if (!question || !conversation || isStreaming.value) // 阻止空问题、缺失会话或重复发送。
    return // 阻止空消息、无会话或重复并发提交。
  const userMessage: ChatMessage = { id: createId(), role: 'user', content: question, createdAt: Date.now() } // 创建并保存用户消息。
  const assistantMessage: ChatMessage = { id: createId(), role: 'assistant', content: '', status: 'streaming', createdAt: Date.now() } // 创建用于逐段接收回复的消息。
  conversation.messages.push(userMessage, assistantMessage) // 按先后顺序添加用户问题和 AI 占位回复。
  conversation.title = conversation.messages.filter(message => message.role === 'user').length === 1 ? question.slice(0, 32) : conversation.title // 使用首条用户问题设置历史会话标题。
  conversation.updatedAt = Date.now() // 更新会话活动时间。
  draft.value = '' // 清空输入框。
  isStreaming.value = true // 锁定当前会话中的输入和切换操作。
  schedulePersist() // 在网络请求前就持久化用户问题与回复占位。
  await runGeneration(question, assistantMessage, conversation) // 发起新请求并将流式文本保存在当前会话。
} // 发送消息函数结束。

async function retryMessage(messageId: string): Promise<void> { // 由用户选择重新生成一条中断或失败的回复。
  const conversation = activeConversation.value // 读取当前会话。
  const messageIndex = conversation?.messages.findIndex(message => message.id === messageId) ?? -1 // 定位用户选择的未完成 AI 回复。
  const assistantMessage = conversation?.messages[messageIndex] // 读取对应的 AI 回复消息。
  const userMessage = conversation?.messages.slice(0, messageIndex).reverse().find(message => message.role === 'user') // 查找该回复之前最近的一条用户问题。
  if (!conversation || !assistantMessage || assistantMessage.role !== 'assistant' || !userMessage || userMessage.role !== 'user' || isStreaming.value) // 仅允许有效消息触发新的生成尝试。
    return // 校验消息对应关系并避免并发生成。
  const retryAssistant: ChatMessage = { id: createId(), role: 'assistant', content: '', status: 'streaming', createdAt: Date.now() } // 创建独立的重试回复并保留原始未完成内容。
  conversation.messages.splice(messageIndex + 1, 0, retryAssistant) // 将新回复紧接在待重试内容之后。
  conversation.updatedAt = Date.now() // 更新会话活动时间。
  isStreaming.value = true // 锁定会话切换和输入操作。
  await runGeneration(userMessage.content, retryAssistant, conversation) // 由用户主动发起新的工作流执行而不是假称断点续传。
} // 主动重新生成函数结束。

function stopGeneration(): void { // 取消当前网络请求并标记尚未完成的回复。
  if (!currentController) // 无活动请求时停止操作无需处理。
    return // 没有活动请求时无需执行停止操作。
  const conversation = activeConversation.value // 读取当前正在显示的会话。
  const assistantMessage = conversation?.messages.at(-1) // 读取该会话正在生成的最新消息。
  if (assistantMessage?.role === 'assistant') // 立即记录用户主动中止状态。
    assistantMessage.status = 'stopped' // 立即标记消息以准确识别用户停止原因。
  currentController.abort() // 取消 fetch 和对应的流式读取。
  currentController = null // 使异常处理区分用户主动停止与连接中断。
} // 停止生成函数结束。

function scrollToLatest(): void { // 将消息列表滚动至最后一条消息。
  const element = scrollContainer.value // 读取消息列表 DOM 元素。
  if (element) // 组件卸载时滚动容器可能不存在。
    element.scrollTop = element.scrollHeight // 滚动到当前内容底部。
} // 消息滚动函数结束。

onMounted(loadHistory) // 在浏览器挂载后读取本地历史并避开服务端渲染环境。
watch(conversations, schedulePersist, { deep: true }) // 会话内容或状态变化时合并写入本地历史。
watch([activeConversationId, () => activeConversation.value?.messages.length], async () => { // 切换会话或新增消息时更新滚动位置。
  await nextTick() // 等待 Vue 将新消息渲染到列表。
  scrollToLatest() // 显示当前会话最新消息。
}) // 消息变化后的自动滚动监听结束。
onBeforeUnmount(() => { // 组件卸载前清理异步任务与请求资源。
  if (persistTimer) { // 仅在存在未执行定时器时清理它。
    clearTimeout(persistTimer) // 取消尚未执行的历史保存定时器。
  } // 历史保存定时器清理结束。
  if (slowTimer) { // 卸载前清理尚未触发的弱网提示。
    clearTimeout(slowTimer) // 避免卸载后更新已销毁组件的响应式状态。
  } // 慢网提示清理结束。
  currentController?.abort() // 中止组件卸载后仍在进行的网络请求。
}) // 组件卸载资源清理结束。
</script> <!-- Vue 模板结束。 -->

<template>
  <div class="local-ai-launcher">
    <!-- 固定悬浮入口与对话窗口的容器。 -->
    <section v-if="isOpen" class="local-ai-panel" role="dialog" aria-label="本地 AI 对话">
      <!-- 对话窗口。 -->
      <header class="local-ai-header">
        <!-- 会话选择和窗口操作区。 -->
        <div class="local-ai-heading">
          <!-- 标题与当前连接状态。 -->
          <strong>本地 AI 助手</strong> <!-- 对话窗口标题。 -->
          <span class="local-ai-state">{{ connectionLabel }}</span> <!-- 当前流式传输状态。 -->
        </div> <!-- 标题区域结束。 -->
        <div class="local-ai-actions">
          <!-- 会话管理与关闭操作。 -->
          <select v-model="activeConversationId" aria-label="历史会话" :disabled="isStreaming">
            <!-- 切换本地保存的历史会话。 -->
            <option v-for="conversation in conversations" :key="conversation.id" :value="conversation.id">
              <!-- 显示可选择的会话。 -->
              {{ conversation.title }} <!-- 当前会话标题。 -->
            </option> <!-- 会话选项结束。 -->
          </select> <!-- 历史会话选择器结束。 -->
          <button type="button" aria-label="新建会话" title="新建会话" :disabled="isStreaming" @click="createConversation">
            ＋
          </button> <!-- 创建会话。 -->
          <button type="button" aria-label="删除当前会话" title="删除当前会话" :disabled="isStreaming || conversations.length < 2" @click="deleteConversation">
            ×
          </button> <!-- 删除当前会话。 -->
          <button type="button" aria-label="关闭对话" title="关闭对话" @click="isOpen = false">
            －
          </button> <!-- 收起聊天窗口。 -->
        </div> <!-- 会话操作区结束。 -->
      </header> <!-- 对话窗口头部结束。 -->
      <div ref="scrollContainer" class="local-ai-messages" aria-live="polite">
        <!-- 可滚动的消息记录。 -->
        <div v-if="activeConversation?.messages.length === 0" class="local-ai-empty">
          <!-- 新会话的空状态提示。 -->
          你好！输入问题即可开始对话。 <!-- 空会话的引导文字。 -->
        </div> <!-- 空状态提示结束。 -->
        <article v-for="message in activeConversation?.messages ?? []" :key="message.id" class="local-ai-message" :class="`is-${message.role}`">
          <!-- 渲染当前会话中的消息。 -->
          <span class="local-ai-role">{{ message.role === 'user' ? '你' : 'AI' }}</span> <!-- 标识消息发送方。 -->
          <div class="local-ai-content">
            {{ message.content || (message.status === 'streaming' ? '正在等待回复…' : '') }}
          </div> <!-- 展示消息文本与等待提示。 -->
          <div v-if="message.status && message.status !== 'completed' && message.status !== 'streaming'" class="local-ai-warning">
            <!-- 显示未完整结束的回复状态。 -->
            {{ statusLabel(message.status) }}：已保留收到的内容。 <!-- 提醒用户保留了已接收文本。 -->
            <span v-if="message.error"> {{ message.error }}</span> <!-- 展示可读错误详情。 -->
            <button type="button" :disabled="isStreaming" @click="retryMessage(message.id)">
              <!-- 用户主动重新生成，不自动重放工作流。 -->
              重新生成 <!-- 主动开始一个新的生成请求。 -->
            </button> <!-- 重新生成按钮结束。 -->
          </div> <!-- 未完成状态提示结束。 -->
        </article> <!-- 单条消息结束。 -->
      </div> <!-- 消息列表结束。 -->
      <div v-if="storageError" class="local-ai-storage-warning" role="status">
        <!-- 显示本地历史保存异常。 -->
        历史记录未能保存：{{ storageError }} <!-- 明确告知用户持久化失败。 -->
      </div> <!-- 历史保存异常提示结束。 -->
      <form class="local-ai-composer" @submit.prevent="sendMessage">
        <!-- 输入并提交用户消息。 -->
        <textarea v-model="draft" aria-label="输入消息" placeholder="输入问题，Enter 发送，Shift + Enter 换行" :disabled="isStreaming" @keydown.enter.exact.prevent="sendMessage" /> <!-- 支持回车发送及组合键换行。 -->
        <button v-if="isStreaming" type="button" class="local-ai-stop" @click="stopGeneration">
          停止
        </button> <!-- 用户主动中止当前流。 -->
        <button v-else type="submit" :disabled="!draft.trim()">
          发送
        </button> <!-- 发送新的用户消息。 -->
      </form> <!-- 输入区结束。 -->
    </section> <!-- 对话窗口结束。 -->
    <button v-if="!isOpen" type="button" class="local-ai-bubble" aria-label="打开本地 AI 对话" @click="isOpen = true">
      <!-- 页面悬浮球入口。 -->
      <span aria-hidden="true">AI</span> <!-- 悬浮球标识。 -->
    </button> <!-- 悬浮球结束。 -->
  </div> <!-- 悬浮聊天组件结束。 -->
</template> <!-- 聊天组件逻辑结束。 -->

<style scoped>
 /* 限定以下样式仅作用于本地 AI 聊天组件。 */
.local-ai-launcher {
  /* 声明悬浮组件的基础布局。 */
  position: fixed; /* 固定悬浮层于视口。 */
  right: 24px; /* 与桌面视口右侧留白。 */
  bottom: 24px; /* 与桌面视口底部留白。 */
  z-index: 2000; /* 确保窗口显示在页面内容上方。 */
  display: flex; /* 垂直排列窗口和入口。 */
  flex-direction: column; /* 将对话窗口放在悬浮球上方。 */
  align-items: flex-end; /* 对齐右侧悬浮球和面板边缘。 */
  gap: 12px; /* 分隔悬浮球与面板。 */
  font-family: Arial, 'Microsoft YaHei', sans-serif; /* 采用中英文界面友好字体。 */
  color: #1f2937; /* 设置对话组件默认文字颜色。 */
} /* 固定悬浮入口并提升其层级。 */
.local-ai-bubble {
  /* 声明悬浮球的外观与点击反馈。 */
  width: 60px; /* 设置悬浮球直径。 */
  height: 60px; /* 设置悬浮球直径。 */
  border: 0; /* 移除浏览器默认边框。 */
  border-radius: 50%; /* 绘制圆形入口。 */
  background: linear-gradient(135deg, #409eff, #6858d9); /* 添加高对比渐变底色。 */
  color: #fff; /* 确保 AI 标识清晰可见。 */
  box-shadow: 0 8px 24px #0003; /* 提升悬浮球与背景的层次。 */
  cursor: pointer; /* 标示入口可以点击。 */
  font-size: 18px; /* 设置标识大小。 */
  font-weight: 700; /* 强调 AI 标识。 */
} /* 绘制显眼且可点击的悬浮球。 */
.local-ai-panel {
  /* 声明适配视口的对话面板布局。 */
  display: flex; /* 使用弹性布局固定输入区域位置。 */
  width: min(420px, calc(100vw - 32px)); /* 限制桌面宽度并适配窄视口。 */
  height: min(640px, calc(100vh - 112px)); /* 限制面板高度并留出安全边距。 */
  flex-direction: column; /* 纵向排列聊天区域。 */
  overflow: hidden; /* 防止内部内容溢出圆角窗口。 */
  border: 1px solid #e5e7eb; /* 绘制浅色边界。 */
  border-radius: 16px; /* 设置圆角窗口。 */
  background: #fff; /* 使用不透明面板背景。 */
  box-shadow: 0 16px 48px #0003; /* 将聊天窗口与页面背景分离。 */
  text-align: left; /* 覆盖应用全局文本居中样式。 */
} /* 限制窗口尺寸并适配较小视口。 */
.local-ai-header {
  /* 声明窗口标题和工具栏布局。 */
  display: flex; /* 横向排列标题和工具栏。 */
  min-height: 68px; /* 为操作按钮保留稳定高度。 */
  align-items: center; /* 垂直居中头部内容。 */
  justify-content: space-between; /* 将标题和操作区分布在两端。 */
  gap: 8px; /* 防止标题和操作区粘连。 */
  padding: 12px 14px; /* 为头部内容留出空间。 */
  border-bottom: 1px solid #e5e7eb; /* 与消息区域分隔。 */
} /* 排列标题、历史选择器和会话操作。 */
.local-ai-heading {
  /* 声明标题与状态的纵向排布。 */
  display: flex; /* 纵向排列标题和状态。 */
  min-width: 0; /* 允许标题在窄窗口中收缩。 */
  flex-direction: column; /* 让连接状态显示在标题下方。 */
  gap: 4px; /* 分隔标题和状态文字。 */
} /* 标题和状态纵向排布。 */
.local-ai-heading strong {
  /* 声明对话标题字号。 */
  font-size: 15px; /* 突出窗口标题。 */
} /* 强调聊天窗口标题。 */
.local-ai-state {
  /* 声明状态文字颜色与字号。 */
  color: #6b7280; /* 使用弱化颜色展示状态。 */
  font-size: 11px; /* 保持状态信息紧凑。 */
} /* 使用次要颜色显示传输状态。 */
.local-ai-actions {
  /* 声明历史与工具按钮的排布。 */
  display: flex; /* 横向排列历史选择和按钮。 */
  align-items: center; /* 垂直居中操作控件。 */
  gap: 4px; /* 分隔紧凑的会话操作。 */
} /* 横向排列历史管理控件。 */
.local-ai-actions select {
  /* 声明会话选择器的紧凑样式。 */
  width: 104px; /* 为标题栏保留紧凑历史选择宽度。 */
  min-width: 0; /* 避免选择器撑开标题栏。 */
  border: 1px solid #d1d5db; /* 与按钮保持一致的控件边界。 */
  border-radius: 6px; /* 设置控件圆角。 */
  padding: 6px; /* 增加选项的点击空间。 */
  background: #fff; /* 保持选择器背景清晰。 */
} /* 让会话选择器适配紧凑头部。 */
.local-ai-actions button {
  /* 声明会话操作按钮的尺寸。 */
  width: 28px; /* 统一历史管理按钮宽度。 */
  height: 28px; /* 统一历史管理按钮高度。 */
  border: 0; /* 移除浏览器默认边框。 */
  border-radius: 6px; /* 设置紧凑按钮圆角。 */
  background: #f3f4f6; /* 区分工具按钮与面板背景。 */
  cursor: pointer; /* 标示按钮可以操作。 */
  font-size: 17px; /* 使图形符号易于辨认。 */
} /* 统一会话管理按钮样式。 */
.local-ai-actions button:disabled {
  /* 声明禁用会话操作的视觉反馈。 */
  cursor: not-allowed; /* 明确禁用控件不可操作。 */
  opacity: 0.45; /* 降低禁用控件的视觉强调。 */
} /* 明确显示不可操作的会话按钮。 */
.local-ai-messages {
  /* 声明可独立滚动的聊天记录区域。 */
  display: flex; /* 支持空态居中和消息纵向排列。 */
  flex: 1; /* 占用头部与输入栏之间的剩余空间。 */
  flex-direction: column; /* 按对话顺序排列消息。 */
  gap: 14px; /* 分隔连续的消息。 */
  overflow-y: auto; /* 只在消息区域滚动。 */
  padding: 16px; /* 为消息内容保留边距。 */
} /* 独立滚动展示聊天内容。 */
.local-ai-empty {
  /* 声明新会话空状态的提示外观。 */
  margin: auto; /* 在空消息列表中居中提示文字。 */
  color: #9ca3af; /* 使用辅助文字颜色。 */
  font-size: 14px; /* 保持空态信息易读。 */
} /* 将新会话引导提示居中显示。 */
.local-ai-message {
  /* 声明默认 AI 消息布局。 */
  max-width: 92%; /* 为消息气泡保留侧边空间。 */
  align-self: flex-start; /* 默认将 AI 消息对齐左侧。 */
} /* 限制消息宽度并默认对齐 AI 回复。 */
.local-ai-message.is-user {
  /* 声明用户消息的右侧对齐。 */
  align-self: flex-end; /* 将用户消息对齐右侧。 */
} /* 将用户消息放置在右侧。 */
.local-ai-role {
  /* 声明消息发送方文字外观。 */
  display: block; /* 让发送方标识独占一行。 */
  margin-bottom: 4px; /* 分隔标识和消息内容。 */
  color: #6b7280; /* 弱化发送方标识颜色。 */
  font-size: 11px; /* 保持标识紧凑。 */
} /* 显示消息发送方标识。 */
.local-ai-content {
  /* 声明消息气泡、换行与溢出处理。 */
  border-radius: 10px; /* 将文本包裹为消息气泡。 */
  background: #f3f4f6; /* 默认显示 AI 消息底色。 */
  padding: 10px 12px; /* 增加气泡内边距。 */
  font-size: 14px; /* 设置消息文本字号。 */
  line-height: 1.6; /* 提高多行文本的可读性。 */
  overflow-wrap: anywhere; /* 避免长文本撑破消息窗口。 */
  white-space: pre-wrap; /* 保留换行并允许自动换行。 */
} /* 保留换行并避免长内容溢出。 */
.is-user .local-ai-content {
  /* 声明用户消息气泡颜色。 */
  background: #e8f2ff; /* 使用不同底色区分用户消息。 */
} /* 使用不同背景区分用户与 AI 消息。 */
.local-ai-warning {
  /* 声明中断和请求错误提示样式。 */
  margin-top: 6px; /* 与回复内容保持间距。 */
  color: #b45309; /* 以警示色标识未完成状态。 */
  font-size: 12px; /* 以次要字号显示异常详情。 */
  line-height: 1.5; /* 确保长错误提示可读。 */
  overflow-wrap: anywhere; /* 避免错误详情撑宽面板。 */
} /* 显示中断状态和错误详情。 */
.local-ai-warning button {
  /* 声明未完成消息的手动重试入口。 */
  display: block; /* 将手动重试按钮放到状态文字下方。 */
  margin-top: 5px; /* 分隔状态文字和重试入口。 */
  border: 0; /* 移除按钮默认边框。 */
  background: transparent; /* 与消息气泡保持一致。 */
  color: #2563eb; /* 突出可操作的重试入口。 */
  cursor: pointer; /* 标示重试入口可以点击。 */
  padding: 0; /* 使入口呈现为简洁文本按钮。 */
} /* 提供明确的手动重新生成入口。 */
.local-ai-storage-warning {
  /* 声明本地历史保存失败提示样式。 */
  padding: 6px 12px; /* 为存储错误提示增加内边距。 */
  background: #fff7ed; /* 以浅色底突出保存问题。 */
  color: #9a3412; /* 保持错误提示文字对比度。 */
  font-size: 11px; /* 以紧凑字号展示错误详情。 */
  overflow-wrap: anywhere; /* 避免错误文本撑开窗口。 */
} /* 突出显示本地历史保存失败。 */
.local-ai-composer {
  /* 声明输入框和发送按钮的布局。 */
  display: flex; /* 横向排列输入框和发送按钮。 */
  align-items: flex-end; /* 将按钮对齐到可换行输入框底部。 */
  gap: 8px; /* 分隔输入区域控件。 */
  padding: 12px; /* 为输入区保留边距。 */
  border-top: 1px solid #e5e7eb; /* 与消息列表视觉分隔。 */
} /* 固定输入区于消息列表下方。 */
.local-ai-composer textarea {
  /* 声明可换行输入区域的尺寸和外观。 */
  min-height: 42px; /* 确保多行输入框有合适的初始高度。 */
  max-height: 112px; /* 限制输入框扩展高度。 */
  flex: 1; /* 使用输入区剩余宽度。 */
  resize: vertical; /* 允许用户手动调整输入框高度。 */
  border: 1px solid #d1d5db; /* 绘制输入框边界。 */
  border-radius: 8px; /* 设置输入框圆角。 */
  padding: 9px; /* 增加输入文本边距。 */
  font: inherit; /* 继承界面字体。 */
  font-size: 13px; /* 设置紧凑输入字号。 */
  line-height: 1.5; /* 保持多行输入清晰易读。 */
} /* 设置可换行且可调整高度的输入框。 */
.local-ai-composer button {
  /* 声明发送与停止按钮的统一外观。 */
  min-width: 54px; /* 保证按钮文字和点击区域宽度。 */
  height: 38px; /* 设置一致的输入区按钮高度。 */
  border: 0; /* 移除浏览器默认按钮边框。 */
  border-radius: 8px; /* 使按钮与输入框风格统一。 */
  background: #409eff; /* 使用主题蓝色突出主要操作。 */
  color: #fff; /* 确保按钮文字清晰可见。 */
  cursor: pointer; /* 标示按钮可以点击。 */
} /* 统一发送和停止按钮的可点击尺寸。 */
.local-ai-composer button:disabled {
  /* 声明空输入时的禁用样式。 */
  cursor: not-allowed; /* 表明空消息无法发送。 */
  opacity: 0.5; /* 降低禁用按钮的视觉强调。 */
} /* 禁用空消息发送时提供视觉反馈。 */
.local-ai-composer .local-ai-stop {
  /* 声明停止按钮的警示色。 */
  background: #dc2626; /* 使用红色强调停止操作。 */
} /* 使用警示色突出中止生成操作。 */
@media (max-width: 480px) {
  /* 为手机屏幕减小悬浮控件占位。 */
  .local-ai-launcher {
    /* 使用更窄的移动端边距。 */
    right: 12px; /* 小屏幕减小右侧边距。 */
    bottom: 12px; /* 小屏幕减小底部边距。 */
  } /* 移动端悬浮层边距调整结束。 */
  .local-ai-panel {
    /* 使用移动端面板宽高限制。 */
    width: calc(100vw - 24px); /* 让窗口适配窄手机屏幕。 */
    height: min(72vh, 640px); /* 为小屏幕保留更多页面空间。 */
  } /* 移动端面板尺寸调整结束。 */
} /* 小屏幕下收紧悬浮窗口边距。 */
</style> <!-- 聊天组件样式结束。 -->
