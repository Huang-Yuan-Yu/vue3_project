<template>
    <div id="my-weather">
        <!--天气div-->
        <div id="weatherLogoDiv">
            <a>
                <!--当isShowWeather为true时，则开始展示天气面板，同时就禁用提示-->
                <el-tooltip :disabled="isShowWeather" content="天气" effect="light" placement="bottom">
                    <img id="weatherLogo" alt="天气图标" src="../../assets/weather.png" @click="userMouseEnter" />
                </el-tooltip>
            </a>
        </div>

        <!--天气组件的div-->
        <div id="weatherDiv">
            <!--引入第三方天气组件-->
            <yy-weather v-show="isShowWeather"></yy-weather>
        </div>
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
            // 是否临时禁用展示天气
            isDisable: false,
        };
    },
    components: { YyWeather },
    watch: {
        // 监听决定是否展示的变量是否变化，这里是防止关闭之后，立即将鼠标移动到图标上，导致显示出来后又关闭
        isShowWeather() {
            // 当正在关闭时，这里时间设置为动画执行的时间——0.8秒
            if (this.isShowWeather === false) {
                this.isDisable = true;
                // 与关闭用的时间长度一样，1秒后就解除禁用
                setTimeout(() => {
                    this.isDisable = false;
                }, 800);
            }
        },
    },
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
            // 当没有禁用时，才能够显示天气模块
            if (this.isDisable === false) {
                // 清除计时器，防止isShowCheckLogin设置为false，因为用户进入了，窗口不能消失
                this.isShowWeather = true;
            }
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
    margin-top: 3vh;
    margin-left: 14px;
    /*为了让tooltip位于准确的地方*/
    padding-right: 2px;
    /*禁止被选中*/
    user-select: none;
    /*从右边开始排列*/
    justify-content: flex-start;
}

#weatherLogo:hover {
    cursor: url("../../assets/cursor/pointer.png"), pointer;
}

/*点击时的样式*/
#weatherLogo:active {
    filter: brightness(60%);
}
</style>