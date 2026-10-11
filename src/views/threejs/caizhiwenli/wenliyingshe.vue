<template>
    <div style="line-height: 5vh; text-align: left;padding: 3vh;">
        <h2  style="text-align: center;">纹理映射之放大过滤和缩小过滤</h2>
        <div>
            <span style="font-weight: 800;">放大过滤 (magFilter)：</span>
            当纹理图像小于屏幕上要显示的区域时，一个纹理像素（texel）需要覆盖多个屏幕像素。此时，magFilter 负责决定如何“拉伸”纹理。
        </div>
        <div style="font-weight: 800;">magFilter属性的常见取值包括：</div>
        <div>1. THREE.NearestFilter：这种方式采用的是"最近邻"过滤，即选择最接近所需像素中心的纹理像素的颜色。这种方式速度快，但放大后的纹理可能会看起来有点像马赛克，尤其是在纹理映射到的区域远大于纹理本身的大小时。<br>
2. THREE.LinearFilter：这种方式采用的是"线性"过滤，即从最接近所需像素的四个纹理像素中采样颜色，并根据距离进行线性插值。这种方式稍慢一些，但放大后的纹理看起来会更平滑，尤其是在纹理被映射到更大区域时。</div>
        <div>
            <span style="font-weight: 800;">缩小过滤 (minFilter)：</span>
            当纹理图像大于屏幕上要显示的区域时，多个纹理像素需要被映射到同一个屏幕像素上。此时，minFilter 负责决定如何“压缩”纹理。
        </div>
        <div style="font-weight: 800;">minFilter属性的常见取值包括：</div>
        <div>  
1. THREE.NearestFilter：这种方式采用的是"最近邻"过滤，即选择最接近所需像素中心的纹理像素的颜色。这种方式速度快，但缩小后的纹理可能会显得比较粗糙。
2. THREE.LinearFilter：这种方式采用的是"线性"过滤，即从最接近所需像素的四个纹理像素中采样颜色，并根据距离进行线性插值。这种方式稍慢一些，但缩小后的纹理看起来会更平滑。
</div>
      <CodeBlock :code="map" language="javascript" :show-run="true" @run="executeCode" />

<h2>Mipmap的过滤方式</h2>
<div>因为缩小纹理时，信息丢失严重，容易产生“闪烁”或“摩尔纹”。因此，Three.js 为 minFilter 提供了更多利用 Mipmap（一种由一系列逐级缩小的纹理组成的链） </div>
<div>
    <span style="font-weight: 800;">基本思想:</span>
    对于每个纹理，生成一系列降低分辨率的副本，称为"mipmap"。在运行时，图形引擎将选择最接近所需分辨率的mipmap用于纹理采样。这意味着在远离观察者的地方，将使用更低分辨率的纹理，而在离观察者更近的地方，将使用更高分辨率的纹理。这种方法可以减少别名现象，提高渲染效率。
</div>
<div>
    <span style="font-weight: 800;">注意:</span>
    如果正在使用一个mipmap，那么纹理的宽度和高度都需要是2的幂。此外，当您使用mipmaps时，Three.js将自动设置纹理的minFilter属性为THREE.LinearMipmapLinearFilter或者THREE.NearestMipmapNearestFilter（取决于你的配置），这些都是使用mipmap的过滤方式。
</div>
    </div>
<img src="../../../assets/three/mipmap.png" alt="mipmap" style="zoom: 100%;">

<h2>anisotropy属性</h2>
<div>当纹理表面与视角成一个倾斜角度（比如看地面或墙壁远处）时，一个屏幕像素对应到纹理上不再是一个正方形，而是一个梯形或不规则的长方形。标准的 Mipmap 只能使用正方形区域进行采样，这会导致采样区域包含了过多无关的纹理像素，从而产生模糊和细节丢失/</div>
<div>而各向异性过滤在处理时，会考虑这个梯形的形状，在纹理的一个主要方向上进行多次采样。anisotropy 属性的值，就代表了这个采样次数</div>
<div>
    anisotropy = 1 (默认值)：关闭各向异性过滤，使用标准的 Mipmap。
anisotropy > 1：开启各向异性过滤。值越高，采样次数越多，倾斜表面的纹理就越清晰。
</div>
<div>各向异性过滤程度的最大值受到具体硬件的限制。可以通过调用renderer.capabilities.getMaxAnisotropy()来查询GPU支持的最大各向异性过滤程度。这个值通常是2的幂，例如2、4、8、16等。</div>
      <CodeBlock :code="anisotropy" language="javascript" :show-run="true" @run="executeCode" />

    </template>
    <script setup lang="ts">
          import CodeBlock from '~/components/CodeBlock .vue';
          const map =`
            // 创建纹理加载器
  const textureLoader = new THREE.TextureLoader();
  //加载纹理
  const texture = textureLoader.load('/1.png')
//改变放大过滤模式
 texture.magFilter =  THREE.NearestFilter;
//改变缩小过滤模式
 texture.minFilter =  THREE.NearestFilter;

          `
           const anisotropy =`
           // 创建纹理加载器
  const textureLoader = new THREE.TextureLoader();
  //加载纹理
  const texture = textureLoader.load('/1.png')
  texture.anisotropy = 16; 
          `
const executeCode = () => {
}
</script>