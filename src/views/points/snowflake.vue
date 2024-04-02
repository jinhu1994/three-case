<template>
    <div ref="snowflake" class="example-wrapper">
        <logo :label="'雪花'"></logo>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getSize, initRenderer } from '@/utils/three';
import logo from '@/components/logo.vue';
import { getStaticResourceUrl } from '@/utils/common';
const snowflake = ref<HTMLElement | null>(null);

const createPoints = (textureName: string, size = 0.5, count = 5000) => {
    const particlesGeometry = new THREE.BufferGeometry();
    // 设置缓冲区数组
    const positions = new Float32Array(count * 3);
    // 设置粒子顶点颜色
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i] = (Math.random() - 0.5) * 150;
        colors[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(getStaticResourceUrl(`${textureName}.png`, '/src/assets/images/point/particles/'));

    const pointMaterial = new THREE.PointsMaterial({
        size: size, // 点材质的大小
        color: 0xffffff,
        map: texture,
        transparent: true,
        alphaMap: texture,
        depthWrite: false, // 渲染此材质对深度缓冲区无影响
        blending: THREE.AdditiveBlending,
        // vertexColors: true, // 启用顶点着色
    });

    const points = new THREE.Points(particlesGeometry, pointMaterial);
    return points;
};

const init = () => {
    const dom = snowflake.value;
    if (dom) {
        const sizes = getSize(dom);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 30);
        camera.position.set(0, 0, 40);
        scene.add(camera);

        const snow1 = createPoints('14', 0.5, 10000);
        const snow2 = createPoints('xh', 0.8, 10000);
        const snow3 = createPoints('xh', 1.2, 10000);
        scene.add(snow1);
        scene.add(snow2);
        scene.add(snow3);

        const renderer = initRenderer(sizes.width, sizes.height);
        dom.appendChild(renderer.domElement);

        // 添加控制器
        const controls = new OrbitControls(camera, renderer.domElement);

        const clock = new THREE.Clock();
        const animate = () => {
            const time = clock.getElapsedTime();
            snow1.rotation.x = time * 0.3;
            snow2.rotation.x = time * 0.5;
            snow2.rotation.y = time * 0.25;
            snow3.rotation.x = time * 0.2;
            snow2.rotation.y = time * 0.2;
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
