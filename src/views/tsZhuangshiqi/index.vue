<template>
    <!-- 页面根容器，承载提示与 3D 小船画布 -->
    <div ref="containerRef" class="sea-scene">
        <!-- 3D 小船画布容器，不新建海浪，只渲染小船和阴影 -->
        <div ref="canvasBoxRef" class="sea-overlay-box" />
        <!-- 鼠标悬浮提示层 -->
        <div v-if="tooltip.visible" class="sea-tooltip" :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
            <!-- 船名 -->
            <div class="sea-tooltip__name">{{ tooltip.name }}</div>
            <!-- 操作提示 -->
            <div class="sea-tooltip__tip">点击查看详情</div>
        </div>

        <!-- 点击小船弹窗 -->
        <el-dialog v-model="dialogVisible" :title="activeBoat?.name || '小船信息'" top="5vh" style="  width: 70vw; height: 85vh;overflow-y: auto;line-height: 4vh;" destroy-on-close>
             <div v-if="activeBoat?.id == 1">
               <div style="text-align: left;">1. 装饰器本质是⼀种特殊的函数，它可以对：类、属性、⽅法、参数进⾏扩展，同时能让代码更
                简洁。<br>
                2. 装饰器⾃ 2015 年在 ECMAScript-6 中被提出。
                3. ts5.0以下 ，需要开发者⼿动调整配置，来开启装饰器⽀持，5.0以上可选择不调整配置。<br>
                4. 装饰器有 5 种：<br>
                1⃣类装饰器<br>
                2⃣属性装饰器<br>
                3⃣⽅法装饰器<br>
                4⃣访问器装饰器<br>
                5⃣参数装饰器</div>
            </div>
        <div v-if="activeBoat?.id == 2">
  <div style="font-weight: 600;">1. 基本语法</div>
            <div>类装饰器是⼀个应⽤在类声明上的函数，可以为类添加额外的功能，或添加额外的逻辑。</div>
            <CodeBlock :code="codeBlock1" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">2. 应⽤举例</div>
            <div>需求：定义⼀个装饰器，实现 Person 实例调⽤ toString 时返回 JSON.stringify 的
                执⾏结果。</div>
            <CodeBlock :code="codeBlock2" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">3. 关于返回值</div>
            <div><span style="font-weight: 600;">类装饰器有返回值：</span>若类装饰器返回⼀个新的类，那这个新类将替换掉被装饰的类。<br>
                <span style="font-weight: 600;">类装饰器⽆返回值</span>
                ：若类装饰器⽆返回值或返回 undefined ，那被装饰的类不会被替换。
            </div>
            <CodeBlock :code="codeBlock3" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">4. 关于构造类型</div>
            <div>在 TypeScript 中， Function 类型所表示的范围⼗分⼴泛，包括：普通函数、箭头函数、⽅
                法等等。但并⾮
                Function 类型的函数都可以被 new 关键字实例化，例如箭头函数是不能
                被实例化的，那么 TypeScript 中概如何声明⼀个构造类型呢？有以下两种⽅式：</div>
            <CodeBlock :code="codeBlock4" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">5. 替换被装饰的类</div>
            <div>对于⾼级⼀些的装饰器，不仅仅是覆盖⼀个原型上的⽅法，还要有更多功能，例如添加新的⽅法和
                状态。</div>
            <div style="background-color:antiquewhite;">需求：设计⼀个 LogTime 装饰器，可以给实例添加⼀个属性，⽤于记录实例对象的创建时
                间，再添加⼀个⽅法⽤于读取创建时间。</div>
            <CodeBlock :code="codeBlock5" language="javascript" :show-run="true" @run="executeCode" />
            </div>
        <div v-if="activeBoat?.id == 3">
  <div>装饰器⼯⼚是⼀个返回装饰器函数的函数，可以为装饰器添加参数，可以更灵活地控制装饰器的⾏
                为。</div>
            <div><span style="font-weight: 600;">需求：</span>
                定义⼀个 LogInfo 类装饰器⼯⼚，实现 Person 实例可以调⽤到 introduce ⽅
                法，且 introduce 中输出内容的次数，由 LogInfo 接收的参数决定。</div>
            <CodeBlock :code="codeBlock6" language="javascript" :show-run="true" @run="executeCode" />
            </div>
               <div v-if="activeBoat?.id == 4">
 <div>装饰器可以组合使⽤，执⾏顺序为：先【由上到下】的执⾏所有的装饰器⼯⼚，依次获取到装饰
                器，然后再【由下到上】执⾏所有的装饰器。</div>
            <div>装饰器组合 —— 执⾏顺序</div>
            <CodeBlock :code="codeBlock7" language="javascript" :show-run="true" @run="executeCode" />
            <div>装饰器组合 —— 应⽤</div>
            <CodeBlock :code="codeBlock8" language="javascript" :show-run="true" @run="executeCode" />
            </div>
               <div v-if="activeBoat?.id == 5">
 <div style="font-weight: 600;">1. 基本语法</div>
            <CodeBlock :code="codeBlock9" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">2. 关于属性遮蔽</div>
            <div>如下代码中：当构造器中的 this.age = age 试图在实例上赋值时，实际上是调⽤了原型上
                age 属性的 set ⽅法。</div>
            <CodeBlock :code="codeBlock10" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">3. 应⽤举例</div>
            <div><span style="font-weight: 600;">需求：</span>
                定义⼀个 State 属性装饰器，来监视属性的修改。</div>
            <CodeBlock :code="codeBlock11" language="javascript" :show-run="true" @run="executeCode" />
            </div>
               <div v-if="activeBoat?.id == 6">
 <div style="font-weight: 600;">1.基本语法</div>
            <CodeBlock :code="codeBlock12" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">2.应⽤举例</div>

            <CodeBlock :code="codeBlock13" language="javascript" :show-run="true" @run="executeCode" />
            </div>
               <div v-if="activeBoat?.id == 7">
 <div style="font-weight: 600;">1.基本语法</div>
            <CodeBlock :code="codeBlock14" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">2. 应⽤举例</div>
            <div>需求：对 Weather 类的 temp 属性的 set 访问器进⾏限制，设置的最低温度 -50 ，最⾼
                温度 50</div>
            <CodeBlock :code="codeBlock15" language="javascript" :show-run="true" @run="executeCode" />
            </div>
               <div v-if="activeBoat?.id == 8">
 <div style="font-weight: 600;">1.基本语法</div>
            <CodeBlock :code="codeBlock16" language="javascript" :show-run="true" @run="executeCode" />
            <div style="font-weight: 600;">2. 应⽤举例</div>
            <div>需求：定义⽅法装饰器 Validate ，同时搭配参数装饰器 NotNumber ，来对 speak ⽅法
                的参数类型进⾏限制。</div>
            <CodeBlock :code="codeBlock17" language="javascript" :show-run="true" @run="executeCode" />
            </div>
        </el-dialog>

    </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import * as THREE from 'three'

