<template>
    <div ref="css3dRef" class="example-wrapper" style="background: #000000">
        <logo :label="'元素周期表'"></logo>
        <div id="menu">
            <button id="table">TABLE</button>
            <button id="sphere">SPHERE</button>
            <button id="helix">HELIX</button>
            <button id="grid">GRID</button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import logo from '@/components/logo.vue';
import { onMounted, ref } from 'vue';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import * as TWEEN from '@tweenjs/tween.js';
import { getSize, initRenderer } from '@/utils/three';
import { TableItem, table } from './3dData';

type Target = {
    table: THREE.Object3D[];
    sphere: THREE.Object3D[];
    helix: THREE.Object3D[];
    grid: THREE.Object3D[];
};

const css3dRef = ref<HTMLElement | null>(null);

const objects: CSS3DObject[] = [];
const targets: Target = { table: [], sphere: [], helix: [], grid: [] };

const init = () => {
    const domEle = css3dRef.value;

    if (domEle) {
        const sizes = getSize(domEle);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 10000);
        camera.position.set(0, 0, 3000);

        table.forEach((item, i) => {
            const element = document.createElement('div');
            element.classList.add('element');
            element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

            const number = document.createElement('div');
            number.classList.add('number');
            number.innerText = (i + 1).toString();
            element.appendChild(number);

            const symbol = document.createElement('div');
            symbol.classList.add('symbol');
            symbol.innerText = item.shortName;
            element.appendChild(symbol);

            const details = document.createElement('div');
            details.classList.add('details');
            details.innerHTML = `${item.fullName}<br>${item.atomicNumber}`;
            element.appendChild(details);

            const objectCSS = new CSS3DObject(element);
            objectCSS.position.x = Math.random() * 4000 - 2000;
            objectCSS.position.y = Math.random() * 4000 - 2000;
            objectCSS.position.z = Math.random() * 4000 - 2000;
            scene.add(objectCSS);
            objects.push(objectCSS);

            const object = new THREE.Object3D();
            object.position.x = item.column * 140 - 1330;
            object.position.y = -item.row * 180 + 990;
            targets.table.push(object);
        });

        const vector = new THREE.Vector3();
        // sphere
        objects.forEach((item, i) => {
            const phi = Math.acos(-1 + (2 * i) / objects.length);
            const theta = Math.sqrt(objects.length * Math.PI) * phi;
            const object = new THREE.Object3D();
            // 从球坐标中的radius、phi和theta设置该向量。
            object.position.setFromSphericalCoords(800, phi, theta);
            // 将该向量与传入的标量进行相乘
            vector.copy(object.position).multiplyScalar(2);
            object.lookAt(vector);
            targets.sphere.push(object);
        });

        // helix
        objects.forEach((item, i) => {
            const theta = i * 0.175 + Math.PI;
            const y = -(i * 8) + 450;
            const object = new THREE.Object3D();
            // 从圆柱坐标中的radius、theta和y设置该向量。
            object.position.setFromCylindricalCoords(900, theta, y);
            vector.x = object.position.x * 2;
            vector.y = object.position.y;
            vector.z = object.position.z * 2;
            object.lookAt(vector);
            targets.helix.push(object);
        });

        // grid
        objects.forEach((item, i) => {
            const object = new THREE.Object3D();
            object.position.x = (i % 5) * 400 - 800;
            object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
            object.position.z = Math.floor(i / 25) * 1000 - 2000;
            targets.grid.push(object);
        });

        const renderer = new CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        domEle.appendChild(renderer.domElement);

        const controls = new TrackballControls(camera, renderer.domElement);
        controls.minDistance = 500;
        controls.maxDistance = 6000;
        controls.addEventListener('change', render);

        // 添加 table 按钮的点击事件
        const buttonTable = document.getElementById('table');
        buttonTable?.addEventListener('click', function () {
            transform(targets.table, 2000);
        });

        // 添加 sphere 按钮的点击事件
        const buttonSphere = document.getElementById('sphere');
        buttonSphere?.addEventListener('click', function () {
            transform(targets.sphere, 2000);
        });

        // 添加 helix 按钮的点击事件
        const buttonHelix = document.getElementById('helix');
        buttonHelix?.addEventListener('click', function () {
            transform(targets.helix, 2000);
        });

        // 添加 grid 按钮的点击事件
        const buttonGrid = document.getElementById('grid');
        buttonGrid?.addEventListener('click', function () {
            transform(targets.grid, 2000);
        });

        transform(targets.table, 2000);

        function transform(targets: THREE.Object3D[], duration: number) {
            TWEEN.removeAll();

            objects.forEach((object, i) => {
                const target = targets[i];
                new TWEEN.Tween(object.position)
                    .to(
                        { x: target.position.x, y: target.position.y, z: target.position.z },
                        Math.random() * duration + duration,
                    )
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();

                new TWEEN.Tween(object.rotation)
                    .to(
                        { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
                        Math.random() * duration + duration,
                    )
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            });

            new TWEEN.Tween({})
                .to({}, duration * 2)
                .onUpdate(render)
                .start();
        }

        function animate() {
            requestAnimationFrame(animate);
            TWEEN.update();
            controls.update();
        }

        animate();

        function render() {
            renderer.render(scene, camera);
        }
    }
};

onMounted(() => {
    init();
});
</script>
<style lang="less">
a {
    color: #8ff;
}

#menu {
    position: absolute;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    column-gap: 16px;
    z-index: 1;

    button {
        color: rgba(127, 255, 255, 0.75);
        background: transparent;
        outline: 1px solid rgba(127, 255, 255, 0.75);
        border: 0px;
        padding: 5px 10px;
        cursor: pointer;

        &:hover {
            background-color: rgba(0, 255, 255, 0.5);
        }

        &:active {
            color: #000000;
            background-color: rgba(0, 255, 255, 0.75);
        }
    }
}

.element {
    width: 120px;
    height: 160px;
    box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
    border: 1px solid rgba(127, 255, 255, 0.25);
    font-family: Helvetica, sans-serif;
    text-align: center;
    line-height: normal;
    cursor: default;

    &:hover {
        box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
        border: 1px solid rgba(127, 255, 255, 0.75);
    }

    .number {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 12px;
        color: rgba(127, 255, 255, 0.75);
    }

    .symbol {
        position: absolute;
        top: 40px;
        left: 0px;
        right: 0px;
        font-size: 60px;
        font-weight: bold;
        color: rgba(255, 255, 255, 0.75);
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
    }

    .details {
        position: absolute;
        bottom: 15px;
        left: 0px;
        right: 0px;
        font-size: 12px;
        color: rgba(127, 255, 255, 0.75);
    }
}
</style>
