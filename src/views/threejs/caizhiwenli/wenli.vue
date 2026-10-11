<template>
    <div style="line-height: 5vh;">
        <h2>创建纹理</h2>
      <CodeBlock :code="cjwl" language="javascript" :show-run="true" @run="executeCode" />

        <h2>纹理重复</h2>
        <div>在 U 和 V 两个方向上，纹理在表面上重复的次数。如果任一方向上的重复次数设置为大于 1，则相应的“平铺”参数也应设置为THREE.RepeatWrapping或THREE.MirroredRepeatWrapping，以实现所需的平铺效果。</div>
        <div>纹理缩放也用repeat属性</div>
        <div>放大纹理：将 repeat 的值设置为小于 1 的正数（如 0.5），纹理在视觉上会被放大。</div>
        <div>将 repeat 的值设置为大于 1 的数（如 2），纹理在视觉上会被缩小并平铺。</div>
<div>拉伸效果：如果 U 和 V 方向的重复次数不同（例如 repeat.set(2, 1)），纹理会在水平方向被拉伸或压缩。</div>
      <CodeBlock :code="repect" language="javascript" :show-run="true" @run="executeCode" />
      <h2>镜像重复</h2>
      <CodeBlock :code="jxrepect" language="javascript" :show-run="true" @run="executeCode" />
        <h2>纹理旋转</h2>
        <div>纹理将围绕中心点旋转多少度，单位为弧度（rad）。正值为逆时针方向旋转，默认值为0。</div>
        <div><span style="font-weight: 800;">设置中心点：</span>
            旋转中心点。(0.5, 0.5)对应纹理的正中心。默认值为(0,0)，即左下角。
        </div>
      <CodeBlock :code="rota" language="javascript" :show-run="true" @run="executeCode" />

        <h2>纹理位移</h2>
        <div>贴图单次重复中的起始偏移量，分别代表U和V，一般范围0.0 —— 1.0</div>
      <CodeBlock :code="move" language="javascript" :show-run="true" @run="executeCode" />

        <h2>纹理纵向翻转</h2>
        <div>threejsz中纹理的 Y 轴坐标默认是上下颠倒的。</div>
      <CodeBlock :code="cf" language="javascript" :show-run="true" @run="executeCode" />
        <h2> 预乘 Alpha</h2>
<div>threejs中默认进行预乘</div>
<div>
    <span style="font-weight: 700;">未预乘:</span>
    颜色通道（RGB）和透明度（Alpha）是独立的。在渲染半透明边缘时，由于双线性过滤（Bilinear filtering）或 Mipmap 缩小，可能会将透明区域原本填充的背景色（如黑色或白色）混合进来，导致边缘出现难看的彩色光晕或黑边（Discoloured fringes）
</div>
<div>
    <span style="font-weight: 700;">预乘：</span>
    在上传 GPU 之前，将 RGB 颜色通道的值提前与 Alpha 通道的值相乘。这样处理后，完全透明区域的 RGB 值也会变为 0（即黑色），从而彻底消除边缘混合时产生的伪影，使透明边缘的过渡更加自然。
</div>
<div>
    <span style="font-weight: 700;">注意：贴图有透明情况效果才明显</span>

</div>
      <CodeBlock :code="Alpha" language="javascript" :show-run="true" @run="executeCode" />


</div>
    </template>
    <script setup lang="ts">
              import CodeBlock from '~/components/CodeBlock .vue';
              
              const cjwl = (`
 // 创建纹理加载器
  const textureLoader = new THREE.TextureLoader();
  //加载纹理
  const texture = textureLoader.load('/img.png')

`)
const repect = (`
//纹理重复
  texture.repeat.set(4,4)
  //设置水平重复
  texture.wrapS = THREE.RepeatWrapping
  //设置垂直重复

  texture.wrapT = THREE.RepeatWrapping
`)
const jxrepect = (`
//设置水平的重复方向为镜像重复
  texture.wrapS = THREE.MirroredRepeatWrapping

`)
const Alpha = `
// 开启预乘 Alpha
texture.premultiplyAlpha = true; 

// ⚠️ 关键注意：修改此属性后，必须手动触发纹理更新
texture.needsUpdate = true; 
`
const rota = `
//纹理旋转
  texture.rotation =  Math.PI /4

`
const move = `
//纹理偏移
  texture.offset.set(0.5,0.5)

`
const cf = `
//纹理翻转
  texture.flipY =  false

`
const executeCode = () => {
}
</script> 