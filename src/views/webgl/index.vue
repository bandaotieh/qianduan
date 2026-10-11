<template>
  <div style="line-height: 5vh;padding: 2vh 2vw;">
    <h2>
      什么是WEBGL
    </h2>
    <div>WebGL（全写Web Graphics h2brary）是一种3D绘图协议，这种绘图技术标准允许把JavaScript和OpenGL ES 2.0结合在一起，通过增加OpenGL ES 2.0的一个JavaScript绑定，WebGL可以为HTML5 Canvas提供硬件3D加速渲染，这样Web开发人员就可以借助系统显卡来在浏览器里更流畅地展示3D场景和模型了，还能创建复杂的导航和数据视觉化。显然，WebGL技术标准免去了开发网页专用渲染插件的麻烦，可被用于创建具有复杂3D结构的网站页面，甚至可以用来设计3D网页游戏等等。</div>
    <h2>核心概念</h2>
    <div >
      <span style="font-weight: 600;">JavaScript 与 GPU 的桥梁</span>
      WebGL 本质上不是一个独立的语言，而是一个接口层。JavaScript 本身没有直接操作 GPU 的能力，WebGL 充当了两者之间的“调度员”和“翻译官”，将 JS 的指令转换为系统底层的图形接口（如 Direct3D、Metal 或 OpenGL），从而驱动 GPU 工作。
    </div>
    <div >
      <span style="font-weight: 600;">基于 Canvas 元素</span>
      WebGL 深度集成于 HTML5 的 canvas  元素中。它作为 Canvas 的一种特殊渲染上下文（Context）存在，能够与网页中的其他 DOM 元素无缝合成。
    </div>
    <div >
      <span style="font-weight: 600;">可编程渲染管线</span>
      与传统 Canvas 2D 的“黑盒”绘制不同，WebGL 强制采用可编程管线。开发者必须使用 GLSL（OpenGL 着色语言）编写运行在 GPU 上的小程序（即着色器 Shader），来完全接管图形的顶点变换和像素着色过程。
    </div>
    <h2>
      WebGL 渲染管线是怎样的
    </h2>
    <div>
      渲染管线，其实就是图形的渲染过程。<br>
渲染管线主要包括两个功能：一是将物体 3D 坐标转变为屏幕空间 2D 坐标，二是为屏幕每个像素点进行着色，渲染管线的一般流程如下图所示，分别是：顶点处理、裁剪和图元组装、光栅化、处理。
    </div>
    <img src="../../assets/webgl/xrgx.png" alt="xrgx">
    <div>顶点处理是针对存储于顶点缓冲区的各个输入顶点进行操作，此阶段为可编程状态。主要的操作是对顶点进行坐标转换，把对象由其所定义的坐标系下的表示，转化为照相机下的坐标系。</div>
    <img src="../../assets/webgl/dd.png" alt="dd">
    <div>
      在顶点处理完之后，就需要将顶点组合成一个个单元，这个单元就是我们的图元。这一步就是组装，将顶点组合成一个个单元，如点，线，三角形。<br>
裁剪则是指将视口以外的对象进行裁剪，这个对象也就是片元。这一步涉及到两个概念，一个是裁剪坐标系，一个是片元。我们后面都会详细说到。
    </div>
    <img src="../../assets/webgl/py.png" alt="py">
<div>
  完成图元组装和裁剪后，下一步是光栅化。光栅化是将几何图元转化为图像的过程。它决定窗口坐标中哪些整型栅格区被基本图元占用，并分配色值和深度值到对应区域。光栅化主要目的是为了将图元组装和裁剪之后的图元数据转化生成帧缓存中的像素。但是光栅化处理完之后，我们并没有直接得到像素，而是得到了片元。<br>
这里我们就可以解释一下什么是片元。片元是一个像素大小的基本单位，但是它并非像素，而是像素的前身。片元相比于像素，除了 RGBA 之外，还会包含如深度值，法线，纹理坐标等信息。为了得到我们期望的像素，最后一步，就是对片元进行处理。
</div>
    <img src="../../assets/webgl/py1.png" alt="py">
    <div>片元处理，主要是通过片元着色器，计算片元的最终颜色和深度。由于可能同时会有多个片元争夺一个像素，需要通过深度和模板测试后来判断当前片元是否可见，并决定是否要绘制到帧缓存中。通过筛选出合适片元，再去除法线，纹理坐标等不重要的信息后，生成像素。</div>
    <img src="../../assets/webgl/py2.png" alt="py">
<div>整个渲染管线流程到这里就结束了。</div>
<h2>渲染流程</h2>
<div>大致分为以下流程</div>
<div>
  <span style="font-weight: 600;">1.JS/CPU 侧准备:</span>
  <ul>
    <h2>获取 WebGL 上下文</h2>
        <CodeBlock :code="context" language="javascript" :show-run="true" @run="executeCode" />

    <h2>编写并编译着色器</h2>
    <div>WebGL 必须使用 GLSL 着色器：
