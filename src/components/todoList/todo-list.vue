<template>
    <!--用户登录组件——ref设置后，父组件可主动获取该子组件的数据。:style绑定一个计算属性，会返回一个url作为图片链接（源）-->
    <div id="todo-list">
        <!--背景图片过渡展示，解决直接看到突然出现的图片-->
        <!--@load：图片加载完毕事件
        Math.random() + 1则在“1”开始，若要指定范围比如0~3，只需要在Math.random()后面加上 * 3
        生成随机数的代码不能直接写在:src里，否则有一个Bug（点击其他按钮，无冒泡时也会重新随机一遍，如果使用data里的变量则不会出现此情况
        draggable="false"：禁止拖拽该图片-->
        <div id="backgroundImageBoxShadow" @click="closeWindows">
            <img
                v-show="showBackgroundImage"
                id="backgroundImage"
                :class="{ backgroundBlur: $store.state.backgroundIsBlur }"
                :src="require(`@/assets/scenery/${imageUrl}.jpg`)"
                alt="背景图片"
                draggable="false"
                @load="showBackgroundImage = true"
            />
        </div>

        <!--鼠标点击特效-->
        <click-special-effect></click-special-effect>
        <!--用户注册、登录模块-->
        <user-login ref="userLogin"></user-login>
        <!--引入包含天气组件的组件-->
        <my-weather ref="myWeather"></my-weather>
        <!--引入侧边工具栏的组件-->
        <side-toolbar></side-toolbar>
        <!--说明：单击左边圆形可标记为完成事项或取消，双击文字可修改内容，输入框按回车可添加事项
        main标签：页面主要内容，一个页面只能使用一次-->
        <main id="todoForm" :class="{ backgroundBlur: $store.state.backgroundIsBlur }" @click="closeWindows">
            <p id="YyTodo">YY待办</p>
            <p v-if="serverStatus === '未知'" class="currentStatus" style="color: #909399">正在连接服务器中······</p>
            <!--如果服务器关闭了-->
            <p v-else-if="serverStatus === '关闭'" class="currentStatus" style="color: #f56c6c">网络连接断开···</p>
            <p v-else-if="serverStatus === '未登录'" class="currentStatus" style="color: #e6a23c">
                您还未登录，无法使用待办事项功能···
            </p>
            <p v-else-if="recordFilterMethod(todoArray).length === 0" class="currentStatus" style="color: #67c23a">
                目前没有待办事项哦~
            </p>
            <p
                v-else-if="recordFilterMethod(todoArray).length !== 0"
                :class="{ zoomFont: isZoomFont }"
                class="currentStatus"
                style="color: #ffffff"
            >
                还有{{ recordFilterMethod(todoArray).length }}个待办事项未完成！
            </p>

            <label id="inputAndButton">
                <!--isShowLineFeed：是否显示提示，在下面的方法里设置数秒后会禁用
                userEquipment等于null，证明是PC端，不是null就是其他设备
                $store.state.userEquipment是使用Vuex的state里的变量-->
                <el-tooltip
                    :content="$store.getters.userEquipment === null ? 'Ctrl+Enter换行' : '回车键换行'"
                    :disabled="isShowLineFeed"
                    effect="light"
                    placement="top"
                >
                    <!--v-model：表单输入绑定，可以使用v-model指令在表单（input、textarea以及select）元素创建双向数据绑定，
                    它会根据控件类型自动选取正确的方法来更新元素
                    注意！要使用户回车后触发事件，应该在输入框中写@keydown.enter=""里面填Vue中methods里面的名称
                    这里要使用keyup，鼠标弹起时才添加，否则会导致无论是有无输入内容，都会提示“内容不能为空”
                    trim可以去除输入内容两边的空格。exact是“准确修饰符，有且只有按下某个键时才会触发对应的事件
                    绑定的:disabled为不可用性，为true表示不可用，为false表示可用
                    rel="inputTodoContent"会给生命周期mounted()里面用，进入页面时会自动获取焦点，方便用户直接输入
                    once：此事件在只触发一次，刷新后重置次数
                    :[inputStatus]="inputStatus"：动态绑定属性名和属性值-->
                    <el-input
                        v-if="$store.getters.userEquipment === null"
                        id="inputTodo"
                        ref="inputTodo"
                        v-model="userInput"
                        v-focus
                        :[inputStatus]="inputStatus"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        clearable
                        :placeholder="serverStatus === '未登录' ? '请登录后再输入待办事项' : '请输入您的待办事项'"
                        type="textarea"
                        @focus="inputFocus"
                        @keyup.enter.exact="addToDo"
                        @keyup.ctrl.enter="lineFeed"
                        @focus.once="closeLineFeedTip"
                        @click="clickTodoInputBox"
                    ></el-input>
                    <!--上面是PC端用的输入框，下面是移动端用的（要注意回车本来就是换行，所以这里无需回车事件）-->
                    <el-input
                        v-else
                        id="inputTodo"
                        ref="inputTodo"
                        v-model="userInput"
                        v-focus
                        :[inputStatus]="inputStatus"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        clearable
                        placeholder="事项输入框"
                        type="textarea"
                        @focus="inputFocus"
                        @focus.once="closeLineFeedTip"
                    ></el-input>
                </el-tooltip>
                <!--这里不能加:disabled="inputDisabled"，会覆盖自定义的光标样式
                如果“userEquipment === null”，证明是PC端，就有一个添加按钮，不用改成换行按钮，因为PC可以用Ctrl+Enter组合键-->
                <el-button
                    id="addToDo"
                    :class="{
                        addToDoDisabledCursor: inputDisabled === true,
                        addToDoNotDisabledCursor: inputDisabled === false,
                    }"
                    type="primary"
                    @click="addToDo"
                    >添加
                </el-button>
            </label>

            <div id="functionIcon">
                <!--鼠标悬停时，会有提示-->
                <el-tooltip content="显示所有事项" effect="light" placement="bottom">
                    <el-image
                        :class="{ opacity100: currentStatus === '显示所有事项' }"
                        :src="require('@/assets/showAll.png')"
                        alt="显示所有事项"
                        class="todoFunctionButton"
                        fit="contain"
                        @click.stop="currentStatus = '显示所有事项'"
                    ></el-image>
                </el-tooltip>
                <el-tooltip content="只显示已完成的事项" effect="light" placement="bottom">
                    <el-image
                        :class="{ opacity100: currentStatus === '只显示已完成的事项' }"
                        :src="require('@/assets/showFinish.png')"
                        alt="只显示已完成的事项"
                        class="todoFunctionButton"
                        fit="contain"
                        @click.stop="currentStatus = '只显示已完成的事项'"
                    ></el-image>
                </el-tooltip>
                <el-tooltip content="只显示未完成的事项" effect="light" placement="bottom">
                    <el-image
                        :class="{ opacity100: currentStatus === '只显示未完成的事项' }"
                        :src="require('@/assets/showIncomplete.png')"
                        alt="只显示未完成的事项"
                        class="todoFunctionButton"
                        fit="contain"
                        @click.stop="currentStatus = '只显示未完成的事项'"
                    ></el-image>
                </el-tooltip>
                <el-tooltip content="清除已完成的事项" effect="light" placement="bottom">
                    <!--事件修饰符“.stop”能够解决冒泡问题，就不会导致这里点击之后冒泡，又在底层点击一次，造成连续点击两个的操作-->
                    <el-image
                        :class="{ cursorNotAllowed: inputDisabled }"
                        :disabled="inputDisabled"
                        :src="require('@/assets/clearAllFinish.png')"
                        alt="清除已完成的事项"
                        class="todoFunctionButton"
                        fit="contain"
                        @click.stop="clearCompleteTheTask"
                    ></el-image>
                </el-tooltip>
                <el-tooltip content="完成所有事项" effect="light" placement="bottom">
                    <el-image
                        :class="{ cursorNotAllowed: inputDisabled }"
                        :disabled="inputDisabled"
                        :src="require('@/assets/doneAll.png')"
                        alt="完成所有事项"
                        class="todoFunctionButton"
                        fit="contain"
                        @click.stop="finishAllTodo"
                    ></el-image>
                </el-tooltip>
                <el-tooltip content="取消完成所有事项" effect="light" placement="bottom">
                    <el-image
                        :class="{ cursorNotAllowed: inputDisabled }"
                        :disabled="inputDisabled"
                        :src="require('@/assets/noDoneAll.png')"
                        alt="取消完成所有事项"
                        class="todoFunctionButton"
                        fit="contain"
                        @click.stop="noFinishAllTodo"
                    ></el-image>
                </el-tooltip>
            </div>

            <transition name="visitorLogin">
                <!--游客登录按钮-->
                <el-button
                    v-if="serverStatus === '未登录'"
                    :loading="isLogin === true"
                    class="visitorLogin"
                    size="large"
                    type="primary"
                    @click="visitorLogin"
                    >{{ anonymousLoginButtonText }}</el-button
                >
            </transition>

            <!--滚动列表，定义最小大小和最大大小（注意！最大和最小的值都为百分比，且同样低，才能达到响应式的目的
            height="60%"-->
            <el-scrollbar id="elScrollbar" :max-height="elScrollbarHeight" :noresize="true">
                <!--“过渡标签组”，因为这里面会有很多个li元素，所以用<transition-group>包裹起来,tar指向无序列表-->
                <transition-group appear name="todo-li" tag="ul">
                    <!--v-for是Vue的for循环，前面为元素，in后面为数组
                    也可以在for中的in前面加上括号，然后填另一个参数，最后在v-bind:class中使用，
                    当value变量为偶数时，样式就生效，否则不生效
                    ！！！一定要记得在class=""里面要加{}
                    还有在class=""之类的双引号内填入变量，不能使用{{}}，而是直接写
                    
                    另外，:key指令中的值，用于给for循环的每个元素一个唯一的表示
                    
                    completed是CSS中的类名，todoArray.done是Vue中data的值，为true时就应用completed样式，为false时就不应用
                    elementIndex是列表里的索引，每一个元素会有不同的index，index可以标识元素的位置
                    @click="completeTheTask(elementIndex)"的作用：上面v-for遍历到哪里，都会有一个索引传入completeTheTask()中
                    ，在Vue的代码中就可以根据这个索引找到用户点击的元素，然后进行done值的改变（true变false等）
                    
                    踩坑日记：completed确实是CSS的类名，但后面的todo.done不是todoSome.done，这里指的是单一元素而不是整个数组
                    注意！！！v-for中的filterMethod是methods里自定义的方法，不是过滤器！
                    
                    可以以事项内容作为唯一标识，因为是唯一的，这里没有id，id只存在于数据库中-->
                    <li v-for="todo in filterMethod(todoArray)" :key="todo.mission">
                        <div
                            :class="{ todoDoneBorder: todo.done === 1, todoNotDoneBorder: todo.done === 0 }"
                            class="todoListElement"
                        >
                            <!--用于完成或取消完成事项-->
                            <g class="svgContainer" @click="completeTheTask(todo)">
                                <!--这里的父组件传向子组件-->
                                <done-svg :isShow="todo.done === 1"></done-svg>
                                <!--循环会将每一个元素填进<li>列表里，调用mission名称，结果是任务的名称-->
                            </g>
                            <!--存放事项内容的div，双击此div就可以修改内容-->
                            <div class="todoDiv" @dblclick="beginModification(todo)">
                                <!--label用于显示事项内容。:class后面的内容，判断文字的颜色是否改为绿色（完成则为绿色）
                                    beginModification：开始修改事项内容；originallyContent：原先的内容
                                    如果当前内容与正要修改的内容不一样，证明不是要修改的，就显示
                                    “|| isRevised === false”表示没有在修改，也会显示，只要其中一个为true，那就显示
                                    v-html能够渲染HTML有的标签，比如<br>-->
                                <p
                                    v-if="todo.mission !== originallyContent || isRevised === false"
                                    :class="{ completed: todo.done, noCompleted: !todo.done }"
                                    v-html="todo.mission"
                                ></p>
                                <!--双击之后就会显示此输入框，失去焦点和按下回车键都会保存，是否显示取决于使用的CSS
                                    v-focus是自定义指令，用于自动聚焦到输入框。isRevised === true表示正在修改-->
                                <el-input
                                    v-if="todo.mission === originallyContent && isRevised === true"
                                    ref="revisedInputBox"
                                    v-model="inputRevisedContent"
                                    v-focus
                                    :autosize="{ maxRows: elScrollbarHeight }"
                                    class="revisedInputBox"
                                    clearable
                                    type="textarea"
                                    @blur="saveInput(todo, $event)"
                                    @keyup.esc.stop="saveInput(todo, $event)"
                                    @keyup.enter.exact="saveInput(todo, $event)"
                                    @keyup.ctrl.enter="revisedLineFeed"
                                />
                            </div>

                            <div class="liEndDiv">
                                <span class="deleteTodo" type="button" @click="deleteTodo(todo)">✖</span>
                                <!--弹出“气泡卡片”——trigger：触发方式，hover则是鼠标悬停触发-->
                                <el-popover
                                    ref="popover"
                                    :content="todo.time"
                                    placement="top"
                                    title="最近一次修改时间"
                                    trigger="hover"
                                >
                                    <template #reference>
                                        <el-button
                                            class="showModificationTime"
                                            color="#330C82"
                                            size="large"
                                            type="info"
                                        >
                                            <!--用户图标，:size为图标大小-->
                                            <el-icon :size="22"><Timer /></el-icon>
                                        </el-button>
                                    </template>
                                </el-popover>
                            </div>
                        </div>
                    </li>
                </transition-group>
            </el-scrollbar>
        </main>

        <!--网站底部-->
        <web-footer></web-footer>
    </div>
