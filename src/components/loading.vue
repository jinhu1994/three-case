<template>
    <div class="loading-wrapper">
        <div class="container">
            <span>Loading</span>
            <div class="circle">
                <div class="ring"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup></script>
<style lang="less" scoped>
@import '../assets/style/animate.less';

.loading-wrapper {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(7, 15, 26);

    .container {
        position: relative;
        height: 150px;
        width: 250px;

        span {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: rgb(20, 129, 202);
            text-shadow: 0 0 10px rgb(20, 129, 202), 0 0 30px rgb(20, 129, 202), 0 0 60px rgb(20, 129, 202),
                0 0 100px rgb(20, 129, 202);
            font-size: 18px;
            z-index: 1;
        }

        .circle {
            position: relative;
            margin: 0 auto;
            height: 150px;
            width: 150px;
            background-color: rgb(13, 10, 37);
            border-radius: 50%;
            animation: turn-around 2s linear infinite;
        }

        .circle::after {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            background-color: rgb(7, 15, 26);
            border-radius: 50%;
        }

        .ring {
            position: absolute;
            top: 0;
            left: 0;
            width: 75px;
            height: 150px;
            background-image: linear-gradient(180deg, rgb(22, 121, 252), transparent 80%);
            border-radius: 75px 0 0 75px;
        }

        .ring::after {
            content: '';
            position: absolute;
            right: -5px;
            top: -2.5px;
            width: 15px;
            height: 15px;
            background-color: rgb(40, 124, 202);
            box-shadow: 0 0 5px rgb(40, 151, 202), 0 0 10px rgb(40, 124, 202), 0 0 20px rgb(40, 124, 202),
                0 0 30px rgb(40, 124, 202), 0 0 40px rgb(40, 124, 202), 0 0 50px rgb(40, 124, 202),
                0 0 60px rgb(40, 124, 202), 0 0 60px rgb(40, 124, 202);
            border-radius: 50%;
            z-index: 1;
        }
    }
}
</style>
