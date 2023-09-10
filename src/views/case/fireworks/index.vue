<template>
    <div ref="fireworksEle" class="example-wrapper">
        <logo :label="'烟花'"></logo>
    </div>
</template>
<script lang="ts" setup>
import logo from '@/components/logo.vue';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Water } from 'three/examples/jsm/objects/water2';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, ref } from 'vue';
import { getSize, initRenderer } from '@/utils/three';
import { getStaticResourceUrl } from '@/utils/common';
import Fireworks from './fireworks';

const fireworksEle = ref<HTMLElement | null>(null)
//  创建的烟花集合
const fireworksArr = ref<Fireworks[]>([]);

const init = () => {
    const dom = fireworksEle.value;
    if (dom) {
        const sizes = getSize(dom);
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        camera.position.set(-48, 20, 8)

        // 加载环境贴图
        new RGBELoader().loadAsync(getStaticResourceUrl('2k.hdr', '/src/assets/images/lantern/')).then((texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
        });

        // 加载gltf模型
        new GLTFLoader().loadAsync(getStaticResourceUrl('newyears_min.glb', '/src/assets/model/')).then((glft) => {
            scene.add(glft.scene)

            // 创建水面
            const waterGeometry = new THREE.PlaneBufferGeometry(100, 100);
            let water = new Water(waterGeometry, {
                scale: 4,
                textureHeight: 1024,
                textureWidth: 1024,
            });
            water.position.y = 0.5;
            water.rotation.x = -Math.PI / 2;
            scene.add(water);

        })

        const renderer = initRenderer(sizes.width, sizes.height);
        renderer.outputEncoding = THREE.sRGBEncoding;
        // 色调映射 用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果。
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // 色调映射的曝光级别 默认是1
        renderer.toneMappingExposure = 0.2;
        dom.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);

        const animate = () => {
            fireworksArr.value.forEach((item, index) => {
                const res = item.update();
                if (res === 'remove') {
                    scene.remove(item.startPoint);
                    scene.remove(item.fireWorks);
                    fireworksArr.value.splice(index, 1);
                }
            })
            renderer.render(scene, camera);
            requestAnimationFrame(animate)
        }

        animate();

        /**
         * @description: 创建烟花
         * @return {*}
         */
        const createFireWorks = () => {
            // HSL颜色创建
            // H：Hue(色调)。0(或360)表示红色，120表示绿色，240表示蓝色，也可取其他数值来指定颜色。取值为：0 - 360
            // S：Saturation(饱和度)。取值为：0.0% - 100.0%
            // L：Lightness(亮度)。取值为：0.0% - 100.0%
            const color = `hsl(${Math.floor(Math.random() * 360)},100%,80%)`;
            const toPosition = new THREE.Vector3(
                (Math.random() - 0.5) * 24,
                15 + Math.random() * 5,
                Math.random() * 30 - 15,
            );
            const pointSize = 20 + Math.floor(Math.random() * 9);
            const firework = new Fireworks(new THREE.Color(color), toPosition, new THREE.Vector3(0, 1, 1), pointSize, scene);
            firework.addScene(scene);
            fireworksArr.value.push(firework);
        }

        window.addEventListener('click', () => {
            createFireWorks();
        })


    }
}

onMounted(() => {
    init();
})

</script>
<style lang="less" scoped></style>