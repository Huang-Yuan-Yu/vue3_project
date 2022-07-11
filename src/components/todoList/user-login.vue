<template>
    <!--如果单击空白处，则右侧的用户提示框立即消失-->
    <div id="user-login">
        <!--登录、注册模块-->
        <div id="login" @mouseleave="userMouseleave">
            <transition name="checkLogin">
                <!--指针移入，则isShowCheckLogin为true，true就显示-->
                <div v-if="isShowCheckLogin" class="loginAndRegistration" @mouseenter="userMouseEnter">
                    <div v-if="!loginSuccess" id="noLogin" class="scale-in-tr">
                        <p class="loginStatus">您尚未登录</p>
                        <p id="persuasionLogin">登录后，可存储您的待办列表和个性化设置</p>
                        <el-button
                            class="userButton"
                            color="#1e1e1e"
                            size="large"
                            type="info"
                            @click="showLoginWindow('登录')"
                        >
                            登录
                        </el-button>
                        <el-button
                            class="userButton"
                            color="#1e1e1e"
                            size="large"
                            type="info"
                            @click="showLoginWindow('注册')"
                        >
                            注册
                        </el-button>
                    </div>
                    <div v-if="loginSuccess" id="loginSuccess" class="scale-in-tr">
                        <p class="loginStatus">欢迎您 {{ myName }}</p>
                        <el-button
                            class="userButton"
                            color="#1e1e1e"
                            size="large"
                            type="info"
                            @click="openSetAvatarWindow"
                        >
                            设置头像
                        </el-button>
                        <el-button class="userButton" color="#1e1e1e" size="large" type="info" @click="userLogout">
                            退出登录
                        </el-button>
                    </div>
                </div>
            </transition>

            
            <!--未登录时显示未登录的头像-->
            <a>
                <img
                    class="userLogo"
                    alt="未登录时的用户头像"
                    src="../../assets/userLogo.png"
                    @mouseenter="userMouseEnter"
                    v-if="loginSuccess === false"
            /></a>
            <!--登录后显示用户的头像，如果未设置头像，则显示默认头像-->
            <a>
                <img
                    class="userLogo"
                    alt="登录后的用户头像"
                    :src="
                        $store.state.userAvatarData === null
                            ? require('@/assets/defaultAvatar.png')
                            : $store.state.userAvatarData
                    "
                    @mouseenter="userMouseEnter"
                    v-if="loginSuccess === true"
            /></a>
        </div>
        <!--设置用户头像的组件，将布尔值变量传入子组件，决定子组件是否要显示-->
        <set-avatar :isShowSetAvatarWindow="isShowSetAvatarWindow" :myName="myName" ref="setAvatar"></set-avatar>

        <transition name="loginUi">
            <!--是否显示登录界面-->
            <div v-if="isShowLoginWindow || isShowRegistrationWindow || isShowResetPassword" id="loginUi">
                <p id="close" @click="closeWindow">✖</p>
                <div v-if="isShowLoginWindow">
                    <p class="loginText">登录</p>
                    <form>
                        <!--clearable：可一键清除输入框的内容；maxlength：输入框可输入的最大字符数；
                        show-word-limit：显示输入框允许输入的最大字符数
                        inputError: this.inputAccountError表示“当输入有误时，就应用inputError这个CSS的class，将输入框变红色-->
                        <el-input
                            v-focus
                            v-model.trim="user.name"
                            :class="{ inputError: this.inputAccountError }"
                            class="noCodeUserAccountInput"
                            clearable
                            maxlength="40"
                            placeholder="请输入您的邮箱"
                            show-word-limit
                            type="email"
                            @blur="checkAccount"
                            @focus="this.inputAccountError = false"
                            @keyup.enter="userLogin"
                        >
                            <!--使用Element Plus（UI库）提供的插槽，这里“#prefix”表示从输入表单的开头插入-->
                            <template #prefix>
                                <!--用户图标，:size为图标大小-->
                                <el-icon :size="22" class="avatar"><avatar /></el-icon>
                            </template>
                        </el-input>
                        <p v-if="inputAccountError" class="loginInputErrorTips">提示：电子邮箱格式错误</p>
                        <!--show-password：显示密码-->
                        <el-input
                            v-model.trim="user.password"
                            :class="{ inputError: this.inputPasswordError }"
                            class="userPasswordInput"
                            clearable
                            maxlength="15"
                            placeholder="请输入您的密码"
                            show-password
                            type="password"
                            @blur="checkPassword"
                            @focus="inputPasswordFocus"
                            @keydown="inputPasswordKeydown"
                            @keyup="inputPasswordKeyup"
                            @keyup.enter="userLogin"
                        >
                            <template #prefix>
                                <!--锁的图标-->
                                <el-icon :size="22" class="avatar"><lock /></el-icon>
                            </template>
                        </el-input>
                        <!--大写提示-->
                        <template v-if="isFocusInputPassword">
                            <el-tag v-show="bigChar" class="capitalizationHint" type="warning">大写锁定已开启</el-tag>
                        </template>
                        <p v-if="inputPasswordError" class="loginInputErrorTips">
                            提示：您的密码至少包括总共8位的英文和数字！
                        </p>
                        <el-button class="loginOrRegisterButton" size="large" type="primary" @click="userLogin"
                            >登录
                        </el-button>
                        <span class="forgetPassword" @click="forgotPassword">忘记密码？</span>
                    </form>
                </div>

                <div v-if="isShowResetPassword">
                    <p class="loginText">重置密码</p>
                    <form>
                        <el-row>
                            <el-col :span="19">
                                <!--注意！autocomplete="nope"能够取消浏览器对此输入框的自动内容填充提示-->
                                <el-input
                                    v-focus
                                    v-model.trim="user.name"
                                    :class="{ inputError: this.inputAccountError }"
                                    autocomplete="nope"
                                    class="userAccountInput"
                                    clearable
                                    maxlength="40"
                                    placeholder="请输入您的邮箱（作为依据）"
                                    show-word-limit
                                    type="email"
                                    @blur="checkAccount"
                                    @focus="this.inputAccountError = false"
                                    @keyup.enter="userRegistration"
                                >
                                    <template #prefix>
                                        <el-icon :size="22" class="avatar"><avatar /></el-icon>
                                    </template>
                                </el-input>
                            </el-col>
                            <el-col :span="5">
                                <!--获取验证码的按钮，发送后60秒处于禁用状态（如果这里为button，则会导致回车事件页面刷新的BUG-->
                                <input
                                    v-if="getVerificationCode.loading === false"
                                    :value="getVerificationCode.text"
                                    class="sendVerificationCode"
                                    type="button"
                                    @click="sendVerificationCode"
                                />
                                <!--包含获取中动画的按钮-->
                                <el-button
                                    v-if="getVerificationCode.loading === true"
                                    class="sendVerificationCode"
                                    loading
                                    type="primary"
                                    >获取中
                                </el-button>
                            </el-col>
                        </el-row>
                        <p v-if="inputAccountError" class="loginInputErrorTips">提示：电子邮箱格式错误</p>
                        <el-input
                            v-model.trim="user.password"
                            :class="{ inputError: this.inputPasswordError }"
                            class="userPasswordInput"
                            clearable
                            maxlength="15"
                            placeholder="请输入您的新密码"
                            show-password
                            type="password"
                            @blur="checkPassword"
                            @focus="inputPasswordFocus"
                            @keydown="inputPasswordKeydown"
                            @keyup="inputPasswordKeyup"
                            @keyup.enter="userRegistration"
                        >
                            <template #prefix>
                                <el-icon :size="22" class="avatar"><lock /></el-icon>
                            </template>
                        </el-input>
                        <!--大写提示-->
                        <template v-if="isFocusInputPassword">
                            <el-tag v-show="bigChar" class="capitalizationHint" type="warning">大写锁定已开启</el-tag>
                        </template>
                        <p v-if="inputPasswordError" class="loginInputErrorTips">
                            提示：密码至少要包括总共8位的英文和数字！
                        </p>
                        <el-row>
                            <el-col :span="12">
                                <el-input
                                    v-model.trim="user.verificationCode"
                                    :class="{ inputError: this.inputVerificationCodeError }"
                                    class="userPasswordInput"
                                    clearable
                                    maxlength="6"
                                    placeholder="验证码"
                                    show-word-limit
                                    type="text"
                                    @focus="this.inputVerificationCodeError = false"
                                    @keyup.enter="userRegistration"
                                >
                                    <template #prefix>
                                        <!--<el-icon><avatar /></el-icon>-->
                                        <el-icon :size="22" class="avatar"><Promotion /></el-icon>
                                    </template>
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-button class="resetPasswordButton" size="large" type="primary" @click="resetPassword"
                            >确认修改
                        </el-button>
                    </form>
                </div>

                <div v-if="isShowRegistrationWindow">
                    <p class="loginText">注册</p>
                    <!--form里面是表单元素，如果不加from，会提示”密码字段不包含在表单中（已翻译）“-->
                    <form>
                        <el-row>
                            <el-col :span="19">
                                <!--注意！autocomplete="nope"能够取消浏览器对此输入框的自动内容填充提示-->
                                <el-input
                                    v-focus
                                    v-model.trim="user.name"
                                    :class="{ inputError: this.inputAccountError }"
                                    autocomplete="nope"
                                    class="userAccountInput"
                                    clearable
                                    maxlength="40"
                                    placeholder="请输入您的邮箱"
                                    show-word-limit
                                    type="email"
                                    @blur="checkAccount"
                                    @focus="this.inputAccountError = false"
                                    @keyup.enter="userRegistration"
                                >
                                    <template #prefix>
                                        <el-icon :size="22" class="avatar"><avatar /></el-icon>
                                    </template>
                                </el-input>
                            </el-col>
                            <el-col :span="5">
                                <!--获取验证码的按钮，发送后60秒处于禁用状态（如果这里为button，则会导致回车事件页面刷新的BUG-->
                                <input
                                    v-if="getVerificationCode.loading === false"
                                    :value="getVerificationCode.text"
                                    class="sendVerificationCode"
                                    type="button"
                                    @click="sendVerificationCode"
                                />
                                <!--包含获取中动画的按钮-->
                                <el-button
                                    v-if="getVerificationCode.loading === true"
                                    class="sendVerificationCode"
                                    loading
                                    type="primary"
                                    >获取中
                                </el-button>
                            </el-col>
                        </el-row>
                        <p v-if="inputAccountError" class="loginInputErrorTips">提示：电子邮箱格式错误</p>
                        <el-input
                            v-model.trim="user.password"
                            :class="{ inputError: this.inputPasswordError }"
                            class="userPasswordInput"
                            clearable
                            maxlength="15"
                            placeholder="请输入用于邮箱的密码"
                            show-password
                            type="password"
                            @blur="checkPassword"
                            @focus="inputPasswordFocus"
                            @keydown="inputPasswordKeydown"
                            @keyup="inputPasswordKeyup"
                            @keyup.enter="userRegistration"
                        >
                            <template #prefix>
                                <el-icon :size="22" class="avatar"><lock /></el-icon>
                            </template>
                        </el-input>
                        <!--大写提示-->
                        <template v-if="isFocusInputPassword">
                            <el-tag v-show="bigChar" class="capitalizationHint" type="warning">大写锁定已开启</el-tag>
                        </template>
                        <p v-if="inputPasswordError" class="loginInputErrorTips">
                            提示：密码至少要包括总共8位的英文和数字！
                        </p>
                        <el-row>
                            <el-col :span="12">
                                <el-input
                                    v-model.trim="user.verificationCode"
                                    :class="{ inputError: this.inputVerificationCodeError }"
                                    :placeholder="$store.state.userEquipment === null ? '请输入验证码' : '验证码'"
                                    class="userPasswordInput"
                                    clearable
                                    maxlength="6"
                                    show-word-limit
                                    type="text"
                                    @focus="this.inputVerificationCodeError = false"
                                    @keyup.enter="userRegistration"
                                >
                                    <template #prefix>
                                        <!--<el-icon><avatar /></el-icon>-->
                                        <el-icon :size="22" class="avatar"><Promotion /></el-icon>
                                    </template>
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-button class="loginOrRegisterButton" size="large" type="primary" @click="userRegistration"
                            >注册
                        </el-button>
                        <span class="forgetPassword">手机号注册</span>
                    </form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