// 小船数据结构
type Boat = {
    id: number  // 小船ID
    name: string           // 小船名称
    mesh: THREE.Mesh       // 小船网格
    shadow: THREE.Mesh     // 船底阴影网格
    baseX: number          // 初始 X 位置
    baseZ: number          // 初始 Z 位置
    phase: number          // 运动相位
    speed: number          // 运动速度
    ampX: number           // 横向摆动幅度
    ampZ: number           // 前后摆动幅度
    ampY: number           // 上下浮动幅度
}

// 页面容器引用
const containerRef = ref<HTMLDivElement | null>(null)
// 3D 画布容器引用
const canvasBoxRef = ref<HTMLDivElement | null>(null)

// 弹窗状态
const dialogVisible = ref(false)
// 当前命中船
const activeBoat = ref<Boat | null>(null)

// 提示状态
const tooltip = reactive({
    visible: false,
    x: 0,
    y: 0,
    name: ''
})

// Three.js 核心对象
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let raf = 0
let startTime = performance.now()

// 小船集合
const boats: Boat[] = []

// 鼠标归一化坐标
const pointer = new THREE.Vector2(-10, -10)
// 射线检测器
const raycaster = new THREE.Raycaster()

// 初始化 Three.js 渲染器、场景、相机
function initThree() {
    const box = canvasBoxRef.value
    if (!box) return

    const width = box.clientWidth
    const height = box.clientHeight

    // 创建透明渲染器
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    })

    // 限制像素比，兼顾性能
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 设置画布尺寸
    renderer.setSize(width, height)
    // 设置背景透明，不遮挡原有背景海浪
    renderer.setClearColor(0x000000, 0)

    // 挂载到容器
    box.appendChild(renderer.domElement)

    // 创建场景
    scene = new THREE.Scene()

    // 创建相机
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    // 设置相机位置
    camera.position.set(0, 4.5, 9)
    // 相机看向场景中心偏下，模拟海面视角
    camera.lookAt(0, 0.2, 0)
}

