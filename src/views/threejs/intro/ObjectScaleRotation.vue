<template>
  <section class="threejs-demo-page">
    <h1>响应式画布与全屏控制</h1>
    <h2>响应式画布</h2>
      <CodeBlock :code="diama" language="javascript" :show-run="true" @run="executeCode" />
    <h2>全屏控制</h2>
      <CodeBlock :code="fudiama" language="javascript" :show-run="true" @run="executeCode" />
  
  </section>
</template>

<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';

//组件逻辑----------------------------------------

const diama = (`  
  // 读取容器当前的宽高
    const { clientWidth, clientHeight } = container
    // 如果渲染器或相机还没创建，或者容器尺寸为 0，就直接返回
    if (!renderer || !camera || !clientWidth || !clientHeight)
      return

    // 根据容器宽高更新相机宽高比，避免模型变形
    camera.aspect = clientWidth / clientHeight
    // 让相机投影矩阵更新
    camera.updateProjectionMatrix()
    // 更新渲染器画布尺寸
    renderer.setSize(clientWidth, clientHeight, false)
`);
const fudiama = (`
window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    //   双击控制屏幕进入全屏，退出全屏
    // 让画布对象全屏
    renderer.domElement.requestFullscreen();
  } else {
    //   退出全屏，使用document对象
    document.exitFullscreen();
  }
});
`)

const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
}
</script>
<style scoped>
.threejs-demo-page { padding: 24px; line-height: 4vh; }
</style>
