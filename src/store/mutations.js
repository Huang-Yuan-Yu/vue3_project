// 之所以要对字符串进行封装，是因为如果字符串使用的是中文，则IDE会提示“非ASCII编码字符”的警告
import * as types from "./mutation-types";

// 设置、改变state，且只能同步操作
const mutations = {
    /**
     * 使背景虚化、景深的方法，此方法会使用commit()方法调用
     * @param state 这里使用state里的值，是Vuex状态管理的数据源
     * @param isOpen 是否处于打开窗口状态，是就将背景虚化
     */
    [types.BACKGROUND_BLUR](state, isOpen) {
        state.backgroundIsBlur = isOpen === true;
    },
    
    /**
     * 将头像数据赋值给state中的变量
     * @param state Vuex状态管理的数据源
     * @param userAvatar 用户头像
     */
    [types.SET_SHOW_AVATAR](state, userAvatar) {
        state.userAvatarData = userAvatar;
    },
};
export default mutations;