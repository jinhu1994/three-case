
precision highp float;
varying vec4 vPosition;
varying vec4 gPosition;

void main() {
    vec4 redColor = vec4(1.0, 0.0, 0.0, 1.0);
    vec4 yellowColor = vec4(1.0, 1.0, 0.0, 1.0);
    vec4 mixColor = mix(yellowColor, redColor, gPosition.y / 3.0);


    // 判断是不是正面
    if (gl_FrontFacing) {
        gl_FragColor = vec4(mixColor.xyz - (vPosition.y - 20.0) / 80.0 - 0.1, 1.0);
    } else {
        gl_FragColor = vec4(mixColor.xyz, 1.0);
    }
}