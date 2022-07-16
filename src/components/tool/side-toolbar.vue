<template>
    <!--侧边工具栏：用于显示更多的工具-->
    <div id="side-toolbar">
        <!--”显示更多“Logo-->
        <div id="sideToolbarLogoDiv" @click="isOpenDrawer = true">
            <a>
                <el-tooltip :disabled="isOpenDrawer" content="更多" effect="light" placement="bottom">
                    <!--<p id="sideToolbarLogo" style="color: white; font-weight: bold">···</p>-->
                    <img id="sideToolbarLogo" alt="天气图标" src="../../assets/hamburgerButton.png" />
                </el-tooltip>
            </a>
        </div>

        <!--v-model：控制侧边栏的打开和关闭；direction：打开的方向，这里为左边；size：侧边栏的大小-->
        <el-drawer v-model="isOpenDrawer" :destroy-on-close="true" :size="'50vw'" :with-header="false" direction="ltr">
            <!--顶部-->
            <div id="drawerTop">
                <h2 id="drawerTitle">更多内容</h2>
                <el-button id="closeButton" type="danger" @click="isOpenDrawer = false">
                    <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
                    <span>关闭</span>
                </el-button>
            </div>
            <!--下面的主要内容-->
            <div id="drawerContent">
                <div class="tools" @click="showWechatMiniProgram">
                    <!--fit="contain"：完整显示图片且不会变形-->
                    <el-image :src="require('@/assets/WeChat.png')" class="toolsLogo" fit="contain" :lazy="true"/>
                    <span class="toolsText">轻型工具箱小程序</span>
                </div>
                <div class="tools" @click="toGitHub">
                    <el-image :src="require('@/assets/GitHub.png')" class="toolsLogo" fit="contain" :lazy="true"/>
                    <span class="toolsText">站长的Github</span>
                </div>
                <div class="tools" @click="toGitee">
                    <el-image :src="require('@/assets/Gitee.png')" class="toolsLogo" fit="contain" :lazy="true"/>
                    <span class="toolsText">站长的Gitee</span>
                </div>
            </div>
        </el-drawer>

        <transition name="wechatMiniProgramTransition">
            <!--是否显示微信小程序的二维码-->
            <div v-if="isShowWechatMiniProgram" id="wechatMiniProgramDiv">
                <p id="close" @click="closeWindows">✖</p>
                <div>
                    <p class="wechatText">站长的个人小程序</p>
                    <el-image
                        :src="require('@/assets/WechatMiniProgram.png')"
                        class="wechatMiniProgram"
                        fit="contain"
                        :lazy="true"
                    />
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
// 引入“圆形关闭”的按钮Logo
import { CircleCloseFilled } from "@element-plus/icons-vue";

export default {
    name: "side-toolbar",
    setup() {
        return {
            CircleCloseFilled,
        };
    },
    data() {
        return {
            // 是否打开左边的侧边栏“抽屉”
            isOpenDrawer: false,
            // 是否显示微信小程序的二维码
            isShowWechatMiniProgram: false,
        };
    },
    methods: {
        // 展示微信小程序的二维码
        showWechatMiniProgram() {
            // 关闭侧边栏
            this.isOpenDrawer = false;
            // 展示窗口
            this.isShowWechatMiniProgram = true;
            // 用Vuex，使背景模糊
            this.$store.dispatch("backgroundIsBlur", true);
        },
        // 关闭窗口
        closeWindows() {
            this.isShowWechatMiniProgram = false;
            // 关闭窗口后继续打开侧边栏
            this.isOpenDrawer = true;
            // 取消背景模糊效果
            this.$store.dispatch("backgroundIsBlur", false);
        },
        // 跳转到我的GitHub首页
        toGitHub() {
            // 在新窗口打开外链接
            window.open("https://github.com/2690085099", "_blank");
        },
        // 跳转到我的Gitee首页
        toGitee() {
            window.open("https://gitee.com/HYY2690085099", "_blank");
        },
    },
};
</script>

