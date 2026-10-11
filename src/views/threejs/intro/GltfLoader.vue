<template>
  <section class="threejs-demo-page">
    <h1>gltf模型加载和模型解压缩</h1>
    <h2>gltf模型加载</h2>
    <div>GLTFLoader是Three.js中用于加载glTF 2.0资源的加载器。glTF是一种开放格式规范，旨在更高效地传输和加载3D内容。该格式文件以JSON或二进制(.glb)格式提供，可以包含外部文件存储贴图(.jpg、.png)和额外的二进制数据(.bin)。</div>
    <div>一个glTF文件可以包含一个或多个场景，每个场景包括网格、材质、贴图、蒙皮、骨架、变形目标、动画、灯光以及摄像机等组件。这些组件可以通过GLTFLoader进行加载和解析，并在Three.js中使用。</div>
    <h3>示例</h3>
    <div>文件后缀glb是已经转成二进制格式数据，gltf是json字符串数据格式</div>
    <div>加载完成回调后，打印glft结果</div>
    <img src="../../../assets//three/gltf.png" alt="gltf">
      <CodeBlock :code="gltf" language="javascript" :show-run="true" @run="executeCode" />
    <h2>模型解压缩</h2>
<div>DRACOLoader是Three.js中用于加载由Draco库压缩的几何体的加载器。Draco是一个开源的3D网格和点云压缩与解压库。压缩后的几何体可以在客户端设备上显著减小大小，但需要额外的解码时间。</div>
  <div><h4>注意：</h4>
    设置draco路径时，需要把threejs模块下的draco文件夹放到自己的目录下
  </div>
    <img src="../../../assets//three/draco.png" alt="draco">

      <CodeBlock :code="draco" language="javascript" :show-run="true" @run="executeCode" />
<h3>完整示例</h3>
      <CodeBlock :code="all" language="javascript" :show-run="true" @run="executeCode" />

  </section>
</template>
<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';

const all = (`
// 引入 Three.js 的核心模块
import * as THREE from 'three'
//导入glft加载器
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

//实例化gltf加载器
const gltfloader = new GLTFLoader()

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建GLTFLoader对象并加载模型
const loader = new THREE.GLTFLoader();
//加载模型
gltfloader.load(
  //模型路径
  "/scence.gltf",
  //加载完成回调
  (gltf) =>{
     // 将模型添加到场景中
  scene.add(gltf.scene);

  // 设置相机位置和渲染目标
  camera.position.x += (Math.sin(Date.now() * 0.001) * 500);
  camera.position.y += (Math.sin(Date.now() * 0.001) * 500);
  camera.lookAt(scene.position);

  // 在每一帧更新时更新相机位置和渲染目标
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
  }
  , undefined, function (error) {
  console.error(error);
});
)

`)
const gltf = (`
//导入glft加载器
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

//实例化gltf加载器
const gltfloader = new GLTFLoader()
// 创建GLTFLoader对象并加载模型
const loader = new THREE.GLTFLoader();
//加载模型
gltfloader.load(
  //模型路径
  "/scence.gltf",
  //加载完成回调
  (gltf) =>{
     // 将模型添加到场景中
  scene.add(gltf.scene);

  // 设置相机位置和渲染目标
  camera.position.x += (Math.sin(Date.now() * 0.001) * 500);
  camera.position.y += (Math.sin(Date.now() * 0.001) * 500);
  camera.lookAt(scene.position);

  // 在每一帧更新时更新相机位置和渲染目标
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
  }
  , undefined, function (error) {
  console.error(error);
});
)
`)
const draco = (`

//导入解析器
import { DRACOLoader } from 'three/examples/jsm/Addons.js'
//实例化加载器 draco
const dracoLoader = new DRACOLoader()
//设置draco路径
dracoLoader.setDecoderPath('/draco/')
//设置gltf加载器draco解码器
gltfloader.setDRACOLoader(dracoLoader)
`)
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
}
</script>
<style scoped>
.threejs-demo-page { padding: 24px; line-height: 5vh; }
</style>
