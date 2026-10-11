<script setup lang="ts">
// 导入城市事件类型，约束筛选类别和地图事件处理参数。
import type { CityAlarm, CityAlarmType } from '~/three/mesh/alarms'
// 导入 Vue 计算属性、生命周期和响应式状态工具。
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
// 导入面板巡检数据图标。
import dataIcon from '~/assets/city/data.svg'
// 导入电力事件图标。
import powerIcon from '~/assets/city/dianli.svg'
// 导入消防事件图标。
import fireIcon from '~/assets/city/fire.svg'
// 导入治安事件图标。
import policeIcon from '~/assets/city/jingcha.svg'
// 导入设备统计图标。
import deviceIcon from '~/assets/city/shebei.png'
// 导入面板标题装饰素材。
import titleBorder from '~/assets/city/title_border.png'
// 导入展示三维城市模型的子组件。
import Scene from '~/components/scene.vue'
// 导入面板与地图共用的城市事件数据。
import { CITY_ALARMS } from '~/three/mesh/alarms'

// 定义事件面板的可选类别，同时支持显示全部。
type AlarmFilter = CityAlarmType | 'all'

// 描述三维地图子组件暴露给面板的交互方法。
interface CitySceneHandle {
  // 将相机移动到指定事件附近。
  focusAlarm: (alarmId: string) => void
  // 根据事件类别筛选地图标记。
  setAlarmFilter: (filter: AlarmFilter) => void
}

// 保存子地图组件的实例引用，供面板按钮调用其公开方法。
const sceneRef = ref<CitySceneHandle | null>(null)
// 保存当前选中的告警 ID，用于高亮对应事件卡片。
const selectedAlarmId = ref<string | null>(null)
// 保存当前选中的统计卡片 ID，用于显示选中状态。
const activeMetric = ref<string | null>(null)
// 保存事件列表和地图当前共同使用的筛选条件。
const activeFilter = ref<AlarmFilter>('all')
// 保存右上角时钟及数据更新时间文本。
const currentTime = ref('')
// 保存每秒更新的计时器句柄，卸载页面时清理。
let clockTimer: ReturnType<typeof setInterval> | undefined

// 配置左侧四项城市运行统计及其图标和展示单位。
const metrics = [
  // IoT 设备接入统计卡片。
  { id: 'devices', label: '接入 IoT 设备', value: '2,549', unit: '台', icon: deviceIcon, trend: '在线' },
  // 未处理安全事件统计卡片。
  { id: 'alarms', label: '未处理安全事件', value: '04', unit: '起', icon: fireIcon, trend: '待处置' },
  // 城市电力能耗统计卡片。
  { id: 'power', label: '城市电力能耗', value: '81', unit: '兆瓦时', icon: powerIcon, trend: '实时' },
  // 今日巡检采集量统计卡片。
  { id: 'patrol', label: '今日巡检采集量', value: '1,085', unit: '人', icon: dataIcon, trend: '今日' },
]

// 根据当前筛选条件计算右侧事件列表的内容。
const filteredAlarms = computed(() => (
  // 选择“全部”时显示所有城市事件。
  activeFilter.value === 'all'
    ? CITY_ALARMS
    // 选择具体类别时只显示类别匹配的事件。
    : CITY_ALARMS.filter(alarm => alarm.type === activeFilter.value)
))

// 根据事件类别返回面板中对应的素材图标。
function typeIcon(type: CityAlarmType) {
  // 治安事件使用警务图标。
  if (type === '治安')
    return policeIcon
  // 电力事件使用电力图标。
  if (type === '电力')
    return powerIcon
  // 其余事件类型使用消防图标。
  return fireIcon
}

// 按本地中文时区格式更新时间显示文本。
function updateClock() {
  // 使用 24 小时制更新时、分、秒。
  currentTime.value = new Intl.DateTimeFormat('zh-CN', {
    // 时钟的小时部分。
    hour: '2-digit',
    // 时钟的分钟部分。
    minute: '2-digit',
    // 时钟的秒钟部分。
    second: '2-digit',
    // 关闭上午/下午格式。
    hour12: false,
  }).format(new Date())
}