</template>

<script>
/**
 * “@”表示src目录，这里引入的是saveArray函数（默认引入）
 * addData：添加数据
 * clearCompletedTodo：清除所有已完成的事项
 * deleteObject：删除事项
 * getObjectArray：获取所有事项，存到数组中
 * getTime：获取当前系统的时间，作为临时的时间，用于显示
 * beginModification：修改事项
 * zoomFont：将字体放大
 * finishAllTodo：完成所有待办事项
 * noFinishAllTodo：取消完成所有待办事项
 * ping：测试网络连接
 */
import {
    addData,
    clearCompletedTodo,
    deleteObject,
    getObjectArray,
    getTime,
    modification,
    zoomFont,
    finishAllTodo,
    noFinishAllTodo,
    ping,
} from "@/jsFunction/todoList";
// 页脚组件
import webFooter from "@/components/todoList/web-footer";
// 鼠标点击特效
import clickSpecialEffect from "@/components/tool/click-special-effect";
// 侧边栏
import sideToolbar from "@/components/tool/side-toolbar";
// 引入天气组件
import myWeather from "@/components/tool/my-weather";
// 用户登录、注册组件
import userLogin from "@/components/user/user-login";
// 完成事项的Svg动态图标
import doneSvg from "./done-svg";
// 引入消息提示框，属于非模态提示框，不会打断用户操作
import { ElMessage } from "element-plus";
// 导入“帮助”的图标
import { InfoFilled } from "@element-plus/icons-vue";
// 引入mitt库，用于高效率的组件间通信
import emitter from "@/jsFunction/eventbus";
// 导入获取“浏览器指纹（唯一标识）”的依赖（安装：npm i @fingerprintjs/fingerprintjs -S）
import FingerprintJS from "@fingerprintjs/fingerprintjs";
// QQ互联
import QC from "qc";

