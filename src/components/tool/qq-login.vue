<template>
    <div id="qq-login"></div>
</template>

<script>
// QQ互联
import QC from "qc";
import { ElMessage } from "element-plus";

export default {
    name: "qq-login",
    created() {
        // 检查是否登录成功，登录成功后只会触发一次这里的代码，因为最后会路由跳转到首页
        if (QC.Login.check()) {
            // 保存作用域，提供给下面用，否则下面的代码用this是无法访问Vue实例的
            let that = this;
            // 获取登录凭证
            QC.Login.getMe(function (openId) {
                if (openId !== undefined) {
                    // 获取用户信息
                    QC.api("get_user_info")
                        // 指定接口访问成功的接收函数，s为成功返回Response对象
                        .success(function (user) {
                            // 将用户的信息传给后端，用于存储在数据库中
                            that.$axios({
                                method: "post",
                                data: {
                                    // QQ昵称
                                    name: user.data.nickname,
                                    // QQ头像
                                    avatar: user.data.figureurl_2,
                                },
                                url: "/api/TodoList/qqLogin",
                            }).then(() => {
                                // 将QQ昵称保存到本地
                                localStorage.setItem("name", user.data.nickname);
                                ElMessage({
                                    // 显示关闭按钮
                                    showClose: true,
                                    message: "QQ授权登录成功！",
                                    type: "success",
                                });
                            });
                        })
                        // 指定接口访问失败的接收函数
                        .error(function (response) {
                            localStorage.setItem("QQ登录", response);
                        });
                    // 完毕后路由跳转到首页
                    that.$router.push("/");
                }
            });
        }
    },
};
</script>

<style scoped></style>