<style scoped>
/*”显示更多“文本图标的div*/
#sideToolbarLogoDiv {
    display: flex;
    justify-content: flex-start;
}

/*”显示更多“图标*/
#sideToolbarLogo {
    width: 28px;
    filter: drop-shadow(-20px -20px 14px rgb(51, 51, 51));
    margin-top: 3vh;
    margin-left: 60px;
    /*从右边开始排列*/
    justify-content: flex-start;
}

#sideToolbarLogo:hover {
    cursor: url("../../assets/cursor/pointer.png"), pointer;
}

/*点击时的样式*/
#sideToolbarLogo:active {
    filter: brightness(60%);
}

/*左边侧边栏的顶部*/
#drawerTop {
    display: flex;
    /*均匀排列每个元素，首个元素放置于起点，末尾元素放置*/
    justify-content: space-between;
    flex-wrap: wrap;
}

/*左边侧边栏的标题*/
#drawerTitle {
    display: inline-block;
    color: #191970;
    margin-top: 0;
    font-size: 26px;
    line-height: 30px;
}

/*关闭按钮*/
#closeButton {
    width: 80px;
    margin-bottom: 20px;
}

/*工具列表中，存储工具的div*/
.tools {
    display: flex;
    justify-content: space-between;
    align-content: center;
    background: linear-gradient(#f0f2f5, #f5f7fa, #f0f2f5);
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 20px;
    transition: all 0.6s ease-in-out;
    border: 1px solid #dfdfdf;
}

/*指针悬停在卡片上时，改变显示的效果*/
.tools:hover {
    box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.2);
    cursor: url("../../assets/cursor/pointer.png"), pointer;
    background: linear-gradient(#f8f8f8, #f5f7fa, #f8f8f8);
}

/*工具里的图标*/
.toolsLogo {
    width: 40px;
    margin-right: 10px;
}

/*工具里的文字*/
.toolsText {
    display: flex;
    /*垂直轴上居中，即上下距离都相等*/
    align-items: center;
    color: #303133;
    text-align: center;
}

/*窗口*/
#wechatMiniProgramDiv {
    max-width: 370px;
    min-width: 10%;
    max-height: 350px;
    text-align: center;
    /*使div在屏幕居中*/
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 20px;
    background: rgba(30, 30, 30, 0.6);
    box-shadow: 0 0 6px rgba(30, 30, 30, 0.6);
    padding-left: 40px;
    padding-right: 40px;
    /*这里是用户图标展开后的div，解决动画期间，屏幕闪烁的Bug（注意！要用在<template>标签下面的第一个标签*/
    -webkit-backface-visibility: hidden;
    z-index: 1;
}

/*窗口动画*/
.wechatMiniProgramTransition-enter-active {
    /*加入动画，此动画名为“scale-in-tr"*/
    animation: wechatMiniProgramTransition-animation 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.wechatMiniProgramTransition-leave-active {
    /*“反转reverse”表示会倒放，从scale-in-tr的100%到0%*/
    animation: wechatMiniProgramTransition-animation 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse;
}

@keyframes wechatMiniProgramTransition-animation {
    0% {
        transform: translateY(-50px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

/*关闭按钮（实际上是字符）*/
#close {
    font-size: 22px;
    text-align: right;
    margin-top: 4px;
    margin-right: -26px;
    cursor: url("../../assets/cursor/pointer.png"), pointer;
    color: rgba(255, 255, 255, 0.5);
    height: 0;
}

#close:hover {
    color: rgba(255, 255, 255, 0.7);
}

#close:active {
    color: rgba(255, 255, 255, 0.9);
}

/*窗口标题*/
.wechatText {
    color: white;
    font-size: 20px;
}

/*微信小程序的图片*/
.wechatMiniProgram {
    width: 250px;
}
</style>