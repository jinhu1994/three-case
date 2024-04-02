<template>
    <div ref="particles" class="example-wrapper"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getSize, initRenderer } from '@/utils/three';
import { getStaticResourceUrl } from '@/utils/common';
const particles = ref<HTMLElement | null>(null);

const init = () => {
    const dom = particles.value;
    if (dom) {
        const sizes = getSize(dom);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        camera.position.set(0, 0, 10);
        scene.add(camera);

        const particlesGeometry = new THREE.BufferGeometry();
        const count = 10000;
        // 设置缓冲区数组
        const positions = new Float32Array(count * 3);
        // 设置粒子顶点颜色
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i] = (Math.random() - 0.5) * 40;
            colors[i] = Math.random();
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(getStaticResourceUrl('1.png', '/src/assets/images/point/particles/'));

        const pointMaterial = new THREE.PointsMaterial({
            size: 0.25, // 点材质的大小
            color: 0xfff000,
            map: texture,
            transparent: true,
            alphaMap: texture,
            depthWrite: false, // 渲染此材质对深度缓冲区无影响
            blending: THREE.AdditiveBlending,
            vertexColors: true, // 启用顶点着色
        });

        const points = new THREE.Points(particlesGeometry, pointMaterial);
        scene.add(points);

        const renderer = initRenderer(sizes.width, sizes.height);
        dom.appendChild(renderer.domElement);

        // 添加控制器
        const controls = new OrbitControls(camera, renderer.domElement);

        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();
    }
};

onMounted(() => {
    init();
});
</script>
