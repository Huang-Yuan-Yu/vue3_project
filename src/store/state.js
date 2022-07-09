const state = {
    // 用户的移动设备类型
    userEquipment: navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    ),
    // 背景是否模糊、虚化
    backgroundIsBlur: false,
    // 用户图像数据——为URL和Base64两种形式存在
    userAvatarData: null,
};

export default state;