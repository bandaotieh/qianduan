varying vec3 vPosition;
uniform float uHeight;
// 接收每个治安事件配置的光墙颜色。
uniform vec3 uColor;
void main(){
    // 设置混合的百分比
        float gradMix = (vPosition.y+uHeight/2.0)/uHeight;
      gl_FragColor = vec4(uColor,1.0-gradMix);
    
}