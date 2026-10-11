<template>
  <section class="threejs-demo-page">
    <h1>tween补间动画</h1>
    <h2>使用方法</h2>
      <CodeBlock :code="anzhhuang" language="javascript" :show-run="true" @run="executeCode" />

    <h2>基础方法</h2>
    <h3>start(time)  </h3>
    <div>开始动画</div>
      <CodeBlock :code="start" language="javascript" :show-run="true" @run="executeCode" />
 <h3>stop()</h3>
    <div> 关闭正在执行的动画</div>
      <CodeBlock :code="stop" language="javascript" :show-run="true" @run="executeCode" />
       <h3>repeat(times)</h3>
    <div> 重复动画</div>
      <CodeBlock :code="repeat" language="javascript" :show-run="true" @run="executeCode" />
       <h3>chain()</h3>
    <div> 链式衔接两个动画，例如：一个动画tweenA在另一个动画tweenB结束后开始。可以通过chain方法来使实现。</div>
      <CodeBlock :code="chain" language="javascript" :show-run="true" @run="executeCode" />
       <h3>yoyo(boolean)</h3>
    <div>控制动画重复模式 , 只有在使用 repeat 时才有效 , 使动画像悠悠球一样来回运动 , 而不是重新开始,</div>
      <CodeBlock :code="yoyo" language="javascript" :show-run="true" @run="executeCode" />
       <h3>delay(time)</h3>
    <div> 动画延时</div>
      <CodeBlock :code="delay" language="javascript" :show-run="true" @run="executeCode" />
       <h3>pause()</h3>
    <div>暂停当前动画</div>
      <CodeBlock :code="pause" language="javascript" :show-run="true" @run="executeCode" />
       <h3>resume()</h3>
    <div>恢复被暂停的动画</div>
      <CodeBlock :code="resume" language="javascript" :show-run="true" @run="executeCode" />
       <h3>to()</h3>
    <div>控制动画的运动形式及方向, 当tween启动时，Tween.js将读取当前属性值并应用相对值来找出新的最终值，相对值必须使用引号，否则该值被视为绝对值</div>
      <CodeBlock :code="to" language="javascript" :show-run="true" @run="executeCode" />



    <h2>全局操作方法</h2>
 <h3>update(time)</h3>
    <div> 更新动画，一般配合window.requestAnimationFrame()使用</div>
      <CodeBlock :code="update" language="javascript" :show-run="true" @run="executeCode" />
       <h3>getAll()</h3>
    <div>获取所有tweens数组</div>
      <CodeBlock :code="getAll" language="javascript" :show-run="true" @run="executeCode" />
       <h3>removeAll()</h3>
    <div>  删除所有tweens数组</div>
      <CodeBlock :code="removeAll" language="javascript" :show-run="true" @run="executeCode" />
       <h3>add()</h3>
    <div>添加一个特定动画</div>
      <CodeBlock :code="add" language="javascript" :show-run="true" @run="executeCode" />
       <h3>remove()</h3>
    <div> 删除一个特定动画</div>
      <CodeBlock :code="remove" language="javascript" :show-run="true" @run="executeCode" />
       <h3>Group()</h3>
    <div>将动画进行分组，TWEEN.update()和TWEEN.removeAll() , 不会影响到已经分好组的动画</div>
      <CodeBlock :code="Group" language="javascript" :show-run="true" @run="executeCode" />
    <h2>回调函数</h2>
 <h3>onStart(callback)</h3>
    <div>  tween开始动画前的回调函数</div>
      <CodeBlock :code="onStart" language="javascript" :show-run="true" @run="executeCode" />
       <h3>onStop(callback)</h3>
    <div> tween结束动画后的回调函数</div>
      <CodeBlock :code="onStop" language="javascript" :show-run="true" @run="executeCode" />
       <h3>onUpdate(callback)</h3>
    <div>在tween每次被更新后执行</div>
      <CodeBlock :code="onUpdate" language="javascript" :show-run="true" @run="executeCode" />
       <h3>onComplete(callback)</h3>
    <div> 在tween动画全部结束后执行</div>
      <CodeBlock :code="onComplete" language="javascript" :show-run="true" @run="executeCode" />
    <h2>缓动函数</h2>
  <img src="../../../assets/three/tween.png" alt="tween">
  <h3>示例</h3>
      <CodeBlock :code="all" language="javascript" :show-run="true" @run="executeCode" />

  </section>
</template>

<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';

//组件逻辑----------------------------------------
const anzhhuang = `
//导入tween
import * as TWEEN  from 'three/examples/jsm/libs/tween.module.js'
//创建一个球
const spher = new THREE.Mesh(
  new THREE.SphereGeometry(1,30,30),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })

)
//创建一个补间   传入小球位置
const tween = new TWEEN.Tween(spher.position)
//第一个参数要去哪个位置  第二个参数要花费多长时间
tween.to({x:5},3000).onUpdate(() =>{
  // console.log(spher.position);
  
})
//设置循环次数   Infinity代表无数次
tween.repeat(Infinity)
//设置循环往复
tween.yoyo(true)
//延迟执行  等2秒在执行
tween.delay(2000) 
//设置缓动函数
tween.easing(TWEEN.Easing.Quadratic.InOut)
//停止动画
const stopAmin = {
  stop: () =>{
    tween.stop()
  }
}
//开始动画
const startAmin = {
  start: () =>{
    tween.start()
  }
}
`
const start = (`  
new TWEEN.Tween().start(time)
// 不加参数立即执行，加参数在特定时间执行
`);
const stop = (`  
new TWEEN.Tween().stop()
`);

