<template>
    <div>
        <span style="font-weight: 600;">原理：</span>
        模拟从相机的位置，向鼠标所在的三维空间发射一束不可见的光线，并检测这束光线与场景中的 3D 对象是否发生了相交（碰撞）。
    </div>
    <h3>实现步骤</h3>
    <div>
        <span style="font-weight: 600;">1. 初始化射线检测器与鼠标坐标</span><br>
        首先，需要创建一个 THREE.Raycaster 对象和一个 THREE.Vector2 对象来存储鼠标的二维坐标。<br>
        <span style="font-weight: 600;">2. 监听鼠标事件并转换坐标系</span><br>
        浏览器的鼠标事件返回的是屏幕像素坐标（如 clientX, clientY）。Three.js 无法直接使用屏幕坐标，必须将其转换为标准化设备坐标（NDC）。NDC 的 X 和 Y 值范围必须在 -1 到 1 之间。<br>
        X 轴：(event.clientX / window.innerWidth) * 2 - 1<br>
Y 轴：-(event.clientY / window.innerHeight) * 2 + 1<br>
        <span style="font-weight: 600;">3. 更新射线并检测碰撞</span><br>
在鼠标事件（如 click 或 mousemove）的回调函数中：<br>
使用 raycaster.setFromCamera(mouse, camera) 方法，根据相机和鼠标 NDC 坐标生成一条射线。<br>
调用 raycaster.intersectObjects(scene.children) 或 intersectObject() 方法检测相交的物体。该方法会返回一个按距离从近到远排序的数组
        <span style="font-weight: 600;">4. 处理交互逻辑</span><br>
如果返回的数组长度大于 0，说明射线击中了物体。数组的第一个元素 intersects[0].object 就是离相机最近的被点击物体。你可以在此处修改它的材质颜色、触发弹窗或播放动画。
    </div>
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
  camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.1, 200);
  camera.position.set(30, 20, 80);
  camera.lookAt(0, 0, 70);
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

  scene.add(axesHelper)

const cubeGeometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({
    wireframe: true
})
//100个立方体
let cubeArr = []
for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
        for (let z = -5; z < 5; z++) {
           const cube = new THREE.Mesh(cubeGeometry,material)
     cube.position.set(i,j,z)
     scene.add(cube)
     cubeArr.push(cube)
            
        }
     
    }
}

//创建投射光线对象
const raycaster = new THREE.Raycaster()
//鼠标位置对象
const mouse = new THREE.Vector2()
//监听鼠标位置
window.addEventListener('click',(event: MouseEvent) =>{
      // 获取容器（盒子）相对于浏览器视口的位置和尺寸
     const rect = canvasContainer.value!.getBoundingClientRect();

  // 基于盒子的宽高和偏移量计算归一化坐标
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    if (camera) {
    raycaster.setFromCamera(mouse,camera)
        
    }
  let result = raycaster.intersectObjects(cubeArr);
  console.log(result);
  
  if (result.length > 0) {
 const hitObject = result[0].object;

// 先检查对象是否真的具有 material 属性
if ('material' in hitObject) {
  const mesh = hitObject as THREE.Mesh;
  mesh.material = new THREE.MeshBasicMaterial({
    color: "#ff0000",
  });
}
  }


})
  handleResize();
  renderer.setAnimationLoop(animate);

  // 监听窗口变化并启动渲染
  window.addEventListener('resize', handleResize);
});


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
