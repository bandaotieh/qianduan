<template>
    <div style="line-height: 5vh;padding: 2vh 5vw;">
    <h1>深度模式</h1>
   <h2>1.深度测试</h2>
   <div>
    <span style="font-weight: 600;">本质：</span>
    决定一个像素是否应该被绘制的“门槛”。
   </div>
   <div>深度测试(depthTest)用于影响渲染顺序，即在多个对象之间如何确定哪一个先被渲染。它默认为true，表示启用深度测试，即在渲染材质之前，先将深度缓冲区中的值与当前像素的深度值进行比较，只有当当前像素的深度值小于深度缓冲区中的值时，才能进行渲染。相反，如果当前像素的深度值大于深度缓冲区中的值，那么该像素就会被丢弃，不会被渲染。深度测试主要用于限制后续渲染的可见范围，避免被覆盖或遮挡。</div>
   <h2>2.深度写入</h2>
     <div>
    <span style="font-weight: 600;">本质：</span>
    决定一个像素在绘制完成后，是否将自己的深度值更新到深度缓冲区。
   </div>
    <div>深度写入(depthWrite)用于决定当前材质是否能够更改深度缓冲区中的值，它的默认值为true，即渲染此材质时对深度缓冲区有任何影响。如果设为false，则当前材质将不会对深度缓冲区有任何影响。这在绘制2D叠加时会很有用，可以将多个物体分层在一起而不创建z-index。</div>
   <h2>3.渲染顺序</h2>
    <div>
    <span style="font-weight: 600;">本质：</span>
    决定物体绘制的先后次序。
   </div>
   <div>
    Three.js 有一套自己的排序逻辑：

先画所有不透明物体。

再画所有透明物体。

对于透明物体，默认按物体中心到相机的距离，从远到近排序。

手动控制 (renderOrder)：可通过 renderOrder 属性强制执行绘制顺序。

数值越小，越先绘制。

常用于强制让某些物体最后绘制，如 label.renderOrder = 999。也可以用于解决同一层级内多个透明物体的排序问题。
   </div>
    <CodeBlock :code="Physical" language="javascript" :show-run="true" @run="executeCode" />
    <h1>混合模式 </h1>
    <div>Three.js 的材质混合模式（Blending Mode） 定义了当前物体（源）的颜色如何与屏幕上已有的颜色（目标）进行叠加混合</div>
    <h2>核心公式</h2>
    <div>混合颜色 = 源颜色 × 源因子 + 目标颜色 × 目标因子</div>
    <div>
        <span style="font-weight: 600;">源颜色</span><br>
        当前材质正要绘制的像素颜色。 <br>
        <span style="font-weight: 600;">源因子</span><br>
        当前材质透明度
        <br>
        <span style="font-weight: 600;">目标颜色</span><br> 
        该像素位置已经存在于颜色缓冲区中的颜色。
        <br>
        <span style="font-weight: 600;">目标因子</span><br>
1减去当前源颜色材质透明度

    </div>
    <div>Three.js 提供了六种内置混合模式，通过材质的 blending 属性来设置</div>
    <img src="../../../assets/three/hunhe.png" alt="hunhe">
    <h2>其他相关属性</h2>
    <div style="font-weight: 600;">1.blendDst</div>
<div>
blendDst是混合目标，它定义了混合中目标的因子，控制目标颜色和最终颜色的比例关系。默认值为OneMinusSrcAlphaFactor。在自定义混合时，必须将材质的blending设置为CustomBlending才能生效。常用的目标因子有：ZeroFactor、OneFactor、SrcColorFactor、OneMinusSrcColorFactor、SrcAlphaFactor、OneMinusSrcAlphaFactor、DstAlphaFactor、OneMinusDstAlphaFactor、DstColorFactor、OneMinusDstColorFactor。
</div>
    <div style="font-weight: 600;">2.blendDstAlpha</div>
<div>
blendDstAlpha指定了目标的透明度因子，即控制目标透明度和最终透明度的比例关系。默认值为null。
</div>

    <div style="font-weight: 600;">3.blendEquation</div>
<div>
blendEquation是混合方程式，通过该属性我们可以自定义混合的方式。在使用混合时采用的方程式必须要在使用它的材质中设置CustomBlending。混合方程式常用的取值有：AddEquation、SubtractEquation、ReverseSubtractEquation、MinEquation、MaxEquation。
</div>

    <div style="font-weight: 600;">4.blendEquationAlpha</div>
<div>
blendEquationAlpha是混合方程式中控制透明度的部分，它的默认值为null。
</div>

    <div style="font-weight: 600;">5.blending</div>
<div>
blending属性是在使用此材质显示对象时要使用何种混合，它控制了物体在场景中的透明度和半透明度。必须将其设置为CustomBlending才能使用自定义blendSrc、blendDst或者blendEquation。混合模式所有可能的取值请参阅constants。默认值为NormalBlending。
</div>

    <div style="font-weight: 600;">6.blendSrc</div>
<div>
blendSrc是混合源，它定义了混合中源颜色的因子，控制源颜色和最终颜色的比例关系。默认值为SrcAlphaFactor。常用的源因子有：ZeroFactor、OneFactor、SrcColorFactor、OneMinusSrcColorFactor、SrcAlphaFactor、OneMinusSrcAlphaFactor、DstAlphaFactor、OneMinusDstAlphaFactor、DstColorFactor、OneMinusDstColorFactor。
</div>

    <div style="font-weight: 600;">7.blendSrcAlpha</div>
<div>
blendSrcAlpha指定了源的透明度因子，即控制源透明度和最终透明度的比例关系。默认值为null。
</div>



</div>
    </template>
    <script setup lang="ts">
    import CodeBlock from '~/components/CodeBlock .vue';

    const Physical = `
// 创建一个简单的盒子模型
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// 创建一个基础材质
var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
// 设置深度函数为AlwaysDepth，深度测试禁用，深度写入也禁用
material.depthFunc = THREE.AlwaysDepth;
material.depthTest = false;
material.depthWrite = false;

var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
-------渲染顺序---------------
// 创建两个立方体
const cubeA = new THREE.Mesh(geometry, materialA);
cubeA.renderOrder = 1; // 后渲染

const cubeB = new THREE.Mesh(geometry, materialB);
cubeB.renderOrder = 0; // 先渲染

scene.add(cubeA);
scene.add(cubeB);
`
const executeCode = () => {
}
</script>