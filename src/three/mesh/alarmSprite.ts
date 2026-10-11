// 导入事件数据类型，约束地图标记接收的数据结构。
import type { CityAlarm } from './alarms'
// 导入 Three.js，用于创建精灵、射线和纹理。
import * as THREE from 'three'
// 导入共享相机，用于将点击位置投射到三维场景。
import camera from '../camera'
// 导入共享渲染器，以便将事件监听绑定到实际画布。
import renderer from '../renderer'

// 为每类事件指定地图标记的主题色。
const alarmColors: Record<CityAlarm['type'], string> = {
  // 治安事件使用蓝色。
  治安: '#43b5ff',
  // 电力事件使用黄色。
  电力: '#ffd166',
  // 火警事件使用红橙色。
  火警: '#ff765e',
}

// 定义能够显示并响应点击的三维事件标记。
export default class AlarmSprite {
  // 暴露精灵对象，供地图场景添加、定位和筛选。
  public readonly mesh: THREE.Sprite
  // 射线检测器判断鼠标是否点中了该标记。
  private readonly raycaster = new THREE.Raycaster()
  // 鼠标在画布坐标系中的归一化位置。
  private readonly pointer = new THREE.Vector2()
  // 保存面板回调，让地图点击能够通知 Vue 界面。
  private readonly callbacks: Array<(alarm: CityAlarm) => void> = []
  // 处理画布点击，并将命中的事件传给已注册回调。
  private readonly handleClick = (event: MouseEvent) => {
    // 获取承载 Three.js 渲染内容的 canvas 元素。
    const canvas = renderer.domElement
    // 读取 canvas 在浏览器页面中的实际边界。
    const bounds = canvas.getBoundingClientRect()
    // canvas 尚无有效尺寸时无法计算指针坐标，因此不做射线检测。
    if (!bounds.width || !bounds.height)
      return

    // 将鼠标横坐标换算到 Three.js 使用的 [-1, 1] 范围。
    this.pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
    // 将鼠标纵坐标换算到 [-1, 1] 范围，并反转屏幕坐标方向。
    this.pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
    // 从当前相机视角发出鼠标射线。
    this.raycaster.setFromCamera(this.pointer, camera)

    // 点击命中该精灵时通知所有面板回调。
    if (this.raycaster.intersectObject(this.mesh).length)
      this.callbacks.forEach(callback => callback(this.alarm))
  }

  // 保存事件数据并创建对应的地图标记精灵。
  constructor(private readonly alarm: CityAlarm) {
    // 生成标记贴图，供精灵材质渲染。
    const texture = this.createTexture()
    // 创建始终可辨认的透明精灵材质。
    const material = new THREE.SpriteMaterial({
      // 将刚创建的画布纹理贴到精灵上。
      map: texture,
      // 允许标记纹理的透明背景生效。
      transparent: true,
      // 不让建筑深度遮挡标记图案。
      depthTest: false,
      // 标记大小随相机距离自然变化。
      sizeAttenuation: true,
    })

    // 使用材质实例化事件精灵。
    this.mesh = new THREE.Sprite(material)
    // 命名精灵，方便在 Three.js 调试工具中识别。
    this.mesh.name = `alarm-${alarm.id}`
    // 将精灵移动到事件数据提供的世界坐标。
    this.mesh.position.set(...alarm.position)
    // 设置标记的基础宽高比例。
    this.mesh.scale.set(1, 1, 1)
    // 提高渲染顺序，确保标记显示在城市模型上方。
    this.mesh.renderOrder = 10
    // 将事件 ID 存入精灵元数据，供筛选逻辑读取。
    this.mesh.userData.alarmId = alarm.id
    // 将点击监听绑定到 canvas，而不是整个浏览器窗口。
    renderer.domElement.addEventListener('click', this.handleClick)
  }

  // 注册由父级界面传入的地图标记点击回调。
  onClick(callback: (alarm: CityAlarm) => void) {
    // 保存回调，命中当前标记时逐一触发。
    this.callbacks.push(callback)
  }