// 使用你提供的贴图方式创建小船材质
function createBoatMaterial() {
    // 创建纹理加载器
    const textureLoader = new THREE.TextureLoader()

    // 加载纹理
    const texture = textureLoader.load(`${import.meta.env.BASE_URL}ship.png`)

    // 将纹理颜色空间设置为 sRGB，颜色更准确
    texture.colorSpace = THREE.SRGBColorSpace

    // 加载透明度贴图，控制船体可见区域
    const alphaMap = textureLoader.load(`${import.meta.env.BASE_URL}shiptmd.png`)

    // 创建小船材质
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,     // 保持贴图原始颜色
        map: texture,        // 设置贴图
        alphaMap: alphaMap,  // 设置透明度贴图
        transparent: true,   // 允许透明
        depthWrite: false    // 关闭深度写入，避免透明物体遮挡异常
    })

    return material
}

// 创建船底阴影材质，使用径向渐变纹理实现柔和阴影
function createShadowMaterial() {
    // 创建离屏画布
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)

    // 中心偏深，边缘完全透明
    gradient.addColorStop(0, 'rgba(0,0,0,0.45)')
    gradient.addColorStop(0.55, 'rgba(0,0,0,0.18)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        opacity: 0.58
    })

    return material
}

// 添加多艘小船，并为每艘船添加船底阴影
function addBoats() {
    if (!scene) return

    const boatMaterial = createBoatMaterial()
    const shadowMaterial = createShadowMaterial()

    const configs = [
        { id: 1, name: '简介', x: -6, z: 3.4, y: 8, scale: 0.7, phase: 0.0 },
        { id: 2, name: '类装饰器', x: 1.8, z: 3.2, y: 1, scale: 0.92, phase: 1.1 },
        { id: 3, name: '装饰器工厂', x: -1, z: 3.9, y: 0, scale: 1.52, phase: 2.2 },
        { id: 4, name: '装饰器组合', x: 5.0, z: 2.8, y: 1, scale: 0.8, phase: 3.1 },
        { id: 5, name: '属性装饰器', x: -4, z: 5, y: 8, scale: 1, phase: 0.0 },
        { id: 6, name: '方法装饰器', x: -3.8, z: 3, y: 1, scale: 0.92, phase: 1.1 },
        { id: 7, name: '访问器装饰器', x: 3, z: 4.9, y: 0, scale: 1.2, phase: 2.2 },
        { id: 8, name: '参数装饰器', x: 5.3, z: 4, y: 1, scale: 1, phase: 3.1 }
    ]

    for (const cfg of configs) {
        // 创建小船几何体
        const boatGeometry = new THREE.PlaneGeometry(1.5 * cfg.scale, 1.0 * cfg.scale)

        // 克隆材质，避免共享状态
        const boatMesh = new THREE.Mesh(boatGeometry, boatMaterial.clone())

        // 设置小船初始位置
        boatMesh.position.set(cfg.x, 0.35, cfg.z)

        // 面向相机
        boatMesh.lookAt(camera!.position)
        boatMesh.renderOrder = 2

        // 添加小船到场景
        scene!.add(boatMesh)

        // 创建船底阴影几何体
        const shadowGeometry = new THREE.PlaneGeometry(0.9 * cfg.scale, 0.4 * cfg.scale)

        // 创建阴影网格
        const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial.clone())

        // 设置阴影初始位置
        shadowMesh.position.set(cfg.x, 0.18, cfg.z)

        // 将阴影旋转为水平面，确保它始终落在背景之下
        shadowMesh.rotation.x = -Math.PI / 2
        shadowMesh.renderOrder = 1

        // 添加阴影到场景
        scene!.add(shadowMesh)

        // 创建小船数据对象
        const boat: Boat = {
            id: cfg.id,
            name: cfg.name,
            mesh: boatMesh,
            shadow: shadowMesh,
            baseX: cfg.x,
            baseZ: cfg.z,
            phase: cfg.phase,
            speed: 0.9 + Math.random() * 0.25,
            ampX: 0.28 + Math.random() * 0.18,
            ampZ: 0.18 + Math.random() * 0.14,
            ampY: 0.18 + Math.random() * 0.12
        }

        boats.push(boat)
    }
}

