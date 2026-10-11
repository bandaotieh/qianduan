<script setup lang="ts">
// 导入事件类别与事件数据类型，约束筛选和面板回调参数。
import type { CityAlarm, CityAlarmType } from '../three/mesh/alarms'
// 导入地图控制器类型，供组件保存模型操作接口。
import type { CityMapController } from '../three/mesh/city'
// 导入 GSAP，用于平滑移动相机和清理补间动画。
import gsap from 'gsap'
// 导入 Three.js，用于计算告警目标点。
import * as THREE from 'three'
// 导入 Vue 生命周期和响应式引用工具。
import { onMounted, onUnmounted, ref } from 'vue'
// 导入场景逐帧渲染函数。
import animate from '../three/animate'
// 导入场景坐标轴辅助对象。
import axesHelper from '../three/axesHelper'
// 导入共享三维相机。
import camera from '../three/camera'
// 导入相机轨道控制器。
import controls from '../three/controls'
// 导入项目统一的地图创建入口。
import createMesh from '../three/createMesh'
// 导入事件数据，供地图定位时查找坐标。
import { CITY_ALARMS } from '../three/mesh/alarms'
// 导入共享 WebGL 渲染器。
import renderer from '../three/renderer'
// 导入共享 Three.js 场景。
import scene from '../three/scene'
// 导入项目原有的屏幕尺寸初始化逻辑。
import '../three/init'

// 声明发给智慧面板的地图事件通知。
const emit = defineEmits<{
  // 地图标记被点击时将完整事件数据传给父组件。
  alarmSelect: [alarm: CityAlarm]
}>()
// 保存模板中 Three.js canvas 的挂载节点。
const canvasContainer = ref<HTMLDivElement | null>(null)
// 保存城市地图控制器，供组件生命周期中筛选或释放资源。
let cityController: CityMapController | null = null

// 根据画布容器尺寸同步相机比例和渲染器尺寸。
function handleResize() {
  // DOM、相机或渲染器不可用时无需更新。
  if (!canvasContainer.value || !camera || !renderer)
    return

  // 读取当前画布容器的实际宽度。
  const width = canvasContainer.value.clientWidth
  // 读取当前画布容器的实际高度。
  const height = canvasContainer.value.clientHeight

  // 隐藏或尚未布局的容器尺寸无效时跳过更新。
  if (!width || !height)
    return

  // 更新相机宽高比，避免模型视角变形。
  camera.aspect = width / height
  // 让新的宽高比应用到相机投影矩阵。
  camera.updateProjectionMatrix()
  // 将 WebGL 画布调整为容器当前尺寸。
  renderer.setSize(width, height)
}

// 在画布挂载后初始化三维场景和城市模型。
onMounted(() => {
  // 缺少容器时无法挂载 canvas，因此结束初始化。
  if (!canvasContainer.value)
    return
  // 将共享相机加入场景树。
  scene.add(camera)
  // 限制像素比，兼顾高分屏清晰度与渲染性能。
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 将 WebGL canvas 插入当前 Vue 组件容器。
  canvasContainer.value.appendChild(renderer.domElement)
  // 将坐标轴辅助对象加入场景，保持项目既有调试行为。
  scene.add(axesHelper)
  // 创建城市模型，并把地图标记点击转发为 Vue 组件事件。
  cityController = createMesh(alarm => emit('alarmSelect', alarm))
  // 设置城市地图初始相机位置。
  camera.position.set(-15, 9, -15)
  // 设置轨道控制器初始观察目标为城市中心。
  controls.target.set(0, 0, 0)
  // 立即同步 OrbitControls 的相机状态。
  controls.update()
  // 首次按当前容器大小设置相机与渲染画布。
  handleResize()
  // 启动项目已有的 Three.js 动画渲染循环。
  renderer.setAnimationLoop(animate)

  // 监听浏览器尺寸变化，以便调整地图视口。
  window.addEventListener('resize', handleResize)
})

// 在组件卸载时移除监听并释放三维资源。
onUnmounted(() => {
  // 移除窗口尺寸监听，避免卸载后回调残留。
  window.removeEventListener('resize', handleResize)
  // 停止相机位置上的补间动画。
  gsap.killTweensOf(camera.position)
  // 停止轨道控制器观察目标上的补间动画。
  gsap.killTweensOf(controls.target)
  // 移除城市模型、告警监听和 GPU 资源。
  cityController?.dispose()
  // 清除控制器引用，防止重复使用已卸载地图。
  cityController = null
  // 从场景中移除坐标轴辅助对象。
  scene.remove(axesHelper)
  // 停止渲染器的动画循环。
  renderer?.setAnimationLoop(null)
  // 释放 WebGL 渲染器资源。
  renderer?.dispose()
  // canvas 仍在当前容器中时，将其从页面移除。
  if (canvasContainer.value && renderer?.domElement) {
    // 移除 Three.js 创建的 canvas DOM 元素。
    canvasContainer.value.removeChild(renderer.domElement)
  }
})

