<template>
    <!--过渡标签一定要在最外面-->
    <transition name="weatherTransition">
        <div class="weather" @mouseleave="userMouseleave" @mouseenter="enterWeather">
            <!--整个天气组件的div-->
            <div id="he-plugin-standard"></div>
        </div>
    </transition>
</template>

<script>
import { defineComponent, onMounted } from "vue";
// 引入mitt库，用于高效率的组件间通信
import emitter from "@/jsFunction/eventbus";

window.WIDGET = {
    CONFIG: {
        layout: "2",
        width: 200,
        height: 240,
        background: "1",
        dataColor: "FFFFFF",
        borderRadius: "8",
        key: "acd15facbafa4a96ae4c4784525ddd8b",
    },
};
export default defineComponent({
    data() {
        return {
            // 关闭天气模块的定时器，用于特殊情况下取消关闭（只需清除定时器）
            closeTimeout: null,
        };
    },
    // Vue3.0的写法
    setup() {
        onMounted(() => {
            weather();
        });
        // 引入获取天气的源，会自动获取用户当前的IP，并进行城市的定位（但用”移动网络/蜂窝网络/手机流量“会无法定位到）
        const weather = () => {
            const s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0";
            document.body.appendChild(s);
        };
        return {};
    },
    methods: {
        // 用户指针离开时
        userMouseleave() {
            // 1.5秒后通知父组件关闭天气模块
            this.closeTimeout = setTimeout(() => {
                emitter.emit("是否关闭天气模块", "是");
            }, 1500);
            
        },
        // 鼠标移进天气模块
        enterWeather() {
            // 清除计时器，取消关闭
            clearTimeout(this.closeTimeout);
        },
    },
});
</script>
<style lang="scss" scoped>
.weather {
    /*脱离文档流*/
    position: absolute;
    /*位于上方*/
    z-index: 1;
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 50%));
    margin-top: 1vh;
    margin-left: 0.6vw;
    /*填充到底部，因为如果不填充，下拉列表不会判断为该组件的一部分，导致鼠标移动到列表时，会判断为鼠标离开*/
    padding-bottom: 220px;
}

/*Vue的动画，这里指动画出现*/
.weatherTransition-enter-active {
    animation: slide-in-fwd-left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/*当动画关闭时*/
.weatherTransition-leave-active {
    animation: slide-in-fwd-left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both reverse;
}

@keyframes slide-in-fwd-left {
    0% {
        -webkit-transform: translateX(-200px);
        transform: translateX(-200px);
        opacity: 0;
    }
    100% {
        -webkit-transform: translateZ(0) translateX(0);
        transform: translateZ(0) translateX(0);
        opacity: 1;
    }
}
</style>