// 波浪高度采样，用于保持漂浮感
function waveOffsetY(x: number, z: number, time: number) {
    return (
        Math.sin(x * 1.4 + time * 1.1) * 0.22 +
        Math.sin(z * 1.0 + time * 0.8) * 0.16 +
        Math.sin((x + z) * 0.9 + time * 1.5) * 0.10
    )
}

// 适配渲染器和相机
function handleResize() {
    const box = canvasBoxRef.value
    if (!box || !renderer || !camera) return

    const width = box.clientWidth
    const height = box.clientHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
}

// 更新小船运动状态和船底阴影
function updateBoats(time: number) {
    for (const boat of boats) {
        // 水平摆动
        const x = boat.baseX + Math.sin(time * boat.speed + boat.phase) * boat.ampX

        // 前后摆动
        const z = boat.baseZ + Math.sin(time * boat.speed * 0.85 + boat.phase) * boat.ampZ

        // 跟随波浪上下浮动
        const y = 0.35 + waveOffsetY(boat.baseX, boat.baseZ, time) * 0.55 + Math.sin(time * boat.speed + boat.phase) * boat.ampY * 0.35

        // 计算海面基准高度
        const seaY = 0.35 + waveOffsetY(boat.baseX, boat.baseZ, time) * 0.55

        // 计算小船离海面高度
        const altitude = Math.max(y - seaY, 0)

        // 更新小船位置
        boat.mesh.position.set(x, y, z)

        // 始终面向相机
        boat.mesh.lookAt(camera!.position)

        // 增加轻微旋转，增强漂浮感
        boat.mesh.rotation.z = Math.sin(time * boat.speed * 0.8 + boat.phase) * 0.12

        // 更新船底阴影位置，始终贴在背景海面下面，避免与船体同层叠加
        boat.shadow.position.set(x, seaY - 0.06, z)

        // 随船离海面高度调整阴影大小
        const scaleFactor = 1 + altitude * 1.05

        // 随船离海面高度调整阴影透明度
        const opacityFactor = Math.max(1.62 - altitude * 0.05, 0.18)

        // 更新阴影缩放
        boat.shadow.scale.set(scaleFactor, 1, scaleFactor)

            // 更新阴影透明度
            ; (boat.shadow.material as THREE.MeshBasicMaterial).opacity = opacityFactor
    }
}

// 将页面坐标转为归一化设备坐标
function updatePointer(clientX: number, clientY: number) {
    const box = canvasBoxRef.value
    if (!box) return

    const rect = box.getBoundingClientRect()
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
}

// 命中检测
function hitBoat(): Boat | null {
    if (!camera || !scene) return null

    raycaster.setFromCamera(pointer, camera)

    const meshes = boats.map(b => b.mesh)
    const hits = raycaster.intersectObjects(meshes, false)

    if (hits.length > 0) {
        const hitMesh = hits[0].object as THREE.Mesh
        return boats.find(b => b.mesh === hitMesh) ?? null
    }

    return null
}

// 显示提示
function showTooltip(clientX: number, clientY: number, boat: Boat) {
    const box = canvasBoxRef.value
    if (!box) return

    const rect = box.getBoundingClientRect()
    const localX = clientX - rect.left
    const localY = clientY - rect.top

    tooltip.visible = true
    tooltip.name = boat.name
    tooltip.x = Math.min(localX + 16, rect.width - 180)
    tooltip.y = Math.max(localY - 54, 8)
}

// 鼠标移动事件
function onPointerMove(event: PointerEvent) {
    updatePointer(event.clientX, event.clientY)
    const boat = hitBoat()

    if (boat) {
        showTooltip(event.clientX, event.clientY, boat)
    } else {
        tooltip.visible = false
    }
}

// 鼠标离开事件
function onPointerLeave() {
    pointer.set(-10, -10)
    tooltip.visible = false
}

// 鼠标点击事件
function onClick(event: MouseEvent) {
    updatePointer(event.clientX, event.clientY)
    const boat = hitBoat()

    if (boat) {
        activeBoat.value = boat
        dialogVisible.value = true
    }
}