// 处理面板事件卡片被点击的行为。
function selectAlarm(alarm: CityAlarm) {
  // 将点击事件 ID 设为当前高亮事件。
  selectedAlarmId.value = alarm.id
  // 清除左侧统计卡片的选中状态。
  activeMetric.value = null
  // 通知地图子组件将相机定位到对应事件。
  sceneRef.value?.focusAlarm(alarm.id)
}

// 处理左侧统计指标卡片被点击的行为。
function selectMetric(metric: typeof metrics[number]) {
  // 高亮当前点击的统计卡片。
  activeMetric.value = metric.id
  // 清除事件卡片的选中状态。
  selectedAlarmId.value = null

  // 电力卡显示电力事件，巡检卡显示治安事件，其余指标显示全部。
  const filter: AlarmFilter = metric.id === 'power'
    ? '电力'
    : metric.id === 'patrol'
      ? '治安'
      : 'all'

  // 更新事件列表的筛选条件。
  activeFilter.value = filter
  // 将相同筛选条件应用到三维地图标记。
  sceneRef.value?.setAlarmFilter(filter)

  // 选择类别指标时将镜头定位到该类别首条事件。
  if (filter !== 'all') {
    // 在共享事件数据中查找当前类别的第一条告警。
    const firstAlarm = CITY_ALARMS.find(alarm => alarm.type === filter)
    // 存在匹配事件时让地图聚焦到该事件位置。
    if (firstAlarm)
      sceneRef.value?.focusAlarm(firstAlarm.id)
  }
}

// 恢复显示全部事件并清除当前的统计卡片选中状态。
function showAllAlarms() {
  // 清除统计指标卡片高亮。
  activeMetric.value = null
  // 清除当前事件卡片选中态。
  selectedAlarmId.value = null
  // 将面板筛选状态恢复为全部。
  activeFilter.value = 'all'
  // 通知地图恢复显示全部告警标记。
  sceneRef.value?.setAlarmFilter('all')
  // 将三维地图平滑移动回城市原点。
  sceneRef.value?.focusOrigin()
}

// 页面挂载后立即设置时钟并启动周期更新。
onMounted(() => {
  // 首次渲染时立即显示当前时间。
  updateClock()
  // 每秒更新一次时钟显示。
  clockTimer = setInterval(updateClock, 1000)
})

// 页面卸载时停止计时器，避免后台定时任务残留。
onBeforeUnmount(() => {
  // 仅在计时器已创建时清理。
  if (clockTimer)
    clearInterval(clockTimer)
})
</script>

