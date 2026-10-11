<template>
    <div style="line-height: 5vh;">
     <h2>环境光 (AmbientLight)</h2>
     <div>
        <span style="font-weight: 700;">作用：</span>
        均匀照亮场景所有表面，无方向性。主要用于提亮场景，无阴影产生。
     </div>
      <CodeBlock :code="hjg" language="javascript" :show-run="true" @run="executeCode" />
     <h2>平行光 (DirectionalLight)</h2>
 <div>
        <span style="font-weight: 700;">作用：</span>
        模拟太阳光，光线平行，有固定方向，能产生清晰的阴影。
     </div>
      <CodeBlock :code="pxg" language="javascript" :show-run="true" @run="executeCode" />
      <h2>聚光灯</h2>
       <div>作用：
        <span style="font-weight: 700;"></span>
        模拟手电筒或舞台追光，光线呈锥形。能产生边缘柔和的阴影。
     </div>

      <CodeBlock :code="jgd" language="javascript" :show-run="true" @run="executeCode" />

 <h2>点光源</h2>
       <div>作用：
        <span style="font-weight: 700;"></span>
       模拟灯泡，从一个点向四周发射光线。有距离衰减，。能产生阴影。
     </div>
<div>创建一个点光源性能相当于创建4个聚光灯</div>
      <CodeBlock :code="dgy" language="javascript" :show-run="true" @run="executeCode" />


<h2>阴影</h2>
<div>设置阴影三步法</div>
 <div>
        <span style="font-weight: 700;">1.</span>
        渲染器开启阴影
     </div>
      <CodeBlock :code="frist" language="javascript" :show-run="true" @run="executeCode" />
<div>
        <span style="font-weight: 700;">2.</span>
        光源允许投射阴影
     </div>
      <CodeBlock :code="second" language="javascript" :show-run="true" @run="executeCode" />
<div>
        <span style="font-weight: 700;">3.</span>
        物体明确投射和接收阴影
     </div>
      <CodeBlock :code="third" language="javascript" :show-run="true" @run="executeCode" />
<div>对于平行光，可以设置阴影的覆盖范围，超出范围时阴影消失</div>
      <CodeBlock :code="scope" language="javascript" :show-run="true" @run="executeCode" />
<h2>阴影作用透明度纹理</h2>
<div>当 Three.js 渲染阴影贴图时，它只记录物体表面的“深度”信息，而不关心材质颜色的透明度（opacity）或透明度贴图（alphaMap）。因此，即使一个平面使用了带透明通道的PNG，在阴影计算中，它仍然是一个完整的矩形，投射出的阴影也是矩形。</div>
<h2>
   问题1：一个带透明纹理（如树叶、栅栏）的平面，投射出的阴影是完整的方形。
</h2>
<div>解决方法:使用 alphaTest 属性。它设置一个透明度阈值（0-1），让阴影贴图在渲染时丢弃掉透明度低于该阈值的像素。</div>
      <CodeBlock :code="yytm" language="javascript" :show-run="true" @run="executeCode" />
<h2> 阴影边缘出现条纹或锯齿</h2>
<div>解决方法:调整光源的 shadow.bias 属性。这是一个微小的偏移值，用于解决阴影贴图的深度冲突。</div>
      <CodeBlock :code="tw" language="javascript" :show-run="true" @run="executeCode" />

    </div>
    </template>
    <script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';
const hjg = `
//添加环境光
const ambinetlight = new THREE.AmbientLight(0xffffff, 0.1) // 颜色，强度
//添加到场景
scene.add(ambinetlight) 
`
const pxg = `
//添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1)  // 颜色，强度
//设置光源位置
directionalLight.position.set(0,20,0)   //默认朝原点打光
//设置打光位置
directionalLight.target.position.set(10,10,0)
//添加平行光辅助器
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)

//添加到场景
scene.add(directionalLight) 

scene.add(directionalLightHelper) 
`
const frist =`
renderer.shadowMap.enabled = true;
`
const second = `
directionalLight.castShadow = true;
`
const third = `
//创建一个球
const spher = new THREE.Mesh(
  new THREE.SphereGeometry(1,30,30),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })

)
// 让物体投射阴影
spher.castShadow = true;
// 让物体接收阴影
spher.receiveShadow = true;
// 让地面等平面接收阴影
planGeometry.receiveShadow = true;
`
const jgd = `
//设置聚光灯
const spotLight = new THREE.SpotLight(0xffffff,0.8)
//设置聚光灯位置
spotLight.position.set(0,10,0)
//设置聚光灯朝向
spotLight.target.position.set(0,0,0)
//设置聚光灯辅助器
const spotLightHelper  = new THREE.SpotLightHelper(spotLight)
//设置聚光灯角度
spotLight.angle = Math.PI / 8
//设置聚光灯距离
spotLight.distance = 20
//设置聚光灯半衰减设置
spotLight.penumbra = 0.5 // 默认为0
//设置聚光灯衰减速度
spotLight.decay = 8 //默认为2 ，，单位平方

//设置阴影纹理大小
directionalLight.shadow.mapSize.width = 2024
directionalLight.shadow.mapSize.height = 2024 
scene.add(spotLight)
scene.add(spotLightHelper)
`
const dgy = `
//设置点光源
const PointLight = new THREE.PointLight(0xffffff,0.8)
//设置点光源位置
PointLight.position.set(0,10,0)
//设置点光源辅助器
const PointLightHelper  = new THREE.PointLightHelper(PointLight)
//设置点光源距离
PointLight.distance = 20
//设置点光源衰减速度
PointLight.decay = 8 //默认为2 ，，单位平方
scene.add(PointLight)
scene.add(PointLightHelper)

`
const scope = `
//设置阴影范围
directionalLight.shadow.camera.left = -10
directionalLight.shadow.camera.right = -10
directionalLight.shadow.camera.top = -10
directionalLight.shadow.camera.bottom = -10
//设置阴影纹理大小
directionalLight.shadow.mapSize.width = 2024
directionalLight.shadow.mapSize.height = 2024
//设置阴影偏移
directionalLight.shdow.bias = -0.01
`
const yytm = `
const material = new THREE.MeshStandardMaterial({
    map: yourTexture, // 你的透明纹理
    alphaTest: 0.5,   // 关键！透明度大于0.5的部分才投射阴影
    transparent: true // 需要开启
});
`
const tw = `
directionalLight.shadow.bias = -0.0005; // 或 0.0001，需要根据场景微调[reference:13][reference:14]
`
const executeCode = () => {
  
}
</script>


 <!-- <div>
        <span style="font-weight: 700;"></span>
     </div> -->