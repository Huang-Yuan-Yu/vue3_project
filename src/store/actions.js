import * as types from "./mutation-types";

// actions是用来“提交commit”mutations里的方法的
// addFood是组件传来的参数
export const backgroundIsBlur = function ({ commit }, isOpen) {
    // 调用方法并传参，并”提交commit“给调用此actions.js中“addFood”变量的组件
    commit(types.BACKGROUND_BLUR, isOpen);
};

export const setShowAvatar = function ({ commit }, userAvatar) {
    // 调用方法并传参，并”提交commit“给调用此actions.js中“addFood”变量的组件
    commit(types.SET_SHOW_AVATAR, userAvatar);
};