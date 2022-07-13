// 为了兼容更多的浏览器而引入的插件
import 'core-js/stable'
import "regenerator-runtime/runtime";

// 这里是从vue文件中导入一个变量，这个变量要用{}括起来，否则在使用时只会提示object类型
// 叫“导入单个绑定”
import { createApp } from "vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

// 引入Element-Plus的CSS
import "element-plus/dist/index.css";
// 图标库
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 引入axios
import axios from "axios";
// 根组件:
import myTest from "@/root_components/my-test";
// import htmlEmail from "@/root_components/html-email"

axios.defaults.headers.post["Content-Type"] = "application/json";

// 创建Vue实例，并赋值给一个常量
const nowPage = createApp(myTest).use(store).use(router);
// Element-Plus的图标库
for (let [key, component] of Object.entries(ElementPlusIconsVue)) {
    nowPage.component(key, component);
}
// 全局使用axios，在代码中，只需要“this.$axios”即可
nowPage.config.globalProperties.$axios = axios;
nowPage.mount("#app");