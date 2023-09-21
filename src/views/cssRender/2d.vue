<template>
    <div ref="css2dRef" class="example-wrapper">
        <logo :label="'CSS2DRenderer示例'"></logo>
    </div>
</template>
<script lang="ts" setup>
import logo from '@/components/logo.vue';
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { getSize, initRenderer } from '@/utils/three';
import { getStaticResourceUrl } from '@/utils/common';

const css2dRef = ref<HTMLElement | null>(null);
const EARTH_RADIUS = 1;
const MOON_RADIUS = 0.27;

const init = () => {
    const domEle = css2dRef.value;

    if (domEle) {
        const sizes = getSize(domEle);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 200);
        camera.position.set(0, -15, 2);

        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(0, 0, 1);
        scene.add(dirLight);

        const light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        const textureLoader = new THREE.TextureLoader();
        const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x999999,
            shininess: 5,
            map: textureLoader.load(getStaticResourceUrl('earth_atmos_4096.jpg', '/src/assets/texture/planets/')),
            specularMap: textureLoader.load(
                getStaticResourceUrl('earth_specular_2048.jpg', '/src/assets/texture/planets/'),
            ),
            normalMap: textureLoader.load(
                getStaticResourceUrl('earth_normal_2048.jpg', '/src/assets/texture/planets/'),
            ),
            normalScale: new THREE.Vector2(0.85, 0.85),
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);

        const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 64, 64);
        const moonMaterial = new THREE.MeshPhongMaterial({
            shininess: 5,
            map: textureLoader.load(getStaticResourceUrl('moon_1024.jpg', '/src/assets/texture/planets/')),
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        scene.add(moon);

        // 创建月球环绕椭圆轨道
        const curve = new THREE.EllipseCurve(
            0,
            0, // ax, aY
            6,
            3, // xRadius, yRadius
            0,
            2 * Math.PI, // aStartAngle, aEndAngle
            false, // aClockwise  椭圆是否按照顺时针方向来绘制
            0, // aRotation
        );
        const points = curve.getPoints(10000);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3 });
        const moonTrack = new THREE.Line(geometry, material);
        scene.add(moonTrack);

        // 添加地球提示标签
        const earthDiv = document.createElement('div');
        earthDiv.classList.add('label');
        earthDiv.innerText = 'Earth';
        const earthLabel = new CSS2DObject(earthDiv);
        earthLabel.position.set(1.5 * EARTH_RADIUS, 0, 0.15);
        earth.add(earthLabel);

        const earthMassDiv = document.createElement('div');
        earthMassDiv.className = 'label';
        earthMassDiv.textContent = '5.97237e24 kg';
        const earthMassLabel = new CSS2DObject(earthMassDiv);
        earthMassLabel.position.set(1.5 * EARTH_RADIUS + 0.45, 0, -0.15);
        earth.add(earthMassLabel);

        // 添加月球提示标签
        const moonDiv = document.createElement('div');
        moonDiv.classList.add('label');
        moonDiv.innerText = 'Moon';
        const moonLabel = new CSS2DObject(moonDiv);
        moonLabel.position.set(0.75, 0, 0.15);
        moon.add(moonLabel);

        const moonMassDiv = document.createElement('div');
        moonMassDiv.className = 'label';
        moonMassDiv.textContent = '7.342e22 kg';
        const moonMassLabel = new CSS2DObject(moonMassDiv);
        moonMassLabel.position.set(0.75 + 0.35, 0, -0.15);
        moon.add(moonMassLabel);

        // 实例化css2d的渲染器
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(sizes.width, sizes.height);
        // 解决HTML标签遮挡Canvas画布事件，导致相机控件OrbitControls的旋转、缩放等操作无效
        labelRenderer.domElement.style.pointerEvents = 'none';
        labelRenderer.domElement.style.position = 'fixed';
        labelRenderer.domElement.style.top = '0px';
        labelRenderer.domElement.style.left = '0px';

        const renderer = initRenderer(sizes.width, sizes.height);
        domEle.appendChild(renderer.domElement);
        domEle.appendChild(labelRenderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 5;
        controls.maxDistance = 100;

        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        const clock = new THREE.Clock();
        const raycaster = new THREE.Raycaster();
        const animate = () => {
            requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();
            const time = (elapsed / 10) % 1;
            const point = curve.getPoint(time);
            moon.position.set(point.x, point.y, 0);

            // 标签渲染器渲染
            labelRenderer.render(scene, camera);
            renderer.render(scene, camera);
        };

        animate();
    }
};

onMounted(() => {
    init();
});
</script>
<style lang="less">
.label {
    color: #fff;
    padding: 2px;
    background: transparent;
}
</style>
