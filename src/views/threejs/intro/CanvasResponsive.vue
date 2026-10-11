<template>
  <section class="threejs-demo-page">
    <h1>场景线性雾和指数雾</h1>
    <h2>线性雾</h2>
    <div>在Three.js中，Fog类是用于创建线性雾的效果。雾效果常用于模拟真实世界中视觉深度递减的效果，也可以用于创建某些艺术效果。当物体距离观察者越远，雾就越密，物体的颜色就越接近雾的颜色。</div>
    <div>使用方式：</div>
      <CodeBlock :code="fog" language="javascript" :show-run="true" @run="executeCode" />
<div>在上述代码示例中，我们首先创建了一个新的场景。然后，我们将场景的 fog 属性设置为一个新的 Fog 对象。Fog 的构造函数接收三个参数：</div>
<div style="line-height: 7vh;">1. color：这是雾的颜色。可以是一个十六进制的整数，或者一个 CSS 样式的字符串。在上述代码示例中，我们使用了十六进制的灰色。<br>
2. near：这是雾开始的距离。在这个距离之内，物体的颜色不受雾的影响。<br>
3. far：这是雾结束的距离。在这个距离之外，物体的颜色完全被雾的颜色覆盖</div>
<div>注意事项：</div>
<div style="line-height: 7vh;">1. 雾效果是通过修改物体的颜色来实现的。因此，如果一个物体的材质不包含颜色信息（例如，一个纯粹的反射材质），那么雾效果可能不会对这个物体产生任何影响。<br>
2. 在一些复杂的场景中，雾效果可能会对性能产生影响。这是因为雾效果需要在每个像素处进行计算。如果场景中包含大量的几何体或复杂的材质，那么雾效果可能会导致渲染速度变慢。<br>
3. 雾效果并不会阻止物体的渲染。也就是说，即使一个物体完全被雾覆盖，它仍然会被渲染。如果场景中包含大量的远离摄像机的物体，那么你可能需要使用其他的方法（例如，裁剪距离或物体级别的可见性控制）来优化渲染性能。
</div>
<h2>指数雾</h2>
<div>在Three.js中，FogExp2类用于创建指数平方雾效果。相比于线性雾（由 Fog 类创建），指数平方雾提供了一个近摄像机处视野清晰，但离摄像机越远，雾效果加强速度超过指数级增长的效果。它可以模拟一些特定环境下的视觉效果，例如雾天或者水下环境。</div>
    <div>使用方式：</div>
      <CodeBlock :code="fogexp" language="javascript" :show-run="true" @run="executeCode" />

<div>在上述代码示例中，我们首先创建了一个新的场景。然后，我们将场景的 fog 属性设置为一个新的 FogExp2 对象。FogExp2 的构造函数接收两个参数：</div>
<div style="line-height: 7vh;">
  1. color：这是雾的颜色。可以是一个十六进制的整数，或者一个 CSS 样式的字符串。在上述代码示例中，我们使用了十六进制的灰色。<br>
2. density：这是雾的密度。密度越大，雾效果越强。
</div>
<div>注意事项：</div>
<div style="line-height: 7vh;">
  1. FogExp2 创建的雾效果会随着距离的增加而快速增强，这可能会使远离摄像机的物体完全被雾覆盖。如果场景中包含重要的远离摄像机的物体，那么你可能需要调整雾的密度或者使用其他的雾类型。<br>
2. 雾效果是通过修改物体的颜色来实现的。因此，如果一个物体的材质不包含颜色信息（例如，一个纯粹的反射材质），那么雾效果可能不会对这个物体产生任何影响。<br>
3. 在一些复杂的场景中，雾效果可能会对性能产生影响。这是因为雾效果需要在每个像素处进行计算。如果场景中包含大量的几何体或复杂的材质，那么雾效果可能会导致渲染速度变慢。<br>
4. 雾效果并不会阻止物体的渲染。也就是说，即使一个物体完全被雾覆盖，它仍然会被渲染。如果场景中包含大量的远离摄像机的物体，那么你可能需要使用其他的方法（例如，裁剪距离或物体级别的可见性控制）来优化渲染性能。
</div>
  </section>
</template>
<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';
const fog = (`
const scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0xcccccc, 10, 15 );
`)
const fogexp = (`
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
`)
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
}

</script>
<style scoped>
.threejs-demo-page { padding: 24px; line-height: 5vh;}
</style>
