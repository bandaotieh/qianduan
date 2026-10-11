<template>
  <section class="threejs-demo-page">
    <h1>光线投射和3d场景交互</h1>
    <div>在 Three.js 中，由于 3D 场景渲染在 Canvas 画布上，我们无法像操作普通 HTML 元素那样直接给 3D 物体（Mesh）添加 addEventListener('click')。要实现交互，必须使用光线投射（Raycasting）技术。
</div>
<div><h3>其核心原理是：</h3> 当用户点击屏幕时，从相机的位置向鼠标点击的屏幕坐标发出一条虚拟的“射线”，然后检测这条射线是否与场景中的 3D 物体相交。如果相交，则触发相应的交互逻辑。</div>
<h2>1. 初始化光线投射器和鼠标向量</h2>
      <CodeBlock :code="diama1" language="javascript" :show-run="true" @run="executeCode" />

<h2>2. 监听鼠标事件并转换坐标系</h2>
      <CodeBlock :code="diama2" language="javascript" :show-run="true" @run="executeCode" />

<h2>3. 执行射线检测并处理交互逻辑</h2>
      <CodeBlock :code="diama3" language="javascript" :show-run="true" @run="executeCode" />
<h2>全部代码</h2>
      <CodeBlock :code="diama4" language="javascript" :show-run="true" @run="executeCode" />

  </section>
</template>
<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';

//组件逻辑----------------------------------------

const diama1 = (`  
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
`);
const diama2 = (`  
window.addEventListener('click', (event) => {
  // 将鼠标 X 坐标转换为 -1 到 1 的范围
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  // 将鼠标 Y 坐标转换为 -1 到 1 的范围（注意 Y 轴取反）
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  // 调用射线检测函数
  checkIntersections();
});
`);
const diama3 = (`  
function checkIntersections() { 
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
}
`);
const diama4 = (`  

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
`);
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
}
</script>
<style scoped>
.threejs-demo-page { padding: 24px;line-height: 5vh;}
</style>