<template>
  <!-- 页面根容器将三维地图与透明信息面板组合为全屏驾驶舱。 -->
  <main class="smart-city">
    <!-- 三维场景作为底图，并将用户点击的事件回传给当前面板。 -->
    <Scene ref="sceneRef" class="smart-city__scene" @alarm-select="selectAlarm" />

    <!-- 覆盖在地图上方的面板容器不拦截地图操作。 -->
    <div class="dashboard">
      <!-- 顶部标题栏展示平台名称、品牌装饰和实时运行时间。 -->
      <header class="dashboard__header">
        <!-- 标题栏的渐变底色装饰。 -->
        <div class="dashboard__header-line" />
        <!-- 复用项目城市素材中的标题边框图。 -->
        <img class="dashboard__title-art" :src="titleBorder" alt="">
        <!-- 居中显示平台品牌和页面说明。 -->
        <div class="dashboard__title">
          <span class="dashboard__eyebrow">SMART CITY · DIGITAL TWIN</span>
          <h1>智慧城市管理平台</h1>
          <p>城市运行态势总览</p>
        </div>
        <!-- 显示系统在线状态和当前时钟。 -->
        <div class="dashboard__status">
          <span class="status-dot" />
          <span>系统运行中</span>
          <time>{{ currentTime }}</time>
        </div>
      </header>

      <!-- 左侧城市统计面板包含可交互的指标卡片。 -->
      <aside class="dashboard__panel dashboard__panel--left" aria-label="城市运行指标">
        <!-- 统计面板标题及英文副标题。 -->
        <div class="panel-heading">
          <span class="panel-heading__mark" />
          <div>
            <span class="panel-heading__en">CITY OVERVIEW</span>
            <h2>城市运行指标</h2>
          </div>
        </div>

        <!-- 按配置生成统计卡片，点击后联动事件筛选和地图镜头。 -->
        <button
          v-for="metric in metrics"
          :key="metric.id"
          class="metric-card"
          :class="{ 'metric-card--active': activeMetric === metric.id }"
          type="button"
          @click="selectMetric(metric)"
        >
          <!-- 展示由指标数据指定的类别图标。 -->
          <span class="metric-card__icon">
            <img :src="metric.icon" alt="">
          </span>
          <!-- 显示指标名称和统计值。 -->
          <span class="metric-card__content">
            <span class="metric-card__label">{{ metric.label }}</span>
            <span class="metric-card__value">
              {{ metric.value }}<small>{{ metric.unit }}</small>
            </span>
          </span>
          <!-- 展示在线、待处置或实时等简要状态。 -->
          <span class="metric-card__trend">{{ metric.trend }}</span>
        </button>

        <!-- 展示数据更新时间和实时状态。 -->
        <div class="panel-footnote">
          <span class="status-dot" />
          数据实时更新
          <span>最近更新 {{ currentTime }}</span>
        </div>
      </aside>

      <!-- 地图底部提示当前三维地图支持的交互方式。 -->
      <div class="dashboard__map-hint">
        <span class="map-hint__crosshair">＋</span>
        <span>三维实景地图</span>
        <span class="map-hint__divider" />
        <span>点击事件定位 · 拖拽旋转 · 滚轮缩放</span>
      </div>

      <!-- 右侧事件面板展示可筛选、可定位的告警列表。 -->
      <aside class="dashboard__panel dashboard__panel--right" aria-label="城市事件列表">
        <!-- 事件面板标题、事件数量和恢复全部按钮。 -->
        <div class="panel-heading panel-heading--events">
          <span class="panel-heading__mark" />
          <div>
            <span class="panel-heading__en">LIVE ALERTS</span>
            <h2>事件列表 <em>{{ filteredAlarms.length }}</em></h2>
          </div>
          <!-- 点击后清除类别筛选并显示全部城市事件。 -->
          <button class="view-all" type="button" @click="showAllAlarms">
            全部
          </button>
        </div>

        <!-- 当前筛选条件对应的事件卡片列表。 -->
        <div class="event-list">
          <!-- 事件卡片点击后定位地图，并显示选中态。 -->
          <button
            v-for="alarm in filteredAlarms"
            :key="alarm.id"
            class="event-card"
            :class="{ 'event-card--active': selectedAlarmId === alarm.id }"
            type="button"
            @click="selectAlarm(alarm)"
          >
            <!-- 根据事件类别显示治安、电力或消防图标。 -->
            <span class="event-card__icon" :class="`event-card__icon--${alarm.type}`">
              <img :src="typeIcon(alarm.type)" alt="">
            </span>
            <!-- 展示事件类别、地点、说明、处置状态和时间。 -->
            <span class="event-card__body">
              <span class="event-card__title">{{ alarm.type }} <span class="event-card__place">{{ alarm.location }}</span></span>
              <span class="event-card__description">{{ alarm.description }}</span>
              <span class="event-card__meta">
                <span class="event-card__status"><i />{{ alarm.status }}</span>
                <time>{{ alarm.time }}</time>
              </span>
            </span>
            <!-- 右侧箭头提示事件卡片可以点击。 -->
            <span class="event-card__arrow">›</span>
          </button>
          <!-- 筛选结果为空时显示空状态提示。 -->
          <div v-if="filteredAlarms.length === 0" class="event-empty">
            当前筛选下暂无事件
          </div>
        </div>
        <!-- 事件列表底部显示实时监控状态。 -->
        <div class="panel-footnote">
          <span class="event-live"><i />LIVE</span>
          正在监测全域告警
        </div>
      </aside>

      <!-- 地图图例说明三类告警标记的颜色含义。 -->
      <div class="dashboard__legend">
        <span><i class="legend-dot legend-dot--security" />治安</span>
        <span><i class="legend-dot legend-dot--power" />电力</span>
        <span><i class="legend-dot legend-dot--fire" />消防</span>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
