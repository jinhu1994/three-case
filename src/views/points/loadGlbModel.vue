<template>
    <div ref="loadGlbModel" class="example-wrapper"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getSize, initRenderer } from '@/utils/three';
import { getStaticResourceUrl } from '@/utils/common';

const loadGlbModel = ref(null);

const init = () => {
    const dom = loadGlbModel.value;
    if (dom) {
        const sizes = getSize(dom);
        const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0xffffff);
        // const camera = new THREE.OrthographicCamera(
        //     sizes.width / -2,
        //     sizes.width / 2,
        //     sizes.height / 2,
        //     sizes.height / -2,
        //     1,
        //     1000,
        // );
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        camera.position.set(0, 0, 10);
        scene.add(camera);

        // 加载gltf模型
        const glftLoader = new GLTFLoader();
        glftLoader.loadAsync(getStaticResourceUrl('矿卡.glb', '/src/assets/model/')).then((gltf) => {
            let carMesh = gltf.scene;
            // 需要 自发光处理，否则会比较暗淡
            carMesh.traverse(function (child) {
                if (child.isMesh) {
                    child.material.emissive = child.material.color;
                    child.material.emissiveMap = child.material.map;
                }
            });
            // carMesh.rotation.x = Math.PI / 2;
            scene.add(carMesh);
        });

        const renderer = initRenderer(sizes.width, sizes.height);
        renderer.outputEncoding = THREE.sRGBEncoding;
        dom.appendChild(renderer.domElement);

        // 添加控制器
        const controls = new OrbitControls(camera, renderer.domElement);

        // 添加坐标轴辅助器 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
        const axesHelper = new THREE.AxesHelper(500);
        scene.add(axesHelper);

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
