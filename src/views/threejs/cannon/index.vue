<script setup lang="ts">
import CodeBlock from '~/components/CodeBlock .vue'

const installCode = `// 在项目根目录执行以下依赖安装命令：pnpm add cannon-es
// 在需要使用物理引擎的模块中导入 Cannon-es：import * as CANNON from 'cannon-es'`

const worldCode = `import { World, Vec3 } from 'cannon-es'

// 创建世界
const world = new World()

// 设置重力（默认 (0, -9.82, 0)）
world.gravity.set(0, -9.82, 0)

// 允许物体休眠（提升性能）
world.allowSleep = true

// 设置求解器迭代次数（精度与性能的权衡，默认 10）
world.solver.iterations = 10

// 设置容差（默认 0.001）
world.solver.tolerance = 0.001
`
const bodyCode1 = `
import { Body, Box, Vec3 } from 'cannon-es'

// 创建刚体
const body = new Body({
  mass: 1,                          // 质量（0 为静态物体）
  position: new Vec3(0, 5, 0),      // 初始位置
  velocity: new Vec3(0, 0, 0),      // 初始速度
  angularVelocity: new Vec3(0, 0, 0), // 初始角速度
  shape: new Box(new Vec3(1, 1, 1)), // 可直接传入形状
})

// 或使用 setter
body.mass = 1
body.position.set(0, 5, 0)

// 添加形状
const boxShape = new Box(new Vec3(0.5, 0.5, 0.5))
body.addShape(boxShape)

// 添加球体形状
import { Sphere } from 'cannon-es'
const sphereShape = new Sphere(0.5)
body.addShape(sphereShape)

// 将刚体添加到世界
world.addBody(body)

`
const shapeCode1 =`
import { Box, Sphere, Plane, Cylinder, Trimesh, Cone } from 'cannon-es'

// 盒子：半长宽高
const box = new Box(new Vec3(0.5, 0.5, 0.5))

// 球体：半径
const sphere = new Sphere(0.5)

// 平面：无限大平面
const plane = new Plane()

// 圆柱体：半径、高度、分段数
const cylinder = new Cylinder(0.5, 0.5, 1, 8)

// 圆锥体：半径、高度、分段数
const cone = new Cone(0.5, 1, 8)

// 三角网格（复杂形状）
const vertices = [0,0,0, 1,0,0, 0,1,0] // 顶点数组
const indices = [0,1,2]                // 索引数组
const trimesh = new Trimesh(vertices, indices)

`
const Material = `
import { Material, ContactMaterial } from 'cannon-es'

// 创建材质
const groundMaterial = new Material('ground')
const ballMaterial = new Material('ball')

// 设置材质属性
groundMaterial.friction = 0.3      // 摩擦系数
groundMaterial.restitution = 0.0   // 弹性系数（反弹）

ballMaterial.friction = 0.1
ballMaterial.restitution = 0.8

// 创建接触材质（定义两种材质之间的碰撞行为）
const contactMat = new ContactMaterial(groundMaterial, ballMaterial, {
  friction: 0.3,
  restitution: 0.7,
})

world.addContactMaterial(contactMat)

// 将材质赋给刚体
const groundBody = new Body({ mass: 0 })
groundBody.material = groundMaterial

const ballBody = new Body({ mass: 1 })
ballBody.material = ballMaterial

`
const bodyCode = `// 创建地面（静态）
const groundBody = new Body({ mass: 0 })
groundBody.addShape(new Plane())
groundBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(groundBody)

// 创建球体（动态）
const sphereBody = new Body({ mass: 1, position: new Vec3(0, 5, 0) })
sphereBody.addShape(new Sphere(0.5))
world.addBody(sphereBody)

// 创建立方体（动态）
const boxBody = new Body({ mass: 1, position: new Vec3(2, 5, 0) })
boxBody.addShape(new Box(new Vec3(0.5, 0.5, 0.5)))
world.addBody(boxBody)
`

