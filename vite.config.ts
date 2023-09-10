import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    plugins: [vue()],

    build: {
        outDir: 'dist',
        assetsDir: 'assets', //指定静态资源存放路径
        sourcemap: false, //是否构建source map 文件
        minify: 'terser', // 混淆器，terser 构建后文件体积更小，'terser' | 'esbuild'
        chunkSizeWarningLimit: 1500, //chunk 大小警告的限制，默认500KB
        rollupOptions: {
            //  指定打包输出的js文件名称
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'js/[name]-[hash].js',
        },
        terserOptions: {
            // 生产环境移除console
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            // 10月更新
            output: {
                comments: true, // 去掉注释内容
            },
        },
    },
});
