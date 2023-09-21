<template>
    <div class="example-wrapper">
        <div class="left"></div>
        <div class="right" ref="stackBlocks"></div>
    </div>
</template>
<script lang="ts" setup>
import * as THREE from 'three';
import { onMounted, ref } from 'vue';
import { getSize, initRenderer } from '@/utils/three';
import { Size } from '@/types/three';

interface InitData {
    camera: THREE.PerspectiveCamera | null;
    scene: THREE.Scene | null;
    renderer: THREE.WebGLRenderer | null;
    plane: THREE.Mesh | null;
    pointer: THREE.Vec2;
    raycaster: THREE.Raycaster;
    rollOverMesh: THREE.Mesh | null;
    rollOverMaterial: THREE.MeshBasicMaterial | null;
    cubeGeo: THREE.BoxGeometry | null;
    cubeMaterial: THREE.MeshLambertMaterial | null;
    objects: any;
    isShiftDown: boolean;
    size: Size;
}

const stackBlocks = ref<HTMLElement | null>(null);
const initData: InitData = {
    camera: null,
    scene: null,
    renderer: null,
    plane: null,
    pointer: new THREE.Vector2(),
    raycaster: new THREE.Raycaster(),
    rollOverMesh: null,
    rollOverMaterial: null,
    cubeGeo: null,
    cubeMaterial: null,
    objects: [],
    isShiftDown: false,
    size: {
        width: 0,
        height: 0,
    },
};

const render = () => {
    if (initData.renderer && initData.scene && initData.camera) {
        initData.renderer.render(initData.scene, initData.camera);
    }
};

const onWindowResize = () => {
    if (initData.camera && initData.renderer) {
        initData.camera.aspect = window.innerWidth / window.innerHeight;
        initData.camera.updateProjectionMatrix();
        initData.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    render();
};

const onPointerMove = (event: MouseEvent) => {
    if (initData.camera && initData.rollOverMesh) {
        initData.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        initData.pointer.y = (event.clientY / window.innerWidth) * 2 - 1;
        initData.raycaster.setFromCamera(initData.pointer, initData.camera);
        const intersects = initData.raycaster.intersectObjects(initData.objects, false);

        if (intersects.length) {
            const intersect = intersects[0];
            const vec3 = intersect.face?.normal || new THREE.Vector3();
            initData.rollOverMesh.position.copy(intersect.point).add(vec3);
            initData.rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(2);
            render();
        }
    }
};

const onPointerDown = (event: MouseEvent) => {
    if (initData.camera && initData.plane && initData.scene && initData.cubeGeo && initData.cubeMaterial) {
        initData.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        initData.pointer.y = (event.clientY / window.innerWidth) * 2 - 1;
        initData.raycaster.setFromCamera(initData.pointer, initData.camera);
        const intersects = initData.raycaster.intersectObjects(initData.objects, false);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            // delete cube
            if (initData.isShiftDown) {
                if (intersect.object !== initData.plane) {
                    initData.scene.remove(intersect.object);
                    initData.objects.splice(initData.objects.indexOf(intersect.object), 1);
                }
                // create cube
            } else {
                const voxel = new THREE.Mesh(initData.cubeGeo, initData.cubeMaterial);
                voxel.position.copy(intersect.point).add(intersect.face?.normal || new THREE.Vector3());
                voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                initData.scene.add(voxel);
                initData.objects.push(voxel);
            }

            render();
        }
    }
};

const onDocumentKeyDown = (event: any) => {
    switch (event.keyCode) {
        case 16:
            initData.isShiftDown = true;
            break;
    }
};

const onDocumentKeyUp = (event: any) => {
    switch (event.keyCode) {
        case 16:
            initData.isShiftDown = false;
            break;
    }
};

const init = () => {
    const dom = stackBlocks.value;
    if (dom) {
        initData.size = getSize(dom);
        initData.scene = new THREE.Scene();
        initData.scene.background = new THREE.Color(0xf0f0f0);
        initData.camera = new THREE.PerspectiveCamera(45, initData.size.width / initData.size.height, 0.1, 10000);
        initData.camera.position.set(500, 800, 1300);
        initData.camera.lookAt(0, 0, 0);
        initData.scene.add(initData.camera);

        const rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
        const rollOverMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.5,
            transparent: true,
        });
        initData.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
        initData.scene.add(initData.rollOverMesh);

        //
        initData.cubeGeo = new THREE.BoxGeometry(50, 50, 50);
        initData.cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0xfeb74c,
            map: new THREE.TextureLoader().load('./src/assets/images/raycaster/square-outline-textured.png'),
        });

        // 创建网格
        const gridHelper = new THREE.GridHelper(1000, 20);
        initData.scene.add(gridHelper);

        const geometry = new THREE.PlaneGeometry(1000, 1000);
        geometry.rotateX(-Math.PI / 2);

        initData.plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        initData.scene.add(initData.plane);
        initData.objects.push(initData.plane);

        const ambientLight = new THREE.AmbientLight(0x606060);
        initData.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        initData.scene.add(directionalLight);

        initData.renderer = initRenderer(initData.size.width, initData.size.height);
        dom.appendChild(initData.renderer.domElement);

        const helper = new THREE.AxesHelper(1000);
        initData.scene.add(helper);

        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onDocumentKeyDown);
        document.addEventListener('keyup', onDocumentKeyUp);
        window.addEventListener('resize', onWindowResize);
    }
};

onMounted(() => {
    init();
    render();
});
</script>
<style lang="less" scoped>
.example-wrapper {
    display: flex;

    .left {
        flex: 1;
    }

    .right {
        width: 1560px;
    }
}
</style>
