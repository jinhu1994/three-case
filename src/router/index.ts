import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('../views/dashboard.vue'),
        meta: { title: '3D案例集锦' },
    },
    {
        path: '/points',
        meta: { title: '粒子系统' },
        children: [
            {
                path: 'basic',
                component: () => import('@/views/points/basic.vue'),
                meta: { title: '初识points以及点材质' },
            },
            {
                path: 'particles',
                component: () => import('@/views/points/particles.vue'),
                meta: { title: '星空' },
            },
            {
                path: 'snowflake',
                component: () => import('@/views/points/snowflake.vue'),
                meta: { title: '雪花' },
            },
            {
                path: 'galaxy',
                component: () => import('@/views/points/galaxy.vue'),
                meta: { title: '星系' },
            },
            {
                path: 'glb',
                component: () => import('@/views/points/loadGlbModel.vue'),
                meta: { title: '加载GLB模型' },
            },
        ],
    },
    {
        path: '/raycaster',
        meta: { title: '光线投射' },
        children: [
            {
                path: 'stackBlocks',
                component: () => import('@/views/raycaster/stack-blocks.vue'),
                meta: { title: '堆积木' },
            },
        ],
    },
    {
        path: '/physics',
        meta: { title: '物理引擎' },
        children: [
            {
                path: 'index',
                component: () => import('@/views/cannon/index.vue'),
                meta: { title: '初识cannon-es' },
            },
        ],
    },
    {
        path: '/shader',
        meta: { title: '着色器' },
        children: [
            {
                path: 'basic',
                component: () => import('@/views/shader/basic/index.vue'),
                meta: { title: '初始着色器' },
            },
            {
                path: 'lantern',
                component: () => import('@/views/shader/lantern/index.vue'),
                meta: { title: '孔明灯' },
            },
            {
                path: 'cloud',
                component: () => import('@/views/shader/cloud/index.vue'),
                meta: { title: '烟雾水云' },
            },
        ],
    },
    {
        path: '/shaderMaterial',
        meta: { title: '着色器加工材质：Material.onBeforeCompile的用法' },
        children: [
            {
                path: 'process',
                component: () => import('@/views/materialProcess/process/index.vue'),
                meta: { title: '材质加工' },
            },
        ],
    },
    {
        path: '/effect',
        meta: { title: '效果合成与后期处理' },
        children: [
            {
                path: 'shaderEffect',
                component: () => import('@/views/effect/shaderEffect/index.vue'),
                meta: { title: 'shaderPass 示例' },
            },
        ],
    },
    {
        path: '/cssRender',
        meta: { title: 'CSS渲染器' },
        children: [
            {
                path: 'CSS2D',
                component: () => import('@/views/cssRender/2d.vue'),
                meta: { title: 'CSS2D渲染器示例' },
            },
            {
                path: 'CSS3D',
                component: () => import('@/views/cssRender/3d.vue'),
                meta: { title: 'CSS3D渲染器示例' },
            },
        ],
    },
    {
        path: '/case',
        meta: { title: '综合案例' },
        children: [
            {
                path: 'fireworks',
                component: () => import('@/views/case/fireworks/index.vue'),
                meta: { title: '烟花' },
            },
            {
                path: 'panoramic',
                component: () => import('@/views/case/panoramic/index.vue'),
                meta: { title: '全景看房' },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});

router.beforeEach((to, from, next) => {
    document.title = (to.meta?.title as string) + ' · Kinghoo';
    next();
});

export default router;
