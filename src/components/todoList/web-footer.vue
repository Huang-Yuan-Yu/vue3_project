<template>
    <div id="web-footer">
        <footer id="footer">
            <a
                class="text"
                href="http://wpa.qq.com/msgrd?v=3&uin=2690085099&site=qq&menu=yes"
                target="_blank"
                >© 2022 黄元昱</a
            >
            <span class="segmentation">|</span>
            <a class="text" href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2022064736号</a>
            <span class="segmentation">|</span>
            <span class="text" @click="showAbout">关于</span>
        </footer>

        <transition name="aboutTransition">
            <!--是否显示“关于“面板-->
            <div v-if="isShowAbout" id="aboutDiv">
                <p id="close" @click="closeWindows">✖</p>
                <div id="topDiv">
                    <img :src="require('@/assets/logo.png')" id="logo" alt="网站图标" />
                    <span id="title">待办事项</span>
                </div>
                <div id="aboutTopDiv">
                    <transition name="introduction">
                        <p id="introduction" v-show="isShowIntroduction">
                            这是<a
                                class="textHighlight"
                                href="http://wpa.qq.com/msgrd?v=3&uin=2690085099&site=qq&menu=yes"
                                target="_blank"
                                >黄元昱</a
                            >的个人网站(〃'▽'〃)
                            <br />
                            如果您觉得此网站有需要改进，可以<a
                                class="textHighlight"
                                href="http://wpa.qq.com/msgrd?v=3&uin=2690085099&site=qq&menu=yes"
                                target="_blank"
                                >联系</a
                            >我
                        </p>
                    </transition>
                    <transition name="websiteTime">
                        <!--开始滚动则隐藏，如果滚动到顶部则显示-->
                        <p class="websiteTime" v-show="isShowIntroduction">
                            待办事项已上线{{ distanceTime }}天
                            <br />
                            最后更新：2022-7-22
                        </p>
                    </transition>
                </div>
                <!--animationend：动画执行完毕就移除动画；当isShowIntroduction等于false时，表示已向上滚动，就应用动画-->
                <div id="aboutBottomDiv">
                    <ul
                        id="announcementUl"
                        :class="{
                            announcementUlAnimation: isShowIntroduction === false,
                        }"
                        :style="{ height: isShowIntroduction === false ? '140%' : '100%' }"
                        @scroll="scrollAnnouncementUl"
                    >
                        <li class="announcementLi">
                            <p>2022-7-22</p>
                            <div>
                                <span class="updateTag new">新增</span>
                                <span class="announcementText">登录时需进行滑动拼图验证</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-7-20</p>
                            <div>
                                <span class="updateTag new">新增</span>
                                <span class="announcementText">游客登录功能</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-7-18</p>
                            <div>
                                <span class="updateTag repair">修复</span>
                                <span class="announcementText">事项列表超出div以及显示高度不够的问题</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-7-17</p>
                            <div>
                                <span class="updateTag repair">修复</span>
                                <span class="announcementText">部分移动设备显示错位和不全的情况</span>
                            </div>
                            <div>
                                <span class="updateTag improve">改进</span>
                                <span class="announcementText">工具栏图标根据数量和设备尺寸进行响应式显示</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-7-16</p>
                            <div>
                                <span class="updateTag new">新增</span>
                                <span class="announcementText">网站底部的“关于”面板</span>
                            </div>
                            <div>
                                <span class="updateTag improve">改进</span>
                                <span class="announcementText">网站字体类型、大小以及字体兼容性</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-7-15</p>
                            <div>
                                <span class="updateTag repair">修复</span>
                                <span class="announcementText">部分移动端显示异常的问题</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-7-14</p>
                            <div>
                                <span class="updateTag improve">改进</span>
                                <span class="announcementText">调整界面的Logo的各个样式，优化观感</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-7-6</p>
                            <div>
                                <span class="updateTag new">新增</span>
                                <span class="announcementText">侧边栏的更多内容，如微信小程序、远程仓库地址等</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-7-5</p>
                            <div>
                                <span class="updateTag improve">改进</span>
                                <span class="announcementText">优化服务器端的网络性能，使用户访问更快</span>
                            </div>
                            <div>
                                <span class="updateTag improve">改进</span>
                                <span class="announcementText">兼容更多的浏览器，使老版本的浏览器也能打开此网站</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-7-4</p>
                            <div>
                                <span class="updateTag new">新增</span>
                                <span class="announcementText">设置头像、修改头像的功能</span>
                            </div>
                            <div>
                                <span class="updateTag improve">改进</span>
                                <span class="announcementText">验证码邮件的样式</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-7-3</p>
                            <div>
                                <span class="updateTag improve">改进</span>
                                <span class="announcementText">优化网站的构建文件大小，缩短首屏时间</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-7-2</p>
                            <div>
                                <span class="updateTag improve">新增</span>
                                <span class="announcementText">邮箱注册、登录以及密码找回等功能，增强判断逻辑</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-6-23</p>
                            <div>
                                <span class="updateTag remove">移除</span>
                                <span class="announcementText">网站中上部分碍眼的滚动公告通知</span>
                            </div>
                        </li>
                        <li class="announcementLi">
                            <p>2022-05-12</p>
                            <div>
                                <span class="updateTag new">新增</span>
                                <span class="announcementText">网站上线</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: "web-footer",
    data() {
        return {
            // 是否显示“关于“面板
            isShowAbout: false,
            // 从网站开设到现在距离的天数
            distanceTime: null,
            // 是否展示网站介绍和创办时间等信息
            isShowIntroduction: true,
            // 更新公告向上划的动画
            announcementUlAnimation: false,
        };
    },
    mounted() {
        // 从服务器端获取时间戳
        this.$axios({
            method: "get",
            url: "/api/TodoList/getDate",
        }).then((response) => {
            // 1652284800是此网站开设时的时间戳（2022-05-12），一天等于86400秒
            this.distanceTime = parseInt((response.data - 1652284800) / 86400);
        });
    },
    methods: {
        // 展示“关于“本站的面板
        showAbout() {
            // 关闭侧边栏
            this.isOpenDrawer = false;
            // 展示窗口
            this.isShowAbout = true;
            // 用Vuex，使背景模糊
            this.$store.dispatch("backgroundIsBlur", true);
        },
        // 关闭窗口
        closeWindows() {
            this.isShowAbout = false;
            // 关闭窗口后继续打开侧边栏
            this.isOpenDrawer = true;
            // 取消背景模糊效果
            this.$store.dispatch("backgroundIsBlur", false);
        },
        // 滚动更新公告的无序列表
        scrollAnnouncementUl() {
            let scrollTop = document.getElementById("announcementUl").scrollTop;
            // 如果滚动到下面一段距离，且为第一次滚动，就将网站介绍隐藏
            if (scrollTop > 100 && this.isShowIntroduction === true) {
                // 就开始隐藏网站介绍
                this.isShowIntroduction = false;
            }
            // 当滚动差不多到顶部才进行赋值，提高性能
            else if (scrollTop === 0) {
                // 如果滚动到顶部，就显示网站介绍信息，反之则隐藏
                this.isShowIntroduction = true;
            }
        },
    },
};
</script>

