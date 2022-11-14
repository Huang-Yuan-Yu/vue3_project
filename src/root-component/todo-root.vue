<!--此组件是为课后练习而创建的-->
<template>
    <div id="todo-root">
        <!--用于平滑刷新网页状态，v-if先是false，然后瞬间切换为true-->
        <todo-list v-if="isRouterAlive" />
    </div>
</template>

<script>
// 要导入自己需要的“组件components“
import todoList from "@/components/todoList/todo-list";

export default {
    // 首页组件的名称
    name: "todo-root",
    components: {
        "todo-list": todoList,
    },
    // 高阶组件里的内容，能够返回一个对象
    provide() {
        return {
            // 用于平滑刷新
            reload: this.reload,
        };
    },
    data() {
        return {
            // 路由是否处于活动状态
            isRouterAlive: true,
        };
    },
    methods: {
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(function () {
                this.isRouterAlive = true;
            });
        },
    },
};
</script>

<style lang="scss" scoped>
/*修改所有超链接的光标悬停样式*/
a:hover {
    cursor: url("../assets/cursor/pointer.png"), pointer;
}
</style>