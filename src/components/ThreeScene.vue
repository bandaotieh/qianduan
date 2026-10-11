<template>
  <!-- 创建一个用于挂载 Three.js 画布的 DOM 容器 -->
  <div ref="canvasContainer" class="three-scene-container" :style="containerStyle" />
</template>

<script setup lang="ts">

// 引入 Three.js 的核心模块，用来创建场景、相机和渲染器
import * as THREE from 'three'
// 引入 Vue 的响应式与生命周期函数，方便组件挂载和卸载时处理资源
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// 定义一个对象类型，封装场景、相机、渲染器和容器，供外部初始化逻辑使用
interface ThreeSceneContext {
  // 场景对象
  scene: THREE.Scene
  // 相机对象
  camera: THREE.PerspectiveCamera
  // 渲染器对象
  renderer: THREE.WebGLRenderer
  // 挂载 Three.js 画布的 DOM 容器
  container: HTMLDivElement
}

// 从父组件接收可配置的属性
const props = withDefaults(
  // 声明组件接收的 props 类型
  defineProps<{
    // 容器宽度，支持数字或 CSS 字符串
    width?: string | number
    // 容器高度，支持数字或 CSS 字符串
    height?: string | number
    // 场景背景颜色
    backgroundColor?: string | number
    // 相机初始位置
    cameraPosition?: [number, number, number]
    // 相机视角角度
    cameraFov?: number
    // 相机近裁剪面
    cameraNear?: number
    // 相机远裁剪面
    cameraFar?: number
    // 初始化场景的回调函数
    initScene?: (ctx: ThreeSceneContext) => void
    // 每帧更新场景的回调函数
    animateScene?: (ctx: ThreeSceneContext, delta: number) => void
  }>(),
  // 给这些属性设置默认值
  {
    // 默认宽度为 100%
    width: '100%',
    // 默认高度为 100%
    height: '100%',
    // 默认背景色为黑色
    backgroundColor: 0x000000,
    // 默认相机位置为 Z 轴正方向 5
    cameraPosition: () => [0, 0, 5] as [number, number, number],
    // 默认视角为 45 度
    cameraFov: 95,
    // 默认近裁剪面为 0.1
    cameraNear: 0.1,
    // 默认远裁剪面为 1000
    cameraFar: 1000,
  },
)

// 保存模板里挂载容器的引用
const canvasContainer = ref<HTMLDivElement | null>(null)

