<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

// const isCollapse = ref(true)
function handleOpen(key: string, keyPath: string[]) {
  // eslint-disable-next-line no-console
  console.log(key, keyPath)
}
function handleClose(key: string, keyPath: string[]) {
  // eslint-disable-next-line no-console
  console.log(key, keyPath)
}

</script>

<template>
 <el-scrollbar max-height="100vh">
    <el-menu 
      router 
      default-active="1" 
      class="el-menu-vertical-demo" 
      :unique-opened="true" 
      @open="handleOpen" 
      @close="handleClose"
    >
      <!-- 3. 补上缺失的 index 属性 -->
      <el-sub-menu index="vue-ts-menu">
        <template #title>
          <el-icon>
            <Location />
          </el-icon>
          <span>Vue3+Ts</span>
        </template>
        <el-menu-item-group title=""> <!-- 建议给 group 加上 title 属性 -->
          <el-menu-item index="/home/vue">Vue3</el-menu-item>
          <el-menu-item index="/home/ts">Ts</el-menu-item>
          <el-menu-item index="/home/tsZhuangshiqi">Ts装饰器</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>

      <!-- 新增示例菜单，与 Vue3+Ts 同级 -->
      <el-sub-menu index="sample-menu">
        <template #title>
          <el-icon>
            <Setting />
          </el-icon>
          <span>three.js</span>
        </template>
        <el-menu-item-group title="">
          <el-menu-item index="/home/example1">一个简单示例</el-menu-item>
          
          <el-sub-menu index="sample-menu-sub">
            <template #title>Threejs开发入门与调试</template>

            <!-- 三级菜单项 -->
            <el-menu-item index="/home/threejs/orbit-controls">坐标辅助器和轨道控制器</el-menu-item>
            <el-menu-item index="/home/threejs/object-translation">物体位移与父子元素</el-menu-item>
            <el-menu-item index="/home/threejs/axes-helper">物体的缩放与旋转</el-menu-item>
            <el-menu-item index="/home/threejs/object-scale-rotation">响应式画布与全屏控制</el-menu-item>
            <el-menu-item index="/home/threejs/animation">应用lil-GUI调试开发3D效果</el-menu-item>
            <el-menu-item index="/home/threejs/clock-animation">几何体_顶点_索引_面之BufferGeometry_顶点组</el-menu-item>
            <el-menu-item index="/home/threejs/gsap-animation">各种贴图的使用及纹理属性</el-menu-item>
            <el-menu-item index="/home/threejs/canvas-responsive">场景线性雾和指数雾</el-menu-item>
            <el-menu-item index="/home/threejs/gltf-loader">gltf模型加载和模型解压缩</el-menu-item>
            <el-menu-item index="/home/threejs/draco-compression">光线投射和3d场景交互</el-menu-item>
            <el-menu-item index="/home/threejs/tween-animation">补间动画Tween</el-menu-item>
            <el-menu-item index="/home/threejs/gsap">Gsap动画库</el-menu-item>

          </el-sub-menu>
           <el-sub-menu index="sample-menu-geometry">
            <template #title>Geometry详解</template>
            <!-- 三级菜单项 -->
            <el-menu-item index="/home/threejs/uv">uv应用</el-menu-item>
            <el-menu-item index="/home/threejs/rotate">法向和几何顶点的位移、旋转、缩放</el-menu-item>
            <el-menu-item index="/home/threejs/box">包围盒，世界矩阵，物体居中，获取中心点</el-menu-item>
                      <el-menu-item index="/home/threejs/line">边缘几何体与线框几何体</el-menu-item>

          </el-sub-menu>
           <el-sub-menu index="sample-menu-caizhiwenli">
            <template #title>材质与纹理详解</template>
            <!-- 三级菜单项 -->
            <el-menu-item index="/home/threejs/caizhi">五类材质应用</el-menu-item>
            <el-menu-item index="/home/threejs/gzhc">光泽效果和虹彩效应</el-menu-item>
            <el-menu-item index="/home/threejs/skill">设置材质效果技巧</el-menu-item>

            <el-menu-item index="/home/threejs/wenli">纹理的各种属性</el-menu-item>
                      <el-menu-item index="/home/threejs/wenliyingshe">纹理映射问题</el-menu-item>
                      <el-menu-item index="/home/threejs/geshi">纹理格式及转换</el-menu-item>
                      <el-menu-item index="/home/threejs/deephh">材质深度模式及混合模式</el-menu-item>

          </el-sub-menu>
            <el-sub-menu index="sample-menu-light">
            <template #title index="/home/threejs/light">灯光、阴影</template>
            <!-- 三级菜单项 -->
            <el-menu-item index="/home/threejs/light">灯光与阴影</el-menu-item>
            <el-menu-item index="/home/threejs/rsycaster">投射光线与三维物体交互</el-menu-item>
        

          </el-sub-menu>
            <el-sub-menu index="sample-menu-keyframme">
            <template #title index="/home/threejs/keyframme">3D动画</template>
            <!-- 三级菜单项 -->
            <el-menu-item index="/home/threejs/keyframme">关键帧动画设置</el-menu-item>
            <el-menu-item index="/home/threejs/keyframmeshili">示例</el-menu-item>
            <el-menu-item index="/home/threejs/renwu">人物</el-menu-item>
        

          </el-sub-menu>
           <el-sub-menu index="sample-menu-shili">
            <template #title index="/home/threejs/keyframme">粒子特效</template>
            <!-- 三级菜单项 -->
            <el-menu-item index="/home/threejs/point">points与点材质</el-menu-item>
            <el-menu-item index="/home/threejs/lizishili">雪花</el-menu-item>
            <el-menu-item index="/home/threejs/xingyun">星云</el-menu-item>
        

          </el-sub-menu>
          <el-sub-menu index="sample-menu-cannon">
            <template #title index="/home/threejs/cannon">物理引擎</template>
            <!-- 三级菜单项 -->
            <el-menu-item index="/home/threejs/cannondoc">cannon</el-menu-item>

            <el-menu-item index="/home/threejs/cannonuse">cannon使用</el-menu-item>
        

          </el-sub-menu>
         
        </el-menu-item-group>
      </el-sub-menu>

    <el-sub-menu index="sample-menu-webgl"> 
        <template #title>
          <el-icon>
            <Setting />
          </el-icon>
          <span>webgl</span>
        </template>
        <el-menu-item-group title="">
          <el-menu-item index="/home/webgl">概念及基本流程</el-menu-item>
          
         <el-sub-menu index="sample-menu-shader">
            <template #title index="/home/webgl/shader">着色器</template>
            <!-- 三级菜单项 -->
            <el-menu-item index="/home/webgl/shaderbasic">着色器基础</el-menu-item>
            <el-menu-item index="/home/webgl/shaderuse">着色器应用</el-menu-item>
        

          </el-sub-menu>
        </el-menu-item-group>
      </el-sub-menu>