/* 全屏根节点为智慧城市页面设置基础排版和深色背景。 */
.smart-city {
  position: fixed;
  inset: 0;
  overflow: hidden;
  color: #eaf5ff;
  background: #061326;
  font-family: Inter, 'Microsoft YaHei', sans-serif;
}

/* 三维场景铺满页面并作为所有信息面板的底层。 */
.smart-city__scene {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* 面板总层提供渐变遮罩，同时允许无控件区域的地图交互穿透。 */
.dashboard {
  position: absolute;
  z-index: 110;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgb(3 14 31 / 78%) 0, rgb(3 14 31 / 0%) 18%),
    linear-gradient(90deg, rgb(3 14 31 / 64%) 0, rgb(3 14 31 / 0%) 28%, rgb(3 14 31 / 0%) 72%, rgb(3 14 31 / 64%) 100%);
}

/* 顶部标题栏负责在页面上方居中布局平台标题。 */
.dashboard__header {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  height: 78px;
  align-items: center;
  justify-content: center;
}

/* 标题栏两侧的暗色几何渐变背景。 */
.dashboard__header-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: min(660px, 60vw);
  height: 100%;
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgb(8 28 58 / 92%), rgb(8 28 58 / 18%));
  clip-path: polygon(7% 0, 93% 0, 100% 52%, 88% 100%, 12% 100%, 0 52%);
}

/* 标题下方复用城市 UI 图片的装饰线。 */
.dashboard__title-art {
  position: absolute;
  top: 67px;
  left: 50%;
  width: min(690px, 64vw);
  height: 14px;
  transform: translateX(-50%);
  object-fit: fill;
  opacity: 0.76;
}

/* 平台标题和说明文字的居中排版。 */
.dashboard__title {
  position: relative;
  z-index: 1;
  padding-top: 5px;
  text-align: center;
  text-shadow: 0 0 18px rgb(72 164 255 / 45%);

  h1 {
    margin: 1px 0 0;
    font-size: clamp(20px, 2vw, 28px);
    font-weight: 700;
    letter-spacing: 5px;
  }

  p {
    margin: 2px 0 0;
    color: #93b6d6;
    font-size: 10px;
    letter-spacing: 3px;
  }
}

/* 平台标题上方的英文品牌副标题。 */
.dashboard__eyebrow {
  color: #49aafc;
  font-size: 8px;
  letter-spacing: 3px;
}

/* 顶栏右侧的在线状态和时钟信息。 */
.dashboard__status {
  position: absolute;
  top: 27px;
  right: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b9d3e9;
  font-size: 11px;
  letter-spacing: 1px;
  pointer-events: auto;

  time {
    margin-left: 8px;
    color: #eef8ff;
    font-variant-numeric: tabular-nums;
  }
}

/* 在线状态的绿色发光圆点。 */
.status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #36e4bb;
  box-shadow: 0 0 10px rgb(54 228 187 / 80%);
}

