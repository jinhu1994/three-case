<template>
    <div ref="lanternShader" class="example-wrapper">
        <logo :label="'孔明灯'"></logo>
    </div>
</template>
<script lang="ts" setup>
import logo from '@/components/logo.vue';
import gsap from "gsap";
import { getSize, initRenderer } from '@/utils/three';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from 'vue';
import { getStaticResourceUrl } from '@/utils/common';
import vertexShader from '@/assets/shader/lantern/vertex.glsl?raw';
import fragmentShader from '@/assets/shader/lantern/fragment.glsl?raw';

const lanternShader = ref<HTMLElement | null>(null);

const init = () => {
    const dom = lanternShader.value;
    if (dom) {
        const sizes = getSize(dom);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        camera.position.set(0, 0, 2)

        // 加载环境贴图
        new RGBELoader().loadAsync(getStaticResourceUrl('2k.hdr', '/src/assets/images/lantern/')).then((texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
        });

        // 预设shader材质
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
        })

        // 加载灯笼的物理模型
        const gltfLoader = new GLTFLoader();
        gltfLoader.loadAsync(getStaticResourceUrl('lantern.glb', '/src/assets/model/')).then((gltf: any) => {
            const lanternBox = gltf.scene.children[1];
            lanternBox.material = shaderMaterial;

            for (let i = 0; i < 200; i++) {
                let lantern = gltf.scene.clone(true)
                let x = (Math.random() - 0.5) * 300;
                let z = (Math.random() - 0.5) * 300;
                let y = Math.random() * 60 + 25;
                lantern.position.set(x, y, z);
                gsap.to(lantern.rotation, {
                    y: Math.PI * 2,
                    duration: 10 + Math.random() * 30,
                    repeat: -1

                })
                gsap.to(lantern.position, {
                    x: "+=" + Math.random() * 5,
                    y: "+=" + Math.random() * 20,
                    yoyo: true,
                    duration: 5 + Math.random() * 10,
                    repeat: -1,
                });
                scene.add(lantern)
            }
        })


        const renderer = initRenderer(sizes.width, sizes.height);
        renderer.outputEncoding = THREE.sRGBEncoding;
        // 色调映射 用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果。
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // 色调映射的曝光级别 默认是1
        renderer.toneMappingExposure = 0.2;
        dom.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        // 设置控制器阻尼
        controls.enableDamping = true;
        // 设置自动旋转
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.1;
        controls.maxPolarAngle = (Math.PI / 3) * 2;
        controls.minPolarAngle = (Math.PI / 3) * 1.5;

        const animate = () => {
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