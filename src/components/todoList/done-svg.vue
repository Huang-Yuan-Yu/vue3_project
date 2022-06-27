<template>
    <div class="doneSvg">
        <!--svg标签作为外框。viewBox：后两个参数分别是宽和高-->
        <svg width="24" height="24" viewBox="0 0 400 400">
            <transition name="doneSvg">
                <!--v-if——根据父组件传下来的Boolean值，决定是否要显示
                polyline标签：绘制多段线
                fill：是否填充（值为none则不填充）
                points：绘制路径——以点来决定
                stroke：图形的颜色
                stroke-linecap：笔画两端（round则为圆角）；stroke-linejoin则是笔画的连接处
                stroke-width：笔画宽度（单位为“像素px”）-->
                <polyline
                    v-if="isShow"
                    fill="none"
                    points="88,214 173,284 304,138"
                    stroke="#68E534"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="24"
                />
            </transition>
        </svg>
    </div>
</template>

<script>
export default {
    name: "doneSvg",
    props: {
        // 是否要显示打钩的Svg
        isShow: {
            // 接受的类型为布尔值
            type: Boolean,
        },
    },
};
</script>

<style lang="scss" scoped>
svg {
    border: 1px solid #a8abb2;
    border-radius: 100%;
}

/*元素开始显示完毕时*/
.doneSvg-enter-active {
    /*stroke-dasharray属性用于在 SVG 形状的笔划中创建破折号*/
    stroke-dasharray: 350;
    stroke-dashoffset: 350;
    animation: tick 0.8s ease-in-out;
    animation-fill-mode: forwards;
}

/*元素开始显示完毕时*/
.doneSvg-leave-to {
    stroke-dasharray: 350;
    stroke-dashoffset: 350;
    animation: tick 0.8s ease-in-out reverse;
    animation-fill-mode: forwards;
}

@keyframes tick {
    from {
        stroke-dashoffset: 350;
    }
    to {
        stroke-dashoffset: 0;
    }
}
</style>