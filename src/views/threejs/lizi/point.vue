<template>]
    <div style="line-height: 5vh;padding: 3vw;">
        <h2>points与点材质</h2>
        <h3>核心概念</h3>
        <div>
            <span style="font-weight: 700;">THREE.Points（点模型）：</span>
            与网格模型（Mesh）使用三角形面渲染不同，点模型是将几何体（BufferGeometry）中的每一个顶点渲染为一个独立的、面向相机的方形区域（点）。<br>
            <span style="font-weight: 700;">THREE.PointsMaterial（点材质）：</span>专门用于控制这些点的外观，包括大小、颜色、纹理以及透视效果等。
        </div>
        <h3>常用属性</h3>
        <div>
            <span style="font-weight: 700;"> 点的大小（Size）:</span>
            控制点的大小，默认为1<br>
            <span style="font-weight: 700;">相机深度衰减（Size Attenuation）:</span>
            默认为true，PointsMaterial 会开启透视衰减（近大远小）。
        </div>
        <h3>
            设置纹理贴图时常用属性
        </h3>
        <div>
            <span style="font-weight: 700;"> map:</span>指定粒子的颜色贴图（Texture）。默认情况下粒子是方形的，通过加载一张带有透明背景的圆形贴图（如 PNG 格式），可以让粒子变成光点或雪花形状。 <br>
            <span style="font-weight: 700;"> transparent:</span> 必须设置为 true。如果你的贴图包含透明通道（Alpha 通道），不打开这个属性，透明区域会显示为黑色或白色背景。<br>
            <span style="font-weight: 700;">alphaMap :</span>透明度贴图。如果不想使用带透明通道的 PNG，也可以加载一张灰度图作为 alphaMap（白色代表不透明，黑色代表透明），它专门用来控制粒子的形状和边缘透明度。 <br>
            <span style="font-weight: 700;">blending :</span>混合模式。通常设置为 THREE.AdditiveBlending（叠加混合）。多个粒子重叠的地方颜色会相加，天然模拟出明亮的发光效果。 <br>
            <span style="font-weight: 700;">depthWrite :</span>深度写入。必须设置为 false。关闭它可以避免前面的粒子遮挡后面的粒子，解决粒子之间出现生硬黑边或闪烁的问题。 <br>

        </div>
        <CodeBlock :code="points" language="javascript" :show-run="true" @run="executeCode" />

    </div>
</template>
<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';

const points = `
//创建球体
  const planGemo = new THREE.SphereGeometry(1,20,20)
  const planmaterial = new THREE.PointsMaterial({  //设置点材质
     color: 0xff33ff, 
     size: 10,               //点的大小
     sizeAttenuation: false  //相机深度衰减  默认为true
     });
  cube = new THREE.Points(planGemo, planmaterial);
  scene.add(cube)
`
const executeCode = () => {
}
</script>