export default {
    name: "todo-list",
    // 注入my-test组件提供（provide）的reload依赖，用于刷新页面
    inject: ["reload"],
    components: {
        webFooter,
        clickSpecialEffect,
        sideToolbar,
        myWeather,
        userLogin,
        doneSvg,
    },
    // Vue3特有的组合式API
    setup() {
        return {
            // 将UI库的图标信息暴露给模板，如果没有此操作，会报警告
            InfoFilled,
        };
    },
    data() {
        return {
            // 引用图片用的随机数（背景图片资源目录下有多少张图片，这里的数字就是多少）
            imageUrl: Math.floor(Math.random() * 15),
            // 服务器状态——未知、关闭或开启，默认为未知，如果出现网络错误，则赋值为“关闭”
            serverStatus: "未知",
            // 用于判断是否正在匿名登录W
            isLogin: false,
            // 登录中的按钮文本
            anonymousLoginButtonText: "游客登录",
            // 是否缩放字体
            isZoomFont: false,
            // 待办事项输入框的不可用性，false表示可用，true表示不可用，默认为不可用，待服务器开启后才设置为可用
            inputDisabled: true,
            // 输入框状态，默认为“只读readonly”，为空则可以输入
            inputStatus: "readonly",
            // ”完成事项用的按钮“的选中状态，为false表示未选中，为true表示选中
            finishButton: false,
            /*格式为{ mission: "学习", done: true },mission代表待办事项，done是完成情况，为true则完成、否则不完成
            这里的初始值为空数组，如果改为null则会报错*/
            todoArray: [],
            // 是否显示“Ctrl+Enter换行”这一提示，默认会显示
            isShowLineFeed: false,
            // 输入的内容默认为空字符串而不是null，才可以对字符串进行处理（trim()，去除两边的空格）
            userInput: "",
            // “当前状态currentStatus”有很多个值，这些值是用来判断的，不同的值会调用到不同的方法
            currentStatus: "显示所有事项",
            // 背景是否模糊、虚化
            backgroundIsBlur: false,
            // 显示背景图片
            showBackgroundImage: false,
            // 滚动栏的高度——动态变化
            elScrollbarHeight: null,
            // 是否修改完毕（或者说是否开始修改）
            isRevised: false,
            // 值为要修改事项的内容，作为唯一标识，因为前端没有录入id，所以不以id作为唯一标识，内容有经过判断，不会出现重复的
            originallyContent: "",
            // 输入内容的缓存，用于临时存储，这里最后是“修改后的内容”
            inputRevisedContent: "",
        };
    },
    created() {
        // 测试网络连接是否正常，这里面是为了确认“当前状态”
        ping()
            .then((response) => {
                if (response === "网络正常" && this.$refs.userLogin.myName === null) {
                    // 网络正常的话，如果子组件的用户名为空，证明未登录
                    this.serverStatus = "未登录";
                } else if (response === "网络异常") {
                    this.serverStatus = "关闭";
                }
            })
            // 异常捕获，否则程序会停止下来
            .catch();
    },
    mounted() {
        // 如果QQ登录成功
        if (QC.Login.check()) {
            let that = this;
            // 获取登录凭证（Access Token以及OpenID）
            QC.Login.getMe(function (openId) {
                if (openId !== undefined) {
                    // 获取用户信息
                    QC.api("get_user_info")
                        // 指定接口访问成功的接收函数，s为成功返回Response对象
                        .success(function (user) {
                            let name = localStorage.getItem("name");
                            // 从服务器接口获取数据
                            getObjectArray(name === null ? user.data.nickname : name)
                                .then((response) => {
                                    // 获取返回的待办事项数组
                                    that.todoArray = response;
                                    // “服务器状态serverStatus”只用于动态显示，没有其他功能：
                                    that.serverStatus = "开启";
                                    // inputDisabled用于控制输入框和按钮是否可用，获取得到数据，才将“不可用性”设置为“否false”，表示可用：
                                    that.inputDisabled = false;
                                    // 注意！要获取完列表之后，再自动将焦点聚焦到事项输入框里
                                    that.$nextTick(() => {
                                        // 多行文本框的聚焦，在ref值为“inputTodo”的后面不能
                                        that.$refs.inputTodo.focus();
                                    });
                                })
                                // 如果服务器未开启，则会报错——网络错误Network Error
                                .catch(() => {
                                    // 那么将serverStatus设置为“关闭”，上面template中的<p>会使用v-if做出相应的判断
                                    that.serverStatus = "关闭";
                                });
                        });
                }
            });
        }

        // 监听子组件的消息
        emitter.on("Token认证", (message) => {
            let myName = localStorage.getItem("name");
            if (message === "认证成功" && myName !== null) {
                // 从服务器接口获取数据，赋值到todoArray变量中。注意！因为此方法声明为异步方法，所以要使用then()方法，在里面写逻辑代码，接收结果
                getObjectArray(myName)
                    .then((response) => {
                        // 获取返回的待办事项数组
                        this.todoArray = response;
                        // “服务器状态serverStatus”只用于动态显示，没有其他功能：
                        this.serverStatus = "开启";
                        // inputDisabled用于控制输入框和按钮是否可用，获取得到数据，才将“不可用性”设置为“否false”，表示可用：
                        this.inputDisabled = false;
                        // 注意！要获取完列表之后，再自动将焦点聚焦到事项输入框里
                        this.$nextTick(() => {
                            // 多行文本框的聚焦，在ref值为“inputTodo”的后面不能
                            this.$refs.inputTodo.focus();
                        });
                    })
                    // 如果服务器未开启，则会报错——网络错误Network Error
                    .catch(() => {
                        // 那么将serverStatus设置为“关闭”，上面template中的<p>会使用v-if做出相应的判断
                        this.serverStatus = "关闭";
                    });
            } else if (message === "认证失败") {
                this.serverStatus = "未登录";
            }
        });

        // this.$watch需写在mounted()中，因为这时$refs指向的子组件才加载完成，这样才能获取到数据
        this.$watch(
            () => {
                // 实时监听子组件里的loginSuccess是否变化
                return this.$refs.userLogin.loginSuccess;
            },
            // 如果变化了，就做出“响应式的操作”
            (loginSuccess) => {
                // 如果检测到已登录成功，就立即向服务器获取信息
                if (loginSuccess === true) {
                    getObjectArray(this.$refs.userLogin.myName).then((response) => {
                        // 如果获取到那边登录子组件的“用户名”为空，证明未登录
                        this.todoArray = response;
                        // “服务器状态serverStatus”只用于动态显示，没有其他功能：
                        this.serverStatus = "开启";
                        // inputDisabled用于控制输入框和按钮是否可用，获取得到数据，才将“不可用性”设置为“否false”，表示可用：
                        this.inputDisabled = false;
                    });
                }
                // 如果检测到loginSuccess为false，证明未登录，就将数组清空
                else {
                    this.todoArray = [];
                    // “服务器状态serverStatus”只用于动态显示，没有其他功能：
                    this.serverStatus = "未登录";
                    // inputDisabled用于控制输入框和按钮是否可用，获取得到数据，将“不可用性”设置为“对true”，表示不可用：
                    this.inputDisabled = true;
                }
            }
        );
        // 背景虚化
        this.$watch(
            () => {
                // 监听子组件中data的布尔值变量，只要有一个为true，这里的结果就为true
                return (
                    this.$refs.userLogin.isShowLoginWindow ||
                    this.$refs.userLogin.isShowRegistrationWindow ||
                    this.$refs.userLogin.isShowResetPassword
                );
            },
            // 是否有打开登录、注册等窗口（isOpen为布尔值）
            (isOpen) => {
                // 如果有，那么就将背景虚化，否则就取消虚化（backgroundIsBlur是actions里的一个变量，这里直接填字符串参数）
                this.$store.dispatch("backgroundIsBlur", isOpen);
            }
        );

        // 在页面加载完毕时，先调用一次（异步执行，防止进入页面时出现显示不全的Bug）
        this.elScrollbarMaxHeight();
        // 当“窗口缩放window.onresize”事件触发时，调用调整“滚动列表的高度”
        window.onresize = () => {
            this.elScrollbarMaxHeight();
        };
        setTimeout(() => {
            this.elScrollbarMaxHeight();
        }, 1000);

        // 保留当前的作用域，否则在方法内会找不到对应的data变量
        let that = this;
        // 当切换到其他标签页时
        window.onblur = function () {
            // 统计未完成的事项个数
            let incompleteNumber = that.todoArray.filter((element) => element.done === 0).length;
            if (incompleteNumber > 0) {
                // 修改网页标题
                document.title = `喂~你还有${incompleteNumber}个事项未完成！`;
            } else {
                document.title = `(○'◡'○)ﾉ祝您愉快~`;
            }
        };
        // 当重新回到标签页
        window.onfocus = function () {
            document.title = "欢迎回到待办事项~";
            setTimeout(() => {
                document.title = "待办事项";
            }, 2000);
        };
        // 网络断开时触发
        window.addEventListener("offline", function () {
            this.serverStatus = "关闭";
            // 调用my-test组件的reload()，能够平滑刷新页面
            that.reload();
        });
        // 网络重连时触发
        window.addEventListener("online", function () {
            this.serverStatus = "开启";
            // 平滑刷新页面
            that.reload();
        });
    },
    methods: {
        // 在点击指定背景时，会关闭窗口，此方法主要为了适配移动端“无法使光标移出元素”的问题
        closeWindows() {
            this.$refs.myWeather.isShowWeather = false;
            this.$refs.userLogin.isShowCheckLogin = false;
        },
        // 如果将焦点聚焦到添加事项的输入框
        inputFocus() {
            // 如果处于禁用状态
            if (this.inputDisabled === true) {
                // 设置为只读
                this.inputStatus = "readonly";
            } else {
                // 清空动态绑定在HTML里的属性名和值，输入框就可以输入了
                this.inputStatus = "";
            }
        },
        // 添加待办事项
        addToDo() {
            // 如果当前没有禁用
            if (this.inputDisabled === false) {
                /*必须提前去除两边空格，否则无法保证数据不重复，并将换行符替换成换行标签，以在显示上换行（replace()默认只替换一次），
                如要多次替换，得用正则表达式一次性匹配，然后替换*/
                this.userInput = this.userInput.trim().replace(/\n/g, "<br/>");
                // 一定要同时满足两个条件才不会报错，才有效果
                if (this.userInput !== "" && this.userInput !== null) {
                    let todoObject = {
                        // 数据库中自带id字段，并且能够自增长，所以这里不用手动添加，而且手动添加会有很多问题
                        name: this.$refs.userLogin.myName,
                        // 事项内容
                        mission: this.userInput,
                        // 完成情况（这里必须为0——表示false，因为MySQL里的布尔值是以0和1表示的
                        done: 0,
                        /* 临时获取本地的时间，暂且不去服务器获取，否则同步获取会导致卡顿，下次加载时会从服务器获取服务器精准的时间
                         * 月份之所以要加1，是因为这里的月份从索引0~11，必须加1才是真正的月份
                         * 月份前面默认不补0，所以将月份转为字符串，然后使用padStart()在开头补0，补到长度为2为止，其他以此类推
                         * 使用模板字面量时，由于代码换行导致格式也改变，所以还是使用传统的字符串拼接方式来拼接
                         * getTime()是todoList.js文件自定义的方法，用于获取用户当前的系统时间*/
                        time: getTime(),
                    };
                    // 开始检查内容是否重复
                    let contentIsRepeat = false;
                    for (let index in this.todoArray) {
                        // 如果通过比较，检查到有内容重复
                        if (this.userInput === this.todoArray[index].mission) {
                            // 那就赋值为true，表示内容重复了
                            contentIsRepeat = true;
                        }
                    }

                    // 如果内容不重复，才进行添加并清空输入框等操作：
                    if (!contentIsRepeat) {
                        /* 将新的对象传给服务器（回调函数就是处理异步操作出来的结果，对结果进行利用的函数）
                         * await表示这是同步方法，只有此方法执行完毕，才执行下面的代码（原本不加await时是异步的，后面代码执行完才执行此代码）*/
                        addData(todoObject).then((result) => {
                            // 这里的result是todoList.js中addDataToJson()方法return的内容
                            // 将“时间time”设置到事项对象中，作为每个事项的创建时间或修改时间
                            todoObject["time"] = result;
                        });
                        // 将对象添加进数组开头
                        this.todoArray.unshift(todoObject);
                        // 清空输入框，以便用户下一次输入：
                        this.userInput = "";
                        ElMessage({
                            showClose: true,
                            message: "添加成功！",
                            type: "success",
                        });
                        zoomFont(this);
                    } else {
                        ElMessage({
                            showClose: true,
                            message: "内容重复，请重新输入！",
                            type: "warning",
                        });
                        // 此时需要将输入框的<br>替换为\n，否则显示异常，<br>的“>”需要使用“转义字符\”转义
                        this.userInput = this.userInput.replace(/<br\/>/g, "\n");
                    }
                } else {
                    ElMessage({
                        showClose: true,
                        message: "添加的待办事项不能为空！",
                        type: "warning",
                    });
                }
                // 重新、继续聚焦到输入框
                this.$nextTick(() => {
                    // 多行文本框的聚焦，在ref值为“inputTodo”的后面不能
                    this.$refs.inputTodo.focus();
                });
            } else {
                ElMessage({
                    showClose: true,
                    message: "请登录后再添加事项！",
                    type: "warning",
                });
            }
        },
        // 在输入框按Ctrl+Enter就触发此换行方法，因为Enter要添加，所以换行就和Enter冲突（在微信、QQ里也一样）
        lineFeed() {
            if (this.inputDisabled === true) {
                // 设置为只读
                this.inputStatus = "readonly";
                ElMessage({
                    showClose: true,
                    message: "请登录后再进行换行！",
                    type: "warning",
                });
            } else {
                // 在末尾加上换行符即可，但由于网页上的“\n”会解析成空格，所以在添加的时候，要将\n替换成<br>，实现真正的换行
                // 另外，要在显示事项的属性里加上v-html，解析HTML
                this.userInput += "\n";
                // 换行后给输入框自动获取焦点
                this.$nextTick(() => {
                    // 多行文本框的聚焦，在ref值为“inputTodo”的后面不能
                    this.$refs.inputTodo.focus();
                });
            }
        },
        // 修改事项时的换行功能
        revisedLineFeed() {
            this.inputRevisedContent += "\n";
        },
        // 关闭换行提示
        closeLineFeedTip() {
            // 1.5秒后，disabled值为true表示禁用
            setTimeout(() => {
                this.isShowLineFeed = true;
            }, 2000);
        },
        // 点击待办事项输入框时
        clickTodoInputBox() {
            // 假如未登录时，用户点击了待办事项输入框
            if (this.serverStatus === "未登录") {
                ElMessage({
                    showClose: true,
                    message: "请登录后再输入待办事项！",
                    type: "warning",
                });
            }
        },
        // 这里的filterMethod是自定义的，用于给上面HTML中的数组“返回过滤后的元素”（过滤器不会改变原数组）：
        filterMethod(todoArray) {
            switch (this.currentStatus) {
                case "显示所有事项":
                    // 原封不动返回
                    return todoArray;
                case "只显示已完成的事项":
                    /*true表示已完成，true的结果会被过滤器保留
                    使用过滤器过滤数组里的元素，element是数组中的元素，而不是整个数组，获取对象里的done属性的值，
                    如果为true则保留，即达到了值保留已完成的事项的目的*/
                    return todoArray.filter((element) => element.done);
                case "只显示未完成的事项":
                    /*如果完成情况等于false，证明未完成，将原来的false的done值取反变为true，就被filter所保留
                    原来是true的done值会变成false*/
                    return todoArray.filter((element) => !element.done);
                default:
                    return null;
            }
        },
        // 过滤掉已完成的事项，以便统计还有多少个事项未完成
        recordFilterMethod(toDoArray) {
            // 0代表false，这里保留为完成的事项
            return toDoArray.filter((element) => element.done === 0);
        },
        // 修改事项的内容，此时还没保存
        beginModification(todo) {
            // 在修改之前，将修改前的内容添加到对象中，以便于传给后端！
            todo["beforeContent"] = todo.mission;
            // 原先的内容——将原先的内容保存起来，作为备份，以防用户取消操作，才可以恢复
            this.originallyContent = todo.mission;
            // 要修改的内容——将目前修改事项的id赋值给inputCache，此变量用于输入框的v-model，双击后不会出现空白，而是事项的原内容
            this.inputRevisedContent = todo.mission.replace(/<br\/>/g, "\n");
            // 为true表示开始修改
            this.isRevised = true;
            // $nextTick能在下次DOM更新循环结束之后执行下面的回调代码，必须这样写
            this.$nextTick(() => {
                // 给多行文本输入框自动获取焦点revisedInputBox[0]表示匹配到的第一个
                this.$refs.revisedInputBox[0].focus();
            });
        },
        // 保存修改的内容
        saveInput(todo, event) {
            // 如果开始修改，才执行下面的代码（此判断用于防止同时间内触发多次此方法，因为回车、Esc事件的同时，也会触发“失去焦点blur”事件）
            if (this.isRevised === true) {
                // 检查内容是否重复
                let contentIsRepeat = false;
                // 回车的一瞬间会换行，所以需要替换
                let inputRevisedContent = this.inputRevisedContent.trim().replace(/\n/g, "<br/>");
                this.todoArray.forEach((element) => {
                    // 如果通过比较，检查到有内容重复
                    if (inputRevisedContent === element.mission) {
                        // 那就赋值为true，表示内容重复了
                        contentIsRepeat = true;
                    }
                });

                // 如果输入的内容与自身的之前相同
                if (this.originallyContent === inputRevisedContent) {
                    // 结束修改
                    this.isRevised = false;
                    // 如果按下了Esc键
                    if (event.key === "Escape") {
                        ElMessage({
                            showClose: true,
                            message: "已取消修改！",
                            type: "success",
                        });
                    } else if (event.key === "Enter" || event.type === "blur") {
                        ElMessage({
                            showClose: true,
                            message: "内容与自身重复···",
                            type: "warning",
                        });
                    }
                }
                // 如果与其他内容不重复
                else if (!contentIsRepeat) {
                    // 如果修改的内容为空，则直接删除此记录
                    if (inputRevisedContent === "") {
                        this.todoArray.splice(this.todoArray.indexOf(todo), 1);
                        // 在后端的数据库中删除：
                        deleteObject(todo);
                        ElMessage({
                            showClose: true,
                            message: "已将空内容删除！",
                            type: "success",
                        });
                    }
                    // 如果不是空内容
                    else {
                        if (event.key === "Enter" || event.type === "blur") {
                            // 上面已经去除两边空格以及将\n替换为<br>了
                            todo.mission = inputRevisedContent;
                            todo.time = getTime();
                            // 同时在服务器端修改：
                            modification(todo);
                            // 为false表示结束修改
                            this.isRevised = false;
                            ElMessage({
                                showClose: true,
                                message: "修改成功！",
                                type: "success",
                            });
                        } else if (event.key === "Escape") {
                            this.isRevised = false;
                            ElMessage({
                                showClose: true,
                                message: "已取消修改！",
                                type: "success",
                            });
                        }
                    }
                }
                // 如果与其他内容重复
                else {
                    // 结束修改
                    this.isRevised = false;
                    // 如果按下了Esc键
                    if (event.key === "Escape") {
                        ElMessage({
                            showClose: true,
                            message: "已取消修改！",
                            type: "success",
                        });
                    } else if (event.key === "Enter" || event.type === "blur") {
                        ElMessage({
                            showClose: true,
                            message: "与其他内容重复···",
                            type: "warning",
                        });
                    }
                }
            }
        },
        /*“完成”或”取消完成“事项：
        从上面HTML中传入列表元素的索引，到这个方法中，这里就可以精确改变具体元素的done值（取反、翻转boolean值）：*/
        completeTheTask(todo) {
            // 放大字体的动画，是自定义的方法
            zoomFont(this);
            // 为true则应用CSS中的样式：
            this.finishButton = true;
            // 将完成状态反转——false变true，true变false，这一步给当前的Boolean值取反，并呈现给用户看
            // 注意！对MySQL来说，0是false，1是true，当todo.done为0时，就取反变为1，不为0时就使其变为0
            todo.done = todo.done === 0 ? 1 : 0;

            // 现在的完成状态
            todo["nowDone"] = todo.done;
            // 而这一步是为了修改数据并存储到服务器，目前布尔值已经取反了
            modification(todo);
        },
        // 删除对象（待办事项）的方法
        deleteTodo(todo) {
            /*这里需要删除节点，而不是单纯的删除对象（不是delete 对象）
            这里会调用删除节点的方法，todoSome是v-for的数组，splice()方法可以删除指定索引的元素，第二个参数意为只删除当前一项*/
            this.todoArray.splice(this.todoArray.indexOf(todo), 1);

            // 在后端的数据库中删除：
            deleteObject(todo);
            ElMessage({
                showClose: true,
                message: "删除成功！",
                type: "success",
            });
            zoomFont(this);
        },
        // 清除已完成的事项：
        clearCompleteTheTask() {
            // 如果没有禁用
            if (this.inputDisabled === false) {
                // 找出所有已完成的事项
                let completedMattersArray = this.todoArray.filter((element) => element.done === 1);
                // 如果当前没有已完成的事项：
                if (completedMattersArray.length === 0) {
                    ElMessage({
                        showClose: true,
                        message: "目前没有已完成的事项~",
                        type: "warning",
                    });
                } else {
                    // 创建一个用于接收“需要删除的事项对应的id”
                    let deleteTodoId = [];
                    completedMattersArray.forEach((element) => {
                        deleteTodoId.push(element.id);
                    });
                    // 清空所有已完成的事项
                    clearCompletedTodo(deleteTodoId);

                    // 注意！改变数组操作的这一步要在后面做！
                    // 寻找出所有未完成的事项，并赋值到原来的事项数组中，这样就达到了去除所有“已完成的事项”的目的：
                    this.todoArray = this.todoArray.filter((element) => element.done === 0);
                    ElMessage({
                        showClose: true,
                        message: "成功清除已完成的事项！",
                        type: "success",
                    });
                    zoomFont(this);
                }
            } else {
                ElMessage({
                    showClose: true,
                    message: "您未登录，无法清除已完成的事项···",
                    type: "warning",
                });
            }
        },
        // 完成所有事项
        finishAllTodo() {
            // 当按钮没有禁用时
            if (this.inputDisabled === false) {
                // 如果查找数组时，发现没有找到未完成的，就证明都已经完成了
                if (this.todoArray.find((todo) => todo.done === 0) === undefined) {
                    ElMessage({
                        showClose: true,
                        message: "没找到未完成的事项",
                        type: "warning",
                    });
                } else {
                    // 使用数组的map()，将所有完成的属性值设置为1，表示完成
                    this.todoArray.map((todo) => (todo.done = 1));
                    // 然而只需要将用户名字提交给后台
                    finishAllTodo(this.$refs.userLogin.myName);
                    ElMessage({
                        showClose: true,
                        message: "完成所有事项！",
                        type: "success",
                    });
                    zoomFont(this);
                }
            } else {
                ElMessage({
                    showClose: true,
                    message: "您未登录，无法完成所有事项···",
                    type: "warning",
                });
            }
        },
        // 取消完成所有事项
        noFinishAllTodo() {
            if (this.inputDisabled === false) {
                // 如果查找数组时，发现没有找到已完成的，就证明都未完成
                if (this.todoArray.find((todo) => todo.done === 1) === undefined) {
                    ElMessage({
                        showClose: true,
                        message: "没找到已完成的事项",
                        type: "warning",
                    });
                } else {
                    // 使用数组的map()，将所有完成的属性值设置为1，表示完成
                    this.todoArray.map((todo) => (todo.done = 0));
                    // 到后台进行处理，只需提交用户名
                    noFinishAllTodo(this.$refs.userLogin.myName);
                    ElMessage({
                        showClose: true,
                        message: "取消完成所有事项！",
                        type: "success",
                    });
                    zoomFont(this);
                }
            } else {
                ElMessage({
                    showClose: true,
                    message: "您未登录，无法取消完成所有事项···",
                    type: "warning",
                });
            }
        },
        // 动态修改“滚动列表”的高度——自适应高度
        elScrollbarMaxHeight() {
            // 当前窗口的高度
            let innerHeight = window.innerHeight;
            if (innerHeight > 2160) {
                // 获取ref值为todoForm的div的高度
                this.elScrollbarHeight = `${innerHeight / 1.7}px`;
            } else if (innerHeight > 1080) {
                this.elScrollbarHeight = `${innerHeight / 1.8}px`;
            } else if (innerHeight > 720) {
                this.elScrollbarHeight = `${innerHeight / 2.1}px`;
            } else if (innerHeight > 480) {
                this.elScrollbarHeight = `${innerHeight / 2.2}px`;
            } else if (innerHeight > 370) {
                this.elScrollbarHeight = `${innerHeight / 2.7}px`;
            } else if (innerHeight > 230) {
                this.elScrollbarHeight = `${innerHeight / 2.9}px`;
            }
        },
        // 游客登录按钮
        visitorLogin() {
            // 表示正在登录
            this.isLogin = true;
            this.anonymousLoginButtonText = "登录中";
            // 获取浏览器指纹
            FingerprintJS.load().then((fp) => {
                fp.get().then((result) => {
                    // 让负责用户信息的组件去处理登录问题，这里顺便将浏览器指纹传过去，充当用户名
                    emitter.emit("游客登录", result.visitorId);
                    emitter.on("游客登录成功", (message) => {
                        if (message === "是") {
                            // 按钮呈现的文本
                            this.anonymousLoginButtonText = "登录成功";
                            // 结束登录中的状态
                            this.isLogin = false;
                            // 延迟还原按钮的文字
                            setTimeout(() => (this.anonymousLoginButtonText = "游客登录"), 500);
                            // 将loginSuccess的布尔值改为true，方便上面HTML显示登录成功
                            this.$refs.userLogin.loginSuccess = true;
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                message: "您以游客的身份登录成功了！",
                                type: "success",
                            });
                        }
                        emitter.off("游客登录成功", "是");
                    });
                });
            });
        },
    },
    // 局部自定义指令
    directives: {
        // 注册一个局部的自定义指令 v-focus
        focus: {
            // inserted就是钩子函数之一，当被绑定的元素插入父节点时调用，但在vue文件中，此input焦点案例没有作用
            // 注意！！！应该使用“生命周期钩子之一：mounted”，仅在整个视图都被渲染后才会运行下面的代码
            mounted(el) {
                // 将焦点定位到带有“v-focus”指令的元素上：
                if (el.querySelector("input")) {
                    el.querySelector("input").focus();
                }
            },
        },
    },
};
</script>

