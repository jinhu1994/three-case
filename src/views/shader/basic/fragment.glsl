
precision highp float;
varying vec2 vUv;

void main() {
    // 绘制圆
    // float strength = 1.0 - step(0.4, distance(vUv, vec2(0.5, 0.5)));
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 绘制圆环
    float strength = step(0.4, distance(vUv, vec2(0.5, 0.5))) - step(0.5, distance(vUv, vec2(0.5, 0.5)));
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}