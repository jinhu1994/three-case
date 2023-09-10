<template>
    <div ref="galaxy" class="example-wrapper">
        <logo :label="'旋转星系'"></logo>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getSize, initRenderer } from '@/utils/three';
import logo from '@/components/logo.vue';
type GalaxyParams = {
    count: number; // 粒子总数
    size: number; // 粒子大小
    radius: number; // 最大半径
    branch: number; // 分支数
    rotateScale: number; // 偏移量
    centerColor: string; // 中点粒子颜色
    endColor: string; // 末端粒子颜色
};

const galaxy = ref<HTMLElement>();
const galaxyParams: GalaxyParams = {
    count: 10000,
    size: 0.1,
    radius: 5,
    branch: 6,
    rotateScale: 0.3,
    centerColor: '#ff6030',
    endColor: '#1b3984',
};

const generateGalaxy = (params: GalaxyParams = galaxyParams) => {
    const colors = new Float32Array(params.count * 3);
    const positions = new Float32Array(params.count * 3);
    for (let i = 0; i < params.count; i++) {
        const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch);
        // 当前点距离圆心的距离
        const distance = Math.random() * params.radius * Math.pow(Math.random(), 3);
        const current = i * 3;
        const randomX = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / params.radius;
        const randomY = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / params.radius;
        const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / params.radius;

        positions[current] = Math.cos(branchAngel + distance * params.rotateScale) * distance + randomX;
        positions[current + 1] = 0 + randomY;
        positions[current + 2] = Math.sin(branchAngel + distance * params.rotateScale) * distance + randomZ;

        // 颜色设置
        const centerColor = new THREE.Color(params.centerColor);
        const endColor = new THREE.Color(params.endColor);
        const mixColor = centerColor.clone().lerp(endColor, distance / params.radius);
        colors[current] = mixColor.r;
        colors[current + 1] = mixColor.g;
        colors[current + 2] = mixColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./assets/images/point/particles/1.png');
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: galaxyParams.size, // 点材质的大小
        map: texture,
        alphaMap: texture,
        transparent: true,
        depthWrite: false, //渲染此材质对深度缓冲区无影响
        blending: THREE.AdditiveBlending,
        vertexColors: true, // 开始顶点颜色
    });
    const points = new THREE.Points(geometry, material);
    return points;
};

const init = () => {
    if (galaxy.value) {
        const dom = galaxy.value;
        const sizes = getSize(dom);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        camera.position.set(0, 6, 0);
        scene.add(camera);
        const points = generateGalaxy();
        scene.add(points);
        const renderer = initRenderer(sizes.width, sizes.height);
        dom.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const clock = new THREE.Clock();
        const animate = () => {
            const time = clock.getElapsedTime();
            controls.update();
            renderer.render(scene, camera);
            points.rotation.y = time * 0.5;
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
