<template>
    <div style="padding: 3vw;"> 
  <!-- <div ref="canvasContainer" class="three-scene-container" style="width: 50vw;height: 50vh;margin-left: 20%;" /> -->
<h3>什么是UV映射</h3>
<div>UV映射是一种将二维纹理映射到三维模型表面的技术。在这个过程中，3D模型上的每个顶点都会被赋予一个二维坐标（U, V）。U和V分别表示纹理坐标的水平和垂直方向。这些坐标用于将纹理图像上的像素与模型表面上的点进行对应。通过UV映射，我们可以在模型上精确地控制纹理的位置和方向。</div>
<h3>UV坐标与顶点位置的关系和区别</h3>
<div>顶点位置（Position）表示3D模型中每个顶点的空间坐标（x, y, z）。UV坐标则表示该顶点在纹理上的二维坐标（U, V）。顶点位置用于确定模型在场景中的形状，而UV坐标用于确定纹理在模型上的分布。
两者之间的主要区别在于：<br>
● 顶点位置是三维坐标，描述了一个顶点在三维空间中的位置。<br>
● UV坐标是二维坐标，描述了一个顶点在纹理图像上的位置。</div>
<h3>设置UV坐标</h3>
<div>通过一个示例来展示如何在BufferGeometry中设置UV坐标。
假设我们要创建一个带纹理的平面。首先，我们需要一张纹理图片。我们将使用THREE.TextureLoader加载纹理：</div>
      <CodeBlock :code="uv1" language="javascript" :show-run="true" @run="executeCode" />
      <div>接着，创建一个BufferGeometry并设置顶点位置：</div>
      <CodeBlock :code="uv2" language="javascript" :show-run="true" @run="executeCode" />
      <div>为每个顶点设置UV坐标。在这个例子中，我们将纹理均匀地映射到四个顶点上：</div>
      <CodeBlock :code="uv3" language="javascript" :show-run="true" @run="executeCode" />
      <div>定义组成平面的两个三角形。为此，我们设置索引属性：</div>
      <CodeBlock :code="uv4" language="javascript" :show-run="true" @run="executeCode" />
      <div>创建一个材质，并将之前加载的纹理传递给材质：</div>
      <CodeBlock :code="uv5" language="javascript" :show-run="true" @run="executeCode" />
      <div>创建一个网格，并将BufferGeometry和材质传递给Mesh对象：</div>
      <CodeBlock :code="uv6" language="javascript" :show-run="true" @run="executeCode" />

</div>
    </template>
   <script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { ref, onMounted, onUnmounted } from 'vue';
// import * as THREE from 'three';
// //导入hrd加载器
// import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
// // 1. 获取 DOM 节点引用
// const canvasContainer = ref<HTMLDivElement | null>(null);
// // 保存 GUI 的挂载容器，避免 GUI 默认插入到 body 导致位置不受控

// const guiHost = ref<HTMLDivElement | null>(null)

// // 2. 声明全局 3D 变量
// let scene: THREE.Scene  | null = null;
// let camera: THREE.PerspectiveCamera | null = null;
// let renderer: THREE.WebGLRenderer | null = null;
// let cube: THREE.Mesh | null = null;
// let controls: OrbitControls | null = null
// // 保存 GUI 实例，负责创建并管理调试面板
// // 3. 窗口大小改变处理函数
// const handleResize = () => {
//   if (!canvasContainer.value || !camera || !renderer) return;

//   const width = canvasContainer.value.clientWidth;
//   const height = canvasContainer.value.clientHeight;

//   if (!width || !height) return;

//   camera.aspect = width / height;
//   camera.updateProjectionMatrix();
//   renderer.setSize(width, height);
// };

// const animate = () => {
//   if (!scene || !camera || !renderer || !cube) return;

//   // cube.rotation.x += 0.01;
//   // cube.rotation.y += 0.01;
//   renderer.render(scene, camera);
// };

// // 5. 挂载时初始化场景
// onMounted(() => {
//   if (!canvasContainer.value) return;

//   // 初始化场景
//   scene = new THREE.Scene();
//   scene.background = new THREE.Color(0x111827);

//   // 初始化相机
//   const { clientWidth, clientHeight } = canvasContainer.value;
//   camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.1, 1000);
//   camera.position.set(3, 2, 5);
//   camera.lookAt(0, 0, 0);
//   scene.add(camera);

//   // 初始化渲染器
//   renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(clientWidth, clientHeight);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   canvasContainer.value.appendChild(renderer.domElement);

 
//   const textureLoader = new THREE.TextureLoader();
//   //加载纹理
//   const texture = textureLoader.load('/1.png')
//   //rgbeloader 加载hdr贴图

// const geometry = new THREE.BufferGeometry();

// const vertices = new Float32Array([
//   -1.0, -1.0,  0.0,
//    1.0, -1.0,  0.0,
//    1.0,  1.0,  0.0,
//   -1.0,  1.0,  0.0
// ]);

// geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
// const uvs = new Float32Array([
//   0.0, 0.0,
//   1.0, 0.0,
//   1.0, 1.0,
//   0.0, 1.0
// ]);

// geometry.setAttribute('uv',new THREE.BufferAttribute(uvs, 2));
// const indices = new Uint16Array([
//   0, 1, 2,
//   2, 3, 0
// ]);

// geometry.setIndex(new THREE.BufferAttribute(indices, 1));
// const material = new THREE.MeshBasicMaterial({ map: texture });

//   cube = new THREE.Mesh(geometry, material);
//   scene.add(cube)


//   handleResize();
//     // renderer.render(scene, camera);
//   renderer.setAnimationLoop(animate);

//   // 监听窗口变化并启动渲染
//   window.addEventListener('resize', handleResize);
// });

// // 6. 卸载时销毁资源（防止内存泄漏）
// onUnmounted(() => {
//   window.removeEventListener('resize', handleResize);
//   renderer?.setAnimationLoop(null);
//   renderer?.dispose();
//   if (canvasContainer.value && renderer?.domElement) {
//     canvasContainer.value.removeChild(renderer.domElement);
//   }
//   renderer = null;
//   camera = null;
//   scene = null;
//   cube = null;
// });

const uv1 = (`
const loader = new THREE.TextureLoader();
const texture = loader.load('path/to/your/texture.jpg');
`)
const uv2 = (`
const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array([
  -1.0, -1.0,  0.0,
   1.0, -1.0,  0.0,
   1.0,  1.0,  0.0,
  -1.0,  1.0,  0.0
]);

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

`)
const uv3 = (`
const uvs = new Float32Array([
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,
  0.0, 1.0
]);

geometry.setAttribute('uv',new THREE.BufferAttribute(uvs, 2));

`)
const uv4 = (`
const indices = new Uint16Array([
  0, 1, 2,
  2, 3, 0
]);

geometry.setIndex(new THREE.BufferAttribute(indices, 1));
`)
const uv5 = (`
const material = new THREE.MeshBasicMaterial({ map: texture });
`)
const uv6 = (`
const plane = new THREE.Mesh(geometry, material);

// 将网格添加到场景中
scene.add(plane);

`)
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
}

</script>
<style lang="css" scoped>

</style>