// AES加密
import aes from "@/jsFunction/aes";
// 引入消息提示框，属于非模态提示框，不会打断用户操作
import { ElMessage } from "element-plus";
// 引入用户图标以及锁图标（需要全局引入加局部注册才能用）
import { Avatar, Lock } from "@element-plus/icons-vue";
// 弹出提示框
import { ElNotification } from "element-plus";
// 获取上次登录时间和本次登录时间
import { loginTime } from "@/jsFunction/todoList";
// 引入mitt库，用于高效率的组件间通信
import emitter from "@/jsFunction/eventbus";
import setAvatar from "@/components/todoList/set-avatar";

export default {
    name: "user-login",
    components: { SetAvatar: setAvatar },
    data() {
        return {
            // 用户信息
            user: {
                name: "",
                password: "",
                // 验证码
                verificationCode: "",
            },
            // 三元运算符，判断本地存储的name值是否为null，如果为null就证明用户未登录，未登录时myName就为null，登录后就获取对应的用户名
            myName: localStorage.getItem("name") === null ? null : localStorage.getItem("name"),
            // 是否登录成功：
            // 如果在本地存储中找到jwt这一个键，并且不为null，那么说明用户登录过，右侧结果就为true，就把true赋值给loginSuccess
            // 否则为false则说明用户未登录
            loginSuccess: localStorage.getItem("jwt") !== null,
            // 是否显示检查登录的div，默认不显示，等光标移到上面再显示
            isShowCheckLogin: false,
            // 用于存储计时器的变量，便于清除
            showTimeout: null,
            // 是否要显示登录窗口
            isShowLoginWindow: false,
            // 是否显示重置密码的窗口
            isShowResetPassword: false,
            // 是否要显示注册窗口
            isShowRegistrationWindow: false,
            // 是否要显示用户设置头像窗口
            isShowSetAvatarWindow: false,
            // 输入的邮箱是否有误：
            inputAccountError: false,
            // 输入的邮箱是否有误：
            inputPasswordError: false,
            // 输入验证码是否错误
            inputVerificationCodeError: false,
            // 验证码
            getVerificationCode: {
                // 按钮用的文本，会动态变化，这里引用Vuex的state变量
                text: this.$store.state.userEquipment === null ? "获取验证码" : "取验证码",
                // 获取到的验证码
                verificationCode: null,
                // 是否正在获取
                loading: false,
                // 按钮是否禁用
                disabled: false,
                // 获取后倒计时等待时间
                duration: 60,
                // 用于计时器
                timer: null,
                // 记录临时邮箱，防止填写完验证码之后修改邮箱——作弊
                tempEmail: null,
            },
            // 下面三个变量用于大写提示的功能（bigChar：聚焦到输入框为true）
            bigChar: false,
            // 用于是否同时按住shift键，按下组合键：Shift+字母键，也能大写，但不会提示
            shiftKey: undefined,
            // 是否聚焦到密码输入框（用于提示大写的判断）
            isFocusInputPassword: false,
        };
    },
    // 在Vue3中，新引入的Avatar, Lock要注册到全局，使之变成响应式，最好不要在components里注册
    setup() {
        return {
            // 用户图标
            Avatar,
            // 密码的锁图标
            Lock,
        };
    },
    // 当页面加载完毕时
    mounted() {
        // 如果已登录，就对Token进行验证：
        if (this.loginSuccess === true) {
            this.$axios({
                method: "post",
                data: { name: localStorage.getItem("name") },
                url: "/api/TodoList/verification",
                // 每次请求都会在HTTP请求头中加上token的值
                headers: {
                    // 设置请求头
                    token: localStorage.getItem("jwt"),
                },
            }).then((response) => {
                // 如果发现后都按传来的数据为“Token已过期”，则注销用户
                if (response.data === "Expired token") {
                    // 向父组件通知说Token过期
                    emitter.emit("Token认证", "认证失败");
                    localStorage.removeItem("jwt");
                    localStorage.removeItem("name");
                    localStorage.removeItem("password");
                    localStorage.removeItem("userAvatarData");
                    // 将登录状态设置为false，将本地存储的用户名设置为空
                    this.loginSuccess = false;
                    this.myName = null;
                    // 顶部弹窗消息
                    ElMessage({
                        // 显示关闭按钮
                        showClose: true,
                        message: "身份已过期，请重新登录！",
                        type: "warning",
                    });
                    // 右下角
                    ElNotification({
                        title: "你还未登录~",
                        message: "登录之后，享有更多功能！",
                        position: "bottom-right",
                    });
                } else if (response.data === "Syntax error, malformed JSON") {
                    emitter.emit("Token认证", "认证失败");
                    ElMessage({
                        // 显示关闭按钮
                        showClose: true,
                        message: "禁止伪造Token！",
                        type: "error",
                    });
                }
                // 如果Token认证成功
                else {
                    // 将头像的数据保存到Vuex的state中
                    this.$store.dispatch("setShowAvatar", response.data.avatar);
                    this.myName = localStorage.getItem("name");
                    emitter.emit("Token认证", "认证成功");
                    // 趁现在还处于vue对象的作用域，先将data中myName变量保留下来，存储到一个变量中
                    let myName = this.myName;
                    // 使用“匿名函数+直接调用”的方式，将函数定义为同步执行，这样才使获取的时间不为undefined
                    (async function () {
                        // 如果未登录（备份：myName !== null && ）
                        let time = await loginTime(myName);
                        // 用于计算当前时间，然后做判断，最后问候用户
                        let currentTime = new Date(time["本次登录时间"]).getHours();
                        // 时间段
                        let timeFrame = null;
                        if (currentTime <= 5) {
                            timeFrame = `凌晨了，${myName}，要注意休息啊！`;
                        } else if (currentTime <= 8) {
                            timeFrame = `早晨好！${myName}，一日之计在于晨！`;
                        } else if (currentTime <= 11) {
                            timeFrame = `上午好！${myName}，每天要吃早餐哦~`;
                        } else if (currentTime <= 13) {
                            timeFrame = `中午好！${myName}，太阳当空照~`;
                        } else if (currentTime <= 16) {
                            timeFrame = `下午好！${myName}，多喝下午茶哦~`;
                        } else if (currentTime <= 18) {
                            timeFrame = `傍晚好！${myName}，夕阳无限好！`;
                        } else if (currentTime <= 24) {
                            timeFrame = `晚上好！${myName}，早点睡哦~`;
                        }
                        // 弹出提示框
                        ElNotification({
                            title: timeFrame,
                            message: `上次登录时间：${time["上次登录时间"]}`,
                            position: "bottom-right",
                        });
                    })();
                }
            });
        } else {
            emitter.emit("Token认证", "未认证");
            ElNotification({
                title: "你还未登录~",
                message: "登录之后，享有更多功能！",
                position: "bottom-right",
            });
        }

        // 监听键盘是否开启大写锁定
        window.addEventListener("keydown", (event) => {
            let e = event || window.event;
            //  检测大写锁定键
            if (e.keyCode === 20) {
                if (!this.isFocusInputPassword) {
                    this.bigChar = !this.bigChar;
                }
            }
        });

        emitter.on("设置头像", (message) => {
            if (message === "成功") {
                this.isShowSetAvatarWindow = false;
            }
        });
    },
    methods: {
        // 当用户指针进入时
        userMouseEnter() {
            // 清除计时器，防止isShowCheckLogin设置为false，因为用户进入了，窗口不能消失
            clearTimeout(this.showTimeout);
            this.isShowCheckLogin = true;
        },
        // 用户指针离开时
        userMouseleave() {
            // 设置定时器，1秒后关闭显示窗口（并且赋值给data中的showTimeout，方便userMouseEnter()清除计时器：
            this.showTimeout = setTimeout(() => {
                this.isShowCheckLogin = false;
            }, 500);
        },
        // 显示登录或注册界面
        showLoginWindow(type) {
            // 点击登录或注册，就将右上角的提示框隐藏
            this.isShowCheckLogin = false;
            // 如果用户想进入登录界面
            if (type === "登录") {
                // 如果isShowRegistrationWindow为true，证明打开了注册界面，此时就不能打开登录界面，给用户提示
                if (this.isShowRegistrationWindow) {
                    ElMessage({
                        showClose: true,
                        message: "打开注册界面时不能打开登录界面！",
                        type: "warning",
                    });
                } else if (this.isShowLoginWindow) {
                    ElMessage({
                        showClose: true,
                        message: "这已经是登录界面了！",
                        type: "warning",
                    });
                } else {
                    // 设置为true则显示
                    this.isShowLoginWindow = true;
                }
            } else if (type === "注册") {
                if (this.isShowLoginWindow) {
                    ElMessage({
                        showClose: true,
                        message: "打开登录界面时不能打开注册界面！",
                        type: "warning",
                    });
                } else if (this.isShowRegistrationWindow) {
                    ElMessage({
                        showClose: true,
                        message: "这已经是注册界面了！",
                        type: "warning",
                    });
                } else {
                    // 设置为true则显示
                    this.isShowRegistrationWindow = true;
                }
            }
        },
        // 关闭登录或注册界面
        closeWindow() {
            this.isShowLoginWindow = false;
            this.isShowRegistrationWindow = false;
            this.isShowResetPassword = false;
            // 清空输入的内容
            this.user = {
                name: "",
                password: "",
                verificationCode: "",
            };
        },
        // 检查邮箱邮箱输入是否正确
        checkAccount() {
            if (this.user.name.length !== 0) {
                // 符合正则表达式，则inputAccountError为false，不符合则为true
                this.inputAccountError = !new RegExp(
                    "^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9\\-]+\\.)+[A-Za-z]{2,6}$"
                ).test(this.user.name);
            }
        },
        // 检查密码输入是否正确
        checkPassword() {
            // 将“是否正在聚焦”改为false
            this.isFocusInputPassword = false;
            if (this.user.password.length !== 0) {
                // 符合正则表达式，则inputAccountError为false，不符合则为true
                this.inputPasswordError = !new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$").test(
                    this.user.password
                );
            }
        },
        // 输入密码时失去焦点
        inputPasswordFocus() {
            // 将错误提示临时取消
            this.inputPasswordError = false;
            this.isFocusInputPassword = true;
        },
        // 获取验证码
        sendVerificationCode() {
            // 如果已经获取验证码，并且正在倒计时等待
            if (this.getVerificationCode.disabled === true) {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "验证码已获取过了，请查看邮箱！",
                    type: "warning",
                });
            }
            // 非空判断，不能没填写邮箱就发送验证码
            else if (this.user.name === "") {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "邮箱不能为空！",
                    type: "warning",
                });
            }
            // inputAccountError为true则表示邮箱格式错误
            else if (this.inputAccountError === true) {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "邮箱格式错误！",
                    type: "error",
                });
            } else {
                // loading为true表示正在获取中
                this.getVerificationCode.loading = true;
                // 先保存输入的邮箱到对象的属性中，防止用户填写验证码后修改邮箱——作弊
                this.getVerificationCode.tempEmail = this.user.name;
                // 将随机生成的6位验证码保存到data的变量中
                this.getVerificationCode.verificationCode = Math.random().toFixed(6).slice(-6);
                // 调用后端发送邮件的接口
                this.$axios
                    .post("/api/TodoEmail/postEmail", {
                        // 用户输入的邮箱
                        email: this.user.name,
                        // 前端随机生成的6位数字验证码
                        verificationCode: this.getVerificationCode.verificationCode,
                    })
                    .then((response) => {
                        if (response.data === "已存在此用户，请更换邮箱地址！") {
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                message: response.data,
                                type: "warning",
                            });
                        } else if (response.data === "验证码获取失败···") {
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                message: response.data,
                                type: "error",
                            });
                        } else if (response.data === "验证码已发送到您的邮箱！") {
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                message: response.data,
                                type: "success",
                            });

                            // 倒计时期间按钮不能单击（为true，按钮处于禁用状态）
                            this.getVerificationCode.disabled = true;
                            // 清除掉定时器
                            this.getVerificationCode.timer && clearInterval(this.getVerificationCode.timer);
                            // 开启定时器；注意！setInterval是间歇调用，这里是每1000毫秒（1秒）调用一次
                            this.getVerificationCode.timer = setInterval(() => {
                                const temporary = this.getVerificationCode.duration--;
                                this.getVerificationCode.text = `${temporary}秒后重取`;
                                if (temporary <= 0) {
                                    // 清除掉定时器
                                    clearInterval(this.getVerificationCode.timer);
                                    this.getVerificationCode.duration = 60;
                                    this.getVerificationCode.text = "重新获取";
                                    // 设置按钮可以单击
                                    this.getVerificationCode.disabled = false;
                                }
                            }, 1000);
                        }
                        // 发送完毕，就将“获取中”的状态关闭
                        this.getVerificationCode.loading = false;
                    });
            }
        },
        // 用户注册
        userRegistration() {
            if (this.user.name === "") {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "邮箱不能为空！",
                    type: "warning",
                });
            } else if (this.user.password === "") {
                ElMessage({
                    showClose: true,
                    message: "密码不能为空！",
                    type: "warning",
                });
            } else if (this.user.verificationCode === "") {
                ElMessage({
                    showClose: true,
                    message: "验证码不能为空！",
                    type: "warning",
                });
            } else if (this.inputAccountError === true) {
                ElMessage({
                    showClose: true,
                    message: "邮箱格式错误，请重新输入！",
                    type: "error",
                });
            } else if (this.inputPasswordError === true) {
                ElMessage({
                    showClose: true,
                    message: "密码格式错误，请重新输入！",
                    type: "error",
                });
            }
            // 检验验证码是否填写正确，如果对不上
            else if (this.user.verificationCode !== this.getVerificationCode.verificationCode) {
                // 在界面上将验证码输入框的边框变为红色
                this.inputVerificationCodeError = true;
                ElMessage({
                    showClose: true,
                    message: "验证码错误，请重新输入！",
                    type: "error",
                });
            } else if (this.getVerificationCode.tempEmail !== this.user.name) {
                ElMessage({
                    showClose: true,
                    message: "禁止中途修改邮箱！（防作弊机制）",
                    type: "error",
                });
            } else {
                // 使用axios的post方法，向后端传递数据
                this.$axios
                    // 调用自定义的aes.js文件里的“加密encrypt”方法，将密码加密后传给后端
                    .post("/api/TodoList/register", { name: this.user.name, password: aes.encrypt(this.user.password) })
                    .then((res) => {
                        if (res.data === "用户名重复，请更换用户名！") {
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                message: res.data,
                                type: "error",
                            });
                        } else {
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                message: res.data,
                                type: "success",
                            });
                            // 然后顺便登录
                            this.$axios
                                .post("/api/TodoList/login", {
                                    name: this.user.name,
                                    password: aes.encrypt(this.user.password),
                                })
                                .then((response) => {
                                    // 如果返回的信息为登录成功：
                                    if (response.data.result === "登录成功") {
                                        // 那么就本地存储token，jwt名称，值为服务器返回的jwt字符串（长长的那个）
                                        localStorage.setItem("jwt", response.data.jwt);
                                        localStorage.setItem("name", this.user.name);

                                        // 然后设置到HTTP请求头里面，字段名称就为“token”
                                        this.$axios.defaults.headers.common["token"] = response.data.jwt;
                                        // 将loginSuccess的布尔值改为true，方便上面HTML显示登录成功
                                        this.loginSuccess = true;
                                        this.myName = this.user.name;
                                        // 使用UI库，弹出登录成功的消息
                                        ElMessage({
                                            // 显示关闭按钮
                                            showClose: true,
                                            message: "顺便帮您登录成功了！",
                                            type: "success",
                                        });
                                        // 登录成功则关闭注册窗口：
                                        this.isShowRegistrationWindow = false;
                                        // 清空输入的内容
                                        this.user = {
                                            name: "",
                                            password: "",
                                            verificationCode: "",
                                        };
                                    } else {
                                        ElMessage({
                                            // 显示关闭按钮
                                            showClose: true,
                                            // 用户名或密码错误
                                            message: response.data.msg,
                                            type: "error",
                                        });
                                    }
                                });
                        }
                    });
            }
        },
        // 用户登录
        userLogin() {
            if (this.user.name === "") {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "邮箱不能为空！",
                    type: "warning",
                });
            } else if (this.user.password === "") {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "密码不能为空！",
                    type: "warning",
                });
            }
            // 当inputAccountError和inputPasswordError为true时，表示用户输入的格式有误
            else if (this.inputAccountError === true) {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "邮箱格式错误，请重新输入！",
                    type: "error",
                });
            } else if (this.inputPasswordError === true) {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "密码格式错误，请重新输入！",
                    type: "error",
                });
            } else if (this.loginSuccess === false) {
                // 先将用户输入的信息传给后台，此信息是用户需要查询的信息：
                this.$axios
                    .post("/api/TodoList/login", { name: this.user.name, password: aes.encrypt(this.user.password) })
                    .then((response) => {
                        // 如果返回的信息为登录成功：
                        if (response.data.result === "登录成功") {
                            // 那么就本地存储token，jwt名称，值为服务器返回的jwt字符串（长长的那个）
                            localStorage.setItem("jwt", response.data.jwt);
                            localStorage.setItem("name", this.user.name);
                            // 将头像的数据保存到Vuex的state中
                            this.$store.dispatch("setShowAvatar", response.data.userAvatarData);

                            // 然后设置到HTTP请求头里面，字段名称就为“token”
                            this.$axios.defaults.headers.common["token"] = response.data.jwt;
                            // 将loginSuccess的布尔值改为true，方便上面HTML显示登录成功
                            this.loginSuccess = true;
                            this.myName = this.user.name;
                            // 使用UI库，弹出登录成功的消息
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                message: "登录成功！",
                                type: "success",
                            });
                            // 登录成功则关闭窗口：
                            this.isShowLoginWindow = false;
                            // 清空输入的内容
                            this.user = {
                                name: "",
                                password: "",
                                verificationCode: "",
                            };
                        } else if (response.data.result === "不存在此用户，请检查账号是否输入正确！") {
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                message: response.data.result,
                                type: "error",
                            });
                        } else {
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                // 用户名或密码错误
                                message: response.data.msg,
                                type: "error",
                            });
                        }
                    });
            } else {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "您已经登录过了！",
                    type: "warning",
                });
            }
        },
        // 用于密码输入框的键盘弹起事件，用于提示用户是否开启大写锁定键
        inputPasswordKeyup(event) {
            const _that = this;
            // 判断是否按键为caps Lock
            if (event.keyCode === 20) {
                _that.bigChar = !_that.bigChar;
                return;
            }
            // 按键不是caps Lock，判断每次最后输入的字母的大小写
            let e = event || window.event;
            let keyValue = e.keyCode ? e.keyCode : e.which;
            let shiftKey = _that.shifKey;
            if (typeof _that.userPassword === "undefined") return;
            let userPassword = _that.userPassword;
            let stringLength = userPassword.length;

            if (stringLength) {
                let uniCode = userPassword.charCodeAt(stringLength - 1);
                // 65到90字母键
                if (keyValue >= 65 && keyValue <= 90) {
                    // 是否同时按住shift键
                    _that.bigChar = !!(
                        (uniCode >= 65 && uniCode <= 90 && !shiftKey) ||
                        (uniCode >= 97 && uniCode <= 122 && shiftKey)
                    );
                }
            }
        },
        // 用于密码输入框的键盘按下事件，用于提示用户是否开启大写锁定键
        inputPasswordKeydown(event) {
            let e = event || window.event;
            let keyValue = e.keyCode ? e.keyCode : e.which;
            this.shiftKey = e.shiftKey ? e.shiftKey : keyValue === 16;
        },
        // 忘记密码的文字按钮
        forgotPassword() {
            // 关闭登录窗口
            this.isShowLoginWindow = false;
            // 打开重置密码窗口
            this.isShowResetPassword = true;
            ElMessage({
                // 显示关闭按钮
                showClose: true,
                message: "已打开重置密码界面！",
                type: "success",
            });
        },
        // 确认重置密码
        resetPassword() {
            if (this.user.name === "") {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "邮箱不能为空，需作为依据！",
                    type: "warning",
                });
            } else if (this.user.password === "") {
                ElMessage({
                    showClose: true,
                    message: "新密码不能为空！",
                    type: "warning",
                });
            } else if (this.user.verificationCode === "") {
                ElMessage({
                    showClose: true,
                    message: "验证码不能为空！",
                    type: "warning",
                });
            } else if (this.inputAccountError === true) {
                ElMessage({
                    showClose: true,
                    message: "邮箱格式错误，请重新输入！",
                    type: "error",
                });
            } else if (this.inputPasswordError === true) {
                ElMessage({
                    showClose: true,
                    message: "密码格式错误，请重新输入！",
                    type: "error",
                });
            }
            // 检验验证码是否填写正确，如果对不上
            else if (this.user.verificationCode !== this.getVerificationCode.verificationCode) {
                // 在界面上将验证码输入框的边框变为红色
                this.inputVerificationCodeError = true;
                ElMessage({
                    showClose: true,
                    message: "验证码错误，请重新输入！",
                    type: "error",
                });
            } else if (this.getVerificationCode.tempEmail !== this.user.name) {
                ElMessage({
                    showClose: true,
                    message: "禁止中途修改邮箱！（防作弊机制）",
                    type: "error",
                });
            } else {
                // 使用axios的post方法，向后端传递数据
                this.$axios
                    // 调用自定义的aes.js文件里的“加密encrypt”方法，将密码加密后传给后端
                    .post("/api/TodoList/resetPassword", {
                        name: this.user.name,
                        password: aes.encrypt(this.user.password),
                    })
                    .then((res) => {
                        if (res.data === "不存在此用户，请检查账号是否输入正确！") {
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                message: res.data,
                                type: "error",
                            });
                        } else if (res.data === "密码重置失败···") {
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                message: res.data,
                                type: "error",
                            });
                        } else if (res.data === "新密码和旧密码一致，不必修改！") {
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                message: res.data,
                                type: "warning",
                            });
                        } else {
                            // 提示重置密码成功
                            ElMessage({
                                // 显示关闭按钮
                                showClose: true,
                                message: res.data,
                                type: "success",
                            });
                            // 关闭重置密码窗口
                            this.isShowResetPassword = false;
                        }
                    });
            }
        },
        // 打开设置用户头像的窗口
        openSetAvatarWindow() {
            if (this.isShowSetAvatarWindow === false) {
                // 为true则显示其组件
                this.isShowSetAvatarWindow = true;
                // 将背景模糊
                this.$store.dispatch("backgroundIsBlur", true);
                emitter.on("是否关闭设置头像的窗口", (message) => {
                    if (message === "是") {
                        this.isShowSetAvatarWindow = false;
                    }
                });
            } else {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "设置头像的窗口已正在显示！",
                    type: "warning",
                });
            }
            this.isShowCheckLogin = false;
        },
        // 退出登录
        userLogout() {
            // 删除掉存储在本地的内容
            localStorage.removeItem("jwt");
            localStorage.removeItem("name");
            localStorage.removeItem("userAvatarData");
            // 改为false，显示未登录
            this.loginSuccess = false;
            ElMessage({
                // 显示关闭按钮
                showClose: true,
                message: "已退出登录！",
                type: "success",
            });
            this.isShowCheckLogin = false;
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

<style lang="scss" scoped>
/*将所有元素初始内外边距清空，使用自定义的设置，防止不同浏览器对默认内外边距的解析不同，导致不同浏览器的浏览效果不同*/
* {
    margin: 0;
    padding: 0;
}

/*指定的这些class或id，指针移到上面，都是还是指针（:hover要紧贴前面的字符，中间空格则无效）*/
.loginText,
#persuasionLogin,
.loginStatus:hover {
    cursor: url("../../assets/cursor/default.png"), default;
}

::v-deep(.el-button) {
    cursor: url("../../assets/cursor/pointer.png"), pointer;
}

::v-deep(.el-input__wrapper) {
    cursor: url("../../assets/cursor/text.png"), text;
}

::v-deep(svg) {
    cursor: url("../../assets/cursor/pointer.png"), pointer;
}

/*登录模块*/
#login {
    /*添加高度为0，就不会占用文档流*/
    height: 0;
    /*弹性布局*/
    display: flex;
    /*从右边开始排列*/
    justify-content: flex-end;
}