<!--这里使用更强大的scss-->
<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}

/*本组件的根div*/
#todo-list {
    width: 100%;
    height: 100%;
    /*自定义指针样式（注意！图片分辨率应为30x30，太大会没有效果）*/
    cursor: url("../../assets/cursor/default.png"), default;
}

/*背景图片的div，用于添加内阴影*/
#backgroundImageBoxShadow {
    width: 100%;
    height: 100%;
    /*四周都有阴影*/
    box-shadow: inset 0 0 50rem black;
    /*脱离文档流*/
    position: absolute;
}

/*存放背景图片的img*/
#backgroundImage {
    width: 100%;
    height: 100%;
    /*使用100%,100%会导致图片变形，因为图片比例不是1:1（图片分辨率1920x1080），而cover则会原样显示*/
    position: fixed;
    /*以图片最上边为基准来显示*/
    background-position: top;
    /*背景div要将“图层”下移一层，使其他内容显示在上面*/
    z-index: -1;
    /*防闪烁*/
    -webkit-backface-visibility: hidden;
    /*背景模糊的过渡时间*/
    transition-duration: 1s;
    /*动画名称*/
    animation-name: imageShow;
    /*动画持续时间*/
    animation-duration: 2s;
    /*淡入效果*/
    animation-timing-function: ease-in-out;
    /*使图片显示方式为“覆盖”，在窗口缩小时能保持原有比例，不会出现变形，不过这会让图片有些地方不可见，但也还可以接受*/
    object-fit: cover;
    /*禁止被选中*/
    user-select: none;
}

