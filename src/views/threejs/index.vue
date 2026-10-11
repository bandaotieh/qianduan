<script setup lang="ts">
// 引入 Three.js 的核心模块
import * as THREE from 'three'
// 引入 OrbitControls 用于实现鼠标拖拽、缩放和自动旋转
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 引入 lil-gui 用于创建可交互的调试面板
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { onBeforeUnmount, ref } from 'vue'
import threejsDialog from '~/components/threejsDialog.vue'
// 引入通用的 Three.js 场景组件
import ThreeScene from '../../components/ThreeScene.vue'
//导入tween
import * as TWEEN  from 'three/examples/jsm/libs/tween.module.js'



//导入glft加载器
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
//导入解析器
import { DRACOLoader } from 'three/examples/jsm/Addons.js'

import gsap from 'gsap';





// 保存子组件暴露出的相机和渲染器实例，后续绑定 OrbitControls 和全屏操作
const threeSceneRes = ref<{ camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer } | null>(null)
// 保存 GUI 的挂载容器，避免 GUI 默认插入到 body 导致位置不受控
const guiHost = ref<HTMLDivElement | null>(null)
// 保存当前创建的立方体实例，方便在动画函数里更新它
let cube: THREE.Mesh | null = null
// 保存 OrbitControls 实例，负责处理相机交互
let controls: OrbitControls | null = null
// 保存 GUI 实例，负责创建并管理调试面板
let gui: GUI | null = null

// 场景初始化函数：在子组件挂载完成后执行，用来创建模型、控制器和调试面板
function initScene({ scene, camera, renderer }: { scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer }) {
  // 把相机和渲染器实例缓存起来，后续动画和全屏逻辑可以复用
  threeSceneRes.value = { camera, renderer }

  // 添加坐标轴，参数表示线段长度
  const axesHelper = new THREE.AxesHelper(5)
  // 创建一个立方体几何体
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  // 创建一个绿色的基础材质
  const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
  const material1 = new THREE.MeshBasicMaterial({ color: 0x394f84 })
  const material2 = new THREE.MeshBasicMaterial({ color: 0x394f00 })
  const material3 = new THREE.MeshBasicMaterial({ color: 0x362f0d })
  const material4 = new THREE.MeshBasicMaterial({ color: 0xf5ce0a })
  const material5 = new THREE.MeshBasicMaterial({ color: 0x5c0af5 })

  // 创建一个基础材质，给父级立方体使用
  const materials = new THREE.MeshBasicMaterial({ color: 0x55bead })

  // 用几何体和材质创建子立方体
  cube = new THREE.Mesh(geometry, [material,material1,material2,material3,material4,material5])
  // 设置子立方体在 X 轴上的初始偏移
  cube.position.x = 2

  // 创建父级立方体，作为一个变换容器
  const parentCube = new THREE.Mesh(geometry, materials)
  // 设置父级立方体位置
  parentCube.position.x = 1
  // 把子立方体挂载到父级立方体上，父级旋转时子级会一起变化
  parentCube.add(cube)
  // 给父级立方体设置初始旋转角度，方便观察父子关系
  parentCube.rotation.x = Math.PI / 4
  // 设置父级立方体为线框模式，便于观察几何结构
  materials.wireframe = true

// //创建几何体
const geometryShan = new THREE.BufferGeometry()

//创建顶点数据
const vertices  = new Float32Array([
   -1.0, -1.0,  1.0, // v0
	 1.0, -1.0,  1.0, // v1
	 1.0,  1.0,  1.0, // v2
	-1.0,  1.0,  1.0, // v3
  
])
//创建顶点属性
geometryShan.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
//创建索引  0,1,2代表Float32Array中前三组v0,v1,v2三个点创建一个三角形，2，3，0代表 v2,v3,v0这三个点形成第二个三角形， v0，v2公共顶点
const indices = new Uint16Array([0,1,2,2,3,0]) 
//创建索引属性
geometryShan.setIndex(new THREE.BufferAttribute( indices, 1 ) )
//设置两个顶点组，形成俩个材质
geometryShan.addGroup(0,3,0)
geometryShan.addGroup(3,3,1)

  // 创建一个基础材质
  const materialShan0 = new THREE.MeshBasicMaterial({ color: 0xb7b21a })
  const materialShan1 = new THREE.MeshBasicMaterial({ color: 0x206d9d })

  const plan = new THREE.Mesh(geometryShan, [materialShan0,materialShan1])
  parentCube.add(plan)

//创建一个球
const spher = new THREE.Mesh(
  new THREE.SphereGeometry(1,30,30),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })

)
spher.position.x = -2
scene.add(spher)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1)
//设置光源位置
directionalLight.position.set(0,20,0)   //默认朝原点打光
//设置打光位置
directionalLight.target.position.set(10,10,0)
//添加平行光辅助器
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)

