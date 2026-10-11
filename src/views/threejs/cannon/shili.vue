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
//导入CANNON
import * as CANNON from 'cannon-es'
// 1. 获取 DOM 节点引用
const canvasContainer = ref<HTMLDivElement | null>(null);
// 保存 GUI 的挂载容器，避免 GUI 默认插入到 body 导致位置不受控
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 保存 GUI 的挂载容器，避免 GUI 默认插入到 body 导致位置不受控

const guiHost = ref<HTMLDivElement | null>(null)
// 2. 声明全局 3D 变量
let scene: THREE.Scene  | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let controls: OrbitControls | null = null

let gui: GUI | null = null

let world :  CANNON.World | null  = null
let sphereBody : CANNON.Body | null  = null
let sphere :  THREE.Mesh | null  = null

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

  // 更新物理引擎里世界的物体
  world?.step(1/120,elapsed)
  // sphere?.position.copy?(sphereBody?.position) 
  if (sphereBody) {
  sphere?.position.copy(sphereBody.position);
    
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
  camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.1, 180);
  camera.position.set(20, 10, 40);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  // 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
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
// scene.add(axesHelper)


//创建平面
// 创建球和平面
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial();
 sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
scene.add(sphere);
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(16,16),
  new THREE.MeshStandardMaterial()

)

floor.position.set(0,-5,0) //设置平面位置
floor.rotation.x = -Math.PI / 2; //翻转平面
floor.receiveShadow = true //允许投射阴影
scene.add(floor)

// 创建物理世界
 world = new CANNON.World()
world.gravity.set(0,-9.8,0)  //设置重力

//创建物理小球形状
const sphereShape = new CANNON.Sphere(1)
//设置物体材质
const sphereWorldMaterial = new CANNON.Material("sphere")
// 创建物理世界的物体
 sphereBody = new CANNON.Body({
  shape: sphereShape,    
  position: new CANNON.Vec3(0, 0, 0),
  //   小球质量
  mass: 1,
  //   物体材质
  material: sphereWorldMaterial  
})
sphereBody.applyLocalForce(
  new CANNON.Vec3(30,0,0),  //添加的力的大小和方向
  new CANNON.Vec3(0,0,0)//施加的力所在的位置

)
// 将物体添加至物理世界
world.addBody(sphereBody);
//监听物体碰撞
sphereBody.addEventListener('collide',(e: string) =>{
   console.log(e);
   
})
//添加环境光和平行光
const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
const directionalLight = new THREE.DirectionalLight(0xffffff,0.5)
directionalLight.castShadow = true
scene.add(ambientLight)
scene.add(directionalLight)

//物理世界创建地面
const floorShape = new CANNON.Plane()  //创建一个平面形状
//创建一个刚体
const floorBody = new CANNON.Body()
floorBody.addShape(floorShape)
//创建一个floor' 的物理材质
const floorMaterial = new CANNON.Material('floor')
//将创建的物理材质绑定到这个地面刚体上
floorBody.material = floorMaterial

// 地面位置
floorBody.position.set(0, -5, 0);
// 旋转地面的位置
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(floorBody);



//设置2种材质碰撞的参数
const defaultContactMaterial = new CANNON.ContactMaterial(
  sphereWorldMaterial,
  floorMaterial,{
    //摩擦力
    friction: 0.2,
    //弹性
    restitution: 0.7
  }
)
//将材料的关联设置添加的物理世界

world.addContactMaterial(defaultContactMaterial)













 






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
