<template>
  <div ref="containerRef" class="hdr-background">
    <div class="starfield" aria-hidden="true">
      <span
        v-for="star in stars"
        :key="star.id"
        class="starfield__star"
        :style="star.style"
      ></span>
      <span
        v-for="meteor in meteors"
        :key="meteor.id"
        class="starfield__meteor"
        :style="meteor.style"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.hdr-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hdr-background :deep(canvas) {
  position: relative;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.starfield {
  position: absolute;
  z-index: 1;
  inset: 0 0 auto;
  height: 48%;
  overflow: hidden;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 55%, rgba(255,255,255,0) 100%);
  mask-image: linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 55%, rgba(255,255,255,0) 100%);
}

.starfield__star {
  position: absolute;
  display: block;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.85);
  opacity: 0.45;
  animation: star-twinkle ease-in-out infinite alternate;
  will-change: opacity, transform;
}

.starfield__meteor {
  position: absolute;
  display: block;
  width: 110px;
  height: 2px;
  border-radius: 50%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95));
  box-shadow: 0 0 8px 1px rgba(255, 255, 255, 0.8);
  opacity: 0;
  transform: rotate(25deg);
  transform-origin: right center;
  animation: meteor-streak linear infinite;
  will-change: opacity, transform;
}

@keyframes star-twinkle {
  from {
    opacity: 0.25;
    transform: scale(0.65);
  }

  to {
    opacity: var(--star-brightness);
    transform: scale(1.45);
  }
}

