<template>
  <section class="threejs-demo-page">
      <div>示例</div>
    <div  class="three-demo-shell">
  <div ref="canvasContainer" class="three-scene-container" style="width: 50vw;height: 50vh;margin-left: 20%;" />
 <!-- 单独的 DOM 容器，用来挂载 lil-gui 的界面元素 -->
      <div ref="guiHost" class="three-demo-gui-host" />
    </div>
    
    <h3>1.贴图的加载</h3>
      <CodeBlock :code="tietu" language="javascript" :show-run="true" @run="executeCode" />
    
     <h3>2.环境遮蔽贴图</h3>
     <div>模拟物体表面缝隙、褶皱或角落因光线被遮挡而产生的局部阴影，增强物体的立体感。</div>
      <CodeBlock :code="hjzb" language="javascript" :show-run="true" @run="executeCode" />
      <div>环境遮蔽贴图添加控制器</div>
      <img src="../../../assets/three/ao.png" alt="ao">

      <div><span style="font-weight: 600;">aoMapIntensity:</span>环境遮挡效果的强度。默认值为1。零是不遮挡效果。</div>
      <CodeBlock :code="hjzbkzq" language="javascript" :show-run="true" @run="executeCode" />
     <h3>3.透明度贴图</h3>
     <div>控制物体表面的透明度，通常黑色区域代表完全透明，白色代表不透明。</div>
      <CodeBlock :code="tmd" language="javascript" :show-run="true" @run="executeCode" />
      <img src="../../../assets/three/alpha.png" alt="alpha">
     <h3>4.光照贴图</h3>
     <div>将预先烘焙好的全局光照信息贴在模型上，无需实时计算光照即可呈现光照效果。</div>
      <img src="../../../assets/three/light.png" alt="light">
      <CodeBlock :code="gz" language="javascript" :show-run="true" @run="executeCode" />
       <h3>5.高光贴图</h3>
      <div>控制物体表面的反光程度（镜面反射强度）。它通常是一张灰度图，像素越白的地方镜面反射越强（如塑料、金属），越黑的地方反射越弱（如木头、布料）。</div>
      <CodeBlock :code="gg" language="javascript" :show-run="true" @run="executeCode" />

     <h3>6.环境贴图</h3>
     <div>提供周围环境的全景图像，用于在物体表面产生逼真的环境反射效果。</div>
<div>最好使用HDR（高动态范围）贴图包含真实的光照信息，适合用于 PBR 材质的反射和光照计算。</div>
<div>需导入hrd加载器</div>
      <CodeBlock :code="hj" language="javascript" :show-run="true" @run="executeCode" />
<h2>全部代码</h2>
      <CodeBlock :code="all" language="javascript" :show-run="true" @run="executeCode" />
     <h3>7.纹理属性</h3>
      <img src="../../../assets/three/wenli.png" alt="wenli">
      <div style="text-align: left;">在 three.js 中，纹理的 colorSpace 属性用于定义纹理的颜色空间。颜色空间是一个可以描述颜色的数学模型。在现实生活中，我们可以观察到无数种颜色，而颜色空间就是用来描述这些颜色的一个方法。不同的颜色空间可以表示不同范围和精度的颜色。</div>
      <div style="text-align: left;"><span style="font-weight: 600;color: red;">1.</span>THREE.NoColorSpace：这意味着没有应用任何特定的颜色空间，纹理的颜色数据会被原样使用。这个选项通常用于已经处于需要的颜色空间中的纹理，或者那些不依赖于颜色空间的特定用途。<br>