// 平滑移动相机，让指定事件标记成为地图观察中心。
function focusAlarm(alarmId: string) {
  // 按事件唯一 ID 查找对应告警数据。
  const alarm = CITY_ALARMS.find(item => item.id === alarmId)
  // 未找到事件时不改变相机位置。
  if (!alarm)
    return

  // 同步突出地图上的目标图标并淡化其他事件图标。
  cityController?.setSelectedAlarm(alarmId)
  // 将事件坐标转换为 Three.js 三维向量。
  const target = new THREE.Vector3(...alarm.position)
  // 保留相机相对于当前观察点的视角距离和方向。
  const offset = camera.position.clone().sub(controls.target)
  // 当前相机与观察点重合时恢复默认视角偏移。
  if (offset.length() < 1)
    offset.set(-15, 9, -15)

  // 停止上一次相机移动，避免多次点击叠加动画。
  gsap.killTweensOf(camera.position)
  // 停止上一次观察目标移动，保持相机与目标同步。
  gsap.killTweensOf(controls.target)
  // 将相机平滑移动到事件点附近并保留原视角距离。
  gsap.to(camera.position, {
    // 新相机横坐标由事件位置与原有视角偏移相加得到。
    x: target.x + offset.x,
    // 新相机高度由事件位置与原有视角偏移相加得到。
    y: target.y + offset.y,
    // 新相机纵深由事件位置与原有视角偏移相加得到。
    z: target.z + offset.z,
    // 使用一秒完成相机过渡。
    duration: 1,
    // 使用平滑的加速和减速曲线。
    ease: 'power2.inOut',
  })
  // 同步将 OrbitControls 的观察中心移动到事件所在位置。
  gsap.to(controls.target, {
    // 更新观察中心的横坐标。
    x: target.x,
    // 更新观察中心的高度坐标。
    y: target.y,
    // 更新观察中心的纵深坐标。
    z: target.z,
    // 使用一秒完成观察中心过渡。
    duration: 1,
    // 使用平滑的加速和减速曲线。
    ease: 'power2.inOut',
  })
}

// 平滑将地图观察目标返回世界坐标原点。
function focusOrigin() {
  // 恢复地图原点处所有告警图标的默认亮度。
  cityController?.setSelectedAlarm(null)
  // 获取当前相机相对于观察目标的视角方向和距离。
  const offset = camera.position.clone().sub(controls.target)
  // 极少数情况下相机与观察目标重合时恢复初始相机偏移。
  if (offset.length() < 1)
    offset.set(-15, 9, -15)

  // 停止之前的镜头移动动画，避免返回原点时相机路径叠加。
  gsap.killTweensOf(camera.position)
  // 停止之前的观察目标动画。
  gsap.killTweensOf(controls.target)
  // 将相机移动至以世界原点为中心的默认观察位置。
  gsap.to(camera.position, {
    // 保持默认斜视角的横向相机距离。
    x: offset.x,
    // 保持当前观察角度的相机高度。
    y: offset.y,
    // 保持默认斜视角的纵深相机距离。
    z: offset.z,
    // 使用一秒平滑完成返回动作。
    duration: 1,
    // 让动画以平滑的加速和减速结束。
    ease: 'power2.inOut',
  })
  // 同步将 OrbitControls 观察目标移动回坐标原点。
  gsap.to(controls.target, {
    // 将观察目标横坐标复位至原点。
    x: 0,
    // 将观察目标高度复位至原点。
    y: 0,
    // 将观察目标纵深复位至原点。
    z: 0,
    // 与相机移动使用相同的动画时长。
    duration: 1,
    // 使用平滑的加速和减速曲线。
    ease: 'power2.inOut',
  })
}

// 将面板选择的事件类型交给地图控制器筛选标记。
function setAlarmFilter(filter: CityAlarmType | 'all') {
  // 地图控制器存在时更新筛选，不存在时保持安全空操作。
  cityController?.setAlarmFilter(filter)
}

// 向智慧面板暴露相机定位和地图筛选两个交互方法。
defineExpose({ focusAlarm, focusOrigin, setAlarmFilter })
</script>

<template>
  <!-- 该容器承载 Three.js 创建的 canvas，并占满面板地图区域。 -->
  <div ref="canvasContainer" class="scene" />
</template>

<style lang="scss" scoped>
/* 让三维画布铺满父级地图区域并位于面板底层。 */
.scene {
  /* 宽度继承父容器可用空间。 */
  width: 100%;
  /* 高度继承父容器可用空间。 */
  height: 100%;
  /* 使用绝对定位让 WebGL 画布覆盖地图容器。 */
  position: absolute;
  /* 将地图画布放在智慧面板下方。 */
  z-index: 1;
  /* 让绝对定位元素紧贴父容器四边。 */
  inset: 0;
}
</style>
