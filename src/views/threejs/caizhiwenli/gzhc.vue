<template>
    <div style="line-height: 5vh;">
        <h2>光泽效果(MeshPhysicalMaterial材质)</h2>
        <div>布料和织物材料</div>
      <CodeBlock :code="gz" language="javascript" :show-run="true" @run="executeCode" />
<h2>虹彩效果(MeshPhysicalMaterial材质)</h2>
<div>常见于肥皂泡、油滴、蝴蝶翅膀等薄膜干涉现象</div>
      <CodeBlock :code="hc" language="javascript" :show-run="true" @run="executeCode" />

    </div>
    </template> 
    <script setup lang="ts">
      import CodeBlock from '~/components/CodeBlock .vue';
const gz = (` 
//创建立方体
const box = new THREE.BoxGeometry(1,1,1)
//创建物理材质
   const Materialshin = new THREE.MeshPhysicalMaterial({
   color: 0x222288,   //材质颜色
   sheen: 1,    // 光泽
   sheenColor : 0xffffff,  //光泽颜色
   roughness: 1,  // 粗糙程度
   sheenRoughness: 1, //光泽粗糙程度
   sheenColorMap: null //光泽纹理 （贴图）

  })
//创建立方体网格模型
const cubes = new THREE.Mesh(box,Material)
  scene.add(cubes)
`)
const hc = `
//创建物体
const box = new THREE.SphereGeometry(1,32,32)

//创建物理材质
    //虹彩效果
   const Materialhc = new THREE.MeshPhysicalMaterial({
   color: 0xffffff,   //材质颜色
   roughness: 0.05, //光滑程度
  transmission: 1, //透明度
  thickness: 0.1, //厚度
  iridescence: 1, //虹彩效应
   iridescenceIOR: 1.3,   // 虹彩折射率
    iridescenceThicknessRange: [100, 400], // 薄膜厚度范围  默认100-400
      // iridescenceThicknessMap: thicknessTexture // 可选：使用贴图控制厚度

  })
//创建立方体网格模型
const cubes = new THREE.Mesh(box,Material)
  scene.add(cubes)
`

const executeCode = () => {
}
</script>