<template>
  <div ref="containerRef" class="hdr-background" />
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
display: block;
width: 100%;
height: 100%;
}
</style>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const props = withDefaults(
  defineProps<{
    hdrFile?: string
    initialAzimuthDeg?: number
    initialElevationDeg?: number
    initialAzimuthOffsetDeg?: number
    initialElevationOffsetDeg?: number
  }>(),
  {
    hdrFile: `${import.meta.env.BASE_URL}sun.png`,
    initialAzimuthDeg: -80,
    initialElevationDeg: -10,
    initialAzimuthOffsetDeg: 0,
    initialElevationOffsetDeg: 0,
  },
)

const containerRef = ref<HTMLDivElement | null>(null)

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

  // ----- 加载全景纹理并保留像素以便采样海面颜色 -----
  let panoramaPixels: Uint8ClampedArray | null = null
  let panoramaWidth = 0
  let panoramaHeight = 0

  // 从 equirectangular PNG 中采样指定经纬度周围的平均颜色
  function sampleEquirectangularPNGColor(
    pixels: Uint8ClampedArray,
    width: number,
    height: number,
    azimuthDeg: number,
    elevationDeg: number,
    sampleRadiusPx = 4,
  ) {
    // azimuth: longitude 0..360, elevation: -90..90
    const theta = THREE.MathUtils.degToRad(azimuthDeg)
    const phi = THREE.MathUtils.degToRad(90 - elevationDeg)
    const u = (theta + Math.PI) / (2 * Math.PI)
    const v = phi / Math.PI
    const cx = Math.floor(u * width) % width
    const cy = Math.floor(v * height)
    let r = 0,
      g = 0,
      b = 0,
      count = 0
    for (let dy = -sampleRadiusPx; dy <= sampleRadiusPx; dy++) {
      for (let dx = -sampleRadiusPx; dx <= sampleRadiusPx; dx++) {
        let sx = cx + dx
        if (sx < 0) sx += width
        if (sx >= width) sx -= width
        const sy = THREE.MathUtils.clamp(cy + dy, 0, height - 1)
        const idx = (sy * width + sx) * 4
        r += pixels[idx]
        g += pixels[idx + 1]
        b += pixels[idx + 2]
        count++
      }
    }
    if (count === 0) return null
    r /= count
    g /= count
    b /= count
    return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace)
  }

  function applySeaColorFromPanorama() {
    if (!panoramaPixels || !seaMesh) return
    // 采样方向：使用当前初始视角的方位（水平）并以地平线高度采样海面颜色
    const sampleAz = (props.initialAzimuthDeg ?? 0) + (props.initialAzimuthOffsetDeg ?? 0)
    const sampleElev = 0 // 地平线附近
    const col = sampleEquirectangularPNGColor(
      panoramaPixels,
      panoramaWidth,
      panoramaHeight,
      sampleAz,
      sampleElev,
      6,
    )
    if (col) {
      const mat = seaMesh!.material as THREE.MeshPhysicalMaterial
      const brightSea = new THREE.Color('#5873DC')
      const deepSea = new THREE.Color('#1A1F49')

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

  new THREE.TextureLoader().load(props.hdrFile, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
    const image = texture.image as HTMLImageElement
    const canvas = document.createElement('canvas')
    canvas.width = Math.min(image.naturalWidth, 1024)
    canvas.height = Math.max(1, Math.round(image.naturalHeight * canvas.width / image.naturalWidth))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Unable to create canvas context for panorama sampling')
    context.drawImage(image, 0, 0)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    panoramaPixels = imageData.data
    panoramaWidth = imageData.width
    panoramaHeight = imageData.height
    // 若 seaMesh 已创建则立刻应用颜色
    applySeaColorFromPanorama()
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
     color: new THREE.Color('#59DDE6'),
     roughness: 0.32,
     metalness: 0.12,
     clearcoat: 0.65,
     clearcoatRoughness: 0.18,
     transparent: true,
     opacity: 0.6,
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
   const baseColor = new THREE.Color('#E4FBF6')
   const deepColor = new THREE.Color('#59DDE6')
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
  // 全景纹理可能已加载，尝试采样并设置海面颜色
  try { applySeaColorFromPanorama() } catch (e) { /* ignore if not ready */ }

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
    // scene.add(smokePoints)

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