const shapeCode = `// 施加力（持续作用）
body.applyForce(new Vec3(0, -10, 0), body.position)

// 施加冲量（瞬间作用）
body.applyImpulse(new Vec3(0, 5, 0), body.position)

// 施加局部力
body.applyLocalForce(new Vec3(0, -10, 0), new Vec3(0, 0, 0))

// 施加局部冲量
body.applyLocalImpulse(new Vec3(0, 5, 0), new Vec3(0, 0, 0))

// 设置速度
body.velocity.set(0, 10, 0)
body.angularVelocity.set(0, 1, 0)
`
const changeWorld = `
// 固定时间步长（推荐）
const fixedTimeStep = 1 / 60   //表示60帧
const maxSubSteps = 3

function animate() {
  requestAnimationFrame(animate)

  // 步进物理世界
  world.step(fixedTimeStep, undefined, maxSubSteps)

  // 获取刚体位置用于渲染
  const pos = body.position
  const quat = body.quaternion
  // 更新 Three.js / Babylon.js / 其他渲染器...
}

`
const moveBody =`
world.removeBody(body)

// 移除接触材质
world.removeContactMaterial(contactMat)

// 清空所有物体
world.bodies.forEach(b => world.removeBody(b))

`
const materialCode = `// 碰撞开始
world.addEventListener('postStep', () => {
  // 每次步进后检查碰撞
})

// 更精确的碰撞事件监听
body.addEventListener('collide', (event) => {
  const { body: otherBody, contact } = event

  console.log('碰撞发生！')
  console.log('碰撞物体:', otherBody)
  console.log('碰撞点:', contact.bi.position)
  console.log('法线方向:', contact.ni)

  // 获取碰撞冲击力
  const impulse = contact.getImpactVelocityAlongNormal()
  if (Math.abs(impulse) > 5) {
    console.log('强力碰撞！')
  }
})
`
const materialCode1 = `
import { Ray, RaycastResult } from 'cannon-es'

// 创建射线
const ray = new Ray()
ray.from.set(0, 10, 0)
ray.to.set(0, -10, 0)

// 执行射线检测
const result = new RaycastResult()
ray.intersectWorld(world, result)

if (result.hasHit) {
  console.log('射线击中:', result.body)
  console.log('击中点:', result.hitPointWorld)
  console.log('法线:', result.hitNormalWorld)
}

`
const materialCode2 = `
// 检测两个形状是否重叠
const overlap = body1.overlaps(body2)
if (overlap) {
  console.log('两个物体重叠！')
}

// 检测世界中的所有重叠（需要启用碰撞检测）
world.bodies.forEach((b1, i) => {
  for (let j = i + 1; j < world.bodies.length; j++) {
    const b2 = world.bodies[j]
    if (b1.overlaps(b2)) {
      console.log($ { b1.id } 与 $ {b2.id} 重叠)
    }
  }
})
`
const syncCode = `import { PointToPointConstraint, HingeConstraint, ConeTwistConstraint, DistanceConstraint } from 'cannon-es'

// 点对点约束（铰链/球关节）
const p2p = new PointToPointConstraint(bodyA, new Vec3(0, 0, 0), bodyB, new Vec3(1, 0, 0))
world.addConstraint(p2p)

// 距离约束（保持固定距离）
const distance = new DistanceConstraint(bodyA, bodyB, { distance: 2 })
world.addConstraint(distance)

// 铰链约束（类似门轴）
const hinge = new HingeConstraint(bodyA, bodyB, {
  pivotA: new Vec3(0, 0, 0),
  axisA: new Vec3(0, 1, 0),
  pivotB: new Vec3(0, 0, 0),
  axisB: new Vec3(0, 1, 0),
})
world.addConstraint(hinge)

// 圆锥-扭转约束（类似肩膀关节）
const coneTwist = new ConeTwistConstraint(bodyA, bodyB, {
  pivotA: new Vec3(0, 0, 0),
  axisA: new Vec3(0, 1, 0),
  pivotB: new Vec3(0, 0, 0),
  axisB: new Vec3(0, 1, 0),
  angle: Math.PI / 4,
})
world.addConstraint(coneTwist)

// 移除约束
world.removeConstraint(p2p)
`

