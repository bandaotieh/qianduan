<template>
    <div style="line-height: 5vh;">  

    <h2>包围盒</h2>
    <h3>1.什么是包围盒</h3>
    <div>可以把包围盒想象成一个用来装复杂模型的“标准快递纸箱”。它是一个简单的几何形状（通常是长方体或球体），用来包裹复杂的物体模型，提供快速计算物体空间占用的方式，而无需处理复杂的几何形状。</div>
   <h3>应用场景</h3>
   <div>
    碰撞检测：通过检查两个物体的包围盒是否相交，来快速判断物体是否发生碰撞。如果包围盒不相交，则肯定没有碰撞，从而省去复杂的精确计算。 <br>
视锥体裁剪（Frustum Culling）：检测物体的包围盒是否在相机的视野（视锥体）范围内。如果完全在视野外，引擎就不会渲染该物体，从而大大节省性能。<br>
射线拾取（Raycasting）：当用鼠标点击屏幕时，引擎会发射一条射线。系统会先判断射线是否与包围盒相交，如果不相交，就跳过对该物体所有三角面的精确交点检查。<br>
获取物体尺寸与定位：方便地获取物体在 3D 空间中的大致尺寸（宽高深）和位置范围，常用于将相机对准某个模型或调整 UI 布局。
   </div>
      <CodeBlock :code="box" language="javascript" :show-run="true" @run="executeCode" />
      <h3>包围球</h3>
      <CodeBlock :code="cricle" language="javascript" :show-run="true" @run="executeCode" />
<h3>获取多个物体包围盒</h3>
      <CodeBlock :code="allbox" language="javascript" :show-run="true" @run="executeCode" />

   <h3>世界矩阵</h3>
   <div>物体进行缩放后，包围盒可能不会跟着一同缩放，这个时候就需要更新世界矩阵</div>
      <CodeBlock :code="sjjz" language="javascript" :show-run="true" @run="executeCode" />

      <h3>物体居中及获取中心点</h3>
      <CodeBlock :code="center" language="javascript" :show-run="true" @run="executeCode" />
</div>
   </template>
    <script setup lang="ts">
    import CodeBlock from '~/components/CodeBlock .vue';
const box = (` 
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
 // 创建一个空的包围盒
const box = new THREE.Box3();
box.setFromObject(mesh);  // 自动计算世界空间中的包围盒
// 根据物体（包括其子对象）自动计算物体及其子物体的世界轴对齐包围盒，会考虑物体的位置、旋转、缩放等变换
box.setFromObject(myMesh); 
//手动计算几何体的包围盒   如果物体的位置、旋转、缩放等变换，这时候需手动更新世界矩阵
mesh.geometry.computeBoundingBox()
 创建一个红色的包围盒辅助器
const boxHelper = new THREE.Box3Helper(combine,0xff0000 )
scene.add(boxHelper)
// 获取包围盒的尺寸 (宽, 高, 深)
const size = new THREE.Vector3();
box.getSize(size);

// 获取包围盒的中心坐标
const center = new THREE.Vector3();
box.getCenter(center);


// 判断两个包围盒是否相交
const isIntersecting = box1.intersectsBox(box2);

// 判断一个点是否在包围盒内
const isInside = box.containsPoint(myPoint);
`)
const sjjz = `
// 1. 对子物体进行缩放
child.scale.set(0.1, 0.1, 0.1);

// 2. 更新世界矩阵（参数 true 表示同时递归更新所有子对象）
child.updateMatrixWorld(true); 
`
const cricle = `
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 1. 先获取局部球
geometry.computeBoundingSphere();
const localSphere = geometry.boundingSphere.clone();

// 2. 转换到世界空间
mesh.updateMatrixWorld(true);
localSphere.center.applyMatrix4(mesh.matrixWorld); // 中心点应用变换

// 3. 处理缩放（半径乘以最大缩放值）
const scale = new THREE.Vector3();
mesh.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), scale);
localSphere.radius *= Math.max(scale.x, scale.y, scale.z);


// 为包围球创建一个线框辅助器（分段数32，红色）
const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2);
const helper = new THREE.SphereHelper(sphere, 32, 0xff0000);
scene.add(helper);
`
const allbox= `
// 1. 创建空的 Box3（初始为无穷大/无穷小）
const combinedBox = new THREE.Box3();

// 2. 假设有一个物体数组
const objects = [mesh1, mesh2, mesh3]; // 可以是 Mesh, Group 等

// 3. 逐个扩展
objects.forEach(obj => {
    combinedBox.expandByObject(obj);
});

// 4. 现在 combinedBox 就是包含所有物体的总包围盒

`
const  center = `
// 1. 创建包围盒并根据模型对象计算其包围盒
const box = new THREE.Box3().setFromObject(model);

// 2. 获取包围盒的尺寸（用于后续缩放或相机定位）
const size = new THREE.Vector3();
box.getSize(size);

// 3. 获取包围盒的中心点坐标
const center = new THREE.Vector3();
box.getCenter(center);
//几何体居中    对齐局部坐标系原点
model.geometry.center();
`


const executeCode = () => {
  
}
</script>
<style lang="less" scoped>
</style>