//添加到场景
scene.add(directionalLight) 

scene.add(directionalLightHelper) 







const combine = new THREE.Box3
const obj = [parentCube]
obj.forEach(o =>{
combine.expandByObject(o)
})

const boxHelper = new THREE.Box3Helper(combine,0xff0000 )
scene.add(boxHelper)



// //实例化gltf加载器
// const gltfloader = new GLTFLoader()
// //实例化加载器 draco
// const dracoLoader = new DRACOLoader()
// //设置draco路径
// dracoLoader.setDecoderPath('/draco/')
// //设置gltf加载器draco解码器
// gltfloader.setDRACOLoader(dracoLoader)
// //加载模型
// gltfloader.load(
//   //模型路径
//   "/scence.gltf",
//   //加载完成回调
//   (gltf) =>{
//      const model = gltf.scene;
//     scene.add(model);
//    gltf.scene.traverse((child) =>{
//     if (child instanceof  THREE.Mesh ) {
//     const geometry = child.geometry
//     //创建边缘geometry
//       const edgesGeometry = new THREE.EdgesGeometry(geometry)
//       //创建线段材质
//       const lineBasicMaterial = new THREE.LineBasicMaterial({
//         color: 0xffffff
//       })
//       //创建线段
//       const edges = new THREE.LineSegments(edgesGeometry,lineBasicMaterial)
//       //添加
//       scene.add(edges)
//     }
   

//    })
  


//   }
// )


//创建动画
const animate1 = gsap.to(spher.position,{ 
  x: 5,      // 在x轴运动   duration
  duration: 5 ,  //    duration 动画持续时间  
   ease: 'power1.inOut',//  ease 动画运动速率
   onComplete: () => {
    console.log('动画完成回调函数');
    
   },
   onStart:() => {
    console.log('动画开始回调函数');

   },
   repeat: -1,  // 动画重复次数  无限循环 -1
   yoyo: true,  //设置往返效果
  delay :2 ,  //设置延迟运动   2s
  })  

gsap.to(spher.rotation,{ x: 2* Math.PI, duration: 5})    // 在x轴旋转   duration 动画持续时间

//通过监听可暂停动画
window.addEventListener('dblclick', () =>{
  if (animate1.isActive()) {
  animate1.pause()   //暂停动画
    
  } else {
  animate1.resume()   //恢复动画

  }
})

// //创建一个补间   传入小球位置
// const tween = new TWEEN.Tween(spher.position)
// //第一个参数要去哪个位置  第二个参数要花费多长时间
// tween.to({x:5},3000).onUpdate(() =>{
//   // console.log(spher.position);
  
// })
// //设置循环次数   Infinity代表无数次
// tween.repeat(Infinity)
// //设置循环往复
// tween.yoyo(true)
// //延迟执行  等2秒在执行
// tween.delay(2000) 
// //设置缓动函数
// tween.easing(TWEEN.Easing.Quadratic.InOut)
// //停止动画
// const stopAmin = {
//   stop: () =>{
//     tween.stop()
//   }
// }
// //开始动画
// const startAmin = {
//   start: () =>{
//     tween.start()
//   }
// }
// const tween2 = new TWEEN.Tween(spher.position)
// tween2.to({y:3},3000).onUpdate(() =>{
//   // console.log(spher.position);
  
// })
// tween.chain(tween2)
// // tween2.chain(tween)
// //启动补间动画
// tween.start()




//创建射线
const raycaster = new THREE.Raycaster();
//创建鼠标向量
const mouse = new THREE.Vector2()

