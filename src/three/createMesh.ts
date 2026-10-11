// 导入事件类型，确保地图点击回调接收正确的数据结构。
import type { CityAlarm } from './mesh/alarms'
// 导入城市地图创建函数。
import createCity from './mesh/city'

// 保留项目原有的地图创建入口，并将地图事件回调传递给城市模型。
export default function createMesh(onAlarmClick: (alarm: CityAlarm) => void) {
  // 创建城市地图并返回地图筛选与销毁控制器。
  return createCity(onAlarmClick)
}
