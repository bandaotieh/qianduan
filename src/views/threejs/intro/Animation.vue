<template>
  <section class="threejs-demo-page">
    <h1>lil-GUI调试</h1>
    <div>lil-gui 是一个轻量级的 JavaScript GUI 库，专门用于创建简单的调试面板或参数调整界面。非常适合在开发过程中用来快速测试和调整参数。</div>
    <h3>1.使用方法</h3>
      <CodeBlock :code="diama" language="javascript" :show-run="true" @run="executeCode" />
<h3> 2.常见控件类型</h3>
<div>1.添加按钮</div>
      <CodeBlock :code="button" language="javascript" :show-run="true" @run="executeCode" />
<div>2.滑块</div>
      <CodeBlock :code="huakuai1" language="javascript" :show-run="true" @run="executeCode" />

      <CodeBlock :code="huakuai" language="javascript" :show-run="true" @run="executeCode" />
      <div>3. 布尔值开关</div>
      <CodeBlock :code="blooen" language="javascript" :show-run="true" @run="executeCode" />
      <div>4. 颜色选择器</div>
      <CodeBlock :code="color" language="javascript" :show-run="true" @run="executeCode" />


  </section>
</template>

<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';

//组件逻辑----------------------------------------

const diama = (`  
//导入
 import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
//创建一个 GUI 对象
const gui = new GUI();
`);
const button = (`  
   //定义事件
  let event = {
    FullScreen : function(){
      //全屏
        threeSceneRes.value?.renderer.domElement.requestFullscreen();
    }
  }
  //添加按钮    .name()更改事件名称   .step(1) 表示移动的举例最小为1
 gui.add(event,'FullScreen').name("全屏")  //传入event
`);

const huakuai1 = (`
gui.add(target, 'propertyName', min, max).name('Label');
//target：目标对象。
//propertyName：要调整的属性名。
//min 和 max：数值范围。
`)
const huakuai = (`  
   //滑块  改变物体位置 
 //可以设置一个组  把移动，旋转之类的都加进去
 let foolder = gui.addFolder('立方体位置')

 //带有onChange和onFinishChange方法  onChange物体移动时进行回调 onFinishChange物体结束移动时进行回调
 foolder.add(cube.position, 'x', -5, 5).step(1).name('子立方体x轴位置').onChange((val) => {
  console.log(val);
  
 });
  foolder.add(cube.position, 'y', -5, 5).name('子立方体y轴位置').onFinishChange((val) => {
  console.log(val);
  
 });
`);
const blooen = (`
gui.add(target, 'propertyName').name('Label');
//示例
// 创建一个红色的基础材质，给父级立方体使用
  const materials = new THREE.MeshBasicMaterial({ color: 0xFF0000 })
// 设置父级立方体为线框模式，便于观察几何结构
  materials.wireframe = true
  // 给 GUI 增加一个线框显示开关
  gui.add(materials, 'wireframe').name('父物体开启线框')
`)
const color = (`
gui.addColor(target, 'propertyName').name('Label');
//示例
// 创建一个红色的基础材质，给父级立方体使用
  const materials = new THREE.MeshBasicMaterial({ color: 0xFF0000 })
  //添加颜色选择器
gui.addColor(materials,'color').name('颜色选择器')

`)
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
}
</script>
<style scoped>
.threejs-demo-page { padding: 24px; line-height: 4vh; overflow: auto;}
</style>
