import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import camera from "./camera";
import renderer from "./renderer";

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
// controls.autoRotate = true;
  // 阻尼系数
  controls.dampingFactor = 0.1
  // 降低旋转速度，让拖拽手感更沉稳
  controls.rotateSpeed = 0.1
  //开启旋转
//   controls.autoRotate = true
  // 降低缩放速度，让滚轮更细腻 
  controls.zoomSpeed = 0.5

export default controls;
