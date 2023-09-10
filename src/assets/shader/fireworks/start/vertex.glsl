precision highp float;

uniform float uSize; 
uniform vec3 uSpeed;
uniform float uTime;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.xyz += (uSpeed * uTime);

    vec4 viewPosotion = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosotion;

    // 设置顶点大小
    gl_PointSize = uSize;
}