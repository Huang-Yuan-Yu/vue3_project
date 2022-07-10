<template>
    <!--设置用户的头像-->
    <div id="set-avatar">
        <transition name="setAvatar">
            <div v-if="isShowSetAvatarWindow" id="setAvatarDiv">
                <p id="close" @click="closeWindows">✖</p>
                <div>
                    <p class="wechatText">设置头像</p>
                    <!--action为后端地址；drag：支持拖拽上传；当未在裁剪时，就显示上传图片的组件；accept能限制用户上传文件的类型
                    :http-request="httpRequest"为上传后自定义向后端发送请求的方法，这里action就不要用了
                    /api/TodoList/uploadAvatar-->
                    <el-upload
                        class="avatar-uploader"
                        action=""
                        :http-request="httpRequest"
                        :show-file-list="false"
                        accept=".jpg,.jpeg,.png,.gif,.bmp"
                        :before-upload="beforeAvatarUpload"
                        drag
                        v-if="isCrop === false"
                    >
                        <div v-if="userAvatarData === null">
                            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                            <div id="elUploadText">可拖拽上传或单击选择图片</div>
                        </div>
                        <div id="userAvatarDiv" v-if="userAvatarData">
                            <img :src="userAvatarData" id="userAvatar" alt="用户头像" />
                        </div>
                        <template #tip v-if="isFirstCroppingCompleted === false">
                            <div id="imageTip">图片格式只支持jpg/jpeg/png/gif/bmp</div>
                        </template>
                    </el-upload>

                    <!--图像裁剪组件：判断为开始裁剪，就显示可裁剪头像的组件。每次裁剪都使用原始图像裁剪——originalImage-->
                    <vue-picture-cropper
                        v-if="isCrop === true"
                        :boxStyle="{
                            width: '100%',
                            height: '202px',
                            backgroundColor: '#f8f8f8',
                            marginBottom: '16px',
                        }"
                        :img="originalImage"
                        :options="{
                            viewMode: 1,
                            dragMode: 'move',
                            aspectRatio: 1,
                            cropBoxResizable: false,
                        }"
                        :presetMode="{
                            mode: 'round',
                            width: 400,
                            height: 400,
                        }"
                        imageSmoothingQuality="high"
                    />

                    <!--第一次裁剪后、正在裁剪中都会持久显示按钮-->
                    <el-row v-if="isFirstCroppingCompleted === true || isCrop === true">
                        <el-col :span="12">
                            <!--只有当在裁剪中，且第一次裁剪之后才显示取消裁剪按钮-->
                            <el-button size="large" type="primary" @click="cancelCropping" v-if="isCrop === true">
                                取消裁剪
                            </el-button>
                            <el-button size="large" type="primary" @click="reCrop" v-else>重新裁剪</el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-button size="large" type="primary" @click="cutFinished" v-if="isCrop === true">
                                裁剪完毕
                            </el-button>
                            <el-button size="large" type="primary" @click="sendImage" v-else>确认头像</el-button>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
// 组件间通信
import emitter from "@/jsFunction/eventbus";
// 引入图像裁剪组件（因为需要图像裁剪功能，所以通过”npm install --save-dev vue-picture-cropper“引入开源第三方包）
import VuePictureCropper, { cropper } from "vue-picture-cropper";
import { defineComponent } from "vue";
// 引入消息提示框，属于非模态提示框，不会打断用户操作
import { ElMessage } from "element-plus";

