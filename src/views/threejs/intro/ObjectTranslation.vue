<template>
  <section class="threejs-demo-page">
    <h1>物体位移与父子元素</h1>
    <h2>1.物体位移</h2>
<div>为了让物体移动起来。我们可以设置它的position属性进行位置的设置。<br>
相机和立方体都是物体。每个物体都是1个对象。<br>
在官方文档里，相机camera和物体mesh都继承Object3D类。所以camera、mesh都属于3d对象。从3d对象的官方文档里，可以找到position属性，并且该属性一个vector3对象。因此通过官方vector3类的文档，可以简单使用下面2种方式来修改position位置,当然还有更多方式。</div>
      <CodeBlock :code="diama" language="javascript" :show-run="true" @run="executeCode" />

      <h2>2.父子元素</h2>
    <div>添加一个父元素，可以以父元素为定位，移动子元素</div>
      <CodeBlock :code="fudiama" language="javascript" :show-run="true" @run="executeCode" />
      <div>红色为父，绿色为子，以父元素为定位向x轴移动一个单位</div>
     <img src="../../../assets/three/fuzi.png" alt="fuzi" style="zoom:60%;">
  </section>
</template>
<script setup lang="ts">
import CodeBlock from '../../../components/CodeBlock .vue'
//组件逻辑----------------------------------------

const diama = (`  
  //设置该向量的x、y 和 z 分量 为数字。
mesh.position.set(x,y,z);
//直接设置position的x,y,z属性
mesh.position.x = x;
mesh.position.y = y;
mesh.position.z = z;
`);
const fudiama = (`
//添加子元素
 cube = new THREE.Mesh(geometry, material)
 //设置子元素位移
  cube.position.x = 2
//添加父元素
  const parentCube =  new THREE.Mesh(geometry, materials)
  //设置父元素位移
  parentCube.position.x = 1
  //将子元素添加至父元素
   parentCube.add(cube)

  // 把父元素添加到场景中
  scene.add(parentCube)

`)
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
};
</script>
<style scoped>
.threejs-demo-page { padding: 24px; }
</style>
