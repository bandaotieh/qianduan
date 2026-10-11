// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('../components/layouts/index.vue'),
    children: [{ //子路由
      name: 'layout',
      path: '',
      component: () => import('../views/index.vue'),
    },
  { 
      name: 'vue',
      path: 'vue',
      component: () => import('../views/vue/index.vue'),
    },
   { 
      name: 'ts',
      path: 'ts',
      component: () => import('../views/ts/index.vue'),
    }, 
    { 
      name: 'tsZhuangshiqi',
      path: 'tsZhuangshiqi',
      component: () => import('../views/tsZhuangshiqi/index.vue'),
    },
    {
      name: 'example1',
      path: 'example1',
      component: () => import('../views/threejs/index.vue'),
    },
   
    {
      name: 'threejsOrbitControls',
      path: 'threejs/orbit-controls',
      component: () => import('../views/threejs/intro/OrbitControls.vue'),
    },
    {
      name: 'threejsObjectTranslation',
      path: 'threejs/object-translation',
      component: () => import('../views/threejs/intro/ObjectTranslation.vue'),
    },
    {
      name: 'threejsAxesHelper',
      path: 'threejs/axes-helper',
      component: () => import('../views/threejs/intro/AxesHelper.vue'),
    },
    {
      name: 'threejsObjectScaleRotation',
      path: 'threejs/object-scale-rotation',
      component: () => import('../views/threejs/intro/ObjectScaleRotation.vue'),
    },
    {
      name: 'threejsAnimation',
      path: 'threejs/animation',
      component: () => import('../views/threejs/intro/Animation.vue'),
    },
    {
      name: 'threejsClockAnimation',
      path: 'threejs/clock-animation',
      component: () => import('../views/threejs/intro/ClockAnimation.vue'),
    },
    {
      name: 'threejsGsapAnimation',
      path: 'threejs/gsap-animation',
      component: () => import('../views/threejs/intro/GsapAnimation.vue'),
    },
    {
      name: 'threejsCanvasResponsive',
      path: 'threejs/canvas-responsive',
      component: () => import('../views/threejs/intro/CanvasResponsive.vue'),
    },
    {
      name: 'threejsTweenAnimation',
      path: 'threejs/tween-animation',
      component: () => import('../views/threejs/intro/TweenAnimation.vue'),
    },
     {
      name: 'gsapAnimation',
      path: 'threejs/gsap',
      component: () => import('../views/threejs/intro/gsap.vue'),
    },
    {
      name: 'threejsGltfLoader',
      path: 'threejs/gltf-loader',
      component: () => import('../views/threejs/intro/GltfLoader.vue'),
    },
    {
      name: 'threejsDracoCompression',
      path: 'threejs/draco-compression',
      component: () => import('../views/threejs/intro/DracoCompression.vue'),
    },
     {
      name: 'uv',
      path: 'threejs/uv',
      component: () => import('../views/threejs/geometry/uv.vue'),
    },
    {
      name: 'rotate',
      path: 'threejs/rotate',
      component: () => import('../views/threejs/geometry/rotate.vue'),
    },
    {
      name: 'box',
      path: 'threejs/box',
      component: () => import('../views/threejs/geometry/box.vue'),
    },
    {
      name: 'line',
      path: 'threejs/line',
      component: () => import('../views/threejs/geometry/line.vue'),
    },
       {
      name: 'caizhi',
      path: 'threejs/caizhi',
      component: () => import('../views/threejs/caizhiwenli/caizhi.vue'),
    },
       {
      name: 'gzhc',
      path: 'threejs/gzhc',
      component: () => import('../views/threejs/caizhiwenli/gzhc.vue'),
    },
    {
      name: 'skill',
      path: 'threejs/skill',
      component: () => import('../views/threejs/caizhiwenli/skill.vue'),
    },
    {
      name: 'wenli',
      path: 'threejs/wenli',
      component: () => import('../views/threejs/caizhiwenli/wenli.vue'),
    },
     {
      name: 'wenliyingshe',
      path: 'threejs/wenliyingshe',
      component: () => import('../views/threejs/caizhiwenli/wenliyingshe.vue'),
    },
    {
      name: 'geshi',
      path: 'threejs/geshi',
      component: () => import('../views/threejs/caizhiwenli/geshi.vue'),
    },
    {
      name: 'deephh',
      path: 'threejs/deephh',
      component: () => import('../views/threejs/caizhiwenli/deephh.vue'),
    },
     {
      name: 'light',
      path: 'threejs/light',
      component: () => import('../views/threejs/light/index.vue'),
    },
    {
      name: 'rsycaster',
      path: 'threejs/rsycaster',
      component: () => import('../views/threejs/light/rsycaster.vue'),
    },
    
     {
      name: 'keyframme',
      path: 'threejs/keyframme',
      component: () => import('../views/threejs/keyframme/index.vue'),
    },
      {
      name: 'keyframmeshili',
      path: 'threejs/keyframmeshili',
      component: () => import('../views/threejs/keyframme/shili.vue'),
    },
      {
      name: 'renwu',
      path: 'threejs/renwu',
      component: () => import('../views/threejs/keyframme/renwu.vue'),
    },
      {
      name: 'point',
      path: 'threejs/point',
      component: () => import('../views/threejs/lizi/point.vue'),
    },  {
      name: 'lizishili',
      path: 'threejs/lizishili',
      component: () => import('../views/threejs/lizi/shili.vue'),
    },  {
      name: 'xingyun',
      path: 'threejs/xingyun',
      component: () => import('../views/threejs/lizi/xingyun.vue'),
    },
     {
      name: 'cannonuse',
      path: 'threejs/cannonuse',
      component: () => import('../views/threejs/cannon/shili.vue'),
    },
     {
      name: 'cannondoc',
      path: 'threejs/cannondoc',
      component: () => import('../views/threejs/cannon/index.vue'),
    },
     {
      name: 'webgl',
      path: 'webgl',
      component: () => import('../views/webgl/index.vue'),
    },
    {
      name: 'shaderBasic',
      path: 'webgl/shaderBasic',
      component: () => import('../views/webgl/shader/shaderBasic.vue'),
    },
     {
      name: 'shaderuse',
      path: 'webgl/shaderuse',
      component: () => import('../views/webgl/shader/shaderuse.vue'),
    },
     {
      name: 'dify',
      path: 'dify',
      component: () => import('../views/dify/index.vue'),
    },
     {
      name: 'ollama',
      path: 'ollama',
      component: () => import('../views/dify/ollama.vue'),
    },
     {
      name: 'prompt',
      path: 'prompt',
      component: () => import('../views/dify/prompt.vue'),
    },
     {
      name: 'rag',
      path: 'rag',
      component: () => import('../views/dify/rag.vue'),
    },
    {
      name: 'agent',
      path: 'agent',
      component: () => import('../views/dify/agent.vue'),
    },
     {
      name: 'agentApi',
      path: 'agentApi',
      component: () => import('../views/dify/agentApi.vue'),
    },
  ]
  },
  {
    path: '/smartcity',
    name: 'smartcity',
    component: () => import('../views/smartcity/index.vue'),

  },
  {
    path: '/',
    name: 'login',
    component: () => import('../views/login/index.vue'),

  },
  // ... 其他路由
]

// （可选）导出 router 实例，方便在其它文件中使用
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 默认导出 router（如果你希望在 main.ts 中直接导入 router 实例，但 ViteSSG 需要的是 routes 配置，所以不建议 default 导出 router）
export default router // 可保留，但 main.ts 中我们只导入 routes
