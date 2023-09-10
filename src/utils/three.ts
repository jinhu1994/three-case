import * as THREE from 'three';
import { GuiParams, Size } from '@/types/three';

// 获取画布大小
const getSize = (canvas: Element): Size => {
    const sizes: Size = {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
    };
    return sizes;
};

// 初始化场景
const initRenderer = (width: number, height: number): THREE.WebGLRenderer => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return renderer;
};

const initLilGui = (controls: Record<string, any>,guiConfig: Record<string, GuiParams>) => {}


export { getSize, initRenderer, initLilGui };