<el-sub-menu index="sample-menu-dify"> 
        <template #title>
          <el-icon>
            <Setting />
          </el-icon>
          <span>Dify</span>
        </template>
        <el-menu-item-group title="">
          <el-menu-item index="/home/dify">Dify安装</el-menu-item>
          <el-menu-item index="/home/ollama">本地接入大模型</el-menu-item>
          <el-menu-item index="/home/prompt">dify应用提示词</el-menu-item>
          <el-menu-item index="/home/rag">RAG及构建知识库</el-menu-item>
          <el-menu-item index="/home/agent">Agent和工作流区别，以及创建</el-menu-item>
          <el-menu-item index="/home/agentApi">Agent嵌入网站</el-menu-item>
          
        
        </el-menu-item-group>
      </el-sub-menu>
      <el-menu-item index="/smartcity" >
        <el-icon><Document /></el-icon>
        <template #title>智慧城市</template>
      </el-menu-item>

      <!-- <el-menu-item index="/nav/4">
        <el-icon><Setting /></el-icon>
        <template #title>Navigator Four</template>
      </el-menu-item> -->
    </el-menu>
  </el-scrollbar>
</template>
<style scoped>
/* 确保外层容器没有额外的 padding 导致滚动条计算错误 */
.el-menu-vertical-demo {
  border-right: none;
}
</style>