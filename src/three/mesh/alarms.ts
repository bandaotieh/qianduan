// 事件类型同时用于面板分类、地图筛选和三维标记配色。
export type CityAlarmType = '治安' | '电力' | '火警'

// 统一描述一条城市事件，确保面板与地图使用同一份数据。
export interface CityAlarm {
  // 唯一标识用于关联面板事件和三维地图精灵。
  id: string
  // 事件类别决定图标、标记颜色与筛选结果。
  type: CityAlarmType
  // 事件发生的区域或地点名称。
  location: string
  // 面板展示的事件补充说明。
  description: string
  // 面板展示的当前处置状态。
  status: string
  // 面板展示的事件时间。
  time: string
  // Three.js 世界坐标中的事件标记位置。
  position: [number, number, number]
}

// 当前用于演示智慧面板和地图联动的事件数据。
export const CITY_ALARMS: CityAlarm[] = [
  // 西城治安事件对应地图西侧的独立区域。
  {
    // 该事件的唯一键。
    id: 'security-west',
    // 事件类别。
    type: '治安',
    // 发生地点。
    location: '西城 · 明发街区',
    // 事件描述。
    description: '巡检发现异常情况，等待核实',
    // 处置状态。
    status: '待核实',
    // 事件发生时间。
    time: '22:56:40',
    // 治安区域标记坐标，按 [x, y, z] 表示。
    position: [-8, 0.8, 6],
  },
  // 北城电力事件对应地图西北建筑区域。
  {
    // 该事件的唯一键。
    id: 'power-north',
    // 事件类别。
    type: '电力',
    // 发生地点。
    location: '北城 · 城市广场',
    // 事件描述。
    description: '电力设备状态异常，需紧急处理',
    // 处置状态。
    status: '处理中',
    // 事件发生时间。
    time: '07:58:59',
    // 横纵坐标避开其他告警，并由射线检测将高度贴合到建筑屋顶。
    position: [11, 0.8, 4],
  },
  // 中心区电力事件对应地图东南建筑区域。
  {
    // 该事件的唯一键。
    id: 'power-center',
    // 事件类别。
    type: '电力',
    // 发生地点。
    location: '中心区 · 科创园',
    // 事件描述。
    description: '配电设施告警，已通知运维人员',
    // 处置状态。
    status: '待处理',
    // 事件发生时间。
    time: '02:46:39',
    // 横纵坐标选择另一栋分离的建筑，屋顶高度由模型射线检测确定。
    position: [9.5, 0.8, 9.25],
  },
  // 东城治安事件对应地图东北侧的独立区域。
  {
    // 该事件的唯一键。
    id: 'security-east',
    // 事件类别。
    type: '治安',
    // 发生地点。
    location: '东城 · 滨河社区',
    // 事件描述。
    description: '接到异常事件上报，正在派遣巡检',
    // 处置状态。
    status: '待核实',
    // 事件发生时间。
    time: '04:10:51',
    // 治安区域标记坐标，按 [x, y, z] 表示。
    position: [8, 0.8, -6],
  },
]