/*图片由完全透明到不透明的过渡*/
@keyframes imageShow {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

/*使背景图片虚化，这个class是动态调用的，当打开某些窗口时，背景图片会虚化*/
.backgroundBlur {
    /*将div放大*/
    transform: scale(1.04);
    filter: blur(1rem);
}

/*YY待办标题*/
#YyTodo {
    font-size: 2vmax;
    color: white;
    padding-top: 2vmax;
    /*让行内元素水平居中，table布局是行之有效的*/
    display: table;
    /*两边的边距都相等*/
    margin: 0 auto;
    transition: all 0.5s ease-in-out;
}

#YyTodo:hover {
    text-shadow: 0 0 10px white;
}

/*当前状态*/
.currentStatus {
    margin-top: 2vmax;
    color: white;
    font-size: 14px;
    height: 20px;
    display: inline-block;
    margin-left: 1px;
    padding-bottom: 4px;
}

/*选中文字后的颜色*/
#YyTodo::selection,
.currentStatus::selection {
    color: #004da3;
    background: white;
}

#YyTodo::-moz-selection.currentStatus::-moz-selection {
    color: #004da3;
    background: white;
}

.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

/*给添加事项的输入框修改指针样式*/
::v-deep(#inputTodo) {
    min-height: 53px;
    cursor: url("../../assets/cursor/text.png"), text;
}

