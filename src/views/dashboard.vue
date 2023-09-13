<template>
    <div class="home-wrapper">
        <h2>Three.js 3D 案例合集</h2>
        <section>
            <div v-for="(route, index) in allRoutes" :key="index" class="case-wrapper">
                <h3>{{ route.meta?.title }}：</h3>
                <ul v-if="route.children">
                    <li v-for="(childrenRoute, cIndex) in route.children" :key="`${index}-${cIndex}`">
                        <a :href="`#${route.path}/${childrenRoute.path}`" target="_blank">
                            {{ childrenRoute.meta?.title }}
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { RouteRecordRaw, useRouter } from 'vue-router';
const router = useRouter();
const allRoutes: RouteRecordRaw[] = reactive([]);
router.options.routes.forEach((x: RouteRecordRaw, i: number) => {
    if (i !== 0) {
        allRoutes.push(x);
    }
});
</script>

<style lang="less" scoped>
.home-wrapper {
    width: 100%;
    height: 100%;
    overflow-y: auto;

    h2 {
        margin: 20px 0;
        font-size: 32px;
        line-height: 2;
        font-weight: bold;
        text-align: center;
    }

    section {
        padding: 16px;

        .case-wrapper {
            padding: 24px;
            margin-top: 24px;
            border-radius: 8px;
            background: rgba(86, 141, 229, 0.3);

            &:first-child {
                margin-top: 0;
            }

            h3 {
                margin-bottom: 12px;
                font-size: 20px;
                line-height: 1.5;
                font-weight: 600;
            }

            ul {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;

                li {
                    height: 20px;
                    line-height: 20px;

                    a {
                        text-decoration: none;
                    }
                }
            }
        }
    }
}
</style>
