// 导入 GSAP，为治安区域光墙添加脉冲动画。
import gsap from 'gsap'
// 导入 Three.js 几何体、材质和颜色工具。
import * as THREE from 'three'
// 导入光墙片元着色器。
import fragment from '../../shader/lightWall/fragment.glsl'
// 导入光墙顶点着色器。
import vertex from '../../shader/lightWall/vertex.glsl'

// 创建可配置半径、颜色和动画范围的环形光墙。
export default class LightWall {
  // 保存光墙环形几何体。
  public geometry: THREE.CylinderGeometry
  // 保存光墙着色器材质。
  public material: THREE.ShaderMaterial
  // 保存用于加入场景的光墙网格。
  public mesh: THREE.Mesh<THREE.CylinderGeometry, THREE.ShaderMaterial>

  // 按给定区域中心创建环形光墙。
  constructor(
    // 指定光墙基础半径。
    radius = 1,
    // 指定光墙脉冲放大的最大比例。
    length = 2,
    // 指定光墙中心在地图平面上的位置。
    position = { x: -0.5, z: 1 },
    // 指定光墙的显示颜色。
    color = 0xFF0000,
  ) {
    // 创建两端开放的圆柱侧面作为围栏环形。
    const geometry = new THREE.CylinderGeometry(radius, radius, 2, 32, 1, true)
    // 保存几何体引用，供组件生命周期释放。
    this.geometry = geometry
    // 创建带有渐隐着色器的透明材质。
    const material = new THREE.ShaderMaterial({
      // 将颜色和光墙高度传入 GLSL 着色器。
      uniforms: {
        // 提供调用者设定的区域警示色。
        uColor: { value: new THREE.Color(color) },
        // 提供渐隐计算使用的圆柱高度。
        uHeight: { value: 2 },
      },
      // 使用项目的光墙顶点着色器。
      vertexShader: vertex,
      // 使用项目的光墙片元着色器。
      fragmentShader: fragment,
      // 启用材质透明混合。
      transparent: true,
      // 圆柱内外两侧均可见。
      side: THREE.DoubleSide,
      // 关闭深度测试，避免半透明光墙被场景表面遮挡。
      depthTest: false,
    })
    // 保存材质引用，供着色器更新和销毁使用。
    this.material = material

    // 使用光墙几何体和材质创建三维网格。
    const mesh = new THREE.Mesh(this.geometry, this.material)
    // 将光墙中心放在区域地面上方，使围栏贴近地表。
    mesh.position.set(position.x, 0.5, position.z)
    // 降低光墙高度，避免警示区域的墙体过高。
    mesh.scale.y = 0.5
    // 将网格设为较高渲染层级，保证半透明警示区域可见。
    mesh.renderOrder = 8
    // 保存网格引用，供城市场景添加。
    this.mesh = mesh

    // 周期性将光墙向外扩张并恢复，形成呼吸脉冲效果。
    gsap.to(this.mesh.scale, {
      // 设置动画扩张后的水平方向比例。
      x: length,
      // 设置动画扩张后的纵深方向比例。
      z: length,
      // 设置单次动画时长。
      duration: 1.4,
      // 无限重复播放警示动画。
      repeat: -1,
      // 每次扩张后反向收缩。
      yoyo: true,
      // 保持脉冲速度平滑稳定。
      ease: 'sine.inOut',
    })
  }

  // 从父场景移除光墙并释放动画、几何体和材质资源。
  remove() {
    // 停止作用于网格缩放值的循环动画。
    gsap.killTweensOf(this.mesh.scale)
    // 从父对象中移除光墙网格。
    this.mesh.removeFromParent()
    // 释放圆柱几何体资源。
    this.geometry.dispose()
    // 释放着色器材质资源。
    this.material.dispose()
  }
}