/*修改输入框的滚动条样式*/
::v-deep(#inputTodo::-webkit-scrollbar) {
    width: 6px;
    height: 6px;
}

::v-deep(#inputTodo::-webkit-scrollbar-thumb) {
    border-radius: 3px;
    background-color: #d4d7de;
}

/*待办事项内容的输入框和添加按钮*/
#inputAndButton {
    /*变为弹性布局*/
    display: flex;
}

/*缩放字体大小的动画*/
.zoomFont {
    animation: textSize 0.8s;
    transition: all 0.8s ease-in-out;
}

/*字体由小到大、再到小*/
@keyframes textSize {
    50% {
        text-shadow: 0 0 20px white;
        transform: scale(1.1);
    }
}

/*待办事项最大的表单标签*/
#todoForm {
    width: 50%;
    margin: 0 auto;
    background: rgba(30, 30, 30, 0.6);
    box-shadow: 0 0 6px rgba(60, 60, 60, 0.6);
    position: relative;
    padding-left: 20px;
    padding-right: 20px;
    // 缩放时的过渡
    transition: all 1s ease-in-out;
    border-radius: 4px;
}

@media (max-height: 250px) {
    #todoForm {
        width: 80%;
        margin-top: -80px;
        transform: scale(0.6);
    }
}

