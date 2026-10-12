// 导入事件类型，供地图控制器和点击回调使用。
import type { CityAlarm, CityAlarmType } from './alarms'
// 导入 GSAP，用于清理地图动画。
import gsap from 'gsap'
// 导入 Three.js，用于创建地图容器及遍历三维对象。
import * as THREE from 'three'
// 导入 GLTF 加载器，读取公共目录中的城市模型。
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
// 导入城市建筑材质处理函数。
import modifyCityMaterial from '../modify/modifyCityMaterial'
// 导入共享 Three.js 场景。
import scene from '../scene'
// 导入城市事件数据，供地图标记和筛选共同使用。
import { CITY_ALARMS } from './alarms'
// 导入事件标记精灵类。
import AlarmSprite from './alarmSprite'
// 导入城市飞线效果。
import FlyLine from './FlyLine'
// 导入城市光墙效果。
import LightWall from './lightWall'
// 导入建筑轮廓线效果。
import MeshLine from './meshline'

// 描述父级界面可以调用的地图交互接口。
export interface CityMapController {
  // 根据事件类别显示全部标记或指定类别。
  setAlarmFilter: (type: CityAlarmType | 'all') => void
  // 高亮指定事件标记并降低其他标记的亮度。
  setSelectedAlarm: (alarmId: string | null) => void
  // 移除地图对象、事件监听并释放地图资源。
  dispose: () => void
}

