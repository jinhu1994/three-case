<template>
    <div class="v-logo-wrapper">
        <p class="box">
            <i class="icon"></i>
            <b class="text">{{ label }}</b>
        </p>
    </div>
</template>

<script lang="ts" setup>
defineProps<{ label: string }>();
</script>

<style lang="less" scoped>
@import '../assets/style/animate.less';

.v-logo-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 11;
    -webkit-animation: slide-in-left 1s 0.15s;
    animation: slide-in-left 1s 0.15s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;

    .box {
        display: inline-block;
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: space-around;
        overflow: hidden;
        padding: 4px 20px;
        border-radius: 0 0 16px 0;
        border: 2px groove rgba(255, 255, 255, 0.3);
        border-top: none;
        border-left: none;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

        .icon {
            display: inline-block;
            height: 64px;
            width: 64px;
            background: url('@/assets/images/common/icon-logo.png') no-repeat center;
            background-size: contain;
            margin-right: 12px;
        }

        .text {
            font-size: 20px;
            color: #fff;
            display: inline-block;
            font-weight: 500;
        }
    }
}
</style>
