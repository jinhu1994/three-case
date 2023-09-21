<template>
    <div ref="cannonEs" class="example-wrapper"></div>
</template>
<script lang="ts" setup>
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getSize, initRenderer } from '@/utils/three';
import { onMounted, ref } from 'vue';
import mp3 from '@/assets/audio/metalHit.mp3';

type SphereItem = {
    mesh: THREE.Mesh;
    world: CANNON.Body;
};

const cannonEs = ref<HTMLElement | null>(null);

const init = () => {
    const dom = cannonEs.value;
    if (dom) {
        const scene = new THREE.Scene();

        const sizes = getSize(dom);
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
        camera.position.set(0, 0, 20);
        scene.add(camera);

        const floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20), new THREE.MeshStandardMaterial());
        floor.position.set(0, -5, 0);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        // 创建物理世界
        const world = new CANNON.World();
        world.gravity.set(0, -9.8, 0); // 设置重力加速度
        // 创建物理世界小球材质
        const shpereWorldMaterial = new CANNON.Material('sphere');
        // 创建击打声音
        const hitSound = new Audio(mp3);
        const sphereArr: SphereItem[] = [];
        const createCube = () => {
            // 创建渲染器小球
            const cudeGeometry = new THREE.BoxGeometry(1, 1, 1);
            const cudeMaterial = new THREE.MeshStandardMaterial();
            const sphere = new THREE.Mesh(cudeGeometry, cudeMaterial);
            sphere.castShadow = true;
            scene.add(sphere);

            // 创建物理世界的小球
            const cudeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
            // 创建物理世界的物体
            const cudeBody = new CANNON.Body({
                shape: cudeShape, // 小球形状
                position: new CANNON.Vec3(0, 0, 0), // 小球位置
                mass: 1, // 小球重量
                material: shpereWorldMaterial,
            });

            // 给物理世界物体施加作用力
            cudeBody.applyLocalForce(
                new CANNON.Vec3(200, 0, 0), // 作用力的大小以及方向
                new CANNON.Vec3(0, 0, 0), // 作用力的位置
            );
            world.addBody(cudeBody);

            // 添加监听碰撞事件
            cudeBody.addEventListener('collide', (e: any) => {
                // 获取碰撞强度
                const impactStrength = e.contact.getImpactVelocityAlongNormal() as number;
                if (impactStrength > 1) {
                    //   重新从零开始播放
                    hitSound.currentTime = 0;
                    // 音量区间[0, 1]
                    const volume = impactStrength / 10;
                    hitSound.volume = volume >= 1 ? 1 : volume;
                    hitSound.autoplay = true;
                }
            });

            sphereArr.push({
                mesh: sphere,
                world: cudeBody,
            });
        };

        //  创建物理世界地面
        const physicsFloor = new CANNON.Plane();
        const floorMaterial = new CANNON.Material('floor');
        const floorBody = new CANNON.Body({
            mass: 0, // 0不表示质量为0，它会使得物体保持不动,
            shape: physicsFloor,
            material: floorMaterial,
            position: new CANNON.Vec3(0, -5, 0),
            quaternion: new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2), // 设置物理世界的旋转
        });
        world.addBody(floorBody);

        // 设置2种材料的碰撞参数
        const defaultContactMaterial = new CANNON.ContactMaterial(shpereWorldMaterial, floorMaterial, {
            friction: 0.1, // 摩擦力
            restitution: 0.7, // 弹性
        });
        // 将材料的关联设置添加的物理世界
        world.addContactMaterial(defaultContactMaterial);

        window.addEventListener('click', createCube);

        // 添加环境光、平行光
        const ambienLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambienLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.castShadow = true;
        scene.add(dirLight);
        const renderer = initRenderer(sizes.width, sizes.height);
        renderer.shadowMap.enabled = true; // 开启阴影
        // 添加控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        // 添加坐标轴辅助器
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        dom.appendChild(renderer.domElement);

        const clock = new THREE.Clock();
        const animate = () => {
            const deltaTime = clock.getDelta();
            controls.update();
            // 更新物理引擎里世界的物体
            world.step(1 / 120, deltaTime);
            sphereArr.forEach((item) => {
                const position = item.world.position;
                const quaternion = item.world.quaternion;
                item.mesh.position.set(position.x, position.y, position.z);
                item.mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            });
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
<style lang="less" scoped></style>