// 主渲染循环
function animate() {
    const time = (performance.now() - startTime) / 1000

    updateBoats(time)

    if (renderer && scene && camera) {
        renderer.render(scene, camera)
    }

    raf = requestAnimationFrame(animate)
}

// 绑定交互事件
function bindEvents() {
    window.addEventListener('resize', handleResize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('click', onClick)
}

// 解绑交互事件
function unbindEvents() {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerleave', onPointerLeave)
    window.removeEventListener('click', onClick)
}

// 组件挂载
onMounted(() => {
    initThree()
    addBoats()
    bindEvents()
    animate()
})

// 组件卸载
onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    unbindEvents()

    // 释放渲染器
    renderer?.dispose()
    renderer?.domElement.remove()

    // 释放小船和阴影资源
    for (const boat of boats) {
        boat.mesh.geometry.dispose()
            ; (boat.mesh.material as THREE.Material).dispose()

        boat.shadow.geometry.dispose()
            ; (boat.shadow.material as THREE.Material).dispose()
    }
})
//代码块
import CodeBlock from '../../components/CodeBlock .vue'

const executeCode = () => {
}

const codeBlock1 = `

            /*
 Demo函数会在Person类定义时执⾏
 参数说明：
 ○ target参数是被装饰的类，即：Person
*/
function Demo(target: Function) {
 console.log(target)
}
// 使⽤装饰器
@Demo
class Person { }
        
`
const codeBlock2 = `

    // 使⽤装饰器重写toString⽅法 + 封闭其原型对象
function CustomString(target: Function) {
 // 向被装饰类的原型上添加⾃定义的 toString ⽅法
 target.prototype.toString = function () {
 return JSON.stringify(this)
 }
 // 封闭其原型对象，禁⽌随意操作其原型对象
 Object.seal(target.prototype)
}
// 使⽤ CustomString 装饰器
@CustomString
class Person {
 constructor(public name: string, public age: number) { }
 speak() {
 console.log('你好呀！')
 }
}
/* 测试代码如下 */
let p1 = new Person('张三', 18)
// 输出：{"name":"张三","age":18}
console.log(p1.toString())
// 禁⽌随意操作其原型对象
interface Person {
 a: any
}
// Person.prototype.a = 100 // 此⾏会报错：Cannot add property a, object is not
extensible
// console.log(p1.a)
        
`
const codeBlock3 = `

    function demo(target:Function){
 // 装饰器有返回值时，该返回值会替换掉被装饰的类
 return class {
 test(){
 console.log(200)
 console.log(300)
 console.log(400)
 }
 }
}
@demo
class Person {
 test(){
 console.log(100)
 }
}
console.log(Person)
        
`
const codeBlock4 = `

    仅声明构造类型---------------
    /*
 ○ new 表示：该类型是可以⽤new操作符调⽤。
 ○ ...args 表示：构造器可以接受【任意数量】的参数。
 ○ any[] 表示：构造器可以接受【任意类型】的参数。
 ○ {} 表示：返回类型是对象(⾮null、⾮undefined的对象)。
*/
// 定义Constructor类型，其含义是构造类型
type Constructor = new (...args: any[]) => {};
function test(fn:Constructor){}
class Person {}
test(Person)
声明构造类型 + 指定静态属性---------------------
// 定义⼀个构造类型，且包含⼀个静态属性 wife
type Constructor = {
 new(...args: any[]): {}; // 构造签名
 wife: string; // wife属性
};
function test(fn:Constructor){}
class Person {
 static wife = 'asd'
}
test(Person)
        
`
const codeBlock5 = `

    // User接⼝
interface User {
 getTime(): Date
 log(): void
}
// ⾃定义类型Class
type Constructor = new (...args: any[]) => {}
// 创建⼀个装饰器，为类添加⽇志功能和创建时间
function LogTime< T extends Constructor>(target: T) {
 return class extends target {
 createdTime: Date;
 constructor(...args: any[]) {
 super(...args);
 this.createdTime = new Date(); // 记录对象创建时间
 }
 getTime() {
 return \`该对象创建时间为：\${this.createdTime}\`;
 }
 };
}
@LogTime
class User {
 constructor(
 public name: string,
 public age: number
 ) { }
 speak() {
 console.log(\`\${this.name}说：你好啊！\`)
 }
}
const user1 = new User('张三', 13);
user1.speak()
console.log(user1.getTime())
        
`
const codeBlock6 = `

    interface Person {
 introduce: () => void
}
// 定义⼀个装饰器⼯⼚ LogInfo，它接受⼀个参数 n，返回⼀个类装饰器
function LogInfo(n:number) {
 // 装饰器函数，target 是被装饰的类
 return function(target: Function){
 target.prototype.introduce = function () {
 for (let i = 0; i < n; i++) {
 console.log(\`我的名字：\${this.name}，我的年龄：\${this.age}\`)
 }
 }
 }
}
@LogInfo(5)
class Person {
 constructor(
 public name: string,
 public age: number
 ) { }
 speak() {
 console.log('你好呀！')
 }
}
let p1 = new Person('张三', 18)
// console.log(p1) // 打印的p1是：_classThis，转换的JS版本⽐较旧时，会出现，不必纠结
p1.speak()
p1.introduce()
        
`
const codeBlock7 = `

    //装饰器
function test1(target:Function) {
 console.log('test1')
}
//装饰器⼯⼚
function test2() {
 console.log('test2⼯⼚')
 return function (target:Function) {
 console.log('test2')
 }
}
//装饰器⼯⼚
function test3() {
 console.log('test3⼯⼚')
 return function (target:Function) {
 console.log('test3')
 }
}
//装饰器
function test4(target:Function) {
 console.log('test4')
}
@test1
@test2()
@test3()
@test4
class Person { }
/*
 控制台打印：
 test2⼯⼚
 test3⼯⼚
 test4
 test3
 test2
 test1
*/
        
`
const codeBlock8 = `

            // ⾃定义类型Class
type Constructor = new (...args: any[]) => {}
interface Person {
 introduce():void
 getTime():void
}
// 使⽤装饰器重写toString⽅法 + 封闭其原型对象
function customToString(target: Function) {
 // 向被装饰类的原型上添加⾃定义的 toString ⽅法
 target.prototype.toString = function () {
 return JSON.stringify(this)
 }
 // 封闭其原型对象，禁⽌随意操作其原型对象
 Object.seal(target.prototype)
}
// 创建⼀个装饰器，为类添加⽇志功能和创建时间
function LogTime< T extends Constructor>(target: T) {
 return class extends target {
 createdTime: Date;
 constructor(...args: any[]) {
 super(...args);
 this.createdTime = new Date(); // 记录对象创建时间
 }
 getTime() {
 return \`该对象创建时间为：\${this.createdTime}\`;
 }
 };
}
// 定义⼀个装饰器⼯⼚ LogInfo，它接受⼀个参数 n，返回⼀个类装饰器
function LogInfo(n:number) {
 // 装饰器函数，target 是被装饰的类
 return function(target: Function){
 target.prototype.introduce = function () {
 for (let i = 0; i < n; i++) {
 console.log(\`我的名字：\${this.name}，我的年龄：\${this.age}\`)
 }
 }
 }
}
@customToString
@LogInfo(3)
@LogTime
class Person {
 constructor(
 public name: string,
 public age: number
 ) { }
 speak() {
 console.log('你好呀！')
 }
}
const p1 = new Person('张三',18)
console.log(p1.toString())
p1.introduce()
console.log(p1.getTime())
        
`
const codeBlock9 = `

    /*
 参数说明：
 ○ target: 对于静态属性来说值是类，对于实例属性来说值是类的原型对象。
 ○ propertyKey: 属性名。
*/
function Demo(target: object, propertyKey: string) {
 console.log(target,propertyKey)
}
class Person {
 @Demo name: string
 @Demo age: number
 @Demo static school:string
 constructor(name: string, age: number) {
 this.name = name
 this.age = age
 }
}
const p1 = new Person('张三', 18)
        
`
const codeBlock10 = `

            class Person {
 name: string
 age: number
 constructor(name: string, age: number) {
 this.name = name
 this.age = age
 }
}
let value = 99
// 使⽤defineProperty给Person原型添加age属性，并配置对应的get与set
Object.defineProperty(Person.prototype, 'age', {
 get() {
 return value
 },
 set(val) {
 value = val
 }
})
const p1 = new Person('张三', 18)
console.log(p1.age) //18
console.log(Person.prototype.age)//18
        
`
const codeBlock11 = `

    // 声明⼀个装饰器函数 State，⽤于捕获数据的修改
function State(target: object, propertyKey: string) {
 // 存储属性的内部值
 let key = \`__\${propertyKey}\`;
 // 使⽤ Object.defineProperty 替换类的原始属性
 // 重新定义属性，使其使⽤⾃定义的 getter 和 setter
 Object.defineProperty(target, propertyKey, {
 get () {
 return this[key]
 },
 set(newVal: string){
 console.log(\`\${propertyKey}的最新值为：\${newVal}\`);
 this[key] = newVal
 },
 enumerable: true,
 configurable: true,
 });
}
class Person {
 name: string;
 //使⽤State装饰器
 @State age: number;
 school = 'atguigu';
 constructor(name: string, age: number) {
 this.name = name;
 this.age = age;
 }
}
const p1 = new Person('张三', 18);
const p2 = new Person('李四', 30);
p1.age = 80
p2.age = 90
console.log('------------------')
console.log(p1.age) //80
console.log(p2.age) //90
        
`
const codeBlock12 = `

                /*
 参数说明：
 ○ target: 对于静态⽅法来说值是类，对于实例⽅法来说值是原型对象。
 ○ propertyKey:⽅法的名称。
 ○ descriptor: ⽅法的描述对象，其中value属性是被装饰的⽅法。
*/
function Demo(target: object, propertyKey: string, descriptor: PropertyDescrip
tor){
 console.log(target)
 console.log(propertyKey)
 console.log(descriptor)
}
class Person {
 constructor(
 public name:string,
 public age:number,
 ){}
 // Demo装饰实例⽅法
 @Demo speak(){
 console.log(\`你好，我的名字：\${this.name}，我的年龄：\${this.age}\`)
 }
 // Demo装饰静态⽅法
 @Demo static isAdult(age:number) {
 return age >= 18;
 }
}
const p1 = new Person('张三',18)
p1.speak()
        
`
const codeBlock13 = `

    function Logger(target: object, propertyKey: string, descriptor: PropertyDescr
iptor){
 // 保存原始⽅法
 const original = descriptor.value;
 // 替换原始⽅法
 descriptor.value = function (...args:any[]) {
 console.log(\`\${propertyKey}开始执⾏......\`)
 const result = original.call(this, ...args)
 console.log(\`\${propertyKey}执⾏完毕......\`)
 return result;
 }
}
function Validate(maxValue:number){
 return function (target: object, propertyKey: string, descriptor: PropertyDe
scriptor){
 // 保存原始⽅法
 const original = descriptor.value;
 // 替换原始⽅法
 descriptor.value = function (...args: any[]) {
 // ⾃定义的验证逻辑
 if (args[0] > maxValue) {
 throw new Error('年龄⾮法！')
 }
 // 如果所有参数都符合要求，则调⽤原始⽅法
 return original.apply(this, args);
 };
 }
}
class Person {
 constructor(
 public name:string,
 public age:number,
 ){}
 @Logger speak(){
 console.log(\`你好，我的名字：\${this.name}，我的年龄：\${this.age}\`)
 }
 @Validate(120)
 static isAdult(age:number) {
 return age >= 18;
 }
}
const p1 = new Person('张三',18)
p1.speak()
console.log(Person.isAdult(100))
        
`
const codeBlock14 = `

    /*
 参数说明：
 ○ target:
 1. 对于实例访问器来说值是【所属类的原型对象】。
 2. 对于静态访问器来说值是【所属类】。
 ○ propertyKey:访问器的名称。
 ○ descriptor: 描述对象。
*/
function Demo(target: object, propertyKey: string, descriptor: PropertyDescrip
tor) {
 console.log(target)
 console.log(propertyKey)
 console.log(descriptor)
}
class Person {
 @Demo
 get address(){
 return '北京宏福科技园'
 }
 @Demo
 static get country(){
 return '中国'
 }
}
        
`
const codeBlock15 = `

    function RangeValidate(min: number, max: number) {
 return function (target: object, propertyKey: string, descriptor: PropertyDe
scriptor) {
 // 保存原始的 setter ⽅法，以便在后续调⽤中使⽤
 const originalSetter = descriptor.set;
 // 重写 setter ⽅法，加⼊范围验证逻辑
 descriptor.set = function (value: number) {
 // 检查设置的值是否在指定的最⼩值和最⼤值之间
 if (value < min || value > max) {
 // 如果值不在范围内，抛出错误
 throw new Error(\`\${propertyKey}的值应该在 \${min} 到 \${max}之间！\`);
 }
 
 // 如果值在范围内，且原始 setter ⽅法存在，则调⽤原始 setter ⽅法
 if (originalSetter) {
 originalSetter.call(this, value);
 }
 };
 };
}
class Weather {
 private _temp: number;
 constructor(_temp: number) {
 this._temp = _temp;
 }
 // 设置温度范围在 -50 到 50 之间
 @RangeValidate(-50,50)
 set temp(value) {
 this._temp = value;
 }
 get temp() {
 return this._temp;
 }
}
const w1 = new Weather(25);
console.log(w1)
w1.temp = 67
console.log(w1)
        
`
const codeBlock16 = `

    /*
 参数说明：
 ○ target:
 1.如果修饰的是【实例⽅法】的参数，target 是类的【原型对象】。
 2.如果修饰的是【静态⽅法】的参数，target 是【类】。
 ○ propertyKey：参数所在的⽅法的名称。
 ○ parameterIndex: 参数在函数参数列表中的索引，从 0 开始。
*/
function Demo(target: object, propertyKey: string, parameterIndex: number) {
 console.log(target)
 console.log(propertyKey)
 console.log(parameterIndex)
}
// 类定义
class Person {
 constructor(public name: string) { }
 speak(@Demo message1: any, mesage2: any) {
 console.log(\`\${this.name}想对说：\${message1}，\${mesage2}\`);
 }
}
        
`
const codeBlock17 = `

    function NotNumber(target: any, propertyKey: string, parameterIndex: number) {
 // 初始化或获取当前⽅法的参数索引列表
 let notNumberArr: number[] = target[\`__notNumber_\${propertyKey}\`] || [];
 // 将当前参数索引添加到列表中
 notNumberArr.push(parameterIndex);
 // 将列表存储回⽬标对象
 target[\`__notNumber_\${propertyKey}\`] = notNumberArr;
}
// ⽅法装饰器定义
function Validate(target: any, propertyKey: string, descriptor: PropertyDescri
ptor) {
 const method = descriptor.value;
 descriptor.value = function (...args: any[]) {
 // 获取被标记为不能为空的参数索引列表
 const notNumberArr: number[] = target[\`__notNumber_\${propertyKey}\`] || [];
 // 检查参数是否为 null 或 undefined
 for (const index of notNumberArr) {
 if (typeof args[index] === 'number') {
 throw new Error(\`⽅法 \${propertyKey} 中索引为 \${index} 的参数不能是数字！\`)
 }
 }
 // 调⽤原始⽅法
 return method.apply(this, args);
 };
 return descriptor;
}
// 类定义
class Student {
 name: string;
 constructor(name: string) {
 this.name = name;
 }
 @Validate
 speak(@NotNumber message1: any, mesage2: any) {
 console.log(\`\${this.name}想对说：\${message1}，\${mesage2}\`);
 }
}
// 使⽤
const s1 = new Student("张三");
s1.speak(100, 200);
        
`

