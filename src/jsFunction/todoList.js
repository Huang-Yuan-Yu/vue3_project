// 以下为待办事项案例用的函数，使用axios从服务器端获取信息，然后客户端接受后处理（增删查改JSON中的数据）
// 一个JS文件，可以有默认导出的函数，也可以没有
import axios from "axios";

/**
 * 保存数据的函数（注意！在axios()中，代码的执行是异步的，不能直接在异步操作的函数中return出东西，axios()处于任务队列中）
 * 这会导致return的是undefined，为什么？
 * 因为主线程是“同步执行“的，主线程在执行到最后，发现return的东西是undefined的，那么就返回undefined
 * 主线程不等人，axios()中的代码是异步执行的，
 * 后来等到其代码执行完毕，return已经执行过了，所以有结果也没办法再返回一次，之前已经返回过undefined了
 *
 * async/await是一种建立在Promise之上的编写异步、非阻塞代码的新方法（Promise是一个对象，这里return的值就是一个Promise）
 * async是异步，而await的全称是“async wait异步等待”
 * async用于声明一个异步执行的函数，而await用于等待一个异步方法执行完成
 * 如果想要“同步”使用数据，那么就可以使用async+await
 *
 * @param todoObject 新添加的对象（数据），会将该对象添加到JSON中
 * @return id 后端返回id给前端，为了在本地添加后呈现给用户，同时删除时也有对应的id作为唯一依据，不会出现报错
 */
export async function addData(todoObject) {
    let time = null;

    // 加上await，这里就变成同步执行，必须等待axios执行后，才执行下面return语句，否则太早执行，id还是空的
    await axios({
        // post()用于添加、提交
        method: "post",
        // data后面跟着一个对象，id不用填，因为是默认的、自增长的，作为数据的唯一标识
        // 添加待办事项数组，这里传进来的参数本身就是一个对象，自带{}，所以不用再加{}
        data: todoObject,
        // url的值是运行在服务器上的“接口地址”
        url: "/api/TodoList/addData",
    })
        // 返回数据，data对象里面带有刚添加进JSON数据的id，以及其他信息，这里只用到id即可
        .then((response) => {
            // 将返回的时间赋值给time变量
            time = response.data;
        });

    return time;
}

/**
 * 删除事项
 */
export function deleteObject(todo) {
    axios({
        method: "delete",
        data: todo,
        url: "/api/TodoList/deleteData",
    });
}

/**
 * 清空所有已完成的事项
 * @param completedTodoIdArray 已完成事项的id
 */
export function clearCompletedTodo(completedTodoIdArray) {
    axios({
        method: "post",
        // 这里直接传递数组，方便后台直接使用
        data: completedTodoIdArray,
        url: "/api/TodoList/clearCompletedTodo",
    });
}

/**
 * 通过比较数组中对象的属性值，从而给数组排序
 * @param property 传入对象的属性
 * @return {function(*, *)} 返回排序后的数组
 */
const compare = (property) => {
    return function (a, b) {
        let value1 = a[property],
            value2 = b[property];
        return value2 - value1;
    };
};

/**
 * 获取JSON中的数组，里面存放有很多的对象
 * （注意！在这边的JS文件中，需要在组件中使用的方法，都必须“导出export”）
 */
export async function getObjectArray(myName) {
    // 创建一个新的数组：
    let objectArray = [];
    await axios({
        method: "post",
        url: "/api/TodoList/getObjectArray",
        data: {name: myName},
    }).then((response) => {
        // compare()是自己写的，给数组中每个对象排序，按id进行降序排序，将后来添加的事项放在前面
        objectArray = response.data.sort(compare("id"));
    });
    // 在这一层不要进行异常处理，将异常处理留给上层（组件）
    // 返回带有数据的数组
    return objectArray;
}

/**
 * 修改指定的事项
 * todo参数：包含修改前和修改后的内容，以及id、完成情况
 */
export function modification(todo) {
    axios({
        method: "patch",
        // 注意！如果要将变量作为对象的键，则应使用[]括起来，而不是直接写参数名
        data: todo,
        url: "/api/TodoList/modificationData",
    });
}

/**
 * 完成所有待办事项
 */
export function finishAllTodo(userName) {
    axios({
        method: "patch",
        // 只需要将用户名字提交给后台，后天自然会根据条件去遍历数据库
        data: {name: userName},
        url: "/api/TodoList/finishAllTodo",
    });
}

/**
 * 取消完成所有待办事项
 */
export function noFinishAllTodo(userName) {
    axios({
        method: "patch",
        // 只需要将用户名字提交给后台，后天自然会根据条件去遍历数据库
        data: {name: userName},
        url: "/api/TodoList/noFinishAllTodo",
    });
}

/**
 * 获取上次登录时间，以及返回这次的登录时间（这次的时间给下次用）
 * update user set login_time = NOW() where name = '2690085099';
 */
export async function loginTime(myName) {
    let timeObject = {};
    await axios({
        method: "post",
        // 要以对象的形式传过去
        data: {name: myName},
        url: "/api/TodoList/updateLoginTime",
    }).then((response) => {
        timeObject["上次登录时间"] = response.data["上次登录时间"];
        timeObject["本次登录时间"] = response.data["本次登录时间"];
    });
    return timeObject;
}

/**
 * 获取用户当前系统的时间
 * @return {string} 返回”年月日、时分秒“构成的字符串，比如“2022-04-29 18:02:44”
 */
export function getTime() {
    let data = new Date();
    return (
        data.getFullYear() +
        "-" +
        (data.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        data.getDate().toString().padStart(2, "0") +
        " " +
        data.getHours().toString().padStart(2, "0") +
        ":" +
        data.getMinutes().toString().padStart(2, "0") +
        ":" +
        data.getSeconds().toString().padStart(2, "0")
    );
}

/**
 * 使Vue对象所指的isZoomFont变量，进行true到false的切换，在此项目的目的为“将字体放大再缩小、还原”
 * @param that 传入Vue实例的this指向
 */
export function zoomFont(that) {
    if (that.isZoomFont === false) {
        // 改为true，表示应用动画
        that.isZoomFont = true;
        setTimeout(() => {
            that.isZoomFont = false;
            // 因为动画的时间为0.5秒，所以这里500ms=0.5s
        }, 800);
    }
}

/**
 * 测试网络连接
 */
export async function ping() {
    let pingResult = null;
    await axios({
        method: "get",
        url: "/api/TodoList/ping",
    })
        .then((response) => {
            pingResult = response.data;
        })
        .catch(() => {
            pingResult = "网络异常";
        });
    return pingResult;
}