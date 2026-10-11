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
// 保存 GUI 的挂载容器，避免 GUI 默认插入到 body 导致位置不受控

const guiHost = ref<HTMLDivElement | null>(null)
// 2. 声明全局 3D 变量
let scene: THREE.Scene  | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let cube: THREE.Mesh | null = null;
let controls: OrbitControls | null = null
let mixer: THREE.AnimationMixer | null = null
let mixer1: THREE.AnimationMixer | null = null
let mixer2: THREE.AnimationMixer | null = null
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
const timer = new THREE.Timer();

const animate = () => {
    //手动更新计时器的内部状态
  timer.update(); 
  //获取自上一帧渲染到当前帧所经过的时间差
  let delta = timer.getDelta();
  if (!scene || !camera || !renderer || !cube) return;
  controls?.update()
  //将时间差（delta）传递给动画混合器
    mixer?.update(delta);
    mixer1?.update(delta);
    mixer2?.update(delta);


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
  camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.1, 1000);
  camera.position.set(3, 2, 8);
  camera.lookAt(0, 0, 0);
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
 
//创建立方体
 
  const planGemo = new THREE.BoxGeometry(0.5,0.5,0.5)
  const planmaterial = new THREE.MeshBasicMaterial({
     color: 0xff33ff, 
 
     });
  cube = new THREE.Mesh(planGemo, planmaterial);

     //创建立方体
 
  const planGemo1 = new THREE.BoxGeometry(0.5,0.5,0.5)
  const planmaterial1 = new THREE.MeshBasicMaterial({
     color: 0xff330f, 
 
     });
     const cube1 = new THREE.Mesh(planGemo1, planmaterial1);
       //创建立方体
 
  const planGemo2 = new THREE.BoxGeometry(0.5,0.5,0.5)
  const planmaterial2 = new THREE.MeshBasicMaterial({
     color: 0xff330f, 
      transparent: true,  // 1. 必须开启透明属性
    opacity : 1
     });
     const cube2 = new THREE.Mesh(planGemo2, planmaterial2);
     cube1.position.setZ(2)
console.log(cube2);

     cube2.position.setY(2)
cube.name = "cube";
cube1.name = "cube1";
cube2.name = "cube2";

  scene.add(cube)
  scene.add(cube1)
  scene.add(cube2)

// 创建位移动画
const positionKF = new THREE.VectorKeyframeTrack(
  "cube.position",
  [0, 1, 2, 3, 4],
  [0, 0, 0, 2, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0]
);

 //创建四元数对象
 const quaternion1 = new THREE.Quaternion()
 quaternion1.setFromEuler(new THREE.Euler(0,0,0))
 const quaternion2 = new THREE.Quaternion()
 quaternion2.setFromEuler(new THREE.Euler(Math.PI,0,0))

 const quaternion3 = new THREE.Quaternion()
 quaternion3.setFromEuler(new THREE.Euler(0,0,0))
 const finQ = quaternion1.toArray().concat(quaternion2.toArray()).concat(quaternion3.toArray())

 mixer = new THREE.AnimationMixer(cube)
 mixer1 = new THREE.AnimationMixer(cube1)
 mixer2 = new THREE.AnimationMixer(cube2)

 //创建旋转动画帧
 const rota = new THREE.QuaternionKeyframeTrack(
    "cube.quaternion",
    [0,2,4],
    finQ
 )
 //颜色关键帧
const colorKF = new THREE.ColorKeyframeTrack(
  "cube.material.color",
  [0, 2, 4],
  [1, 0, 1, 1, 1, 0, 1, 0, 1]
);
 //布尔关键帧
 const boolKF = new THREE.BooleanKeyframeTrack(
    "cube1.visible",
    [0, 1, 2, 3, 4],
      [true, false, true, false, true]
 )

//数值关键帧
    const opacityKF = new THREE.NumberKeyframeTrack(
      "cube2.material.opacity",  // 绑定到材质的透明度属性
      [0, 1, 2, 3, 4],  // 时间节点：0秒、1秒、2秒
      [1, 0.5, 0, 0.5, 1] // 对应的透明度值：0(全透明) -> 1(不透明) -> 0(全透明)
    );
// 创建动画剪辑

 const clip = new THREE.AnimationClip("move",4,[positionKF,rota,boolKF,colorKF,opacityKF])
// 创建动画动作
const action = mixer.clipAction(clip);
const action1 = mixer1.clipAction(clip);
const action2 = mixer2.clipAction(clip);

action.play();
action1.play();
action2.play();


let eventObj = {
  stopAll: () => {
    mixer?.stopAllAction();
    mixer1?.stopAllAction();
    mixer2?.stopAllAction();

  },
  play: () => {
    action.play();
    action1.play();
    action2.play();

    mixer?.setTime(2);
  },
};

gui.add(eventObj, "stopAll");
gui.add(eventObj, "play");
gui.add(mixer, "timeScale");

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
  mixer =null
  mixer1 =null
  mixer2 =null

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