/* 左右两侧共用的面板边框、背景、布局和装饰角。 */
.dashboard__panel {
  position: absolute;
  top: 90px;
  bottom: 62px;
  display: flex;
  width: clamp(230px, 22vw, 300px);
  flex-direction: column;
  padding: 20px 16px 12px;
  border: 1px solid rgb(63 151 226 / 35%);
  background:
    radial-gradient(ellipse at 50% 0, rgb(19 74 124 / 28%), transparent 65%),
    linear-gradient(145deg, rgb(4 22 45 / 87%), rgb(4 18 38 / 78%));
  box-shadow:
    0 0 26px rgb(0 96 184 / 13%),
    inset 0 0 20px rgb(18 99 164 / 9%);
  pointer-events: auto;

  &::before,
  &::after {
    position: absolute;
    width: 14px;
    height: 14px;
    border-color: #42adff;
    border-style: solid;
    content: '';
  }

  &::before {
    top: -1px;
    left: -1px;
    border-width: 2px 0 0 2px;
  }

  &::after {
    right: -1px;
    bottom: -1px;
    border-width: 0 2px 2px 0;
  }
}

/* 将统计面板停靠在屏幕左侧。 */
.dashboard__panel--left {
  left: 22px;
}

/* 将事件面板停靠在屏幕右侧。 */
.dashboard__panel--right {
  right: 22px;
}

/* 面板标题统一设置图标、文本和底部分隔线。 */
.panel-heading {
  display: flex;
  min-height: 50px;
  align-items: center;
  gap: 10px;
  padding: 0 2px 14px;
  border-bottom: 1px solid rgb(82 157 222 / 22%);
  background: url('../../assets/city/box_title.png') left bottom / 100% 7px no-repeat;

  h2 {
    margin: 1px 0 0;
    color: #f0f8ff;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  em {
    display: inline-block;
    min-width: 21px;
    margin-left: 5px;
    padding: 1px 5px;
    border-radius: 9px;
    background: rgb(255 92 92 / 18%);
    color: #ff8585;
    font-size: 10px;
    font-style: normal;
    text-align: center;
  }
}

/* 面板标题左侧的蓝色发光竖线。 */
.panel-heading__mark {
  width: 3px;
  height: 26px;
  background: linear-gradient(#70d9ff, #2389ff);
  box-shadow: 0 0 12px rgb(51 157 255 / 75%);
}

/* 面板标题上方的英文分类文字。 */
.panel-heading__en {
  color: #5599ce;
  font-size: 8px;
  letter-spacing: 2px;
}

/* 事件面板标题布局及“全部”筛选按钮样式。 */
.panel-heading--events {
  /* 恢复全部事件的次级操作按钮。 */
  .view-all {
    margin-left: auto;
    padding: 4px 9px;
    border: 1px solid rgb(72 158 230 / 42%);
    background: rgb(27 104 171 / 17%);
    color: #8ccaff;
    cursor: pointer;
    font: inherit;
    font-size: 10px;
  }
}

/* 左侧统计卡片的布局、背景边框和点击反馈。 */
.metric-card {
  position: relative;
  display: flex;
  min-height: 91px;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding: 13px;
  overflow: hidden;
  border: 1px solid rgb(56 137 206 / 24%);
  background:
    linear-gradient(100deg, rgb(8 35 66 / 66%), rgb(7 30 57 / 38%)),
    url('../../assets/city/border_bg01.png') center / 100% 100% no-repeat;
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;

  &:hover,
  &--active {
    transform: translateX(2px);
    border-color: rgb(59 177 255 / 75%);
    background-color: rgb(21 88 143 / 28%);
    box-shadow:
      inset 0 0 18px rgb(38 152 249 / 14%),
      0 0 14px rgb(24 120 210 / 15%);
  }
}

/* 统计图标与事件类别图标共用的容器样式。 */
.metric-card__icon,
.event-card__icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgb(76 168 241 / 35%);
  background: rgb(15 70 118 / 32%);
  box-shadow: 0 0 16px rgb(43 142 225 / 13%);

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
}

/* 左侧统计指标的图标容器尺寸。 */
.metric-card__icon {
  width: 42px;
  height: 42px;
}

