<template>
  <section class="threejs-demo-page">
    <h1>物体的缩放与旋转</h1>
    <h2>1.缩放</h2>
    <div>因为物体的scale属性是vector3对象，因此按照vector的属性和方法，设置x/y/z轴方向的缩放大小。</div>
         <img src="../../../assets/three/suofang.png" alt="suofang" style="zoom:100%;">
      <CodeBlock :code="diama" language="javascript" :show-run="true" @run="executeCode" />
      <div>
        <span style="font-weight: 600;">注意：</span>
        子元素是根据父元素进行缩放，假如父元素缩放两倍，子元素缩放两倍，那么子元素是原来大小的四倍。
      </div>
    <h2>2.旋转</h2>
    <div>因为的旋转通过设置rotation属性，该属性是Euler(欧拉角)类的实例，因此可以通过Euler类的方法进行设置旋转角度。</div>
    <div>欧拉角描述一个旋转变换，通过指定轴顺序和各个轴上的指定旋转角度来旋转一个物体</div>
    <div>对Euler实例进行遍历将按相应的顺序生成它的分量（x,y,z,order）</div>
         <img src="../../../assets/three/rota.png" alt="rota" style="zoom:100%;">
         <div>因为是局部旋转，所以也受父元素影响，父元素旋转45°，子元素旋转45°，相当于子元素旋转90°。</div>
      <CodeBlock :code="fudiama" language="javascript" :show-run="true" @run="executeCode" />
<div>set方法，每个参数具体定义 <br>
.set ( x : Float, y : Float, z : Float, order : String ) : this<br>
x - 用弧度表示x轴旋转量。<br>
y - 用弧度表示y轴旋转量。<br>
z - 用弧度表示z轴旋转量。<br>
order - (optional) 表示旋转顺序的字符串。</div>
    <h3>实现一个简单的旋转动画</h3>
    <div>每一帧旋转弧度制的0.01角度。</div>
      <CodeBlock :code="xuanzhan" language="javascript" :show-run="true" @run="executeCode" />

  </section>
</template>
<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';
//组件逻辑----------------------------------------

const diama = (`  
 //例如设置x轴放大3倍、y轴方向放大2倍、z轴方向不变
cube.scale.set(3, 2, 1);
//单独设置某个轴的缩放
cube.scale.x = 3
`);
const fudiama = (`
//直接设置旋转属性，例如围绕x轴旋转90度
cube.rotation.x = -Math.PI/2

//围绕x轴旋转45度
cube.rotation.set(-Math.PI / 4, 0, 0, "XZY");

`)
const xuanzhan = (`
function render() {
  cube.position.x += 0.01;
  cube.rotation.x += 0.01;
  if (cube.position.x > 5) {
    cube.position.x = 0;
  }
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}
`)
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
}
</script>
<style scoped>
.threejs-demo-page { padding: 24px; line-height: 4vh; overflow: auto;}
</style>
