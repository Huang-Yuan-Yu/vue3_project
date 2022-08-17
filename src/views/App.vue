<template>
    <div id="app">
        <!--路由切换动画；另外要注意！含有router-view的组件不用写在路由配置里！-->
        <router-view v-slot="{ Component }">
            <transition name="routerTransition">
                <component :is="Component"></component>
            </transition>
        </router-view>
    </div>
</template>

<script>
export default {
    name: "App",
};
</script>

<style scoped>
.routerTransition-enter-active {
    animation: routerAnimation 0.3s ease-in-out;
}

/*逐渐显现的动画*/
@keyframes routerAnimation {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>