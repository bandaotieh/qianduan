<template>
    <div style="line-height: 5vh;">
    <h3>边缘几何体</h3>
    <div>提取物体的“硬边”或“轮廓”。它会分析几何体，只显示那些相邻面夹角较大的边。这就像在3D建模软件中看到的线框模式，只勾勒出物体棱角分明的骨架，线条简洁，非常清晰。</div>
      <CodeBlock :code="bianyuan" language="javascript" :show-run="true" @run="executeCode" />
    
    <h3>线框几何体</h3>
<div>显示物体的所有三角面边线。它会将几何体的每一个三角形的每一条边都显示出来</div>
<div><span style="font-weight: 600;">注意</span>在材质上直接设置 wireframe: true 和在代码里用 WireframeGeometry 效果类似，都会显示所有三角面的边线</div>
      <CodeBlock :code="xiankuang" language="javascript" :show-run="true" @run="executeCode" />
      <h3>traverse</h3>
  <div>遍历一个模型内所有物体</div>
      <CodeBlock :code="all" language="javascript" :show-run="true" @run="executeCode" />

    </div>
</template>
<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';
const bianyuan = (` 
 // 1. 创建你的原始几何体，比如一个立方体
const geometry = new THREE.BoxGeometry(2, 2, 2);

// 2. 创建边缘几何体
// 第二个参数 thresholdAngle 是角度阈值（度），默认15度
// 只有相邻面法线夹角大于此值的边才会被显示
const edges = new THREE.EdgesGeometry(geometry, 15); [reference:10][reference:11]

// 3. 创建线条材质
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });

// 4. 创建线条物体并添加到场景
const wireframe = new THREE.LineSegments(edges, lineMaterial);
scene.add(wireframe);

`)
const xiankuang =  `
// 1. 创建你的原始几何体，比如一个球体
const geometry = new THREE.SphereGeometry(1, 16, 16);

// 2. 创建线框几何体（不需要额外参数）[reference:12]
const wireframeGeo = new THREE.WireframeGeometry(geometry);

// 3. 创建线条材质
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffaa00 });

// 4. 创建线条物体并添加到场景
const wireframe = new THREE.LineSegments(wireframeGeo, lineMaterial);
scene.add(wireframe);
`
const all =`
gltfloader.load(
  //模型路径
  "/scence.gltf",
  //加载完成回调
  (gltf) =>{
     const model = gltf.scene;
    scene.add(model);
   gltf.scene.traverse((child) =>{
    if (child instanceof  THREE.Mesh ) {
    const geometry = child.geometry
    //创建边缘geometry
      const edgesGeometry = new THREE.EdgesGeometry(geometry)
      //创建线段材质
      const lineBasicMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff
      })
      //创建线段
      const edges = new THREE.LineSegments(edgesGeometry,lineBasicMaterial)
      //添加
      scene.add(edges)
    }
   

   })
  


  }
)
`
const executeCode = () => {
}
</script>
<style lang="less" scoped></style>