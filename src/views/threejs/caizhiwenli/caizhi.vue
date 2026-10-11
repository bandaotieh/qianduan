<template>
    <div style="line-height: 5vh;padding: 0 2vw">
    <h2>Matcap材质原理与应用</h2>
    <div>利用一张包含预烘焙光照和材质的球体纹理（Matcap 贴图），根据模型表面法线相对于相机的方向来拾取颜色。它能在不使用任何场景灯光的情况下，呈现出类似金属光泽或复杂光照的错觉</div>
      <CodeBlock :code="Matcap" language="javascript" :show-run="true" @run="executeCode" />
    <div>
        <span style="font-weight: 600;">无需灯光：</span>
        与 MeshLambertMaterial 或 MeshPhongMaterial 不同，Matcap 材质完全不需要在场景中添加 AmbientLight 或 PointLight。光照信息已经“烘焙”在贴图中，添加灯光也不会改变其外观。
        <span style="font-weight: 600;">相机视角依赖：</span>
由于它是基于相机视角的法线映射，当你移动相机时，模型上的高光和反射会随之改变，产生类似环境反射的视觉效果。
        <span style="font-weight: 600;">性能极佳：</span>
计算量极小，适合在实时渲染中展示高质感的模型。
    </div>
    <h2>Lambert材质原理与应用</h2>

    <div>MeshLambertMaterial（兰伯特材质）是一种基于 Lambert 漫反射光照模型的材质。核心特点是能够响应场景中的光源，呈现出有明暗过渡的哑光质感，且没有高光反射效果。适合用于渲染凹凸不平等粗糙表面</div>
    <div><span style="font-weight: 600;">注意：</span>
    MeshLambertMaterial 必须配合光源使用。如果没有添加光源，物体会显示为纯黑色，完全不可见
    </div>
      <CodeBlock :code="Lambert" language="javascript" :show-run="true" @run="executeCode" />
    <h2>Phong 材质原理与应用</h2>
<div>Phong 材质能够模拟光线照射到物体表面产生的镜面反射（高光）效果，适合用来表现光滑的塑料、漆面木材、水晶或玻璃等光泽表面。</div>
 <div><span style="font-weight: 600;">注意：</span>
Phong 材质配合光源使用。如果没有添加光源，物体会显示为纯黑色.
    </div>
      <CodeBlock :code="Phong" language="javascript" :show-run="true" @run="executeCode" />
<div>Phong材质实现玻璃水晶效果</div>
      <CodeBlock :code="shuijin" language="javascript" :show-run="true" @run="executeCode" />
<h3>MeshStandardMaterial（标准材质）</h3>
<div>该材质提供了比MeshLambertMaterial 或MeshPhongMaterial 更精确和逼真的结果，代价是计算成本更高,而且必须始终指定环境贴图</div>
      <CodeBlock :code="Standard" language="javascript" :show-run="true" @run="executeCode" />
<h3>物理网格材质(MeshPhysicalMaterial)</h3>
<div>完全兼容标准材质的所有参数，还增加了更精细的高级物理光学属性</div>
<div>用于制作透明物体,具有专属参数</div>
<div>
    <span style="font-weight: 600;">clearcoat（清漆层）：</span>
取值 0~1。模拟物体表面的一层透明涂层（如汽车车漆、家具表面的清漆），增加表面的光泽感。
</div>
<div>
    <span style="font-weight: 600;">clearcoatRoughness（清漆层粗糙度）：</span>
    取值 0~1。控制透明涂层表面的光滑程度，影响清漆层反射的清晰度。
</div>
<div>
    <span style="font-weight: 600;">clearcoatMap（清漆层贴图）：</span>
    该纹理的 RGB 值会乘以 clearcoat 属性，用于控制清漆层在模型表面的分布和强度变化。
</div>
<div>
    <span style="font-weight: 600;">clearcoatNormalMap（清漆层法向贴图）：</span>
   清漆层的法线贴图。用于在清漆层表面创建凹凸不平或细节丰富的微观外观（例如车漆表面的细微划痕或橘皮纹理），而不会改变模型的几何形状。
</div>
<div>
    <span style="font-weight: 600;">clearcoatNormalScale（清漆层法向因子）：</span>
   控制清漆层法线贴图的缩放比例。它的值是一个 THREE.Vector2 对象，允许您分别设置 U 轴和 V 轴上的缩放比例，从而精细调整法线贴图在清漆层上的表现力度。
</div>
<div>
    <span style="font-weight: 600;">transmission（透光率）</span>
    取值 0~1。模拟玻璃、半透明塑料等物体的透光效果。即便在完全透射的情况下，仍可保持高反射率，比普通的 opacity 更真实。