const forceCode = `// 设置一个触发器区域（静态，不可见）
const triggerBody = new Body({ mass: 0, position: new Vec3(0, 1, 0) })
triggerBody.addShape(new Box(new Vec3(2, 2, 2)))
triggerBody.collisionFilterGroup = 2
triggerBody.collisionFilterMask = 1
world.addBody(triggerBody)

// 在碰撞事件中检测
triggerBody.addEventListener('collide', (event) => {
  const other = event.body
  if (other.id !== triggerBody.id) {
    console.log('触发器被触发！')
    // 执行触发逻辑：开门、得分、传送等
  }
})
`

const collisionCode = `// 设置碰撞组和掩码（按位运算）
const body1 = new Body()
body1.collisionFilterGroup = 1      // 属于组 1
body1.collisionFilterMask = 2 | 4   // 与组 2 或 4 碰撞

const body2 = new Body()
body2.collisionFilterGroup = 2
body2.collisionFilterMask = 1       // 与组 1 碰撞

const body3 = new Body()
body3.collisionFilterGroup = 4
body3.collisionFilterMask = 0       // 不与任何组碰撞
`

const rayCode = `// 运动学物体：位置由代码控制，但能推动其他动态物体
const kinematicBody = new Body({
  mass: 0,
  type: Body.KINEMATIC,
  position: new Vec3(0, 2, 0),
})
kinematicBody.addShape(new Box(new Vec3(1, 1, 1)))
world.addBody(kinematicBody)

// 更新位置（每帧调用）
kinematicBody.position.x += 0.01
kinematicBody.velocity.set(0.01, 0, 0) // 必须设置速度使碰撞有效
`

const constraintCode = `// 全局开启休眠
world.allowSleep = true

// 设置休眠参数
world.sleepTimeLimit = 0.5      // 静止多久后休眠（秒）
world.sleepSpeedLimit = 0.1     // 速度低于此值视为静止

// 单个物体设置
body.sleepSpeedLimit = 0.05
body.sleepTimeLimit = 0.5

// 手动唤醒
body.wakeUp()

// 强制休眠
body.sleep()
`

const triggerCode = `world.allowSleep = true
world.sleepTimeLimit = 0.5
world.sleepSpeedLimit = 0.1
`

const cleanupCode = `world.solver.iterations = 5 // 默认 10，降低可提升性能但精度下降
`
const cleanupCode1 = `
// 减少不必要的碰撞检测
body.collisionFilterGroup = 1
body.collisionFilterMask = 2 // 只与组 2 碰撞

`
const cleanupCode2 = `
// 批量添加物体时暂停世界
world.broadphase.useBoundingBoxes = true // 使用 AABB 加速

// 批量添加
const bodies = []
for (let i = 0; i < 100; i++) {
  const b = new Body({ mass: 1 })
  // ... 配置
  bodies.push(b)
}
bodies.forEach(b => world.addBody(b))


`
const cleanupCode3 = `
// 增加容差，减少检测次数
world.solver.tolerance = 0.01 // 默认 0.001


`
</script>