<span style="font-weight: 600;font-size: 1.5vw;">顶点着色器：</span>
处理每个顶点，必须输出 gl_Position
<span style="font-weight: 600;font-size: 1.5vw;">片元着色器：</span>

处理每个片元，输出颜色

</div>
    <h2>准备顶点数据</h2>
    <div>把顶点位置、法线、UV、颜色等放入 GPU 缓冲区：</div>
        <CodeBlock :code="dd" language="javascript" :show-run="true" @run="executeCode" />
        <div> 像GPU 解释这些数据：</div>
        <CodeBlock :code="dd1" language="javascript" :show-run="true" @run="executeCode" />

    <h2>准备纹理、uniform、状态</h2>
    <div>
<span style="font-weight: 600;font-size: 1.5vw;">纹理：</span>
      createTexture、texImage2D、设置过滤和包裹方式
<span style="font-weight: 600;font-size: 1.5vw;">uniform：</span>

矩阵、时间、光照参数等
<span style="font-weight: 600;font-size: 1.5vw;">状态：</span>

深度测试、背面剔除、混合等</div>
  </ul>
 
</div>
<div>
  <h2>2. GPU 侧渲染管线:</h2>
  <h3>顶点着色器:处理顶点坐标、法线等。</h3>
  <div>顶点着色器程序用来描述顶点需要执行的模型变换、视变换、投影变换处理的顶点着色器程序源代码/可执行文件。可以作为顶点着色器的输入有：</div>
  <div >● 用 attribute 修饰的属性, 可以传递顶点数据、纹理坐标等。 
● 用 uniform 修饰的属性, 可以传递变换矩阵等。 <br>
顶点着色器常见的输出有: <br>
● gl_Position, 将变换后的顶点数据进行输出。
● gl_PointSize, 设置点的大小。 <br>
在顶点着色器进行的业务处理有： <br>
● 矩阵变换的计算 
● 计算光照公式生成逐顶点颜色 
● 生成/变换纹理坐标</div>
  <h2>图元装配：将顶点组装成三角形/线段。</h2>
  <div>
    根据绘制模式，把顶点组装成：

●点

●线段

●三角形 ..

WebGL 最常用的是 gl.TRIANGLES。
  </div>
  <h2>裁剪与视口变换：视锥体裁剪、透视除法（NDC）、视口映射。</h2>
  <div>GPU 会裁剪掉视锥体外的部分。

然后执行透视除法：</div>
        <CodeBlock :code="caijian" language="javascript" :show-run="true" @run="executeCode" />
<div>得到标准化设备坐标 NDC，范围通常是 [-1, 1]。</div>
  <h2>背面剔除:根据三角形绕序（顺时针/逆时针）决定是否丢弃，这是光栅化前的优化。</h2>
<div></div>
  <h2>光栅化：将图元转换为片元（候选像素）。</h2>
  <div>把三角形等图元转换成一个个片元，也就是“候选像素”。

同时，顶点着色器输出的 varying 会在这里插值，例如 UV、法线、颜色。</div>
  <h2>多重采样操作：如果是 MSAA，在这里进行采样覆盖和抗锯齿处理。</h2>

  <h2>裁剪测试：限制绘制矩形区域，区域外的片元直接丢弃。</h2>

  <h2>片元着色器：计算每个片元的最终颜色（纹理采样、光照计算等）。</h2>
  <div>片元着色器程序是用来描述片段上执行操作(如颜色混合)的片元着色器程序源代码/可执行文件。 <br>
在片元着色器中的输入有： <br>
● 在光栅化阶段通过插值为每个片段生成的纹理坐标。
● 用 uniform 修饰的属性, 可以传递在片元着色器需要使用的数据等。
● 用 sampler2D 修饰的属性, 传递纹理对象，实际上传递的是对应的纹理单元(texture unit)索引号。
片元着色器的常用输出： <br>
● gl_FragColor 输出每个片段的颜色。
在片元着色器的业务处理有：
● 计算颜色
● 获取纹素
● 往像素点中填充颜色值 <br>
它可以用于图片/视频中每个像素的颜色填充</div>7
  <h2>模板测试：</h2>
  <div>根据模板缓冲决定片元是否通过。</div>
  <h2>深度测试：</h2>
  <div>根据深度缓冲决定片元是否被遮挡。</div>
  <h2>融合：</h2>
  <div>将片元颜色与帧缓冲中已有的颜色混合（处理透明度）。</div>

  <h2>缓存：</h2>
  <div>最终写入颜色缓冲、深度缓冲，浏览器随后合成到屏幕上。</div>

 <img src="../../assets/webgl/webgl.png" alt="webgl">
</div>
<div></div>
  </div>
</template>

<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';
const context = `
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
`
const dd  =`
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
`
const dd1 = `
const loc = gl.getAttribLocation(program, 'aPosition');
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
`
const caijian =`
NDC = gl_Position.xyz / gl_Position.w
`

const executeCode = () => {
}
</script>

