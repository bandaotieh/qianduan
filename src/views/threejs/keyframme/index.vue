<template>
    <div style="line-height: 5vh;padding: 3vw;">
        <h1>关键帧动画</h1>
        <h3>关键帧轨道（KeyframeTrack）：动画数据的基石</h3>
        <div>关键帧轨道是一个数据容器，本质上是一个“时间-值”对的序列。它负责定义某个特定属性（如位置、旋转、颜色）在特定时间点应该呈现的具体数值。</div>
        <div>
            <span style="font-weight: 600;">命名规范：</span>
            轨道通过“属性路径.属性名”的命名方式，精确绑定到目标对象的指定属性上（例如 .position 或 .material.color）。
        </div>
        <div>
            <span style="font-weight: 600;">数据类型：</span>Three.js 提供了多种预设的轨道类型来处理不同的数据格式，例如：<br>
            <span style="font-weight: 600;">VectorKeyframeTrack：</span>用于位置、缩放等三分量向量属性。<br>
            <span style="font-weight: 600;">QuaternionKeyframeTrack:</span>用于旋转（四元数）属性。<br>
            <span style="font-weight: 600;">ColorKeyframeTrack:</span>用于材质颜色的 RGB 三通道变化。<br>
            <span style="font-weight: 600;">BooleanKeyframeTrack:</span>用于控制可见性等开关状态。

        </div>
        <h2>three设置keyframme关键帧实现动画</h2>
        <CodeBlock :code="pingyi" language="javascript" :show-run="true" @run="executeCode" />

        <h2>四元数与欧拉角转换设置关键帧动画</h2>
        <div>
            <span style="font-weight: 600;">四元数的表示</span>
            <img src="../../../assets/three/siyuan.png" alt="siyuan">
        </div>
        <h3>为什么需要这样的表示</h3>
        <div>
            <span style="font-weight: 600;"> 1.避免万向锁</span>：欧拉角在特定角度（如绕某一轴旋转 ±90°
            时）会导致两个旋转轴重合，从而丢失一个自由度，使物体的旋转轨迹发生错乱。四元数通过“旋转轴+旋转角度”的组合方式，从根本上避免了这一问题。<br>
            <span
                style="font-weight: 600;">2.插值效果好</span>在关键帧之间进行过渡时，如果对欧拉角直接进行线性插值，容易出现路径不自然的问题。四元数支持球面线性插值（Slerp），能够保证旋转路径在球面上最短且最平滑。<br>
            <span style="font-weight: 600;">3.引擎底层逻辑</span>Three.js 的规则是，对象的旋转永远存储在 quaternion
            属性中，欧拉角（rotation）仅仅是一个方便开发者输入的界面。

        </div>
        <h3>使用四元数实现旋转</h3>
        <CodeBlock :code="siyuan" language="javascript" :show-run="true" @run="executeCode" />

        <h3>使用欧拉角实现旋转</h3>
        <CodeBlock :code="oula" language="javascript" :show-run="true" @run="executeCode" />

        <h2>布尔关键帧动画实现闪烁</h2>
        <div>布尔关键帧动画（BooleanKeyframeTrack）专门用于处理具有“开关”性质的属性，例如控制 3D 对象或灯光的可见性（visible）。</div>
        <CodeBlock :code="boolen" language="javascript" :show-run="true" @run="executeCode" />

        <h2>颜色关键帧动画实现各种颜色属性动画</h2>
        <div>实现颜色关键帧动画主要依赖 ColorKeyframeTrack 类。它可以平滑地过渡材质的颜色（如实现呼吸灯、状态指示）或光源的颜色。</div>
        <h3> 核心语法与数据格式</h3>
        <div>
            ColorKeyframeTrack 接受三个主要参数：<br>
            <span style="font-weight: 600;">name：</span>目标属性的路径。对于材质颜色，通常是 '.material.color'；对于光源颜色，则是 '.color'。<br>
            <span style="font-weight: 600;">times：</span>时间戳数组（单位：秒）。<br>
            <span style="font-weight: 600;">values：</span>颜色值数组。颜色由 RGB 三通道组成，每个通道的值在 0 到 1 之间。每个时间点需要连续提供 3 个数值（R, G,
            B）。

        </div>
        <CodeBlock :code="color" language="javascript" :show-run="true" @run="executeCode" />
        <h2>numberkeyframe数值动画</h2>
        <div>NumberKeyframeTrack（数值关键帧轨道）专门用于处理标量（单个数值）属性的动画。它通常被用来控制物体的透明度（opacity）、材质的亮度或某些特定的数值参数。</div>
        <h3> 核心语法与数据格式</h3>
        <div>
            NumberKeyframeTrack 的构造函数接受三个主要参数：<br>
            <span style="font-weight: 600;">name：</span>目标属性的路径（例如 '.material.opacity' 或 '.scale.x'）。<br>
            <span style="font-weight: 600;">times：</span>时间戳数组（单位：秒）。<br>
            <span style="font-weight: 600;">values：</span>数值数组，与时间戳一一对应。因为是标量，每个时间点只需要提供 1 个数值。

        </div>
        <CodeBlock :code="NumberKeyframeTrack" language="javascript" :show-run="true" @run="executeCode" />

        <h2>mixer混合器详解</h2>
        <div>
            核心职责与底层原理<br>
            <span style="font-weight: 600;">状态管理器:</span>它负责监听模型的骨骼（Bone）、变形目标（Morph
            Targets）或其他属性，并在内部维护一个动画动作（AnimationAction）列表。<br>
            <span style="font-weight: 600;">时间推进与插值计算:</span>在每一帧中，Mixer
            会根据时间增量，解析关键帧数据，通过插值算法（如线性插值、球形插值）计算当前时间对应的中间状态，并将结果写入绑定的目标对象属性中。<br>
            <span style="font-weight: 600;">帧率无关性:</span>通过接收时间差（deltaTime），它确保了无论设备的刷新率如何，动画播放的速度都能保持一致。

        </div>
        <h3>创建混合器</h3>
        <div>每个包含动画的 3D 对象（通常是模型或网格）都需要一个对应的 AnimationMixer 实例。</div>
        <CodeBlock :code="mixer" language="javascript" :show-run="true" @run="executeCode" />
        <h3>管理动画动作</h3>
        <div>通过 clipAction 方法，你可以为特定的动画剪辑（AnimationClip）创建或获取一个 AnimationAction 控制实例。传入相同参数多次调用，会返回同一个动作实例，避免重复创建。</div>
        <CodeBlock :code="mixer1" language="javascript" :show-run="true" @run="executeCode" />
        <h3>驱动动画更新</h3>
        <div>这是最关键的步骤。必须在渲染循环中调用 update 方法，传入自上一帧以来的时间间隔（秒），以推进所有活动动画的状态</div>
        <CodeBlock :code="mixer2" language="javascript" :show-run="true" @run="executeCode" />
        <h3>暂停开始</h3>
        <CodeBlock :code="mixer3" language="javascript" :show-run="true" @run="executeCode" />
    </div>