/* 将指标名称、数值纵向排列。 */
.metric-card__content {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

/* 统计指标名称的文字颜色和字号。 */
.metric-card__label {
  color: #adc8e0;
  font-size: 12px;
}

/* 统计数值及其单位的字号和对齐方式。 */
.metric-card__value {
  color: #f4f9ff;
  font-size: 24px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;

  small {
    margin-left: 5px;
    color: #88acca;
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0;
  }
}

/* 指标卡片右下角的简短状态标签。 */
.metric-card__trend {
  align-self: flex-end;
  padding: 3px 5px;
  border: 1px solid rgb(48 204 176 / 25%);
  color: #63d9bd;
  font-size: 9px;
}

/* 面板底部的在线提示与最近更新时间。 */
.panel-footnote {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: auto;
  padding: 12px 2px 0;
  color: #78a0bf;
  font-size: 10px;

  > span:last-child {
    margin-left: auto;
    color: #6689a5;
    font-size: 9px;
  }
}

/* 地图下方的交互操作说明。 */
.dashboard__map-hint {
  position: absolute;
  bottom: 22px;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 10px;
  transform: translateX(-50%);
  color: #a5c7e1;
  font-size: 10px;
  letter-spacing: 1px;
  text-shadow: 0 1px 7px #041328;
}

/* 地图提示左侧的定位十字装饰。 */
.map-hint__crosshair {
  color: #52c9ff;
  font-size: 19px;
}

/* 分隔地图名称和交互说明的细线。 */
.map-hint__divider {
  width: 1px;
  height: 12px;
  background: rgb(122 182 229 / 38%);
}

/* 告警卡片列表的垂直间距。 */
.event-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 9px;
}

/* 单条事件卡片的内容布局和鼠标悬停反馈。 */
.event-card {
  display: flex;
  min-height: 93px;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 9px 10px;
  border: 1px solid transparent;
  border-bottom-color: rgb(74 138 191 / 20%);
  background: linear-gradient(100deg, rgb(13 48 82 / 53%), rgb(7 27 50 / 20%));
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition:
    border-color 180ms ease,
    background 180ms ease;

  &:hover,
  &--active {
    border-color: rgb(65 163 239 / 52%);
    background: linear-gradient(100deg, rgb(16 75 125 / 72%), rgb(8 36 65 / 48%));
  }
}

/* 事件图标容器尺寸，以及火警、电力类别的颜色变体。 */
.event-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;

  img {
    width: 20px;
    height: 20px;
  }

  &--火警 {
    border-color: rgb(255 115 74 / 43%);
    background: rgb(128 48 35 / 23%);
  }

  &--电力 {
    border-color: rgb(82 187 255 / 40%);
    background: rgb(27 82 130 / 27%);
  }
}

/* 事件标题、说明和时间信息的纵向布局。 */
.event-card__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 7px;
}

/* 告警类别名称和地点信息的标题样式。 */
.event-card__title {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #e7f4ff;
  font-size: 13px;
  font-weight: 600;
}

/* 事件地点过长时截断并显示省略号。 */
.event-card__place {
  overflow: hidden;
  color: #80a8c8;
  font-size: 10px;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 事件说明过长时单行截断。 */
.event-card__description {
  overflow: hidden;
  color: #8caec9;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 告警状态和发生时间的两端对齐布局。 */
.event-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #7f9fba;
  font-size: 9px;

  time {
    color: #a4bfd7;
    font-variant-numeric: tabular-nums;
  }
}

/* 告警处置状态的文字与圆点指示。 */
.event-card__status {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ffba76;

  i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #ffad58;
    box-shadow: 0 0 6px rgb(255 173 88 / 70%);
  }
}

/* 事件卡片右侧的可点击箭头。 */
.event-card__arrow {
  align-self: center;
  color: #4d91c4;
  font-size: 20px;
}

/* 当前筛选没有匹配事件时显示的空状态。 */
.event-empty {
  padding: 34px 4px;
  color: #8caec9;
  font-size: 12px;
  text-align: center;
}