<style scoped>
/*网站备案的Footer——类似于Div*/
#footer {
    width: 100%;
    position: absolute;
    bottom: 1vh;
    text-align: center;
}

/*底部的文字样式*/
.text {
    font-size: 1vh;
    color: rgba(255, 255, 255, 0.4);
    text-decoration: none;
    transition: all 0.4s ease-in-out;
}

.text:hover {
    color: rgba(255, 255, 255, 0.6);
    cursor: url("../../assets/cursor/pointer.png"), pointer;
}

.text::selection {
    color: #004da3;
    background: white;
}

/*分割线*/
.segmentation {
    color: rgba(255, 255, 255, 0.2);
    margin-left: 0.6vw;
    margin-right: 0.6vw;
}

/*窗口*/
#aboutDiv {
    max-width: 400px;
    min-width: 10%;
    max-height: 450px;
    text-align: center;
    /*使div在屏幕居中*/
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 20px;
    background: rgba(30, 30, 30, 0.8);
    box-shadow: 0 0 6px rgba(30, 30, 30, 0.6);
    padding-left: 40px;
    padding-right: 40px;
    /*这里是用户图标展开后的div，解决动画期间，屏幕闪烁的Bug（注意！要用在<template>标签下面的第一个标签*/
    -webkit-backface-visibility: hidden;
    z-index: 1;
    overflow-y: hidden;
}

