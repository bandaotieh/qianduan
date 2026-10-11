<template>
    <div style="line-height: 5vh;">
        <div>GSAP（GreenSock Animation Platform） 是一个高性能、与框架无关的 JavaScript 动画库。它可以用来制作任何 JavaScript 能够触及的内容的动画，包括 CSS、SVG、Canvas、React、Vue、WebGL、颜色、字符串、运动路径、通用对象等。</div>
        <div>GSAP 提供了四种基本的 Tween 方法</div>
        <img src="../../../assets/three/gsap.png" alt="gsap">
<h2>1.使用方法</h2>
      <CodeBlock :code="npm" language="javascript" :show-run="true" @run="executeCode" />
<h2>基础属性</h2>
      <CodeBlock :code="shili" language="javascript" :show-run="true" @run="executeCode" />

    </div>
    </template>
    <script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';
const npm =`
//安装
 npm i Gsap
 //导入动画库
    import gsap from 'gsap';
    


`
const shili = `
//创建一个球
const spher = new THREE.Mesh(
  new THREE.SphereGeometry(1,30,30),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })

)
//创建动画
const animate1 = gsap.to(spher.position,{ 
  x: 5,      // 在x轴运动   duration
  duration: 5 ,  //    duration 动画持续时间  
   ease: 'power1.inOut',//  ease 动画运动速率
   onComplete: () => {
    console.log('动画完成回调函数');
    
   },
   onStart:() => {
    console.log('动画开始回调函数');

   },
   repeat: -1,  // 动画重复次数  无限循环 -1
   yoyo: true,  //设置往返效果
  delay :2 ,  //设置延迟运动   2s
  })  

gsap.to(spher.rotation,{ x: 2* Math.PI, duration: 5})    // 在x轴旋转   duration 动画持续时间

//通过监听可暂停动画
window.addEventListener('dblclick', () =>{
  if (animate1.isActive()) {
  animate1.pause()   //暂停动画
    
  } else {
  animate1.resume()   //恢复动画

  }
})

`
const executeCode = () => {
  
}
</script>