/* 告警列表底部的实时状态提示。 */
.event-live {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #71e6c6;
  font-size: 9px;
  letter-spacing: 1px;

  i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4be2bd;
    box-shadow: 0 0 8px rgb(75 226 189 / 80%);
  }
}

/* 左下角地图告警类别颜色图例。 */
.dashboard__legend {
  position: absolute;
  bottom: 19px;
  left: 25px;
  display: flex;
  gap: 14px;
  color: #a5c7e1;
  font-size: 10px;
  pointer-events: auto;

  span {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

/* 治安、电力、消防图例点共用的尺寸设置。 */
.legend-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;

  &--security {
    background: #43b5ff;
    box-shadow: 0 0 8px #43b5ff;
  }

  &--power {
    background: #ffd166;
    box-shadow: 0 0 8px #ffd166;
  }

  &--fire {
    background: #ff765e;
    box-shadow: 0 0 8px #ff765e;
  }
}

/* 中小屏适配：收窄面板并隐藏次要文字，避免遮挡城市模型。 */
@media (max-width: 760px) {
  /* 在中小屏为两侧面板保留居中地图区域。 */
  .dashboard__panel {
    top: 84px;
    bottom: 52px;
    width: clamp(180px, 27vw, 225px);
    padding: 14px 9px 10px;
  }

  /* 中小屏左侧统计面板的位置。 */
  .dashboard__panel--left {
    left: 10px;
  }

  /* 中小屏右侧事件面板的位置。 */
  .dashboard__panel--right {
    right: 10px;
  }

  /* 中小屏压缩统计卡片的高度和内边距。 */
  .metric-card {
    min-height: 72px;
    gap: 7px;
    margin-top: 8px;
    padding: 8px 6px;
  }

  /* 中小屏缩小统计卡片图标。 */
  .metric-card__icon {
    width: 32px;
    height: 32px;

    img {
      width: 20px;
      height: 20px;
    }
  }

  /* 中小屏缩小统计项名称字号。 */
  .metric-card__label {
    font-size: 10px;
  }

  /* 中小屏缩小统计数值字号。 */
  .metric-card__value {
    font-size: 18px;
  }

  /* 隐藏中小屏上不必要的状态和重复提示文字。 */
  .metric-card__trend,
  .panel-footnote > span:last-child,
  .dashboard__status > span:not(.status-dot),
  .dashboard__legend,
  .dashboard__map-hint > span:last-child {
    display: none;
  }

  /* 中小屏压缩事件卡片的高度和留白。 */
  .event-card {
    min-height: 83px;
    gap: 6px;
    padding: 9px 5px;
  }

  /* 限制中小屏事件说明宽度，避免文字挤压面板。 */
  .event-card__description {
    max-width: 24vw;
  }
}

/* 极窄屏适配：进一步收紧顶部标题、面板和卡片内容。 */
@media (max-width: 420px) {
  /* 将状态时钟移向右上角，给标题留出空间。 */
  .dashboard__status {
    top: 13px;
    right: 10px;
  }

  /* 极窄屏缩短标题栏高度。 */
  .dashboard__header {
    height: 70px;
  }

  /* 极窄屏缩小平台标题并压缩字间距。 */
  .dashboard__title h1 {
    font-size: 17px;
    letter-spacing: 2px;
  }

  /* 极窄屏调整左右面板的起始位置和宽度。 */
  .dashboard__panel {
    top: 76px;
    width: calc(50% - 16px);
  }

  /* 极窄屏缩小面板标题字号。 */
  .panel-heading h2 {
    font-size: 13px;
  }

  /* 极窄屏隐藏统计卡片图标以保留文字空间。 */
  .metric-card__icon {
    display: none;
  }

  /* 极窄屏缩小事件类别图标。 */
  .event-card__icon {
    width: 28px;
    height: 28px;
  }
}
</style>