<template>
  <article class="cannon-guide">
    <header class="guide-header">
      <p class="eyebrow">
        THREE.JS · PHYSICS
      </p>
      <h1>Cannon-es 物理引擎实践指南</h1>
      <p class="intro">
        Cannon-es 负责计算刚体运动与碰撞，Three.js 负责把结果绘制到屏幕上。把两者连接起来，就能为场景中的物体加入重力、反弹和交互。
      </p>
      <div class="guide-meta">
        <span>适用版本：cannon-es 0.20+</span>
        <span>核心流程：创建世界 → 添加刚体 → 固定步进 → 同步模型</span>
      </div>
    </header>

    <section class="guide-section">
      <h2>1. 安装与模块导入</h2>
      <p>
        使用 Vite、Vue 等构建工具时，通过包管理器安装
        <code>cannon-es</code>，再从 ESM 模块导入所需类型。
      </p>
      <CodeBlock :code="installCode" language="javascript" />
      <p class="note">
        浏览器原生模块也可以从 ESM CDN 导入；实际项目建议锁定依赖版本，并优先使用本地构建工具管理包。
      </p>
    </section>

    <section class="guide-section">
      <h2>2. 核心概念</h2>
      <p>
        <code>2.1 物理世界（World）</code> 是所有物理对象的容器，管理重力、碰撞检测和约束求解。重力决定物体的持续加速度，求解器迭代次数会影响碰撞和约束的稳定程度；更高的迭代次数也意味着更多计算量。
      </p>
      <CodeBlock :code="worldCode" language="typescript" />
      <p>
        <code>2.2 刚体 (Body)</code>刚体是物理模拟的基本单位，包含质量、形状和位置等信息。
      </p>
      <CodeBlock :code="bodyCode1" language="typescript" />
      <code>Body常用属性</code>
      <img src="../../../assets/three/body.png" alt="body" style="max-width: 1000px;">
<p>
  
        <code>2.3 碰撞形状 (Shape)</code>cannon-es 支持多种碰撞形状：
      </p>
      <CodeBlock :code="shapeCode1" language="typescript" />
      <p>
  
        <code>2.4 材质 (Material) 与接触材质 (ContactMaterial)</code>材质定义了物体的物理属性（摩擦、恢复系数等）。
      </p>
      <CodeBlock :code="Material" language="typescript" />

    </section>

    <section class="guide-section">
      <h2>3. 基本操作</h2>
      <p>
       <code>3.1 添加物体到世界</code>
      </p>
      <CodeBlock :code="bodyCode" language="typescript" />
      <p>
       <code>3.2 施加力与冲量</code>
      </p>
     
      <CodeBlock :code="shapeCode" language="typescript" />
       <p>
       <code>3.3 更新物理世界</code>
      </p>
      <CodeBlock :code="changeWorld" language="typescript" />

       <p>
       <code>3.4 移除物体</code>
      </p>
      <CodeBlock :code="moveBody" language="typescript" />
       
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>形状</th><th>常见用途</th><th>构造要点</th></tr>
          </thead>
          <tbody>
            <tr><td><code>Box</code></td><td>方块、箱体</td><td>传入半尺寸，例如边长为 2 时使用 (1, 1, 1)。</td></tr>
            <tr><td><code>Sphere</code></td><td>球体、滚动物</td><td>传入半径。</td></tr>
            <tr><td><code>Plane</code></td><td>地面、墙面</td><td>默认法线方向是局部 +Z，通常要旋转以匹配地面朝向。</td></tr>
            <tr><td><code>Cylinder</code></td><td>圆柱类物体</td><td>使用半径、高度和分段数；模型轴向需要与碰撞体保持一致。</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="guide-section">
      <h2>4. 材质与碰撞响应</h2>
      <p>
       <code>4.1 碰撞事件</code>
      </p>
      <CodeBlock :code="materialCode" language="typescript" />
      <p>
       <code>4.2 碰撞检测查询(射线检测) </code>
      </p>
      <CodeBlock :code="materialCode1" language="typescript" />
<p>
       <code>4.3 重叠检测</code>
      </p>
      <CodeBlock :code="materialCode2" language="typescript" />

    </section>

    <section class="guide-section">
      <h2>5. 约束 (Constraint) </h2>
      <p>
       约束用于限制两个刚体之间的相对运动。
      </p>
      <CodeBlock :code="syncCode" language="typescript" />
     
    </section>

    <section class="guide-section">
      <h2>6. 其他功能</h2>
      <p>
        <code>6.1 触发器 (Trigger)</code>
        通过检测重叠实现触发器效果。
      </p>
      <CodeBlock :code="forceCode" language="typescript" />
       <p>
        <code>6.2 碰撞过滤</code>
       
      </p>
      <CodeBlock :code="collisionCode" language="typescript" />