@keyframes meteor-streak {
  0%,
  78% {
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(25deg);
  }

  80% {
    opacity: 1;
  }

  90% {
    opacity: 0;
    transform: translate3d(32vw, 14vh, 0) rotate(25deg);
  }

  100% {
    opacity: 0;
    transform: translate3d(32vw, 14vh, 0) rotate(25deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .starfield__star,
  .starfield__meteor {
    animation: none;
    opacity: 0.55;
    will-change: auto;
  }

  .starfield__meteor {
    display: none;
  }
}
</style>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import lightHdrUrl from '/light.hdr?url'

const props = withDefaults(
  defineProps<{
    hdrFile?: string
    initialAzimuthDeg?: number
    initialElevationDeg?: number
    initialAzimuthOffsetDeg?: number
    initialElevationOffsetDeg?: number
  }>(),
  {
    hdrFile: lightHdrUrl,
    initialAzimuthDeg: -80,
    initialElevationDeg: -10,
    initialAzimuthOffsetDeg: 0,
    initialElevationOffsetDeg: 0,
  },
)

const containerRef = ref<HTMLDivElement | null>(null)
const stars = Array.from({ length: 90 }, (_, index) => {
  const seededRandom = (seed: number) => {
    const value = Math.sin((index + 1) * seed) * 10000
    return value - Math.floor(value)
  }

  return {
    id: index,
    style: `
      left: ${seededRandom(12.9898) * 100}%;
      top: ${seededRandom(78.233) * 100}%;
      width: ${2 + seededRandom(43.758) * 2.5}px;
      height: ${2 + seededRandom(43.758) * 2.5}px;
      animation-delay: ${seededRandom(5.398) * -6}s;
      animation-duration: ${2.5 + seededRandom(94.673) * 4}s;
      --star-brightness: ${0.8 + seededRandom(31.416) * 0.2};
    `,
  }
})
const meteors = Array.from({ length: 3 }, (_, index) => {
  const seededRandom = (seed: number) => {
    const value = Math.sin((index + 101) * seed) * 10000
    return value - Math.floor(value)
  }

  const duration = 9 + seededRandom(23.17) * 8

  return {
    id: index,
    style: `
      left: ${seededRandom(64.31) * 70}%;
      top: ${seededRandom(18.73) * 65}%;
      animation-duration: ${duration}s;
      animation-delay: ${seededRandom(7.91) * -duration}s;
    `,
  }
})

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  // ----- 场景、相机、渲染器 -----
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  )

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  container.appendChild(renderer.domElement)

  // ----- OrbitControls -----
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  controls.rotateSpeed = 0.1
  controls.autoRotate = false
  controls.zoomSpeed = 0.2
  controls.minDistance = 2
  controls.maxDistance = 20

  // 初始视角
  const azimuth = (props.initialAzimuthDeg ?? 0) + (props.initialAzimuthOffsetDeg ?? 0)
  const elevation = (props.initialElevationDeg ?? 0) + (props.initialElevationOffsetDeg ?? 0)
  const phi = THREE.MathUtils.degToRad(90 - elevation)
  const theta = THREE.MathUtils.degToRad(azimuth)
  const viewDir = new THREE.Vector3().setFromSphericalCoords(1, phi, theta)
  const initialDistance = 5
  camera.position.copy(viewDir.clone().multiplyScalar(initialDistance))
  camera.lookAt(0, 0, 0)
  controls.target.set(0, 0, 0)

  // ----- 加载 HDR 纹理（全景背景）并保留引用以便采样颜色 -----
  let hdrEquirect: THREE.DataTexture | null = null

  // 从 equirectangular HDR DataTexture 中采样指定经纬度周围的平均颜色
  function sampleEquirectangularHDRColor(
    texture: any,
    azimuthDeg: number,
    elevationDeg: number,
    sampleRadiusPx = 4,
  ) {
    if (!texture || !texture.image || !texture.image.data) return null
    const img = texture.image
    const data = img.data as Float32Array | Uint8Array
    const w = img.width
    const h = img.height
    // azimuth: longitude 0..360, elevation: -90..90
    const theta = THREE.MathUtils.degToRad(azimuthDeg)
    const phi = THREE.MathUtils.degToRad(90 - elevationDeg)
    const u = (theta + Math.PI) / (2 * Math.PI)
    const v = phi / Math.PI
    const cx = Math.floor(u * w) % w
    const cy = Math.floor(v * h)
    let r = 0,
      g = 0,
      b = 0,
      count = 0
    for (let dy = -sampleRadiusPx; dy <= sampleRadiusPx; dy++) {
      for (let dx = -sampleRadiusPx; dx <= sampleRadiusPx; dx++) {
        let sx = cx + dx
        if (sx < 0) sx += w
        if (sx >= w) sx -= w
        let sy = THREE.MathUtils.clamp(cy + dy, 0, h - 1)
        const idx = (sy * w + sx) * 3
        r += data[idx]
        g += data[idx + 1]
        b += data[idx + 2]
        count++
      }
    }
    if (count === 0) return null
    r /= count
    g /= count
    b /= count
    return new THREE.Color(r, g, b)
  }

  function applySeaColorFromHDR() {
    if (!hdrEquirect || !seaMesh) return
    // 采样方向：使用当前初始视角的方位（水平）并以地平线高度采样海面颜色
    const sampleAz = (props.initialAzimuthDeg ?? 0) + (props.initialAzimuthOffsetDeg ?? 0)
    const sampleElev = 0 // 地平线附近
    const col = sampleEquirectangularHDRColor(hdrEquirect, sampleAz, sampleElev, 6)
    if (col) {
      const mat = seaMesh!.material as THREE.MeshPhysicalMaterial
      const brightSea = new THREE.Color('#5873DC')
      const deepSea = new THREE.Color('#1A1F49')

      // HDR 采样值可能极亮，直接用会把海面压成白色，先限制亮度并映射到目标海洋色板。
      const maxChannel = Math.max(col.r, col.g, col.b, 0.001)
      const luminanceFactor = THREE.MathUtils.clamp(maxChannel / 2.2, 0, 1)
      const baseColor = deepSea.clone().lerp(brightSea, luminanceFactor)

      mat.color.copy(baseColor)
      mat.roughness = 0.32
      mat.metalness = 0.12
      mat.clearcoat = 0.65
      mat.clearcoatRoughness = 0.18
      mat.envMapIntensity = 1.1
      mat.needsUpdate = true
    }
  }

  new HDRLoader().load(props.hdrFile, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
    // 存储以便后续采样
    hdrEquirect = texture as unknown as THREE.DataTexture
    // 若 seaMesh 已创建则立刻应用颜色
    applySeaColorFromHDR()
  })

  // ----- 添加一些基础环境光（辅助海面反射）-----
  const ambientLight = new THREE.AmbientLight(0x404060)
  scene.add(ambientLight)
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
  dirLight.position.set(1, 1, 1)
  scene.add(dirLight)

  // ========== 1. 创建海浪（顶点动画海面） ==========
  let seaMesh: THREE.Mesh | null = null

  function createSea() {
   // 创建一个平面几何体，宽度150，高度150，分段数80x80（用于顶点动画）
   const geometry = new THREE.PlaneGeometry(150, 150, 80, 80)
   // 绕X轴旋转-90度（即PI/2），使平面从竖直变为水平（躺平）
   geometry.rotateX(-Math.PI / 2)

   // 创建物理材质（更真实的渲染，支持清漆、粗糙度等）
   const material = new THREE.MeshPhysicalMaterial({
     color: new THREE.Color('#5A6BD3'),
     roughness: 0.32,
     metalness: 0.12,
     clearcoat: 0.65,
     clearcoatRoughness: 0.18,
     transparent: true,
     opacity: 1.7,
     side: THREE.DoubleSide,
     envMapIntensity: 1.1,
     vertexColors: true,
   })

   seaMesh = new THREE.Mesh(geometry, material)
   seaMesh.position.y = -1.5
 
   scene.add(seaMesh)

   // 保存原始顶点 Y 坐标
   const pos = geometry.attributes.position
   const arr = pos.array
   const originY = new Float32Array(arr.length)
   const baseColor = new THREE.Color('#5A6BD3')
   const deepColor = new THREE.Color('#000000')
   const colorAttribute = new THREE.Float32BufferAttribute(arr.length, 4)
   geometry.setAttribute('color', colorAttribute)

   for (let i = 0; i < arr.length; i++) originY[i] = arr[i]

   // 更新函数挂载到 mesh 上，方便动画循环调用
   ;(seaMesh as any).__update = (time: number) => {
     for (let i = 0; i < arr.length; i += 3) {
       const x = arr[i]
       const z = arr[i + 2]
       const wave1 = Math.sin(x * 0.4 + time * 0.8) * 0.25
       const wave2 = Math.sin(z * 0.6 + time * 1.2) * 0.2
       const wave3 = Math.sin((x + z) * 0.5 + time * 0.6) * 0.15
       arr[i + 1] = originY[i + 1] + wave1 + wave2 + wave3

       const edgeMix = THREE.MathUtils.clamp((Math.abs(x) + Math.abs(z)) / 18, 0, 1)
       const mixColor = baseColor.clone().lerp(deepColor, edgeMix * 0.8)
       colorAttribute.array[i] = mixColor.r
       colorAttribute.array[i + 1] = mixColor.g
       colorAttribute.array[i + 2] = mixColor.b
     }
     pos.needsUpdate = true
     colorAttribute.needsUpdate = true
   }
 }
  createSea()
  // HDR 可能已加载，尝试从 HDR 采样并设置海面颜色
  try { applySeaColorFromHDR() } catch (e) { /* ignore if not ready */ }

  // ========== 2. 创建烟雾粒子 ==========
  let smokePoints: THREE.Points | null = null

  function createSmoke() {
    // 更小、成片并靠近海面的烟雾：使用聚簇生成并限制 y 在海面附近
    const seaY = seaMesh ? seaMesh.position.y : -2.5
    const count = 600 // 适中数量，性能与效果折中，可调
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const velocities: { x: number; y: number; z: number }[] = []

    const radius = 12
    // 预生成几个聚簇中心，形成“片状”云雾
    const clusters = [] as { x: number; z: number; spread: number }[]
    for (let c = 0; c < 4; c++) {
      clusters.push({
        x: (Math.random() - 0.5) * radius * 0.6,
        z: (Math.random() - 0.5) * radius * 0.6,
        spread: 1.5 + Math.random() * 3.0,
      })
    }

    for (let i = 0; i < count; i++) {
      // 随机选择一个聚簇中心并在其周围采样（高密度区域）
      const c = clusters[Math.floor(Math.random() * clusters.length)]
      const angle = Math.random() * Math.PI * 2
      const r = Math.abs((Math.random() - 0.2) * c.spread)
      const x = c.x + Math.cos(angle) * r
      const z = c.z + Math.sin(angle) * r
      // y 限制在海面附近，形成底部成片飘动
      const y = seaY + 0.1 + Math.random() * 0.9
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // 更小的水平速度，几乎不抬升——保持在低位成片飘动
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.01,
      })
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // 生成较小的圆形渐变纹理（Canvas）
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.6)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    // 如果已从 HDR 采样了海面色，可以用来稍微给烟雾染色，否则使用浅灰/蓝调
    
    let smokeColor = new THREE.Color(0x99bcd6)
    if ((seaMesh as any) && (seaMesh as any).material) {
      try {
        const mat = (seaMesh as any).material as THREE.MeshStandardMaterial
        // 取海面 base color 的亮色作为烟雾底色（更自然）
        smokeColor = mat.color.clone().lerp(new THREE.Color(0xffffff), 0.6)
      } catch (e) {
        /* ignore */
      }
    }

    const material = new THREE.PointsMaterial({
      map: texture,
      size: 0.6, // 明显变小
      transparent: true,
      opacity: 0.14, // 更轻薄
      blending: THREE.NormalBlending,
      depthWrite: false,
      color: smokeColor,
      sizeAttenuation: true,
    })

    smokePoints = new THREE.Points(geometry, material)
    scene.add(smokePoints)

    ;(smokePoints as any).__velocities = velocities
  }
  createSmoke()

  // ========== 窗口自适应 ==========
  const onResize = () => {
    const width = container.clientWidth
    const height = container.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
  const resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(container)

  // ========== 动画循环 ==========
  let animationId = 0
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const time = performance.now() * 0.001 // 秒

    // 更新海浪
    if (seaMesh && (seaMesh as any).__update) {
      ;(seaMesh as any).__update(time)
    }

    // 更新烟雾粒子（较慢、贴近海面）
    if (smokePoints) {
      const positions = smokePoints.geometry.attributes.position.array
      const velocities = (smokePoints as any).__velocities
      const count = positions.length / 3
      const radius = 12
      const seaY = seaMesh ? seaMesh.position.y : -2.5
      for (let i = 0; i < count; i++) {
        const idx = i * 3
        positions[idx] += velocities[i].x * (Math.sin(time * 0.2 + i) * 0.5 + 1) * 0.5
        positions[idx + 1] += velocities[i].y
        positions[idx + 2] += velocities[i].z * (Math.cos(time * 0.15 + i) * 0.5 + 1) * 0.5

        // 边界检查：如果超出半径，重置到靠近某个聚簇中心的低空位置
        const x = positions[idx]
        const y = positions[idx + 1]
        const z = positions[idx + 2]
        if (x * x + z * z > radius * radius) {
          const angle = Math.random() * Math.PI * 2
          const r = Math.random() * (radius * 0.6)
          positions[idx] = Math.cos(angle) * r
          positions[idx + 2] = Math.sin(angle) * r
          positions[idx + 1] = seaY + 0.1 + Math.random() * 0.9
          velocities[i] = {
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.003,
            z: (Math.random() - 0.5) * 0.01,
          }
        }
        // 垂直边界限制，保持在海面附近
        if (positions[idx + 1] > seaY + 2.0 || positions[idx + 1] < seaY - 0.5) {
          positions[idx + 1] = seaY + 0.1 + Math.random() * 0.9
        }
      }
      smokePoints.geometry.attributes.position.needsUpdate = true
    }

    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // ========== 清理 ==========
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    resizeObserver.disconnect()
    controls.dispose()
    renderer.dispose()
    if (container && renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement)
    }
    // 释放海面资源
    if (seaMesh) {
      seaMesh.geometry.dispose()
      const seaMaterial = seaMesh.material
      if (Array.isArray(seaMaterial)) {
        seaMaterial.forEach(material => material.dispose())
      }
      else {
        seaMaterial.dispose()
      }
    }
    // 释放烟雾资源
    if (smokePoints) {
      smokePoints.geometry.dispose()
      const smokeMaterial = smokePoints.material
      if (Array.isArray(smokeMaterial)) {
        smokeMaterial.forEach(material => material.dispose())
      }
      else {
        smokeMaterial.dispose()
      }
    }
  })
})
</script>