<template>
  <section class="threejs-demo-page">
    <div style="overflow: auto;">
      <h1>坐标辅助器和轨道控制器</h1>

      <h2>1.坐标辅助器</h2>
      <div>一般在开发阶段，添加物体和设置物体位置，都需要参考一下坐标轴，方便查看是否放置到对应位置。所以一般添加坐标轴辅助器来作为参考，辅助器简单模拟3个坐标轴的对象。红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴。
      </div>
      <CodeBlock :code="zbDiama" language="javascript" :show-run="true" @run="executeCode" />
      <h2>2.轨道控制器</h2>
      <h3> 控制物体移动</h3>
      <div> 环绕控制使摄像机能够围绕目标进行环绕运动。</div>
      <div>OrbitControls是一个插件，必须显式导入。</div>
      <CodeBlock :code="diama" language="javascript" :show-run="true" @run="executeCode" />
      <h2>控制轨道控制器的平移，缩放，旋转</h2>
      <CodeBlock :code="kz" language="javascript" :show-run="true" @run="executeCode" />
      <a href="https://threejs.org/docs/?q=orbit#OrbitControls">更多属性见文档。</a>

    </div>

  </section>
</template>
<script setup lang="ts">
import CodeBlock from '../../../components/CodeBlock .vue'


//组件逻辑----------------------------------------
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
};
//坐标辅助器代码
const zbDiama = (
  `const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );`
)
 //轨道控制器代码
const diama = (`  
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    //添加一个轨道控制器
let controls = new OrbitControls(threeSceneRes.value?.camera,threeSceneRes.value?.renderer.domElement)
//设置阻尼的惯性
controls.enableDamping = true
//设置阻尼系数
controls.dampingFactor = 0.05
//设置自动旋转
controls.autoRotate = true
    controls.update()
`);
const kz =`

//禁用平移
controls.enablePan = false
//设置离目标最小距离
controls.minDistance =3
//设置离目标最小距离
controls.maxDistance =3
//设置垂直最小旋转角度   范围 0-Π
controls.minPolarAngle = Math.PI /4
//设置垂直最大旋转角度   范围 0-Π
controls.maxPolarAngle = Math.PI /3
//设置水平最小旋转角度   范围 -2 * Math.PI —— 2 * Math.PI
controls.minAzimuthAngle = Math.PI /4
//设置水平最大旋转角度   
controls.minAzimuthAngle = Math.PI /2
`
</script>
<style scoped>
.threejs-demo-page {
  padding: 2vh 5vw;
  line-height: 4vh;
}
</style>