  // 高亮当前事件，并在有选中项时弱化其他地图标记。
  setSelected(selected: boolean, hasSelection: boolean) {
    // 放大被选中的标记以便在地图上快速识别。
    this.mesh.scale.setScalar(selected ? 1.5 : 1)
    // 选中项保持明亮，其他项在有选中项时降低对比度。
    this.mesh.material.color.set(selected ? 0xFFFFFF : hasSelection ? 0x526B82 : 0xFFFFFF)
    // 被选中标记保持完全不透明，未选中项适当淡化。
    this.mesh.material.opacity = selected || !hasSelection ? 1 : 0.42
  }

  // 移除当前标记并释放事件监听和 GPU 资源。
  remove() {
    // 清除 canvas 上注册的点击监听，避免卸载后重复响应。
    renderer.domElement.removeEventListener('click', this.handleClick)
    // 将精灵从其父级地图组中移除。
    this.mesh.removeFromParent()
    // 释放精灵使用的贴图显存。
    this.mesh.material.map?.dispose()
    // 释放精灵材质资源。
    this.mesh.material.dispose()
  }

  // 用 canvas 绘制圆形徽标与事件类别字符。
  private createTexture() {
    // 创建浏览器画布，作为动态生成标记图案的绘图表面。
    const canvas = document.createElement('canvas')
    // 设置画布宽度，控制生成纹理的水平分辨率。
    canvas.width = 128
    // 设置画布高度，控制生成纹理的垂直分辨率。
    canvas.height = 128
    // 获取 2D 绘图上下文。
    const context = canvas.getContext('2d')
    // 上下文创建失败时显式报错，避免产生空白标记。
    if (!context)
      throw new Error('Unable to create the city alarm marker texture')

    // 读取当前事件类别对应的标记颜色。
    const color = alarmColors[this.alarm.type]
    // 开始绘制外层光晕圆。
    context.beginPath()
    // 设置外层圆的中心和半径。
    context.arc(64, 64, 48, 0, Math.PI * 2)
    // 将外层圆设为半透明主题色。
    context.fillStyle = `${color}30`
    // 填充外层光晕区域。
    context.fill()
    // 设置外圈描边宽度。
    context.lineWidth = 4
    // 使用事件主题色描绘外圈轮廓。
    context.strokeStyle = color
    // 绘制外圈描边。
    context.stroke()

    // 开始绘制内层深色圆盘。
    context.beginPath()
    // 设置内层圆的位置和半径。
    context.arc(64, 64, 34, 0, Math.PI * 2)
    // 将内层圆填充为深蓝色。
    context.fillStyle = 'rgba(5, 24, 49, 0.88)'
    // 填充内层圆盘。
    context.fill()
    // 设置内圈描边宽度。
    context.lineWidth = 2
    // 使用半透明白色描绘内圈边缘。
    context.strokeStyle = 'rgba(255, 255, 255, 0.85)'
    // 绘制内圈描边。
    context.stroke()

    // 将标记文字设为白色以提高辨识度。
    context.fillStyle = '#ffffff'
    // 设置标记字符的字体、字号和中文字体回退。
    context.font = '700 34px "Microsoft YaHei", sans-serif'
    // 水平方向以画布中心对齐字符。
    context.textAlign = 'center'
    // 垂直方向以字符中心对齐文字。
    context.textBaseline = 'middle'
    // 根据事件类别显示“治”“电”或告警符号。
    context.fillText(this.alarm.type === '治安' ? '治' : this.alarm.type === '电力' ? '电' : '!', 64, 65)

    // 将绘制好的 canvas 转换为 Three.js 纹理。
    const texture = new THREE.CanvasTexture(canvas)
    // 指定 sRGB 颜色空间，保证标记颜色显示正确。
    texture.colorSpace = THREE.SRGBColorSpace
    // 返回可供 SpriteMaterial 使用的纹理。
    return texture
  }
}