/*用户图标*/
.userLogo {
    width: 30px;
    filter: drop-shadow(-20px -20px 14px rgb(51, 51, 51));
    margin-top: 3vh;
    margin-right: 2vw;
    /*禁止被选中*/
    user-select: none;
}

/*未登录时*/
#noLogin {
    width: 100%;
    height: auto;
    padding: 2px 10px 10px 10px;
}

/*登录成功的样式*/
#loginSuccess {
    width: 100%;
    height: auto;
    padding: 2px 10px 10px 10px;
}

/*未登录和登录时的弹框样式*/
#noLogin,
#loginSuccess {
    background: #1e1e1e;
    /*使用filter添加的阴影会比box-shadow逼真*/
    filter: drop-shadow(0px 0px 14px rgba(0, 0, 0, 5));
    border-radius: 12px;
    /*相对定位*/
    position: relative;
    top: 64px;
    left: 2vw;
    transition: all 0.5s ease-in-out;
}

/*这里是用户图标展开后的div，解决动画期间，屏幕闪烁的Bug（注意！要用在<template>标签下面的第一个标签*/
.loginAndRegistration {
    -webkit-backface-visibility: hidden;
    /*在屏幕很小时，右上角登录图标展开后，能够置顶，达到防止被遮挡的目的*/
    z-index: 2;
}

