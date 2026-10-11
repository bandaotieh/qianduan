<template>
    <div style="line-height: 5vh;">
    <h2>Three.js 纹理源文件格式总览</h2>
    <img src="../../../assets/three/geshi.png" alt="geshi">
    <div>倾向于使用 webp   dds  KTX2 压缩情况比较好</div>
    <div>可使用NVIDIA_Texture_Tools软件导出优化压缩</div>
    <a href="https://docs.nvidia.com/texture-tools/index.html">下载链接</a>
    <div>当我们使用高动态范围(HDR)纹理文件时，需启用色调映射（Tone Mapping）和曝光（Exposure）</div>
    <h2>色调映射 (Tone Mapping)</h2>
    <div>在3D渲染中，场景的光照计算是在一个高动态范围（HDR） 空间里进行的，这意味着一个像素的亮度值可以远超1.0。但我们的屏幕（LDR）只能显示0到1之间的亮度值。
色调映射就是解决这个矛盾的“压缩”过程。它负责将HDR场景中丰富的明暗细节，映射到屏幕有限的亮度范围内，同时尽可能地保留亮部和暗部的细节。如果没有色调映射，场景要么暗部一片死黑，要么亮部一片惨白。</div>
    </div>
    <div>色调映射算法</div>
    <img src="../../../assets/three/sdys.png" alt="sdys">
    <h2>曝光 (Exposure)</h2>
    <div>曝光可以理解为对整个画面亮度的整体控制。它像一个全局的亮度旋钮，在你选定了色调映射算法后，用来调整画面的整体明暗。</div>
      <CodeBlock :code="Physical" language="javascript" :show-run="true" @run="executeCode" />

    </template>
    <script setup lang="ts">
    import CodeBlock from '~/components/CodeBlock .vue';

    const Physical = `
// 创建渲染器
const renderer = new THREE.WebGLRenderer();

// 1. 设置色彩空间 (推荐 sRGB)
renderer.outputColorSpace = THREE.SRGBColorSpace;

// 2. 选择色调映射算法
renderer.toneMapping = THREE.ACESFilmicToneMapping; // 推荐

// 3. 调整曝光值
renderer.toneMappingExposure = 1.0; // 默认值，根据场景调整
`
const executeCode = () => {
}
</script>