/*窗口动画*/
.aboutTransition-enter-active {
    /*加入动画，此动画名为“scale-in-tr"*/
    animation: aboutTransition-animation 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.aboutTransition-leave-active {
    /*“反转reverse”表示会倒放，从scale-in-tr的100%到0%*/
    animation: aboutTransition-animation 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse;
}

@keyframes aboutTransition-animation {
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

/*顶部的div*/
#topDiv {
    display: flex;
    /* 水平居中 */
    justify-content: center;
    /* 垂直居中 */
    align-items: center;
    margin-bottom: 10px;
}

/*窗口标题*/
#title {
    color: #79bbff;
    font-size: 20px;
    margin-left: 4px;
}

/*网站Logo*/
#logo {
    height: 50px;
}

/*包含介绍的div*/
#aboutTopDiv {
    height: 26%;
}

/*介绍*/
#introduction {
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    margin-bottom: 24px;
    margin-top: 6px;
    line-height: 18px;
}

.introduction-enter-active {
    animation: introduction-scale-in-center 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.introduction-leave-active {
    /*“反转reverse”表示会倒放，从scale-in-tr的100%到0%*/
    animation: introduction-scale-in-center 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both reverse;
}

@keyframes introduction-scale-in-center {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

/*介绍文字中的高亮*/
.textHighlight {
    color: #79bbff;
    text-decoration: none;
}

/*网站创立时间*/
.websiteTime {
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    text-align: left;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 18px;
}

.websiteTime-enter-active {
    animation: websiteTime-slide-out-top 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}

.websiteTime-leave-active {
    /*“反转reverse”表示会倒放，从scale-in-tr的100%到0%*/
    animation: websiteTime-slide-out-top 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53) both reverse;
}

@keyframes websiteTime-slide-out-top {
    0% {
        transform: translateY(-40px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

#aboutBottomDiv {
    height: 50%;
}

/*更新公告的无序列表*/
#announcementUl {
    padding: 0;
    margin: 0;
    list-style: none;
    overflow-y: auto;
    transition: 0.25s;
}

/*更新公告无序列表的动画，只有在列表往上的时候才会应用此样式*/
.announcementUlAnimation {
    transform: translateY(-100px);
}

/*滚动轨道*/
#announcementUl::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0;
}

/*滚动条*/
#announcementUl::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 6px;
    height: 6px;
}

#announcementUl::-webkit-scrollbar-thumb {
    cursor: pointer;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.2);
    transition: color 0.2s ease;
}

/*更新公告的列表*/
.announcementLi {
    text-align: left;
    margin-bottom: 14px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
}

/*更新公告里的p标签*/
.announcementLi p {
    margin: 0;
}

/*更新类型的标签*/
.updateTag {
    padding: 1px 3px;
    margin-left: 12px;
    margin-right: 5px;
    border-radius: 2px;
    color: #303133;
    margin-top: 1px;
}

/*“新增”类型的标签*/
.updateTag.new {
    background-color: #a4ba80;
}

/*“改进”类型的标签*/
.updateTag.improve {
    background-color: #a1c6c9;
}

/*“修复”类型的标签*/
.updateTag.repair {
    background-color: #dbc693;
}

/*“移除”类型的标签*/
.updateTag.remove {
    background-color: #c8c8c8;
}

/*文本的内容垂直居中*/
.announcementText {
    /*垂直居中*/
    vertical-align: middle;
}
</style>