window.addEventListener('click',(e) => {
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
//通过摄像机和鼠标位置更新射线
raycaster.setFromCamera(mouse,camera)
  //  计算射线与场景中物体的交点（传入需要检测的物体数组或 scene.children）
  const intersects = raycaster.intersectObjects(scene.children, true); 
  // 3. 如果检测到相交的物体
  if (intersects.length > 0) {
    //判断是否点击过
    if (intersects[0].object.userData._isSelected) {
       intersects[0].object.material.color.set(
      intersects[0].object.userData._isColor
       );
   intersects[0].object.userData._isSelected = false 

return
    }
//增加属性判断是否点击过
   intersects[0].object.userData._isSelected = true 
   //改变颜色
    intersects[0].object.material.color.set(0xff0000); // 变为红色
   //保存之前的颜色(
   intersects[0].object.userData._isColor = intersects[0].object.material.color.getHex()
   console.log(intersects[0].object.userData._isColor);
   
  }
  
})


  // 创建 OrbitControls，并绑定到当前相机和 canvas
  controls = new OrbitControls(camera, renderer.domElement)
   // 开启阻尼
  controls.enableDamping = true
  // 阻尼系数
  controls.dampingFactor = 0.1
  // 降低旋转速度，让拖拽手感更沉稳
  controls.rotateSpeed = 0.1
  //开启旋转
  controls.autoRotate = true
  // 降低缩放速度，让滚轮更细腻
  controls.zoomSpeed = 0.2
  //缩放区间
  controls.minDistance = 2
  controls.maxDistance = 20

  // 创建 lil-gui 实例，并关闭默认自动挂载，改为手动挂载到指定容器
  gui = new GUI({ autoPlace: false })
  if (guiHost.value) {
    // 如果模板里的 GUI 宿主已准备好，就把 GUI 面板插入其中
    guiHost.value.appendChild(gui.domElement)
  }
  else {
    // 如果宿主还没挂载，退而求其次把 GUI 面板追加到画布容器旁边
    renderer.domElement.parentElement?.appendChild(gui.domElement)
  }

  // 给 GUI 增加一个线框显示开关
  gui.add(materials, 'wireframe').name('父物体开启线框')
// gui?.add(stopAmin,'stop').name('停止动画')
// gui?.add(startAmin,'start').name('开始动画')


  // 定义一个用于触发全屏的按钮事件
  const event = {
    FullScreen: () => {
      renderer.domElement.requestFullscreen()
    },
  }
  // 把全屏按钮添加到 GUI 面板中
  gui.add(event, 'FullScreen').name('全屏')

  // 使用文件夹把相关控件分组，方便管理
  const folder = gui.addFolder('立方体位置')
  folder.add(cube.position, 'x', -5, 5).step(1).name('子立方体x轴位置')
  folder.add(cube.position, 'y', -5, 5).name('子立方体y轴位置')
//添加颜色选择器
gui.addColor(materials,'color').name('颜色选择器')
  // 把立方体添加到场景中
  scene.add(parentCube)
  scene.add(axesHelper)
}

// 每帧更新场景中的动画效果
function animateScene(_ctx: { scene: THREE.Scene }, delta: number) {
  // 如果立方体还没创建，就直接返回，避免空引用
  if (!cube)
    return

  // 每帧都更新 OrbitControls 的状态，让拖拽和阻尼效果持续生效
  controls?.update()
//更新tween
TWEEN.update()
  // 根据每帧间隔时间让立方体缓慢旋转
  cube.rotation.x += delta * 1.5
  // 根据每帧间隔时间让立方体继续沿 Y 轴旋转
  cube.rotation.y += delta * 1.5
}

// 切换浏览器全屏状态，便于用户更方便地查看 3D 场景
function toggleFullScreen() {
  const fullScreenElement = document.fullscreenElement
  if (!fullScreenElement) {
    threeSceneRes.value?.renderer.domElement.requestFullscreen()
  }
  else {
    document.exitFullscreen()
  }
}

// 为页面增加双击全屏事件，提升交互体验
window.addEventListener('dblclick', toggleFullScreen)

// 组件卸载前执行清理，避免重复实例、内存泄漏和事件残留
onBeforeUnmount(() => {
  // 移除双击全屏监听，避免组件销毁后仍然响应事件
  window.removeEventListener('dblclick', toggleFullScreen)
  // 释放 OrbitControls 的内部资源
  controls?.dispose()
  // 销毁 GUI，并移除其 DOM 节点
  gui?.destroy()
  gui?.domElement.remove()
  // 清空引用，避免组件被复用时出现旧数据
  controls = null
  gui = null
  threeSceneRes.value = null
})

// 组件逻辑----------------------------------------

