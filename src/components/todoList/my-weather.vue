<template>
    <!--天气div-->
    <div id="weatherLogoDiv">
        <a><img id="weatherLogo" alt="天气图标" src="../../assets/weather.png" @mouseenter="userMouseEnter" /></a>
    </div>

    <!--天气组件的div-->
    <div id="weatherDiv">
        <!--引入第三方天气组件-->
        <yy-weather v-show="isShowWeather"></yy-weather>
    </div>
</template>

<script>
// 引入天气的组件
import YyWeather from "@/components/todoList/yy-weather";
// 引入mitt库，用于高效率的组件间通信
import emitter from "@/jsFunction/eventbus";

export default {
    name: "my-weather",
    data() {
        return {
            // 是否展示天气
            isShowWeather: false,
        };
    },
    components: { YyWeather },
    mounted() {
        // 监听子组件的消息
        emitter.on("是否关闭天气模块", (message) => {
            if (message === "是") {
                this.isShowWeather = false;
            }
        });
    },
    methods: {
        // 当用户指针进入时
        userMouseEnter() {
            // 清除计时器，防止isShowCheckLogin设置为false，因为用户进入了，窗口不能消失
            clearTimeout(this.showTimeout);
            this.isShowWeather = true;
        },
    },
};
</script>

<style scoped>
/*天气图标的div*/
#weatherLogoDiv {
    position: absolute;
    display: flex;
    justify-content: flex-start;
}

/*天气图标*/
#weatherLogo {
    width: 30px;
    filter: drop-shadow(-20px -20px 14px rgb(51, 51, 51));
    margin-top: 3vh;
    margin-left: 1.4vw;
    /*禁止被选中*/
    user-select: none;
    /*从右边开始排列*/
    justify-content: flex-start;
}
</style>