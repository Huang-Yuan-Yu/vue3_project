/**
 * @param state 是state.js传过来的对象
 */
export const myArray = function (state) {
    // 直接访问state对象里定义的myArray属性，其值是一个数组
    return state.userEquipment;
};