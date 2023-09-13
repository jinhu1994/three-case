<template>
    <div ref="cloudShader" class="example-wrapper">
        <logo :label="'烟雾水云效果'"></logo>
    </div>
</template>
<script lang="ts" setup>
import logo from '@/components/logo.vue';
import { getSize, initRenderer } from '@/utils/three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from 'vue';
import vertexShader from '@/assets/shader/cloud/vertex.glsl?raw';
import fragmentShader from '@/assets/shader/cloud/fragment.glsl?raw';
import GUI from 'lil-gui';
import { AttrType, GuiParams } from '@/types/three';

const cloudShader = ref<HTMLElement | null>(null);

const init = () => {
    const dom = cloudShader.value;
    if (dom) {
        const sizes = getSize(dom);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        camera.position.set(1, 1, 1)

        const params: Record<string, any> = {
            uWaresFrequency: 14, // 波浪的峰值
            uScale: 0.03, // 缩放比例
            uNoiseFrequency: 10,
            uNoiseScale: 1.5,
            uXzScale: 1.5,
            uLowColor: '#ff0000',
            uHighColor: '#ffff00',
            uXspeed: 1,
            uZspeed: 1,
            uNoiseSpeed: 1,
            uOpacity: 0.4,
        }

        const guiConfig: Record<string, GuiParams> = {
            uWaresFrequency: { type: AttrType.Number, min: 1, max: 100, step: 0.1 },
            uScale: { type: AttrType.Number, min: 0, max: 0.5, step: 0.001 },
            uXzScale: { type: AttrType.Number, min: 0, max: 5, step: 0.001 },
            uNoiseFrequency: { type: AttrType.Number, min: 1, max: 100, step: 0.1 },
            uNoiseScale: { type: AttrType.Number, min: 0, max: 5, step: 0.001 },
            uLowColor: { type: AttrType.Color, min: 0, max: 0, step: 0 },
            uHighColor: { type: AttrType.Color, min: 0, max: 0, step: 0 },
            uXspeed: { type: AttrType.Number, min: 0, max: 5, step: 0.001 },
            uZspeed: { type: AttrType.Number, min: 0, max: 5, step: 0.001 },
            uNoiseSpeed: { type: AttrType.Number, min: 0, max: 5, step: 0.001 },
            uOpacity: { type: AttrType.Number, min: 0, max: 1, step: 0.01 },
        }

        // 预设shader材质
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            uniforms: {
                uTime: {
                    value: 0
                }
            }
        });

        // 设置着色器 uniforms
        Object.keys(params).forEach((key: string) => {
            const value = params[key];
            switch (typeof value) {
                case 'number':
                    shaderMaterial.uniforms[key] = {
                        value: value
                    }
                    break;
                case 'string':
                    shaderMaterial.uniforms[key] = {
                        value: new THREE.Color(value)
                    }
                    break;
                default:
                    break;
            }

        })

        // 设置gui
        const gui = new GUI();

        Object.keys(params).forEach(x => {
            Object.keys(guiConfig).forEach(key => {
                if (x === key) {
                    const config = guiConfig[key];
                    if (config.type === AttrType.Number) {
                        gui.add(params, x, config.min, config.max, config.step).onChange((val: number) => {
                            shaderMaterial.uniforms[x].value = val;
                        })
                    }

                    if (config.type === AttrType.Color) {
                        gui.addColor(params, x).onFinishChange((val: string) => {
                            shaderMaterial.uniforms[x].value = new THREE.Color(val)
                        })
                    }
                }
            })
        })


        const plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(1, 1, 2048, 2048),
            shaderMaterial,
        );

        plane.rotation.x = - Math.PI / 2;
        scene.add(plane)


        const renderer = initRenderer(sizes.width, sizes.height);
        dom.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        // 设置控制器阻尼
        controls.enableDamping = true;

        const helper = new THREE.AxesHelper(5);
        scene.add(helper)


        const clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            shaderMaterial.uniforms.uTime.value = elapsedTime;
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate)
        }
        animate();
    }
}

onMounted(() => {
    init();
})
</script>
<style lang="less" scoped></style>