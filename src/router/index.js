import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    /* 使用createWebHistory()，地址栏后面不会带有“#”，如果是createWebHashHistory()，就有带#号
     * 注意！”#“是起分隔作用的，如果不加#，那么在路由跳转后刷新时，会导致出现Cannot GET错误，
     * 有加#号的的模式就不会——createWebHashHistory*/
    history: createWebHistory(),
    // 将上面的routes数组（路由映射表）填入这里，作为对象的值
    routes: [
        // 一定要配置路由映射表，否则无法将指定的根组件设置为默认显示页面（注意！含有router-view的组件不用写在路由配置里！）
        {
            path: "/",
            // “() => import()”是路由懒加载，即动态导入，对所有的路由都使用动态导入是个好主意
            component: () => import("../root-component/todo-root"),
            meta: {
                title: "待办事项",
            },
        },
        {
            path: "/qqlogin",
            component: () => import("../../src/components/tool/qq-login"),
        },
    ],
});

// 这里是全局前置路由守卫，想要显示标题，就得经过这一步
router.beforeEach((to, from, next) => {
    // 路由发生变化修改页面title
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});

export default router;