
precision highp float;
varying float vElevation;
uniform float uOpacity;
uniform vec3 uHighColor;
uniform vec3 uLowColor;

void main() {
    float mixParameter = (vElevation+1.0)/2.0;
    vec3 color = mix(uLowColor, uHighColor, mixParameter);
    gl_FragColor = vec4(color, uOpacity);
}