/*Vue的动画，这里指动画出现*/
.checkLogin-enter-active {
    /*加入动画，此动画名为“scale-in-tr"*/
    animation: scale-in-tr 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/*当动画关闭时*/
.checkLogin-leave-active {
    /*“反转reverse”表示会倒放，从scale-in-tr的100%到0%*/
    animation: scale-in-tr 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both reverse;
}

@keyframes scale-in-tr {
    /*这里能够从有往左，从上到下的放大，以右上角为基点*/
    0% {
        transform: scale(0);
        transform-origin: 100% 100%;
        opacity: 0;
    }
    100% {
        transform: scale(1);
        transform-origin: 0 0;
        opacity: 1;
    }
}

/*当前登录状态*/
.loginStatus {
    text-align: center;
    color: white;
    font-weight: bold;
    margin-top: 14px;
    margin-bottom: 0;
}

/*劝说用户登录*/
#persuasionLogin {
    color: #8f8f8f;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
}

/*“媒体查询”，屏幕较小时，显示的字体小，做到响应式布局*/
@media (max-width: 300px) {
    #persuasionLogin {
        font-size: 1px;
    }
}

/*登录后，用户的各种选项按钮*/
.userButton {
    width: 100%;
    margin-top: 10px;
    margin-left: 0;
    cursor: url("../../assets/cursor/pointer.png"), pointer;
}

