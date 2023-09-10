import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';
import startVertex from '@/assets/shader/fireworks/start/vertex.glsl?raw';
import startFragment from '@/assets/shader/fireworks/start/fragment.glsl?raw';
import fireworksVertex from '@/assets/shader/fireworks/bomb/vertex.glsl?raw';
import fireworksFragment from '@/assets/shader/fireworks/bomb/fragment.glsl?raw';
import { getStaticResourceUrl } from '@/utils/common';

export default class FireWorks {
    [x: string]: any;
    /**
     * @description:
     * @param {THREE} color 烟花的颜色
     * @param {THREE} to 烟花发射后到达的位置
     * @param {THREE} from 烟花位置
     * @param {number} pointSize 烟花大小
     * @return {*}
     */
    constructor(
        color: THREE.Color,
        to: THREE.Vector3,
        from: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
        pointSize: number = 20,
        scene: THREE.Scene,
    ) {
        this.uuid = uuidv4();
        this.scene = scene;
        this.fireworksSize = pointSize;
        // 创建烟花模型
        this.startGeometry = new THREE.BufferGeometry();
        const startPositionArray = new Float32Array(3);
        startPositionArray[0] = from.x;
        startPositionArray[1] = from.y;
        startPositionArray[2] = from.z;
        this.startGeometry.setAttribute('position', new THREE.BufferAttribute(startPositionArray, 3));

        // 烟花材质
        this.startMetrial = new THREE.ShaderMaterial({
            vertexShader: startVertex,
            fragmentShader: startFragment,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                uTime: {
                    value: 0,
                },
                uSize: {
                    value: pointSize,
                },
                uColor: {
                    value: color,
                },
                uSpeed: {
                    value: new THREE.Vector3(to.x - from.x, to.y - from.y, to.z - from.z),
                },
            },
        });

        // 烟花
        this.startPoint = new THREE.Points(this.startGeometry, this.startMetrial);

        // 开始计时
        this.clock = new THREE.Clock();

        // 创建爆炸时烟花散开的几何体
        this.fireWorksGeometry = new THREE.BufferGeometry();
        const fireworksCount = 800 + Math.ceil(Math.random() * 199);
        const fireworksPosition = new Float32Array(fireworksCount * 3);
        const sizeScales = new Float32Array(fireworksCount);
        const directionArr = new Float32Array(fireworksCount * 3);

        for (let i = 0; i < fireworksCount; i++) {
            fireworksPosition[i * 3 + 0] = to.x;
            fireworksPosition[i * 3 + 1] = to.y;
            fireworksPosition[i * 3 + 2] = to.z;

            // 爆炸烟花粒子 初始大小
            sizeScales[i] = 1 - Math.abs(Math.random() - 0.8);

            // 爆炸烟花散开的方向
            let theta = Math.random() * 2 * Math.PI;
            let beta = Math.random() * 2 * Math.PI;
            let r = Math.random();

            directionArr[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta);
            directionArr[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta);
            directionArr[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta);
        }

        this.fireWorksGeometry.setAttribute('position', new THREE.BufferAttribute(fireworksPosition, 3));
        this.fireWorksGeometry.setAttribute('aSizeScale', new THREE.BufferAttribute(sizeScales, 1));
        this.fireWorksGeometry.setAttribute('aDirection', new THREE.BufferAttribute(directionArr, 3));

        // 烟花爆炸物材质
        this.fireworksMaterial = new THREE.ShaderMaterial({
            vertexShader: fireworksVertex,
            fragmentShader: fireworksFragment,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                uTime: {
                    value: 0,
                },
                uSize: {
                    value: 0,
                },
                uColor: {
                    value: color,
                },
            },
        });

        this.fireWorks = new THREE.Points(this.fireWorksGeometry, this.fireworksMaterial);

        // 创建音频
        this.launchListener = new THREE.AudioListener();
        this.bombListener = new THREE.AudioListener();
        this.launchSound = new THREE.Audio(this.launchListener);
        this.bombSound = new THREE.Audio(this.bombListener);

        // 创建音频加载器
        const audioLoader = new THREE.AudioLoader();
        // 烟花发射的声音
        audioLoader.load(
            getStaticResourceUrl(`pow${Math.floor(Math.random() * 4) + 1}.ogg`, '/src/assets/audio/fireworks/'),
            (buffer) => {
                this.launchSound.setBuffer(buffer);
                this.launchSound.setLoop(false);
                this.launchSound.setVolume(1);
            },
        );
        // 烟花爆炸的声音
        audioLoader.load(getStaticResourceUrl('send.mp3', '/src/assets/audio/fireworks/'), (buffer) => {
            this.bombSound.setBuffer(buffer);
            this.bombSound.setLoop(false);
            this.bombSound.setVolume(1);
        });
    }

    addScene(scene: THREE.Scene) {
        scene.add(this.startPoint);
        scene.add(this.fireWorks);
        this.scene = scene;
    }

    // 更新时间
    update() {
        const elapsedTime = this.clock.getElapsedTime();

        if (elapsedTime <= 1) {
            if (elapsedTime > 0.2) {
                if (!this.bombSound.isPlaying && !this.bombSoundplay) {
                    this.bombSound.play();
                    this.bombSoundplay = true;
                }
                this.startMetrial.uniforms.uTime.value = elapsedTime;
            }
        } else {
            // 经过1秒后 放出的烟花消失
            this.startMetrial.uniforms.uSize.value = 0;
            this.startPoint.clear();
            this.startGeometry.dispose();
            this.startMetrial.dispose();

            if (!this.launchSound.isPlaying && !this.play) {
                this.launchSound.play();
                this.play = true;
              }

            // 烟花开始爆炸
            const time = elapsedTime - 1;
            this.fireworksMaterial.uniforms.uTime.value = time;
            this.fireworksMaterial.uniforms.uSize.value = this.fireworksSize;

            if (time >= 3) {
                // 烟花爆炸完毕
                this.fireWorks.clear();
                this.fireWorksGeometry.dispose();
                this.fireworksMaterial.dispose();
                this.scene.remove(this.fireWorks);
                this.scene.remove(this.startPoint);
                return 'remove';
            }
        }
    }
}
