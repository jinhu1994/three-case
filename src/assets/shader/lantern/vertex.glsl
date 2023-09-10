// highp -2^16-2^16
// mediump = -2^10-2^10
// lowp -2^8-2^8

precision highp float;
varying vec4 vPosition;
varying vec4 gPosition;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vPosition = modelPosition;
    gPosition = vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}