<p>
        <code>6.3 运动学物体</code>
       
      </p>
      <CodeBlock :code="rayCode" language="typescript" />
<p>
        <code>6.4 休眠 (Sleep)</code>
       
      </p>
      <CodeBlock :code="constraintCode" language="typescript" />

    </section>

   

    <section class="guide-section">
      <h2>7.性能优化 </h2>
      <p>
        <code> 7.1启用休眠</code>
      </p>
      <CodeBlock :code="triggerCode" language="typescript" />
     <p>
        <code> 7.2减少求解器迭代次数</code>
      </p>
      <CodeBlock :code="cleanupCode" language="typescript" />
<p>
        <code> 7.3使用宽阶段碰撞过滤</code>
      </p>
      <CodeBlock :code="cleanupCode1" language="typescript" />
<p>
        <code> 7.4 批量操作</code>
      </p>
      <CodeBlock :code="cleanupCode2" language="typescript" />

      <p>
        <code> 7.5降低碰撞检测精度</code>
      </p>
      <CodeBlock :code="cleanupCode3" language="typescript" />

    </section>

    <!-- <footer class="guide-footer">
      <a href="https://blog.csdn.net/a181001_/article/details/163654971" target="_blank" rel="noreferrer">
        查看相关主题文章
      </a>
    </footer> -->
  </article>
</template>

<style scoped>
.cannon-guide {
  max-width: 1080px;
  margin: 0 auto;
  padding: 36px 32px 56px;
  color: #243047;
  line-height: 1.8;
}

.guide-header {
  margin-bottom: 36px;
  padding: 36px;
  border: 1px solid #dce7f5;
  border-radius: 18px;
  background: linear-gradient(135deg, #f2f7ff, #ffffff 72%);
}

.eyebrow {
  margin: 0 0 8px;
  color: #3973c6;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

h1,
h2 {
  color: #17243a;
  line-height: 1.35;
}

h1 {
  margin: 0;
  font-size: clamp(26px, 4vw, 38px);
}

.intro {
  max-width: 760px;
  margin: 18px 0;
  color: #52627a;
  font-size: 16px;
}

.guide-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  color: #718096;
  font-size: 13px;
}

.guide-section {
  margin: 30px 0;
  padding: 28px 30px;
  border: 1px solid #e6ebf2;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 6px 22px rgb(24 48 84 / 4%);
}

.guide-section h2 {
  margin: 0 0 14px;
  font-size: 21px;
}

.guide-section p {
  margin: 12px 0;
}

.guide-section code {
  padding: 2px 5px;
  border-radius: 4px;
  background: #f1f5fa;
  color: #285a9e;
  font-family: Consolas, 'Courier New', monospace;
  font-size: 0.92em;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px;
  border-radius: 10px;
  background: #f5f8fc;
}

.info-card strong {
  color: #2c5d9e;
}

.info-card span,
.note {
  color: #69788d;
  font-size: 14px;
}

.table-wrap {
  overflow-x: auto;
  margin: 18px 0 6px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 11px 12px;
  border-bottom: 1px solid #e8edf4;
  vertical-align: top;
}

th {
  color: #3a4b64;
  background: #f5f8fc;
  font-weight: 600;
}

.guide-list {
  padding-left: 22px;
}

.guide-list li {
  margin: 8px 0;
}

.callout {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
  padding: 14px 16px;
  border-left: 4px solid #5592df;
  border-radius: 6px;
  background: #f2f7ff;
}

.checklist {
  border-color: #dce7f5;
  background: #f8fbff;
}

.guide-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  padding: 18px 4px;
  color: #78869a;
  font-size: 13px;
}

.guide-footer a {
  color: #3973c6;
  text-decoration: none;
}

.guide-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 680px) {
  .cannon-guide {
    padding: 20px 14px 36px;
  }

  .guide-header {
    padding: 24px 20px;
  }

  .guide-section {
    padding: 22px 18px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
