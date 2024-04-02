<template>
    <div ref="pointBasic" class="example-wrapper"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getSize, initRenderer } from '@/utils/three';
import { getStaticResourceUrl } from '@/utils/common';
const pointBasic = ref<HTMLElement | null>(null);

const init = () => {
    const dom = pointBasic.value;
    if (dom) {
        const scene = new THREE.Scene();

        const sizes = getSize(dom);
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        camera.position.set(0, 0, 10);
        scene.add(camera);

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(getStaticResourceUrl('1.png', '/src/assets/images/point/particles/'));

        const sphereGeometry = new THREE.SphereBufferGeometry(3, 30, 30);
        const pointMaterial = new THREE.PointsMaterial({
            size: 0.05, // 点材质的大小
            color: 0xfff000,
            map: texture,
            transparent: true,
            alphaMap: texture,
            depthWrite: false, //渲染此材质对深度缓冲区无影响
            blending: THREE.AdditiveBlending,
        });

        const points = new THREE.Points(sphereGeometry, pointMaterial);
        points.clear();
        scene.add(points);

        const renderer = initRenderer(sizes.width, sizes.height);
        // 添加控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // 添加坐标轴辅助器
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        dom.appendChild(renderer.domElement);

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