</script>

<style scoped>
/* 页面容器 */
.sea-scene {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
}

/* 原有内容层 */
.sea-scene__content {
    position: relative;
    z-index: 1;
    padding: 16px;
}

/* 3D 小船只画布区域，不新建海浪 */
.sea-overlay-box {
    position: fixed;
    right: 0;
    top: 18vh;
    z-index: 2;
    width: 100vw;
    height: 82vh;
    border-radius: 12px;
    overflow: hidden;
    pointer-events: none;
}

/* 鼠标提示 */
.sea-tooltip {
    position: fixed;
    z-index: 3;
    max-width: 180px;
    padding: 10px 12px;
    color: #0f172a;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(148, 163, 184, 0.35);
    border-radius: 10px;
    box-shadow: 0 10px 24px rgba(2, 6, 23, 0.12);
    pointer-events: none;
}

/* 提示标题 */
.sea-tooltip__name {
    font-weight: 600;
}

/* 提示说明 */
.sea-tooltip__tip {
    margin-top: 4px;
    color: #475569;
    font-size: 12px;
}

/* 弹窗行样式 */
.sea-dialog__row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
}

/* 最后一行无分隔线 */
.sea-dialog__row:last-child {
    border-bottom: 0;
}

/* 标签颜色 */
.sea-dialog__row span {
    color: #64748b;
}
</style>