<span style="font-weight: 600;color: red;">2.</span>THREE.SRGBColorSpace：在此颜色空间中，颜色数据以 sRGB 格式存储。sRGB 是一个 RGB 标准，它试图将色彩的表现和人眼感知到的颜色更好地匹配。相对于线性颜色空间，sRGB 颜色空间在暗区提供了更多的颜色级别。使用此颜色空间时，需要注意图像的颜色可能会被转换为非线性的 sRGB 格式。<br>
<span style="font-weight: 600;color: red;">3.</span>THREE.LinearSRGBColorSpace：这也是一个以 sRGB 格式存储颜色数据的颜色空间，但颜色数据被当作线性数据处理。在进行计算和处理时，这种颜色空间可以提供更精确的结果。然而，需要注意的是，使用此颜色空间可能会使得颜色在暗区看起来过于暗。<br>
需要注意的是，如果纹理已经被一个材料使用，然后你改变了纹理的颜色空间类型，那么你需要将 Material.needsUpdate 设置为 true 来使材料重新编译。这是因为材料的编译过程依赖于纹理的颜色空间，如果纹理的颜色空间改变了，那么材料的编译结果可能就不再正确，因此需要重新编译。<br>
如何选择颜色空间类型取决于你的特定需求。如果你的纹理已经在需要的颜色空间中，那么你可以选择 THREE.NoColorSpace。如果你希望你的纹理颜色更好地匹配人眼的颜色感知，那么你可以选择 THREE.SRGBColorSpace。如果你需要对颜色数据进行精确的计算和处理，那么你可以选择 THREE.LinearSRGBColorSpace。</div>
      <CodeBlock :code="wenli" language="javascript" :show-run="true" @run="executeCode" />

  </section>
</template>

<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
//导入hrd加载器
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
// 1. 获取 DOM 节点引用
const canvasContainer = ref<HTMLDivElement | null>(null);
// 保存 GUI 的挂载容器，避免 GUI 默认插入到 body 导致位置不受控

const guiHost = ref<HTMLDivElement | null>(null)

// 2. 声明全局 3D 变量
let scene: THREE.Scene  | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let cube: THREE.Mesh | null = null;
let controls: OrbitControls | null = null
// 保存 GUI 实例，负责创建并管理调试面板
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

