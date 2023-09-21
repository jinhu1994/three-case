<template>
    <div ref="shaderEffect" class="example-wrapper"></div>
</template>
<script lang="ts" setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 导入后期效果合成器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/Shaderpass';

import GUI from 'lil-gui';
import { onMounted, ref } from 'vue';
import { getSize, initRenderer } from '@/utils/three';
import { getStaticResourceUrl } from '@/utils/common';

const shaderEffect = ref<HTMLElement | null>();

const resourceUrls = [
    { name: 'px', url: getStaticResourceUrl('px.jpg', '/src/assets/texture/environmentMaps/0/') },
    { name: 'nx', url: getStaticResourceUrl('nx.jpg', '/src/assets/texture/environmentMaps/0/') },
    { name: 'py', url: getStaticResourceUrl('py.jpg', '/src/assets/texture/environmentMaps/0/') },
    { name: 'ny', url: getStaticResourceUrl('ny.jpg', '/src/assets/texture/environmentMaps/0/') },
    { name: 'pz', url: getStaticResourceUrl('pz.jpg', '/src/assets/texture/environmentMaps/0/') },
    { name: 'nz', url: getStaticResourceUrl('nz.jpg', '/src/assets/texture/environmentMaps/0/') },
    { name: 'model', url: getStaticResourceUrl('DamagedHelmet.gltf', '/src/assets/model/DamagedHelmet/glTF/') },
    { name: 'normalMap', url: getStaticResourceUrl('interfaceNormalMap.png', '/src/assets/texture/') },
];

const init = () => {
    const dom = shaderEffect.value;

    if (dom) {
        const sizes = getSize(dom);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500);
        camera.position.set(0, 0, 3);

        const cubeTextureLoader = new THREE.CubeTextureLoader();
        const envTextureMap = cubeTextureLoader.load(resourceUrls.slice(0, 6).map((o) => o.url));
        scene.background = envTextureMap;
        scene.environment = envTextureMap;

        const gltfLoader = new GLTFLoader();
        gltfLoader.load(resourceUrls[6].url, (gltf) => {
            scene.add(gltf.scene.children[0]);
        });

        const renderer = initRenderer(sizes.width, sizes.height);
        dom.appendChild(renderer.domElement);

        // 合成效果
        const effectComposer = new EffectComposer(renderer);
        effectComposer.setSize(sizes.width, sizes.height);

        // 添加渲染通道
        const renderPass = new RenderPass(scene, camera);
        effectComposer.addPass(renderPass);

        const colorParams = {
            r: 0,
            g: 0,
            b: 0,
        };
        // 着色器渲染通道
        const shaderPass = new ShaderPass({
            uniforms: {
                // 当前图像纹理，自带的，但是在这里必须声明
                tDiffuse: {
                    value: null,
                },
                uColor: {
                    value: new THREE.Color(colorParams.r, colorParams.g, colorParams.b),
                },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec3 uColor;
                varying vec2 vUv;
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    color.xyz += uColor;
                    gl_FragColor = color;
                }
            `,
        });
        effectComposer.addPass(shaderPass);

        const gui = new GUI();
        const colorFolder = gui.addFolder('颜色设置');
        colorFolder
            .add(colorParams, 'r')
            .min(0)
            .max(1)
            .step(0.01)
            .onChange((val: number) => {
                shaderPass.uniforms.uColor.value.r = val;
            });
        colorFolder
            .add(colorParams, 'g')
            .min(0)
            .max(1)
            .step(0.01)
            .onChange((val: number) => {
                shaderPass.uniforms.uColor.value.g = val;
            });
        colorFolder
            .add(colorParams, 'b')
            .min(0)
            .max(1)
            .step(0.01)
            .onChange((val: number) => {
                shaderPass.uniforms.uColor.value.b = val;
            });

        // 创建纹理加载器对象
        const textureLoader = new THREE.TextureLoader();
        const normalTexture = textureLoader.load(resourceUrls[7].url);

        // 打造水波纹效果
        const wavePass = new ShaderPass({
            uniforms: {
                tDiffuse: {
                    value: null,
                },
                uNormalMap: {
                    value: null,
                },
                uTime: {
                    value: 0,
                },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform sampler2D uNormalMap;
                varying vec2 vUv;
                uniform float uTime;

                void main() {
                    vec2 newUv = vUv;
                    newUv += sin(newUv.x * 5.0 + uTime * 0.5) * 0.02;
                    vec4 color = texture2D(tDiffuse, newUv);
                    // 获取贴图color
                    vec4 normalColor = texture2D(uNormalMap,vUv);
                    // 设置光线照射方向
                    vec3 lightDirection = normalize(vec3(-5, 5, 2));

                    float lightness = clamp(dot(normalColor.xyz, lightDirection), 0.0, 1.0);
                    color.xyz += lightness;
                    gl_FragColor = color;

                }
            `,
        });

        wavePass.material.uniforms.uNormalMap.value = normalTexture;
        effectComposer.addPass(wavePass);

        const controls = new OrbitControls(camera, renderer.domElement);
        const clock = new THREE.Clock();
        const animate = () => {
            const time = clock.getElapsedTime();
            wavePass.material.uniforms.uTime.value = time;
            effectComposer.render();
            requestAnimationFrame(animate);
        };

        animate();
    }
};

onMounted(() => {
    init();
});
</script>
<style lang="less" scoped></style>
