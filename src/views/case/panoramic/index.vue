<template>
    <div ref="panoramicRef" class="example-wrapper"></div>
</template>
<script lang="ts" setup>
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from 'vue';
import { getSize, initRenderer } from '@/utils/three';
import { getStaticResourceUrl } from '@/utils/common';

const panoramicRef = ref<HTMLElement | null>(null);

const init = () => {
    const dom = panoramicRef.value;

    if (dom) {
        const sizes = getSize(dom);
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        camera.position.set(0, 0, 0);

        const renderer = initRenderer(sizes.width, sizes.height);
        dom.appendChild(renderer.domElement);

        const animate = () => {
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        animate();
    }
}

onMounted(() => {
    init();
})
</script>
<style lang="less" scoped></style>