// 保存渲染器实例，便于后续销毁资源
let renderer: THREE.WebGLRenderer | null = null
// 保存相机实例，便于后续更新和销毁
let camera: THREE.PerspectiveCamera | null = null
// 保存场景实例，便于后续添加对象和渲染
let scene: THREE.Scene | null = null
// 保存动画帧编号，便于取消动画循环
let animationFrameId: number | null = null
// 保存 ResizeObserver 实例，便于监听容器尺寸变化
let resizeObserver: ResizeObserver | null = null
// 保存时钟对象，便于计算每帧间隔时间
let clock: THREE.Timer | null = null
// 根据传入的宽高生成容器样式对象
const containerStyle = computed(() => ({
  // 如果宽度是数字，就转成像素值字符串，否则直接使用传入的字符串
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  // 如果高度是数字，就转成像素值字符串，否则直接使用传入的字符串
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

// 递归释放 Three.js 场景中物体占用的几何体和材质资源
const disposeObject = (object: THREE.Object3D) => {
  // 判断当前对象是否为网格对象
  if ((object as THREE.Mesh).isMesh) {
    // 取出网格对象
    const mesh = object as THREE.Mesh
    // 释放几何体资源
    mesh.geometry.dispose()

    // 取出材质
    const material = mesh.material
    // 如果材质是数组，说明一个网格有多份材质，逐个释放
    if (Array.isArray(material)) {
      material.forEach(item => item.dispose())
    }
    // 如果材质是单个对象，直接释放
    else {
      material?.dispose()
    }
  }
}

// 组件挂载后初始化 Three.js 相关对象
onMounted(() => {
  // 取出容器 DOM 节点
  const container = canvasContainer.value
  // 如果容器不存在，就直接返回，避免后续报错
  if (!container)
    return

  // 创建一个新的 Three.js 场景
  scene = new THREE.Scene()
  // 设置场景背景颜色
  scene.background = new THREE.Color(props.backgroundColor)

  // 创建一个透视相机
  camera = new THREE.PerspectiveCamera(props.cameraFov, 1, props.cameraNear, props.cameraFar)
  // 设置相机位置
  camera.position.set(...props.cameraPosition)
  // 让相机看向场景原点
  camera.lookAt(0, 0, 0)

  // 创建 WebGL 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  // 设置渲染器像素比，兼顾清晰度和性能
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 把渲染器生成的 canvas 挂到容器里
  container.appendChild(renderer.domElement)
 
  // 组装一个上下文对象，方便外部初始化逻辑拿到 scene/camera/renderer/container
  const ctx: ThreeSceneContext = { scene, camera, renderer, container }
  // 执行外部传入的初始化场景函数
  props.initScene?.(ctx)

  // 定义一个处理窗口尺寸变化的函数
  const resize = () => {
    // 读取容器当前的宽高
    const { clientWidth, clientHeight } = container
    // 如果渲染器或相机还没创建，或者容器尺寸为 0，就直接返回
    if (!renderer || !camera || !clientWidth || !clientHeight)
      return

    // 根据容器宽高更新相机宽高比，避免模型变形
    camera.aspect = clientWidth / clientHeight
    // 让相机投影矩阵更新
    camera.updateProjectionMatrix()
    // 更新渲染器画布尺寸
    renderer.setSize(clientWidth, clientHeight, false)
  }

  // 定义动画循环函数
  const animate = () => {
    // 请求下一帧执行动画函数
    animationFrameId = requestAnimationFrame(animate)

    // 计算两帧之间的时间差
    const delta = clock?.getDelta() ?? 0
    // 执行外部传入的动画更新函数
    props.animateScene?.(ctx, delta)

    // 如果渲染器、场景和相机都存在，就进行渲染
    if (renderer && scene && camera)
      renderer.render(scene, camera)
  }

  // 先按当前容器尺寸做一次初始化
  resize()
  // 创建 ResizeObserver 用于监听容器尺寸变化
  resizeObserver = new ResizeObserver(resize)
  // 开始监听容器尺寸变化
  resizeObserver.observe(container)
  // 创建时钟对象，用于计算动画时间差
  clock = new THREE.Timer()
  // 启动动画循环
  animate()
})

// 组件卸载前清理动画、监听和 WebGL 资源
onBeforeUnmount(() => {
  // 如果存在动画帧，取消它，避免继续渲染
  if (animationFrameId !== null)
    cancelAnimationFrame(animationFrameId)

  // 停止尺寸监听
  resizeObserver?.disconnect()

  // 遍历场景中的所有对象并释放资源
  if (scene) {
    scene.traverse(disposeObject)
  }

  // 释放渲染器资源
  renderer?.dispose()
  // 从 DOM 中移除渲染器创建的 canvas
  renderer?.domElement.remove()

  // 清空引用，帮助垃圾回收
  animationFrameId = null
  resizeObserver = null
  clock = null
  scene = null
  camera = null
  renderer = null
})
defineExpose({
  // 修改：通过 getter 在父组件读取时返回最新的相机实例，避免暴露组件创建阶段的 null 快照。
  get camera() {
    return camera
  },
  // 修改：通过 getter 在父组件读取时返回最新的渲染器实例，避免暴露组件创建阶段的 null 快照。
  get renderer() {
    return renderer
  },
})
</script>

<style scoped>
/* 设置 Three.js 容器的基础样式 */
.three-scene-container {
  /* 让容器以块级元素显示 */
  display: block;
  /* 隐藏内容溢出，避免画布出现滚动条 */
  overflow: hidden;
}
</style>