// 加载城市模型并构建可筛选、可点击的三维地图。
export default function createCity(onAlarmClick: (alarm: CityAlarm) => void): CityMapController {
  // 创建独立对象组，统一管理城市模型与地图标记。
  const cityGroup = new THREE.Group()
  // 为地图组命名，便于调试识别。
  cityGroup.name = 'smart-city-map'
  // 保存已创建的事件精灵，以便筛选和卸载。
  const alarmSprites: AlarmSprite[] = []
  // 保存治安事件的区域光墙，以便随地图一起释放。
  const securityWalls: LightWall[] = []
  // 默认展示全部事件类别。
  let alarmFilter: CityAlarmType | 'all' = 'all'
  // 保存当前选中的事件，以支持模型异步加载完成前的面板点击。
  let selectedAlarmId: string | null = null
  // 记录地图是否已经卸载，避免异步加载完成后继续创建对象。
  let disposed = false

  // 创建 GLTF 模型加载器。
  const gltfLoader = new GLTFLoader()
  // 加载 public 目录中的城市三维模型。
  gltfLoader.load(
    // 使用从站点根目录开始的模型 URL，兼容打包后的 public 资源。
    // '/city2.glb',
    `${import.meta.env.BASE_URL}city2.glb`,
    // 模型加载成功后设置建筑材质并创建附加效果。
    (gltf) => {
      // 如果加载完成前地图已经卸载，就不再创建场景对象。
      if (disposed)
        return

      // 遍历模型中的对象，为所有网格设置城市显示材质。
      gltf.scene.traverse((item) => {
        // 仅为实际网格模型处理材质和建筑轮廓。
        if ((item as THREE.Mesh).isMesh) {
          // 将当前场景对象缩窄为 Three.js 网格。
          const mesh = item as THREE.Mesh
          // 使用深蓝底色突出智慧城市线框效果。
          mesh.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x0C0E33) })
          // 添加项目已有的城市材质效果。
          modifyCityMaterial(mesh)

          // 对命名为 Layerbuildings 的建筑层单独绘制轮廓线。
          if (item.name === 'Layerbuildings') {
            // 使用建筑几何体创建轮廓线网格。
            const meshLine = new MeshLine(mesh.geometry)
            // 计算几何体边界盒，为后续定位轮廓线准备尺寸信息。
            mesh.geometry.computeBoundingBox()
            // 获取建筑层高度；边界盒缺失时使用零高度。
            const height = mesh.geometry.boundingBox?.getSize(new THREE.Vector3()).y ?? 0
            // 略微放大轮廓网格，避免与建筑表面重叠闪烁。
            meshLine.mesh.scale.setScalar(1.0001)
            // 按建筑高度微调轮廓网格的垂直位置。
            meshLine.mesh.position.y = -height * 0.01
            // 将轮廓线附加到对应建筑对象。
            mesh.add(meshLine.mesh)
          }
        }
      })
      // 将加载完成的城市模型放入统一地图组。
      cityGroup.add(gltf.scene)
      // 更新模型的世界矩阵，为屋顶射线检测准备准确变换。
      gltf.scene.updateMatrixWorld(true)
      // 获取城市模型垂直范围，用作电力标记射线的起点高度。
      const cityBounds = new THREE.Box3().setFromObject(gltf.scene)
      // 创建向下发射的射线，用于将电力标记吸附到建筑表面。
      const roofRaycaster = new THREE.Raycaster()

      // 创建并添加城市飞线动画。
      const flyLine = new FlyLine()
      cityGroup.add(flyLine.mesh)

      // 为每条事件记录创建一个可交互的地图标记。
      CITY_ALARMS.forEach((alarm) => {
        // 根据事件数据创建三维精灵标记。
        const alarmSprite = new AlarmSprite(alarm)
        // 电力标记投射到最近建筑顶面，避免悬浮过高或落在街面。
        if (alarm.type === '电力') {
          // 从事件水平坐标正上方向城市模型发出垂直向下的射线。
          roofRaycaster.set(
            new THREE.Vector3(alarm.position[0], cityBounds.max.y + 10, alarm.position[2]),
            new THREE.Vector3(0, -1, 0),
          )
          // 获取射线命中的第一个城市模型表面。
          const roofHit = roofRaycaster.intersectObject(gltf.scene, true)[0]
          // 将图标贴近命中建筑表面；未命中时采用事件数据中的保守高度。
          alarmSprite.mesh.position.y = roofHit ? roofHit.point.y + 0.28 : alarm.position[1]
        }
        // 应用当前筛选条件，隐藏不匹配类别的标记。
        alarmSprite.mesh.visible = alarmFilter === 'all' || alarm.type === alarmFilter
        // 应用当前选中状态，包括地图异步加载期间产生的选择。
        alarmSprite.setSelected(alarm.id === selectedAlarmId, selectedAlarmId !== null)
        // 将精灵点击事件转发给父级面板。
        alarmSprite.onClick(onAlarmClick)
        // 保存精灵实例，供后续筛选与清理。
        alarmSprites.push(alarmSprite)
        // 将标记放入统一地图组中。
        cityGroup.add(alarmSprite.mesh)

        // 治安事件使用贴近地面的脉冲光墙圈定各自告警区域。
        if (alarm.type === '治安') {
          // 在当前治安事件坐标创建蓝色环形警示光墙。
          const securityWall = new LightWall(0.58, 1.3, {
            // 光墙中心与治安事件的地图横坐标一致。
            x: alarm.position[0],
            // 光墙中心与治安事件的地图纵深坐标一致。
            z: alarm.position[2],
          }, 0x43B5FF)
          // 使用事件 ID 标记光墙，便于调试和检查。
          securityWall.mesh.name = `security-zone-${alarm.id}`
          // 将光墙纳入统一地图组以跟随场景生命周期。
          cityGroup.add(securityWall.mesh)
          // 保存光墙引用供控制器销毁时显式清理动画。
          securityWalls.push(securityWall)
        }
      })

      // 将城市模型组加入共享场景以参与渲染。
      scene.add(cityGroup)
    },
    // 当前不需要显示加载进度，因此省略进度回调。
    undefined,
    // 加载失败时在控制台明确报告错误。
    (error) => {
      // 地图卸载后不再报告已经失效的异步加载错误。
      if (!disposed)
        console.error('Unable to load the smart city model:', error)
    },
  )

  // 返回供 Vue 面板控制地图筛选和资源清理的方法。
  return {
    // 更新筛选类型，并即时切换每个地图标记的可见状态。
    setAlarmFilter(type) {
      // 保存当前筛选条件，供模型加载完成时初始化标记状态。
      alarmFilter = type
      // 恢复全部事件时清除选中项，让所有标记恢复默认高亮。
      if (type === 'all')
        selectedAlarmId = null
      // 遍历已创建标记并逐个更新显隐。
      alarmSprites.forEach((alarmSprite) => {
        // 获取当前事件精灵，以便同步其可见和选中状态。
        const { mesh } = alarmSprite
        // 根据精灵元数据找到其对应事件类别。
        const alarmType = CITY_ALARMS.find(alarm => alarm.id === mesh.userData.alarmId)?.type
        // 选择“全部”或与筛选类别一致的标记显示。
        mesh.visible = type === 'all' || alarmType === type
        // 全部筛选时取消单项淡化，恢复每个标记的默认高亮。
        if (type === 'all')
          alarmSprite.setSelected(false, false)
      })
    },
    // 设置当前选中事件，并同步更新所有三维图标的高亮状态。
    setSelectedAlarm(alarmId) {
      // 记住选中事件，使模型尚未加载时的用户操作不会丢失。
      selectedAlarmId = alarmId
      // 让选中标记放大，其余标记在选中期间变暗。
      alarmSprites.forEach((alarmSprite) => {
        // 根据事件 ID 判断当前精灵是否应保持高亮。
        alarmSprite.setSelected(alarmSprite.mesh.userData.alarmId === alarmId, alarmId !== null)
      })
    },
    // 清理地图监听、动画和 GPU 资源。
    dispose() {
      // 标记地图已卸载，阻止稍后完成的模型加载继续创建对象。
      disposed = true
      // 移除每个事件精灵及其画布点击监听。
      alarmSprites.forEach(alarm => alarm.remove())
      // 清空精灵列表，解除当前控制器对对象的引用。
      alarmSprites.length = 0
      // 停止治安区域光墙动画并释放其几何体和材质。
      securityWalls.forEach(securityWall => securityWall.remove())
      // 清空光墙列表，解除控制器对对象的引用。
      securityWalls.length = 0
      // 遍历地图组中的全部对象以释放其资源。
      cityGroup.traverse((object) => {
        // 停止绑定在对象缩放属性上的 GSAP 动画。
        gsap.killTweensOf(object.scale)

        // 仅处理网格或精灵等可渲染对象的几何体和材质。
        if ((object as THREE.Mesh).isMesh || (object as THREE.Sprite).isSprite) {
          // 将当前对象作为含几何体和材质的可渲染对象处理。
          const renderable = object as THREE.Mesh | THREE.Sprite
          // 释放对象几何体占用的显存。
          renderable.geometry?.dispose()
          // 统一将单个材质或材质数组转换成数组。
          const materials = Array.isArray(renderable.material) ? renderable.material : [renderable.material]
          // 逐一释放材质及其纹理资源。
          materials.forEach((material) => {
            // 若材质带有纹理贴图，则一并停止贴图动画并释放纹理。
            if ('map' in material && material.map instanceof THREE.Texture) {
              // 停止绑定在贴图偏移量上的 GSAP 动画。
              gsap.killTweensOf(material.map.offset)
              // 释放贴图占用的显存。
              material.map.dispose()
            }
            // 释放当前材质资源。
            material.dispose()
          })
        }
      })
      // 将地图组从共享场景中移除。
      scene.remove(cityGroup)
    },
  }
}