const animate = () => {
  if (!scene || !camera || !renderer || !cube) return;
  controls?.update()

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
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
  camera.position.set(3, 2, 5);
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
  // 创建纹理加载器
  const textureLoader = new THREE.TextureLoader();
  //加载纹理
  const texture = textureLoader.load('/1.png')
  //将纹理颜色改为srgb
  texture.colorSpace = THREE.SRGBColorSpace
  //加载ao贴图（环境遮蔽贴图）
  const aomap = textureLoader.load('/hjzb.png')
  //加载透明度贴图
  const alphaMap = textureLoader.load('/tmd.png')
//加载光照贴图
  const lightMap = textureLoader.load('/gz.png')
  //设置高光贴图
  const specularMap = textureLoader.load('/gg.png')
  //rgbeloader 加载hdr贴图
  const rgbeloader = new HDRLoader()
  rgbeloader.load('/gaota.hdr',(eveMap) =>{
    //设置球形映射
    eveMap.mapping = THREE.EquirectangularReflectionMapping
    if (scene) {
        //设置环境贴图

    scene.background = eveMap
    //给场景设置环境贴图
    scene.environment = eveMap
    }
  
    //设置物体的环境贴图
    planmaterial.envMap = eveMap



  })



  const planGemo = new THREE.PlaneGeometry(3,3)
  const planmaterial = new THREE.MeshBasicMaterial({
     color: 0xffffff, 
     //设置贴图
     map: texture,
     //设置ao贴图
     aoMap: aomap,
     //设置透明度贴图
     alphaMap: alphaMap,
     //设置光照贴图
    //  lightMap: lightMap,
      //设置高光贴图
     specularMap: specularMap,
    //反射强度
    reflectivity: 0.5,
     //允许透明
     transparent: true
     });
  cube = new THREE.Mesh(planGemo, planmaterial);
  // scene.add(cube)
//创建立方体
const box = new THREE.SphereGeometry(1,32,32)
//创建物理材质

  const Material = new THREE.MeshPhysicalMaterial({
    //允许透明
    transparent: true,
    //透光率（或者说透光性），范围从0.0到1.0。默认值是0.0。
    transmission: 0.98,
    opacity: 1,
    //粗糙度
    roughness: 0.05,
    //厚度
    thickness: 2,
    //衰减颜色
    attenuationColor : new THREE.Color(0.6,0,0),
    //衰减距离
    attenuationDistance: 1,
  })

  //光泽效果
   const Materialshin = new THREE.MeshPhysicalMaterial({
   color: 0x222288,   //材质颜色
   sheen: 1,    // 光泽
   sheenColor : 0xffffff,  //光泽颜色
   roughness: 1,  // 粗糙程度
   sheenRoughness: 1, //光泽粗糙程度
   sheenColorMap: null //光泽纹理 （贴图）

  })
    //虹彩效果
   const Materialhc = new THREE.MeshPhysicalMaterial({
   color: 0xffffff,   //材质颜色
   roughness: 0.05, //光滑程度
  transmission: 1, //透明度
  thickness: 0.1, //厚度
  iridescence: 1, //虹彩效应
   iridescenceIOR: 1.3,   // 虹彩折射率
    iridescenceThicknessRange: [200, 400], // 薄膜厚度范围  默认100-400
      // iridescenceThicknessMap: thicknessTexture // 可选：使用贴图控制厚度

  })
//创建立方体网格模型
const cubes = new THREE.Mesh(box,Materialhc)
  scene.add(cubes)
 
//       const geometrys = new THREE.SphereGeometry(1, 32, 32);
// const materialss = new THREE.MeshPhongMaterial({
//     color: 0xffffff,        // 物体的基础颜色
//     shininess: 60,          // 高光部分的亮度，默认值为 30
//     specular: 0xffffff,      // 高光部分的颜色，默认为深灰色 0x111111
//     refractionRatio: 0.6,   //折射率
//     reflectivity: 0.8, // 反色系数
//     envMap : texture,

// });

// const mesh = new THREE.Mesh(geometrys, materialss);
// scene.add(mesh);

const lightsss = new  THREE.AmbientLight(0xffffff,1)
scene.add(lightsss);

// gui = new GUI()
gui.add(planmaterial,'aoMapIntensity').min(0).max(10).name('ao强度')
//切换纹理属性
gui.add(texture,'colorSpace',{
  sRGB: THREE.SRGBColorSpace,
  Linear: THREE.LinearSRGBColorSpace
}).onChange(() =>{
  //切换后需要更新
  texture.needsUpdate = true 
})
  handleResize();
    // renderer.render(scene, camera);
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
//组件逻辑----------------------------------------

const tietu = (`  
// 创建纹理加载器
  const textureLoader = new THREE.TextureLoader();
  //加载纹理 
  const texture = textureLoader.load('/1.png')
  //设置面
  const planGemo = new THREE.PlaneGeometry(3,3)
  const planmaterial = new THREE.MeshBasicMaterial({
     color: 0xffffff, 
     //设置贴图
     map: texture,
     //允许透明
     transparent: true
     });
  cube = new THREE.Mesh(planGemo, planmaterial);
  scene.add(cube)
`);

const hjzb = (`  
 // 创建纹理加载器
  const textureLoader = new THREE.TextureLoader();
  //加载纹理
  const texture = textureLoader.load('/1.png')
  //加载ao贴图（环境遮蔽贴图）
  const aomap = textureLoader.load('/hjzb.png')

  const planGemo = new THREE.PlaneGeometry(3,3)
  const planmaterial = new THREE.MeshBasicMaterial({
     color: 0xffffff, 
     //设置贴图
     map: texture,
     //设置ao贴图
     aoMap: aomap,
     //允许透明
     transparent: true
     });
  cube = new THREE.Mesh(planGemo, planmaterial);
  scene.add(cube)
`);
const hjzbkzq = (`
gui = new GUI()
//
gui.add(planmaterial,'aoMapIntensity').min(0).max(10).name('ao强度')
`)
const tmd = (`  
// 创建纹理加载器
  const textureLoader = new THREE.TextureLoader();
  //加载纹理
  const texture = textureLoader.load('/1.png')
  //加载ao贴图（环境遮蔽贴图）
  const aomap = textureLoader.load('/hjzb.png')
  //加载透明度贴图
  const alphaMap = textureLoader.load('/tmd.png')

  const planGemo = new THREE.PlaneGeometry(3,3)
  const planmaterial = new THREE.MeshBasicMaterial({
     color: 0xffffff, 
     //设置贴图
     map: texture,
     //设置ao贴图
     aoMap: aomap,
     //设置透明度贴图
     alphaMap: alphaMap,
     //允许透明
     transparent: true
     });
  cube = new THREE.Mesh(planGemo, planmaterial);
  scene.add(cube)
`);
const hj = (`  
//导入hrd加载器
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

  // 创建纹理加载器
  const textureLoader = new THREE.TextureLoader();
  //加载纹理
  const texture = textureLoader.load('/1.png')
  //rgbeloader 加载hdr贴图
  const rgbeloader = new HDRLoader()
  rgbeloader.load('/sun.hdr',(eveMap) =>{
    //设置球形映射
    eveMap.mapping = THREE.EquirectangularReflectionMapping
    //设置环境贴图
    scene.background = eveMap
    //给场景设置环境贴图
    scene.environment = eveMap
    //设置物体的环境贴图
    planmaterial.envMap = eveMap

  })
  const planGemo = new THREE.PlaneGeometry(3,3)
  const planmaterial = new THREE.MeshBasicMaterial({
     color: 0xffffff, 
     //设置贴图
     map: texture,
     //允许透明
     transparent: true,
     //反射强度
    reflectivity: 0.5,
     });
  cube = new THREE.Mesh(planGemo, planmaterial);
  scene.add(cube)
`);
const gz = (`  
  // 创建纹理加载器
  const textureLoader = new THREE.TextureLoader();
  //加载纹理
  const texture = textureLoader.load('/1.png')
  //加载ao贴图（环境遮蔽贴图）
  const aomap = textureLoader.load('/hjzb.png')
//加载光照贴图
  const lightMap = textureLoader.load('/gz.png')
  const planGemo = new THREE.PlaneGeometry(3,3)
  const planmaterial = new THREE.MeshBasicMaterial({
     color: 0xffffff, 
     //设置贴图
     map: texture,
     //设置ao贴图
     aoMap: aomap,
   
     //设置光照贴图
    //  lightMap: lightMap,
     //允许透明
     transparent: true
     });
  cube = new THREE.Mesh(planGemo, planmaterial);
  scene.add(cube)
`);
;
const gg = (`  
  // 创建纹理加载器
  const textureLoader = new THREE.TextureLoader();
  //加载纹理
  const texture = textureLoader.load('/1.png')
  //加载ao贴图（环境遮蔽贴图）
  const aomap = textureLoader.load('/hjzb.png')
//加载光照贴图
  const specularMap = textureLoader.load('/gg.png')
  const planGemo = new THREE.PlaneGeometry(3,3)
  const planmaterial = new THREE.MeshBasicMaterial({
     color: 0xffffff, 
     //设置贴图
     map: texture,
     //设置ao贴图
     aoMap: aomap,
    //设置高光贴图
     specularMap: specularMap,
     //允许透明
     transparent: true
     });
  cube = new THREE.Mesh(planGemo, planmaterial);
  scene.add(cube)
`);
;
const all = (`  

//导入hrd加载器
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
// 保存 GUI 实例，负责创建并管理调试面板
let gui: GUI | null = null


 // 创建纹理加载器
  const textureLoader = new THREE.TextureLoader();
  //加载纹理
  const texture = textureLoader.load('/1.png')
  //加载ao贴图（环境遮蔽贴图）
  const aomap = textureLoader.load('/hjzb.png')
  //加载透明度贴图
  const alphaMap = textureLoader.load('/tmd.png')
//加载光照贴图
  const lightMap = textureLoader.load('/gz.png')
  //设置高光贴图
  const specularMap = textureLoader.load('/gg.png')
  //rgbeloader 加载hdr贴图
  const rgbeloader = new HDRLoader()
  rgbeloader.load('/sun.hdr',(eveMap) =>{
    //设置球形映射
    eveMap.mapping = THREE.EquirectangularReflectionMapping
    //设置环境贴图
    scene.background = eveMap
    //给场景设置环境贴图
    scene.environment = eveMap
    //设置物体的环境贴图
    planmaterial.envMap = eveMap

  })
  const planGemo = new THREE.PlaneGeometry(3,3)
  const planmaterial = new THREE.MeshBasicMaterial({
     color: 0xffffff, 
     //设置贴图
     map: texture,
     //设置ao贴图
     aoMap: aomap,
     //设置透明度贴图
     alphaMap: alphaMap,
     //设置光照贴图
    //  lightMap: lightMap,
      //设置高光贴图
     specularMap: specularMap,
    //反射强度
    reflectivity: 0.5,
     //允许透明
     transparent: true
     });
  cube = new THREE.Mesh(planGemo, planmaterial);
  scene.add(cube)
gui = new GUI()
gui.add(planmaterial,'aoMapIntensity').min(0).max(10).name('ao强度')
`);
const wenli = (`
 //加载纹理
  const texture = textureLoader.load('/1.png')
  //将纹理颜色改为srgb  不设置默认为LinearSRGBColorSpace
  texture.colorSpace = THREE.SRGBColorSpace
`)
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
}




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
