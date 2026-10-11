<template>
  <section class="threejs-demo-page">
    <h1>几何体_顶点_索引_面之BufferGeometry</h1>
    <h3>1.顶点（Vertices）：3D 形状的基本构成</h3>
    <div>顶点是几何体的基本单位，每个顶点包含三维空间中的坐标 (x, y, z)。在 BufferGeometry 中，顶点数据通常被平铺存储在一个一维的 Float32Array 数组中，每三个数字代表一个顶点。</div>
    <img src="../../../assets/three/buffer.png" alt="buffer" style="zoom: 100%;">
    <h3>2.面（Faces）与索引（Index）：构建多边形</h3>
    <div>Three.js 默认使用三角形作为基本的渲染面。<br>
无索引模式（Non-indexed）：如果你要画一个正方形，需要 2 个三角形，也就是 6 个顶点。这意味着相邻三角形的公共顶点必须在数组中重复定义，浪费内存。<br>
<div>三角形顶点</div>
    <img src="../../../assets/three/sanjiao.png" alt="sanjiao" style="zoom: 100%;">
<div>四边形顶点</div>

    <img src="../../../assets/three/sibian.png" alt="sibian" style="zoom: 100%;">

<br>
索引模式（Indexed）：通过 index 属性，我们可以让多个三角形共享同一个顶点。索引数组中的每 3 个数字代表一个三角形面的 3 个顶点坐标在 position 数组中的下标。</div>
      <CodeBlock :code="diama" language="javascript" :show-run="true" @run="executeCode" />
<div>开启索引模式后，四边形顶点</div>
    <img src="../../../assets/three/sibians.png" alt="sibian" style="zoom: 100%;">
      <CodeBlock :code="suoyin" language="javascript" :show-run="true" @run="executeCode" />

    <h3>3.BufferGeometry</h3>
<div>将上述的顶点和索引数据通过 BufferAttribute 绑定到几何体上</div>
    <h3>4.顶点组</h3>
<div>threejs支持根据面设置不同材质，一个面一种材质</div>
<div>使用BufferGeometry中的.groups : Array. <br>
将几何体拆分为若干组，每组将在单独的绘制调用中渲染。这使得该几何体能够使用材质数组。<br>

每个顶点和索引必须且仅属于一个组——各组之间不得共享顶点或索引，也不得使顶点或索引闲置未用。</div>
    <img src="../../../assets/three/add.png" alt="add" style="zoom: 100%;">
      <CodeBlock :code="dingdianzu" language="javascript" :show-run="true" @run="executeCode" />

  </section>
</template>
<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';

//组件逻辑----------------------------------------

const diama = (`  
//创建一个三角面
 //创建几何体
const geometryShan = new THREE.BufferGeometry()
//创建顶点数据  顶点是有顺序的，每三个为一个顶点，逆时针为正面
const vertices  = new Float32Array([
    -1, 1, 0,   // 顶点 0：(x, y, z)
  -2, 0, 0,  // 顶点 1：(x, y, z)
  -1, 0, 0    // 顶点 2：(x, y, z)
])
//创建顶点属性
geometryShan.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  // 创建一个基础材质
  const materialShan = new THREE.MeshBasicMaterial({ color: 0xb7b21a })
  //创建面
  const plan = new THREE.Mesh(geometryShan, materialShan)
  //挂载
  parentCube.add(plan)
`);
const suoyin = (`
//创建顶点数据
const vertices  = new Float32Array([
   -1.0, -1.0,  1.0, // v0
	 1.0, -1.0,  1.0, // v1
	 1.0,  1.0,  1.0, // v2
	-1.0,  1.0,  1.0, // v3
  
])
//创建顶点属性
geometryShan.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
//创建索引  0,1,2代表Float32Array中前三组v0,v1,v2三个点创建一个三角形，2，3，0代表 v2,v3,v0这三个点形成第二个三角形， v0，v2公共顶点
const indices = new Uint16Array([0,1,2,2,3,0]) 
//创建索引属性
geometryShan.setIndex(new THREE.BufferAttribute( indices, 1 ) )
  // 创建一个基础材质
  const materialShan = new THREE.MeshBasicMaterial({ color: 0xb7b21a })
  //创建面
  const plan = new THREE.Mesh(geometryShan, materialShan)
  //挂载
  parentCube.add(plan)
`)
const dingdianzu = (`
// //创建几何体
const geometryShan = new THREE.BufferGeometry()

//创建顶点数据
const vertices  = new Float32Array([
   -1.0, -1.0,  1.0, // v0
	 1.0, -1.0,  1.0, // v1
	 1.0,  1.0,  1.0, // v2
	-1.0,  1.0,  1.0, // v3
  
])
//创建顶点属性
geometryShan.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
//创建索引  0,1,2代表Float32Array中前三组v0,v1,v2三个点创建一个三角形，2，3，0代表 v2,v3,v0这三个点形成第二个三角形， v0，v2公共顶点
const indices = new Uint16Array([0,1,2,2,3,0]) 
//创建索引属性
geometryShan.setIndex(new THREE.BufferAttribute( indices, 1 ) )
//设置两个顶点组，形成俩个材质
geometryShan.addGroup(0,3,0)
geometryShan.addGroup(3,3,1)

  // 创建一个基础材质
  const materialShan0 = new THREE.MeshBasicMaterial({ color: 0xb7b21a })
  const materialShan1 = new THREE.MeshBasicMaterial({ color: 0x206d9d })

  const plan = new THREE.Mesh(geometryShan, [materialShan0,materialShan1])
  parentCube.add(plan)
`)
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
}
</script>
<style scoped>
.threejs-demo-page { padding: 24px; line-height: 4vh;}
</style>