// 控制弹窗显示状态
const dialogVisible = ref(false)
// 关闭弹窗时的回调方法
function handleSave() {
  dialogVisible.value = false
}
// 一个简单立方体代码
const diama = ref(`
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
// 创建带抗锯齿的 WebGL 渲染器，用于将场景绘制到 canvas。
renderer = new THREE.WebGLRenderer({ antialias: true })
// 限制像素比上限，兼顾高分屏清晰度和渲染性能。
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// 将渲染器生成的 canvas 插入已经挂载的容器中。
container.appendChild(renderer.domElement)

// 创建边长为 1 的立方体几何体。
geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建不受灯光影响的绿色基础材质。
material = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
// 将几何体和材质组合为可加入场景的网格模型。
const cube = new THREE.Mesh(geometry, material)
// 将立方体添加到场景中，使其参与渲染。
scene.add(cube)

// 将相机向 Z 轴后方移动，保证可以看到原点处的立方体。
camera.position.z = 5
// 让相机始终朝向场景原点。
camera.lookAt(0, 0, 0)

// 定义容器尺寸变化时同步画布尺寸和相机比例的函数。
const resize = () => {
  // 读取容器当前可用的 CSS 宽度和高度。
  const { clientWidth, clientHeight } = container
  // 渲染器或有效尺寸不存在时不进行更新，避免无效渲染。
  if (!renderer || !clientWidth || !clientHeight)
    return

  // 用容器宽高比更新相机，防止模型变形。
  camera.aspect = clientWidth / clientHeight
  // 将新的相机比例写入投影矩阵。
  camera.updateProjectionMatrix()
  // 设置 canvas 的绘制缓冲区尺寸；false 表示不改写 canvas 的内联 CSS 尺寸。
  renderer.setSize(clientWidth, clientHeight, false)
}

// 定义每一帧执行的渲染循环。
const animate = () => {
  // 请求浏览器在下一帧再次执行本函数，并记录编号以便取消。
  animationFrameId = requestAnimationFrame(animate)
  // 每帧绕 X 轴旋转少量角度。
  cube.rotation.x += 0.01
  // 每帧绕 Y 轴旋转少量角度。
  cube.rotation.y += 0.01
  // 将当前场景从相机视角绘制到 canvas；渲染器存在时才执行。
  renderer?.render(scene, camera)
}

// 先按当前容器尺寸完成首次初始化。
resize()
// 创建用于监听容器尺寸变化的浏览器观察器。
resizeObserver = new ResizeObserver(resize)
// 开始监听画布容器的尺寸变化。
resizeObserver.observe(container)
// 启动持续旋转和渲染的动画循环。
animate()
})

// 在组件卸载前停止动画、监听和 WebGL 资源，避免路由切换后的泄漏。
onBeforeUnmount(() => {
  // 已经创建动画帧时，取消下一次渲染回调。
  if (animationFrameId !== null)
    cancelAnimationFrame(animationFrameId)

  // 停止容器尺寸监听。
  resizeObserver?.disconnect()
  // 释放立方体几何体占用的 GPU 资源。
  geometry?.dispose()
  // 释放立方体材质占用的 GPU 资源。
  material?.dispose()
  // 释放渲染器占用的 WebGL 上下文和内部资源。
  renderer?.dispose()
  // 从页面中移除渲染器创建的 canvas。
  renderer?.domElement.remove()

  // 清空动画帧引用，标记动画已停止。
  animationFrameId = null
  // 清空观察器引用，方便垃圾回收。
  resizeObserver = null
  // 清空几何体引用，方便垃圾回收。
  geometry = null
  // 清空材质引用，方便垃圾回收。
  material = null
  // 清空渲染器引用，方便垃圾回收。
  renderer = null
})
`)
</script>

<template>
  <div class="threejs-demo">
    <!-- 外层容器用于承载 Three.js 画布和 lil-gui 面板，保证控件能悬浮在画布上方 -->
    <div class="three-demo-shell">
      <!-- ThreeScene 组件会在挂载后创建 WebGL canvas 并把场景渲染到这里 -->
      <ThreeScene
        ref="threeSceneRes" class="three-demo-canvas" width="70vw" height="40vw"
        :background-color="0x111827" :camera-position="[3, 2, 5]" :init-scene="initScene" :animate-scene="animateScene"
      />
      <!-- 单独的 DOM 容器，用来挂载 lil-gui 的界面元素 -->
      <div ref="guiHost" class="three-demo-gui-host" />
    </div>
    <el-button style="margin-top: 1vh;" @click="dialogVisible = true">
      查看代码
    </el-button>
  </div>
  <threejsDialog v-model="dialogVisible" :daima="diama" title="ts代码" @confirm="handleSave" />
</template>

<style scoped>
/* 外层容器使用弹性布局，方便纵向排列内容 */
.threejs-demo {
  /* 设置为纵向排列 */
  display: flex;
  /* 设置主轴方向为纵向 */
  flex-direction: column;
  /* 设置子元素之间的间距 */
  gap: 12px;
  align-items: center;
}

/* 画布与 GUI 的容器，使用相对定位便于把 GUI 叠加在画布上方 */
.three-demo-shell {
  position: relative;
  width: 70vw;
  height: 40vw;
}

/* GUI 面板的定位宿主，固定在画布右上角 */
.three-demo-gui-host {
  position: absolute;
  top: 2vw;
  right: 0;
  z-index: 2;
}

/* 给 Three.js 场景组件设置固定尺寸 */
.three-demo-canvas {
  margin-top: 2vh;
}
</style>
