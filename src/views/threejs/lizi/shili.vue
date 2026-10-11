<template>
  <section class="threejs-demo-page">
    <div  class="three-demo-shell">
  <div ref="canvasContainer" class="three-scene-container" style="width: 80vw;height: 80vh;margin-left: 10%;" />
      <div ref="guiHost" class="three-demo-gui-host" />
   
</div>
    
  
  </section>
</template>

<script setup lang="ts">
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
//导入hrd加载器
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
// 1. 获取 DOM 节点引用
const canvasContainer = ref<HTMLDivElement | null>(null);
// 保存 GUI 的挂载容器，避免 GUI 默认插入到 body 导致位置不受控
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { depth } from 'three/tsl';
// 保存 GUI 的挂载容器，避免 GUI 默认插入到 body 导致位置不受控

const guiHost = ref<HTMLDivElement | null>(null)
// 2. 声明全局 3D 变量
let scene: THREE.Scene  | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let cube: THREE.Points | null = null;
let controls: OrbitControls | null = null

let gui: GUI | null = null
let points1: THREE.Points  | null = null
let points2: THREE.Points  | null = null
let points3: THREE.Points  | null = null

// 3. 窗口大小改变处理函数
const handleResize = () => {
  if (!canvasContainer.value || !camera || !renderer) return;

  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;

  if (!width || !height) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};
//创建一个 Three.js 的计时器对象
// 设置时钟
const timer = new THREE.Timer();
const animate = () => {
  if (!scene || !camera || !renderer ) return;
  controls?.update()
 
 timer.update(); 
  //获取自上一帧渲染到当前帧所经过的时间差
  let elapsed = timer.getElapsed();
  if (points1) points1.rotation.x = elapsed * 0.3;
  if (points2) {
    points2.rotation.x = elapsed * 0.3;
    points2.rotation.y = elapsed * 0.2;
  }
  if (points3) {
    points3.rotation.x = elapsed * 0.3;
    points3.rotation.y = elapsed * 0.2;
  }


  renderer.render(scene, camera);
};

// 5. 挂载时初始化场景
onMounted(() => {
  if (!canvasContainer.value) return;

  // 初始化场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111827);

  // 初始化相机
  const { clientWidth, clientHeight } = canvasContainer.value;
  camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.1, 5);
  camera.position.set(3, 2, 8);
  camera.lookAt(0, 0, 40);
  scene.add(camera);

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(clientWidth, clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);
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
   // 创建 OrbitControls，并绑定到当前相机和 canvas
  controls = new OrbitControls(camera, renderer.domElement)
   // 开启阻尼
  controls.enableDamping = true
  // 阻尼系数
  controls.dampingFactor = 0.1
  // 降低旋转速度，让拖拽手感更沉稳
  controls.rotateSpeed = 0.1
  //开启旋转
  // controls.autoRotate = true
  // 降低缩放速度，让滚轮更细腻
  controls.zoomSpeed = 0.2
  //缩放区间
  controls.minDistance = 2
  controls.maxDistance = 20
  const axesHelper = new THREE.AxesHelper(8)

//   scene.add(axesHelper)
 points1 = ceratePonints('211',0.1)
 points2 = ceratePonints('xh',0.15)

  points3 = ceratePonints('3',0.1)



  handleResize();
  renderer.setAnimationLoop(animate);

  // 监听窗口变化并启动渲染
  window.addEventListener('resize', handleResize);
});
function ceratePonints(url:string,size:any ){
    // 创建空的几何体对象
  const particlesGeometry = new THREE.BufferGeometry()
  const count = 5000
  //设置缓冲区数组
  const positions = new Float32Array(count * 3)
  //设置粒子顶点颜色
  const colors = new Float32Array(count * 3)
  //设置顶点
  for (let i = 0; i < count * 3; i++) {
   positions[i] = (Math.random() - 0.5) * 10
   colors[i] =  Math.random()
    
  }
//   /设置顶点的位置属性
  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions,3)
  )
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    // 载入纹理
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(`/${url}.png`);
  // 设置点材质
  const pointsMaterial = new THREE.PointsMaterial({
    size: size,
    color: 0xffffff,
    map:texture ,
    alphaMap: texture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,

    
  });
const points = new THREE.Points(particlesGeometry,pointsMaterial)
  scene?.add(points);
  return points;


}

// 6. 卸载时销毁资源（防止内存泄漏）
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  renderer?.setAnimationLoop(null);
  renderer?.dispose();
  if (canvasContainer.value && renderer?.domElement) {
    canvasContainer.value.removeChild(renderer.domElement);
  }
  renderer = null;
  camera = null;
  scene = null;
  cube = null;
 points1 = null
 points2 = null
 points3 = null

});





</script>
<style scoped>
.threejs-demo-page { padding: 24px; line-height: 4vh;}
/* 画布与 GUI 的容器，使用相对定位便于把 GUI 叠加在画布上方 */
.three-demo-shell {
  display: flex;
  position: relative;
height: 50vh;
}

/* GUI 面板的定位宿主，固定在画布右上角 */
.three-demo-gui-host {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
}

/* 给 Three.js 场景组件设置固定尺寸 */
.three-demo-canvas {
  margin-top: 2vh;
}

</style>