</div>
<div>
    <span style="font-weight: 600;">roughness(粗糙度)</span>
    控制物体表面的微观光滑程度，取值范围为 0.0 到 1.0。
</div>
<div>
    <span style="font-weight: 600;">thickness（厚度）</span>
    定义透明/半透明物体在体积上的厚度，取值必须大于零。
</div>
<div>
    <span style="font-weight: 600;"> attenuationColor（衰减颜色）</span>
    定义光线在透明介质内部传播时，因被吸收而逐渐变成的颜色（默认是白色）。
</div>
<div>
    <span style="font-weight: 600;"> attenuationDistance（衰减距离）</span>
    它控制颜色变深的“速度”。
</div>

      <CodeBlock :code="Physical" language="javascript" :show-run="true" @run="executeCode" />

</div>
    </template>
    <script setup lang="ts">
    import CodeBlock from '~/components/CodeBlock .vue';
const Matcap = (` 
//加载 Matcap 纹理
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/2.png'); 
//创建材质并应用
const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
    transparent: true // 如果贴图包含 Alpha 通道，可开启透明
});

const geometry = new THREE.SphereGeometry(1, 32, 32);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
`)
const Lambert =  `
//创建材质并应用
const geometry = new THREE.ConeGeometry(3, 5, 32);
const material = new THREE.MeshLambertMaterial({ 
    color: 0x00ffff 
});
const cone = new THREE.Mesh(geometry, material);
cone.position.y = 5;
scene.add(cone);

// 添加环境光（整体照亮，无阴影）
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 添加点光源（向四周辐射，有明暗和阴影）
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

`
const Phong =`
//通过配置颜色、高光颜色和高光亮度等参数，模拟出镜面反射效果：
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshPhongMaterial({
    color: 0xff0000,        // 物体的基础颜色
    shininess: 60,          // 高光部分的亮度，默认值为 30
    specular: 0xffffff      // 高光部分的颜色，默认为深灰色 0x111111
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 添加点光源（向四周辐射，有明暗和阴影）
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);
`
const shuijin = `
//  HDR 环境贴图 (envMap)
duckMesh.material = new THREE.MeshPhongMaterial({
    color: 0xffffff,          // 基础颜色设为白色
    envMap: envMap,  
       reflectivity: 0.99,          // 反射系数，调高以增强反射强度
    refractionRatio: 0.7      // 折射系数
});
`
const Standard =`
// 创建标准材质
const standardMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6600,     // 基础颜色
    roughness: 0.3,      // 粗糙度（0为光滑，1为粗糙）
    metalness: 0.7,      // 金属度（0为非金属，1为纯金属）
    flatShading: false,  // 是否使用平面着色
    side: THREE.FrontSide // 渲染面：FrontSide(正面), BackSide(背面), DoubleSide(双面)
});

// 将材质应用到几何体上
const cube = new THREE.Mesh(geometry, standardMaterial);
scene.add(cube);

//更改模型材质
//实例化gltf加载器
const gltfloader = new GLTFLoader()
//实例化加载器 draco
const dracoLoader = new DRACOLoader()
//设置draco路径
dracoLoader.setDecoderPath('/draco/')
//设置gltf加载器draco解码器
gltfloader.setDRACOLoader(dracoLoader)
//加载模型
gltfloader.load(
  //模型路径
  "/scence.gltf",
  //加载完成回调
  (gltf) =>{
     // 创建新的标准材质
    const newMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        metalness: 0.7,
        roughness: 0.3
    });

    // 递归遍历所有节点
    model.traverse((child) => {
        if (child.isMesh) {
            // 替换为新材质
            child.material = newMaterial;
        }
    });
      //添加
      scene.add(edges)
    }
   

   })
  


  }
)

`
const Physical = `
//创建立方体
const box = new THREE.BoxGeometry(1,1,1)
//创建物理材质

  const Material = new THREE.MeshPhysicalMaterial({
    //允许透明
    transparent: true,
    //透光率（或者说透光性），范围从0.0到1.0。默认值是0.0。
    transmission: 0.98,
    opacity: 1,
    //粗糙度
    roughness: 0.05,
    //厚度
    thickness: 2,
    //衰减颜色
    attenuationColor : new THREE.Color(0.6,0,0),
    //衰减距离
    attenuationDistance: 1,
  })
//创建立方体网格模型
const cubes = new THREE.Mesh(box,Material)
  scene.add(cubes)
 
`
const executeCode = () => {
}
</script>
<style scoped>
</style>