const repeat = (`
new TWEEN.Tween().repeat(times)
// times 次数，表示这个动画重复多少次
`)
const chain = (`  
 tweenA.chain(tweenB);//单链接
 
//循环无限链接
tweenA.chain(tweenB);
tweenB.chain(tweenA);
 
//将多个动画链接到另一个动画，以使它们同时开始动画：
tweenA.chain(tweenB,tweenC);
`);
const yoyo = (`
new TWEEN.Tween().repeat(3)
new TWEEN.Tween().yoyo(true)
// 在repeat之后才能使用yoyo()
`)
const delay = (`
new TWEEN.Tween().delay(time)
// time为具体延时时间 单位ms

`)
const pause = (`
new TWEEN.Tween().pause()

`)
const resume = (`
new TWEEN.Tween().resume()

`)
const to = (`
new TWEEN.Tween().to() 

// 对象的属性x的值最后将变成100
var absoluteTween = new TWEEN.Tween(absoluteObj).to({ x: 100 }); 
absoluteTween.start(); 
 
 //对象的属性x的值最后会+100
var relativeTween = new TWEEN.Tween(relativeObj).to({ x: "+100" });
relativeTween.start(); 

`)
const update = (`
TWEEN.update()

`)
const getAll = (`
TWEEN.getAll()

`)
const removeAll = (`
TWEEN.removeAll()

`)
const add = (`
var tween = new TWEEN.Tween()
TWEEN.add(tween)

`)
const remove = (`
var tween = new TWEEN.Tween()
TWEEN.remove(tween)

`)
const Group = (`
//补间组
var groupA = new TWEEN.Group();
var groupB = new TWEEN.Group();
 
var tweenA = new TWEEN.Tween({ x: 1 }, groupA)
 .to({ x: 10 }, 100)
 .start();
 
var tweenB = new TWEEN.Tween({ x: 1 }, groupB)
 .to({ x: 10 }, 100)
 .start();
 
var tweenC = new TWEEN.Tween({ x: 1 })
 .to({ x: 10 }, 100)
 .start();
 
groupA.update(); // 只更新tweenA
groupB.update(); // 只更新tweenB
TWEEN.update(); // 只更新tweenC
 
groupA.removeAll(); // 只移除tweenA
groupB.removeAll(); // 只移除tweenB
TWEEN.removeAll(); // 只移除tweenC

`)
const onStart = (`
new TWEEN.Tween().onStart((obj)=>{})
// 动画开始时执行,只执行一次

`)
const onStop = (`
new TWEEN.Tween().onStop((obj)=>{}) 
`)
const onUpdate = (`
new TWEEN.Tween().onUpdate((obj)=>{})
// 返回实际更新后的值

`)
const onComplete = (`
new TWEEN.Tween().onComplete((obj)=>{})

`)
const all = (`
//导入tween
import * as TWEEN  from 'three/examples/jsm/libs/tween.module.js'



//创建一个球
const spher = new THREE.Mesh(
  new THREE.SphereGeometry(1,30,30),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })

)
spher.position.x = -2
scene.add(spher)

//创建一个补间   传入小球位置
const tween = new TWEEN.Tween(spher.position)
//第一个参数要去哪个位置  第二个参数要花费多长时间
tween.to({x:5},3000).onUpdate(() =>{
  // console.log(spher.position);
  
})
//设置循环次数   Infinity代表无数次
// tween.repeat(Infinity)
//设置循环往复
// tween.yoyo(true)
//延迟执行  等2秒在执行
tween.delay(2000) 
//设置缓动函数
tween.easing(TWEEN.Easing.Quadratic.InOut)
const stopAmin = {
  stop: () =>{
    tween.stop()
  }
}
const startAmin = {
  start: () =>{
    tween.start()
  }
}
const tween2 = new TWEEN.Tween(spher.position)
tween2.to({y:3},3000).onUpdate(() =>{
  // console.log(spher.position);
  
})
tween.chain(tween2)
// tween2.chain(tween)
//启动补间动画
tween.start()


gui?.add(stopAmin,'stop').name('停止动画')
gui?.add(startAmin,'start').name('开始动画')

//在动画函数中更新‘
//更新tween
TWEEN.update()
`)
const executeCode = () => {
  console.log('点击了运行按钮，这里可以接入沙箱环境或 eval 逻辑');
  alert('代码运行逻辑触发！');
}

</script>
<style scoped>
.threejs-demo-page { padding: 24px; line-height: 4vh; overflow: auto;}
</style>