</template>
<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue';
const pingyi = (`
//声明混合器
let mixer: THREE.AnimationMixer | null = null
//创建一个 Three.js 的计时器对象
const timer = new THREE.Timer();
const animate = () => {
    //手动更新计时器的内部状态
  timer.update(); 
  //获取自上一帧渲染到当前帧所经过的时间差
  let delta = timer.getDelta();
  if (mixer) {
  //将时间差（delta）传递给动画混合器
    mixer.update(delta);
  }
  requestAnimationFrame(animate);
  // 渲染
  renderer.render(scene, camera);
 
};
//创建立方体
 
  const planGemo = new THREE.BoxGeometry(0.5,0.5,0.5)
  const planmaterial = new THREE.MeshBasicMaterial({
     color: 0xff33ff, 
 
     });
  cube = new THREE.Mesh(planGemo, planmaterial);
cube.name = "cube";  //给模型命名

  scene.add(cube)

// 创建位移动画
const positionKF = new THREE.VectorKeyframeTrack(   //参数1 模型名字，参数2 动画时间  参数三 模型位置
  "cube.position",
  [0, 1, 2, 3, 4],
  [0, 0, 0, 2, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0]
);
 mixer = new THREE.AnimationMixer(cube)
// 创建动画剪辑
 const clip = new THREE.AnimationClip("move",4,[positionKF])   //动画名称。 动画时长。 动画
// 创建动画动作
const action = mixer.clipAction(clip);
action.play();

`);
const siyuan = (`
//设置三个旋转角度
const quaternion1 = new THREE.Quaternion();  //创建四元数对象
quaternion1.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);  //1，0，0 代表旋转轴， 0代表旋转角度
const quaternion2 = new THREE.Quaternion();
 quaternion3.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
const quaternion3 = new THREE.Quaternion();
quaternion3.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
//将三个四元数分别转换为数组，然后拼接成一个长数组
const finQ = quaternion1
  .toArray()
  .concat(quaternion2.toArray())
  .concat(quaternion3.toArray());

// //  创建旋转动画帧
const rotationKF = new THREE.QuaternionKeyframeTrack(
  "cube.quaternion",
  [0, 2, 4],
  finQ
);
mixer = new THREE.AnimationMixer(cube);
// 创建动画剪辑
const clip = new THREE.AnimationClip("move", 4, [positionKF, rotationKF]);
// 创建动画动作
const action = mixer.clipAction(clip);
action.play();

`);
const oula = (`
const quaternion1 = new THREE.Quaternion();
quaternion1.setFromEuler(new THREE.Euler(0, 0, 0));  //三个参数分别代码xyz轴旋转度数
const quaternion2 = new THREE.Quaternion();
quaternion2.setFromEuler(new THREE.Euler(Math.PI, 0, 0));
const quaternion3 = new THREE.Quaternion();
quaternion3.setFromEuler(new THREE.Euler(0, 0, 0));
const finQ = quaternion1
  .toArray()
  .concat(quaternion2.toArray())
  .concat(quaternion3.toArray());
// //  创建旋转动画帧
const rotationKF = new THREE.QuaternionKeyframeTrack(
  "cube.quaternion",
  [0, 2, 4],
  finQ
);
mixer = new THREE.AnimationMixer(cube);
// 创建动画剪辑
const clip = new THREE.AnimationClip("move", 4, [positionKF, rotationKF]);
// 创建动画动作
const action = mixer.clipAction(clip);
action.play();
`);
const boolen = `
 //布尔关键帧
 const boolKF = new THREE.BooleanKeyframeTrack(
    "cube.visible",
    [0, 2,  4],
      [true, false, true,]
 )
// 创建动画剪辑

 const clip = new THREE.AnimationClip("move",4,[positionKF,rota,boolKF])
// 创建动画动作
const action = mixer.clipAction(clip);
action.play();
`
const color = `
//颜色关键帧
const colorKF = new THREE.ColorKeyframeTrack(
  "cube.material.color",
  [0, 2, 4],
  [1, 0, 1, 1, 1, 0, 1, 0, 1]
);
`
const NumberKeyframeTrack = `
   const opacityKF = new THREE.NumberKeyframeTrack(
      "cube2.material.opacity",  // 绑定到材质的透明度属性
      [0, 1, 2, 3, 4],  // 时间节点：0秒、1秒、2秒
      [1, 0.5, 0, 0.5, 1] // 对应的透明度值：0(全透明) -> 1(不透明) -> 0(全透明)
    );
`
const mixer = `
const mixer = new THREE.AnimationMixer(object); // object 为绑定的目标对象
`
const mixer1 = `
const action = mixer.clipAction(animationClip);
action.play(); // 开始播放
`
const mixer2 = `
const timer = new THREE.Timer();
function animate() {
    requestAnimationFrame(animate);
       //手动更新计时器的内部状态
  timer.update(); 
  //获取自上一帧渲染到当前帧所经过的时间差
  let delta = timer.getDelta();
    mixer.update(delta); // 驱动动画时间推进
    renderer.render(scene, camera);
}
`
const mixer3 = `
let eventObj = {
  stopAll: () => {
    mixer.stopAllAction(); //暂停mixer上的所有动画
  },
  play: () => {
    action.play(); //开始mixer上的所有动画
    mixer.setTime(2);  //延迟2秒执行  必须先播放在延迟不然不起效果
  },
};
`
const executeCode = () => {
}
</script>