export default defineComponent({
    name: "set-avatar",
    components: {
        VuePictureCropper,
    },
    data() {
        return {
            // 原始的图像（作为恢复、还原备份）
            originalImage: null,
            // 用户图像数据——为URL和Base64两种形式存在
            userAvatarData: null,
            // 是否开始裁剪：
            isCrop: false,
            // 判断第一次裁剪是否完成（一定要进行第一次裁剪）
            isFirstCroppingCompleted: false,
        };
    },
    props: {
        // 是否显示设置头像的窗口
        isShowSetAvatarWindow: {
            // 接受的类型为布尔值
            type: Boolean,
            default: false,
        },
        // 用户名
        myName: {
            type: String,
        },
    },
    methods: {
        // 关闭窗口
        closeWindows() {
            // 清空数据
            this.userAvatarData = null;
            emitter.emit("是否关闭设置头像的窗口", "是");
            // 取消背景模糊效果
            this.$store.dispatch("backgroundIsBlur", false);
        },
        // 在上传图像之前，检查图片是否符合规格
        beforeAvatarUpload(file) {
            // 判断图片文件类型
            if (
                !(
                    file.type === "image/jpeg" ||
                    file.type === "image/png" ||
                    file.type === "image/JPG" ||
                    file.type === "image/gif" ||
                    file.type === "image/bmp"
                )
            ) {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "图片格式只能为jpg/jpeg/png/gif/bmp",
                    type: "error",
                });
                return false;
            } else {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "开始裁剪，已启用图片压缩！",
                    type: "success",
                });
            }
        },
        // 图片上传后先压缩再裁剪
        httpRequest(options) {
            let that = this;
            // 获取文件对象
            let file = options.file;
            // 在还没压缩之前先赋值
            this.userAvatarData = this.originalImage =  URL.createObjectURL(file);
            // 创建一个HTML5的FileReader对象
            let reader = new FileReader();
            // 创建一个img对象
            let img = new Image();
            if (file) {
                reader.readAsDataURL(file);
            }
            reader.onload = (e) => {
                img.src = e.target.result;
                // base64地址图片加载完毕后执行
                img.onload = function () {
                    // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
                    let canvas = document.createElement("canvas");
                    let context = canvas.getContext("2d");
                    // 图片原始尺寸
                    let originWidth = this.width;
                    let originHeight = this.height;
                    // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
                    let maxWidth = 400,
                        maxHeight = 400;
                    // 目标尺寸
                    let targetWidth = originWidth,
                        targetHeight = originHeight;
                    // 图片尺寸超过最大尺寸的限制
                    if (originWidth > maxWidth || originHeight > maxHeight) {
                        if (originWidth / originHeight > maxWidth / maxHeight) {
                            // 更改宽度，按照宽度限定尺寸
                            targetWidth = maxWidth;
                            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                        } else {
                            targetHeight = maxHeight;
                            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                        }
                    }
                    // 对图片进行缩放
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    // 清除画布
                    context.clearRect(0, 0, targetWidth, targetHeight);
                    // 图片压缩，第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高
                    context.drawImage(img, 0, 0, targetWidth, targetHeight);
                    // 压缩后的base64文件（“原始图像originalImage”备份用的不压缩）
                    that.userAvatarData = canvas.toDataURL("image/jpeg", 0.92);
                };
            };
            // 立即开始裁剪
            this.isCrop = true;
        },
        // 裁剪头像完毕
        cutFinished() {
            const size = {
                width: 200,
                height: 200,
            };
            // 使用第三方库获取生成的base64图片地址，把base64赋给变量，便于展示
            this.userAvatarData = cropper.getDataURL(size);
            // 隐藏裁切弹窗
            this.isCrop = false;
            // 确认第一次裁剪完成
            this.isFirstCroppingCompleted = true;
            ElMessage({
                // 显示关闭按钮
                showClose: true,
                message: "裁剪成功！",
                type: "success",
            });
            // console.log(this.userAvatarData)
        },
        // 重新裁剪图片
        reCrop() {
            this.isCrop = true;
            ElMessage({
                // 显示关闭按钮
                showClose: true,
                message: "正在进行重新裁剪···",
                type: "success",
            });
        },
        // 取消裁剪
        cancelCropping() {
            // 裁剪过一次才允许取消裁剪
            if (this.isFirstCroppingCompleted === true) {
                this.isCrop = false;
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "已取消重新裁剪！",
                    type: "success",
                });
            } else {
                // 清空数据
                this.userAvatarData = null;
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: "必须进行头像的圆形裁剪（方便显示）！",
                    type: "warning",
                });
            }
        },
        // 向后端发送图片
        sendImage() {
            this.$axios({
                method: "post",
                url: "/api/TodoList/uploadAvatar",
                // 传图片的Base64编码以及用户名，用户名用于数据库的条件查询
                data: { base64: this.userAvatarData, userName: this.myName },
            }).then((response) => {
                ElMessage({
                    // 显示关闭按钮
                    showClose: true,
                    message: response.data,
                    type: "success",
                });
            });
            // 通知父组件说——子组件要关闭窗口
            emitter.emit("设置头像", "成功");
            // 取消背景模糊效果
            this.$store.dispatch("backgroundIsBlur", false);
            // 将头像的数据保存到Vuex的state中
            this.$store.dispatch("setShowAvatar", this.userAvatarData);
        },
    },
});
</script>
<style>
/*用于el-upload标签*/
.avatar-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
    cursor: url("../../assets/cursor/pointer.png"), pointer;
}

/*头像上传框*/
.el-upload-dragger {
    background-color: rgba(0, 0, 0, 0);
    margin-bottom: 16px;
}

/*中间的Logo以及显示上传图片*/
.el-icon--upload {
    font-size: 28px;
    color: #8c939d;
    height: 80px;
    text-align: center;
}

/*图片上传框中间的文字说明*/
#elUploadText {
    color: rgb(168, 171, 178);
}

/*用户头像的div*/
#userAvatarDiv {
    /*投机取巧：在子元素中，使用负值的外边距就可以突破父元素的padding*/
    margin: -30px;
}

/*显示用户上传的头像*/
#userAvatar {
    height: 180px;
    display: block;
    /*使图片不变形*/
    object-fit: cover;
    margin: 0 auto;
}

/*上传照片前的提醒文字*/
#imageTip {
    text-align: left;
    color: rgb(168, 171, 178);
    font-size: 12px;
    margin-top: -10px;
    /*指定文字之间的间距*/
    letter-spacing: 0.6px;
}

/*窗口*/
#setAvatarDiv {
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
.setAvatar-enter-active {
    /*加入动画，此动画名为“scale-in-tr"*/
    animation: setAvatar-animation 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.setAvatar-leave-active {
    /*“反转reverse”表示会倒放，从scale-in-tr的100%到0%*/
    animation: setAvatar-animation 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse;
}

@keyframes setAvatar-animation {
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
</style>