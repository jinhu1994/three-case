precision highp float;

uniform float uSize; 
uniform float uTime;

attribute vec3 aDirection;
attribute float aSizeScale;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.xyz += aDirection * uTime * 2.0;

    vec4 viewPosotion = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosotion;

    // 设置顶点大小
    gl_PointSize = uSize * aSizeScale - (uTime * 10.0);
}