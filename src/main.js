// 为了兼容更多的浏览器而引入的插件
import "core-js/stable";
import "regenerator-runtime/runtime";

// 这里是从vue文件中导入一个变量，这个变量要用{}括起来，否则在使用时只会提示object类型
// 叫“导入单个绑定”
import {createApp} from "vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

// 引入Element-Plus的CSS
import "element-plus/dist/index.css";
// 图标库
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 引入axios
import axios from "axios";

// 提高滚动性能——npm i default-passive-events -S
import "default-passive-events";
// 视图
import App from "@/views/App";

// 引入nprogress，页面加载进度条——npm install --save nprogress
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
    easing: "ease", // 动画方式
    speed: 500, // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3, // 初始化时的最小百分比
});
router.beforeEach((to, from, next) => {
    // 每次切换页面时，调用进度条
    NProgress.start();
    // 这个一定要加，没有next()页面不会跳转的
    next();
});
router.afterEach(() => {
    // 在即将进入新的页面组件前，关闭掉进度条
    NProgress.done();
});

axios.defaults.headers.post["Content-Type"] = "application/json";

// 创建Vue实例，并赋值给一个常量
const nowPage = createApp(App).use(store).use(router);
// Element-Plus的图标库
for (let [key, component] of Object.entries(ElementPlusIconsVue)) {
    nowPage.component(key, component);
}
// 全局使用axios，在代码中，只需要“this.$axios”即可
nowPage.config.globalProperties.$axios = axios;
nowPage.mount("#app");