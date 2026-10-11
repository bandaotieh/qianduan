<template>
    <div style="line-height: 5vh;">

    <h2>设置材质效果技巧</h2>
    <div><span style="font-weight: 600;">方法一:</span>在建模软件中，导出的模型放在threeJs中可能会有差别，这时可以编辑器中添加好材质效果，然后导出glb或gltf文件,在导入场景中</div>
      <CodeBlock :code="skill" language="javascript" :show-run="true" @run="executeCode" />
<div><span style="font-weight: 600;">方法二:</span>导出整个场景（json格式），然后使用OBJ加载器（OBJLoader）导入</div>
<div>需设置环境贴图</div>
      <CodeBlock :code="obj" language="javascript" :show-run="true" @run="executeCode" />

    </div>

    </template>
    <script setup lang="ts">
          import CodeBlock from '~/components/CodeBlock .vue';
const skill = (`
//实例化gltf加载器
const gltfloader = new GLTFLoader()
//实例化加载器 draco
const dracoLoader = new DRACOLoader()
//设置draco路径
dracoLoader.setDecoderPath('/draco/')
//设置gltf加载器draco解码器
gltfloader.setDRACOLoader(dracoLoader)
//加载模型
gltfloader.load(
  //模型路径
  "/scence.gltf",
  //加载完成回调
  (gltf) =>{

   })
  


  }
)
`)
const obj = `
//实例化加载器
const loader = new THREE.ObjectLoader()
loader.load('/scence.json',(object) =>{
  scene.add(object)
})
`
const executeCode = () => {
}
</script>