@media (max-height: 150px) {
    #todoForm {
        margin-top: -90px;
        padding: 0;
        transform: scale(0.5);
    }
}

/*事项的内容*/
.completed,
.noCompleted {
    width: 100%;
    margin-top: 1vw;
    margin-bottom: 1vw;
    /*在缩放时会有过渡效果*/
    transition: all 0.5s ease-in-out;
    /*解决文字超出div，无法实现自动换行的问题*/
    word-break: break-all;
    word-wrap: break-word;
}

.completed::selection,
.noCompleted::selection {
    color: #5ea5ff;
    background: #ffffff;
}

/*未完成时的事项内容字体颜色*/
.noCompleted {
    color: #303133;
}

/*如果已完成*/
.completed {
    color: #303133;
    text-decoration: line-through;
    opacity: 0.8;
}

/*输入框外边的div（在UI库中）*/
::v-deep(.el-textarea) {
    width: 90%;
    display: inline-block;
}

/*待办事项输入框*/
::v-deep(.el-textarea__inner) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-top: 6px;
    font-size: 10pt;
}

/*待办事项输入框，要修改UI库的样式，得使用深度选择器才能成功*/
#addToDo {
    /*高度一定要选择继承，才能与输入框的高度同步*/
    height: inherit;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    /*使按钮响应式的的放大和缩小*/
    flex: 1 1 50px;
    transition-duration: 0s;
    box-shadow: 0 0 2px rgba(89, 171, 255, 0.8);
}

