<template>
    <div style="line-height: 5vh;">  
    <h2>法向</h2>
<div>最常见的用途是在光照计算中</div>
<div> Three.js 提供的内置几何体（如 BoxGeometry、SphereGeometry），引擎会自动生成法向量。也可以手动调用以下方法来自动计算顶点法线：</div>
      <CodeBlock :code="fax" language="javascript" :show-run="true" @run="executeCode" />
<h3>手动设置法向量</h3>
      <CodeBlock :code="fax1" language="javascript" :show-run="true" @run="executeCode" />
<h3>动态更新法向量</h3>
<div>如果模型在动画中发生了顶点位置变形（如波浪效果），法向量必须同步更新，否则光照会失真</div>
      <CodeBlock :code="fax2" language="javascript" :show-run="true" @run="executeCode" />
      <h3>法向量辅助器</h3>
      <div>通过 VertexNormalsHelper 在模型表面绘制出红色的法线线段，直观检查方向。</div>
      <CodeBlock :code="fax3" language="javascript" :show-run="true" @run="executeCode" />

    <h2>几何顶点的位移、旋转、缩放</h2>
    <h3>使用Geometry方法:直接改变顶点数据</h3>
    <div>创建一个简单的立方体Geometry，并应用一些变换：</div>
      <CodeBlock :code="wenli" language="javascript" :show-run="true" @run="executeCode" />
<div>● rotateX、rotateY、rotateZ：这些方法用于分别沿X、Y、Z轴旋转几何体。它们接受一个弧度值作为参数，表示旋转的角度。通过调用这些方法，我们可以更改几何体的方向。<br>
● scale：此方法用于缩放几何体。它接受三个参数：x、y和z，分别表示沿X、Y、Z轴的缩放系数。通过调用此方法，我们可以更改几何体的大小。<br>
● translate：此方法用于平移几何体。它接受三个参数：x、y和z，分别表示沿X、Y、Z轴的平移距离。通过调用此方法，我们可以更改几何体的位置。<br>
需要注意的是，这些方法直接修改几何体的顶点数据，因此会影响所有使用该几何体的网格。</div>
<h3> 使用Object3D属性</h3>
    <div>创建另一个立方体，并应用一些变换：</div>
      <CodeBlock :code="wenli2" language="javascript" :show-run="true" @run="executeCode" />
<h3>Geometry与Object3D方法的区别</h3>
<div>● Geometry中的方法直接修改几何体的顶点数据，而Object3D的属性仅影响对象在场景中的变换。因此，更改Geometry中的方法会影响所有使用该几何体的网格，而更改Object3D属性不会影响其他使用相同几何体的对象。<br>
● Geometry中的方法更适合在创建时对几何体进行一次性的修改，而Object3D的属性更适合在实时渲染过程中对场景中的对象进行动态变换。<br>
● 在性能方面，更改Object3D属性通常比修改Geometry中的顶点数据更高效，因为后者涉及到重新计算顶点数据。因此，在实际应用中，优先考虑使用Object3D的属性进行变换。</div>
   </div>
   </template>
    
    <script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';
const fax = (` 
 geometry.computeVertexNormals();

`)
const fax1 = (` 
const normals = new Float32Array([
    0, 0, 1,  // 第1个顶点的法向量
    0, 0, 1,  // 第2个顶点的法向量
    0, 0, 1   // 第3个顶点的法向量
]);
geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

`)
const fax2 = (` 
// 1. 修改顶点位置后，标记位置属性需要更新
geometry.attributes.position.needsUpdate = true;
// 2. 重新计算顶点法向量
geometry.computeVertexNormals();

`)
const fax3 = `
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
const helper = new VertexNormalsHelper(mesh, 0.2, 0xff0000);  //0.2  代表长度    0xff0000  代表颜色
scene.add(helper);`
const wenli = (` 
 const geometry = new THREE.BoxGeometry(1, 1, 1);

// 使用Geometry的方法进行变换
geometry.rotateX(Math.PI / 4); // 沿X轴旋转45度
geometry.rotateY(Math.PI / 6); // 沿Y轴旋转30度
geometry.scale(2, 2, 2);       // 将立方体沿X、Y、Z轴缩放2倍
geometry.translate(1, 1, 1);   // 将立方体沿X、Y、Z轴平移1个单位

`)
const wenli2 = (`
const geometry2 = new THREE.BoxGeometry(1, 1, 1);
const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube2 = new THREE.Mesh(geometry2, material2);

// 使用Object3D属性进行变换
cube2.rotation.x = Math.PI / 4; // 沿X轴旋转45度
cube2.rotation.y = Math.PI / 6; // 沿Y轴旋转30度
cube2.scale.set(2, 2, 2);       // 将立方体沿X、Y、Z轴缩放2倍
cube2.position.set(3, 3, 3);    // 将立方体沿X、Y、Z轴平移1个单位

// 将网格添加到场景中
scene.add(cube2);


`)
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
}
    </script>
    <style lang="less" scoped>

    </style>