.userButton:hover {
    background: #353535;
    color: white;
    /*默认边框为白色，这里改为与background颜色相同，相当于去掉边框*/
    border: 0 #292929;
    transition-duration: 0.7s;
}

/*按下按钮的一瞬间*/
.userButton:active {
    background: #929292;
    transition-duration: 0.1s;
}

/*登录界面*/
#loginUi {
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

/*登录窗口动画（注意！loginUi是HTML中的<transition>标签的name属性的值，而不是class名*/
.loginUi-enter-active {
    /*加入动画，此动画名为“scale-in-tr"*/
    animation: loginUi-animation 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.loginUi-leave-active {
    /*“反转reverse”表示会倒放，从scale-in-tr的100%到0%*/
    animation: loginUi-animation 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse;
}

@keyframes loginUi-animation {
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

/*”登录“二字*/
.loginText {
    height: 50px;
    line-height: 50px;
    color: white;
    font-size: 20px;
    margin-bottom: 1vmax;
    margin-top: 1vmax;
}

/*大写提示*/
.capitalizationHint {
    // 独占一行
    display: flex;
    // 脱离文档流
    position: absolute;
    width: 24%;
    margin-top: -12px;
}

/*邮箱和密码输入错误的警告*/
.loginInputErrorTips {
    color: red;
    font-weight: bold;
    font-size: 14px;
    text-align: left;
    /*改为绝对定位，则不会占用文档流*/
    position: absolute;
    margin-top: -10px;
}

/*用户登录时输入的内容——邮箱和密码*/
::v-deep(.userAccountInput, .userPasswordInput) {
    width: 100%;
}

/*用户图标*/
.avatar {
    position: relative;
    right: 1px;
    bottom: 1px;
}

/*当用户输入错误时，将输入边框变红*/
::v-deep(.inputError .el-input__wrapper) {
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    // 内阴影，充当边框，这样就不会占用空间
    box-shadow: 0 0 0 2px red inset;
}

/*无附带获取验证码按钮的邮箱输入框*/
.noCodeUserAccountInput {
    margin-bottom: 16px;
}

/*输入邮箱*/
.userAccountInput {
    margin-bottom: 16px;
}

/*修改输入框的样式*/
::v-deep(.userAccountInput .el-input__wrapper) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

/*获取验证码的按钮*/
.sendVerificationCode {
    width: 100%;
    height: 32px;
    border-radius: 0 4px 4px 0;
    border: none;
    background: #409eff;
    color: #ffffff;
    font-size: 10px;
}

/*悬停*/
.sendVerificationCode:hover {
    background: #59abff;
    cursor: url("../../assets/cursor/pointer.png"), pointer;
}

/*点击时*/
.sendVerificationCode:active {
    background: #3b91eb;
}

/*输入密码*/
.userPasswordInput {
    margin-top: 16px;
    margin-bottom: 16px;
}

/*登录或注册按钮*/
.loginOrRegisterButton {
    width: 100px;
    border: whitesmoke;
    margin-top: 16px;
    margin-left: 80px;
}

/*重置密码界面的确认按钮*/
.resetPasswordButton {
    width: 100px;
    border: whitesmoke;
    margin-top: 14px;
}

@media (max-width: 350px) {
    .loginOrRegisterButton {
        margin-top: 0;
        margin-left: 0;
    }

    .forgetPassword {
        display: flex;
        width: 80px;
        margin-left: 10vw;
    }
}

/*指针移到登录或注册按钮上时*/
.loginOrRegisterButton:hover {
    background-color: #0ae2ed;
}

/*点击登录或注册按钮时*/
.loginOrRegisterButton:active {
    background-color: #00f3ff;
}

/*忘记密码*/
.forgetPassword {
    color: white;
    position: relative;
    top: 10px;
    left: 52px;
    cursor: url("../../assets/cursor/pointer.png"), pointer;
    text-align: right;
}
</style>