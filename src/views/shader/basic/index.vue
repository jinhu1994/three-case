<template>
    <div ref="basicShader" class="example-wrapper"></div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getSize, initRenderer } from '@/utils/three';
import vertexShader from './vertex.glsl?raw';
import fragmentShader from './fragment.glsl?raw';


const basicShader = ref<HTMLElement | null>(null)

const init = () => {
    const dom = basicShader.value;
    if (dom) {
        const sizes = getSize(dom);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        camera.position.set(0, 0, 5);
        scene.add(camera);

        // 
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide
        })
        const floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(1, 1, 32, 32),
            shaderMaterial,

        );
        scene.add(floor);

        const renderer = initRenderer(sizes.width, sizes.height);
        // 添加控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // 添加坐标轴辅助器
        const axesHelper = new THREE.AxesHelper(2);
        scene.add(axesHelper);

        dom.appendChild(renderer.domElement);

        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();
    }
}

onMounted(() => {
    init();
})
</script>
<style lang="less" scoped></style>