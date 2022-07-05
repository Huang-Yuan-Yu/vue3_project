import { createStore } from "vuex";

// 导入外部自定义的JS文件，这是为了将每一块内容单独分开，不要全都写在这个index.js文件里
import state from "./state";
import mutations from "./mutations";
// 引用getters里的全部内容，并取别名为getters变量（注意！一定要这么写，不然会报错
import * as getters from "./getters";
import * as actions from "./actions";
import modules from "./modules";

export default createStore({
    // 只有不在生产环境下才开启Vuex的严格模式
    strict: process.env.NODE_ENV !== "production",
    // 使用ES6语法，将对象直接写在这里
    // 这里意思为“状态”，是Vuex状态管理的数据源
    state,
    // 和“过滤器filters”作用类似，用于将state处理后输出，也可以不处理
    getters,
    // 用于定义方法，通常会结合state，对state进行设置、改变
    mutations,
    // 提交mutations中的方法用的，可以根据具体的业务逻辑进行判断，然后选择要调用哪个mutations里的方法，会向方法传入参数
    actions,
    // 当store对象过于庞大时，可以根据具体的业务需求分为多个module
    modules,
});