/*添加按钮的禁用状态*/
::v-deep(.addToDoDisabledCursor) {
    cursor: url("../../assets/cursor/not-allowed.png"), not-allowed;
}

.addToDoNotDisabledCursor {
    cursor: url("../../assets/cursor/pointer.png"), pointer;
}

/*待办列表的每一项列表*/
.todoListElement {
    display: flex;
    /*垂直轴上居中，即上下距离都相等 */
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    text-align: center;
    border-radius: 4px;
    // 初始背景
    background: rgba(255, 255, 255, 0.6);
    // 磨砂玻璃
    backdrop-filter: blur(1vh);
    color: #333;
    transition: all 0.5s ease-in-out;
}

/*事项未完成时的边框样式*/
.todoNotDoneBorder {
    // 渐变背景颜色要用的
    background-image: linear-gradient(to top, rgba(217, 252, 255, 0.8), rgba(255, 255, 255, 0.1));
    border-bottom: 3px solid rgba(81, 250, 255, 0.8);
    box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.4) inset, 0 2px 4px rgba(81, 250, 255, 0.5);
}

.todoNotDoneBorder:hover {
    background-image: linear-gradient(to top, rgba(200, 249, 252, 1), rgba(255, 255, 255, 0.2));
    border-bottom: 3px solid #00f8ff;
    box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.4) inset, 0 2px 4px rgba(81, 250, 255, 0.7);
}

/*完成事项后的边框样式*/
.todoDoneBorder {
    background-image: linear-gradient(to top, rgba(232, 255, 231, 0.8), rgba(255, 255, 255, 0.1));
    border-bottom: 3px solid rgba(118, 255, 53, 0.8);
    box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.4) inset, 0 2px 4px rgba(118, 255, 53, 0.5);
}

.todoDoneBorder:hover {
    background-image: linear-gradient(to top, rgba(222, 255, 220, 1), rgba(255, 255, 255, 0.2));
    border-bottom: 3px solid #76ff35;
    box-shadow: 0 0 2px 2px rgba(255, 255, 255, 0.1) inset, 0 2px 4px rgba(118, 255, 53, 0.7);
}

/*列表中后面的div*/
.liEndDiv {
    display: flex;
    height: 100%;
    align-items: center;
}

/*删除事项*/
.deleteTodo {
    margin-left: 1vw;
    margin-right: 1vw;
    cursor: url("../../assets/cursor/pointer.png"), pointer;
    transition-duration: 0s;
}

/*鼠标移到删除的文本上，会变亮*/
.deleteTodo:hover {
    color: #999;
}

/*显示修改时间的图标按钮*/
::v-deep(.showModificationTime) {
    min-width: 20px;
    height: 100%;
    margin-right: 4px;
    cursor: url("../../assets/cursor/default.png"), default;
    /*直接覆盖按钮的背景颜色，能够防止点击按钮后颜色不会恢复*/
    background-color: #330c82;
}

/*待办事项功能按钮的div*/
#functionIcon {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    // 自动换行
    flex-flow: wrap;
    // 对齐
    align-self: baseline;
    margin: 1px 0;
}

/*待办事项功能按钮*/
.todoFunctionButton {
    width: 30px;
    /*默认未选中时的不透明度为40%（注意不能用百分比，否则在移动端无效）*/
    opacity: 0.4;
    /*加上过渡*/
    transition: all 0.5s ease-in-out;
    cursor: url("../../assets/cursor/pointer.png"), pointer;
}

/*游客登录按钮*/
.visitorLogin {
    width: 100%;
    display: flex;
    opacity: 0.8;
    transition: 0.25s;
    box-shadow: 0 0 2px rgba(89, 171, 255, 0.8);
}

.visitorLogin-enter-active {
    opacity: 0;
}

.visitorLogin-enter-to {
    opacity: 0.8;
    transition: all 1s ease-in-out;
}

.visitorLogin-leave-active {
    /*不透明度、高度和字体在渐变下慢慢变为0*/
    opacity: 0;
    height: 0;
    font-size: 0;
    transition: all 1s ease-in-out;
}

/*待办事项的滚动栏*/
#elScrollbar {
    padding-bottom: 20px;
}

/*事项元素开始进入*/
.todo-li-enter-active {
    opacity: 0;
}

/*事项div进入完毕*/
.todo-li-enter-to {
    opacity: 1;
    transition: all 1s ease-in-out;
}

/*事项div开始离开*/
.todo-li-leave-active {
    /*需要让这个元素脱离标准流，不然后面的元素动不了*/
    position: absolute;
    transition: all 1s ease;
    width: 100%;
    /*不要显示消失的事项框*/
    opacity: 0;
}

/*添加事项和删除事项的动画，移除元素时，让动画平滑一点*/
.todo-li-move {
    transition: all 1s ease;
}

/*使图标显示完全而不会透明，当选中时就会应用此样式*/
.opacity100 {
    opacity: 1;
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
}

/*光标的样式为：禁止*/
.cursorNotAllowed {
    cursor: url("../../assets/cursor/not-allowed.png"), not-allowed;
}

/*”完成以及取消完成按钮“的容器*/
.svgContainer {
    width: 20px;
    margin-right: 16px;
    cursor: url("../../assets/cursor/pointer.png"), pointer;
    margin-top: 6px;
    margin-left: 4px;
}

/*存放事项的div*/
.todoDiv {
    width: 100%;
    cursor: url("../../assets/cursor/text.png"), text;
}

/*修改事项用到的输入框*/
::v-deep(.revisedInputBox, .el-textarea__inner) {
    width: 20vw;
}
</style>