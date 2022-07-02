const { defineConfig } = require("@vue/cli-service");
// 能够自动导入Element-plus的所需组件
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
module.exports = defineConfig({
    transpileDependencies: true,
});

// 在构建时，会出现各种资源路径错误的情况，在本文件中重写打包后的基础路径为当前目录，就可以解决
// 后来通过“npm install --save-dev compression-webpack-plugin”引入打包大小优化的依赖
module.exports = {
    // 公共路径为“./”：
    publicPath: "./",
    // 是否为生产环境构建生成sourceMap，为false则在控制台不显示来源于代码的何处
    productionSourceMap: false,
    // 解决跨域问题（同源策略的跨域问题，只要“协议+地址+端口”三者，有一个与对方不同，则会有跨域问题：
    devServer: {
        // 这里的ip和端口是我们本机的
        open: true,
        // 本机的主机名或IP地址
        host: "127.0.0.1",
        // 端口（HTTPS用的是443）
        port: 443,
        // 是否为HTTPS协议，这里为否
        https: true,
        // 下面为需要跨域的，proxy为“代理”的意思：
        proxy: {
            // 配置跨域，这里的api为自定义的，如果使用其他网络上的接口，则这里填的是对应的其他值
            "/api": {
                // 这里后台的地址模拟的;应该填写真实的后台地址
                target: "https://thinkphp.hyy666.top/",
                // 是否支持webSocket，默认为true
                ws: true,
                // 允许跨域
                changOrigin: true,
                secure: false, // 如果是https接口，需要配置这个参数
                pathRewrite: {
                    // 将地址栏中出现的api字样，重写为空字符串：
                    "^/api": "",
                },
            },
        },
    },
    // 想要修改icon，必须要加上下面这些代码，否则修改无效
    pwa: {
        iconPaths: {
            favicon32: "favicon.ico",
            favicon16: "favicon.ico",
            appleTouchIcon: "favicon.ico",
            maskIcon: "favicon.ico",
            msTileImage: "favicon.ico",
        },
    },
    //其他配置（不能直接将plugins添加到下面，而是外面要有configureWebpack）
    configureWebpack: {
        // 插件
        plugins: [
            // 自动导入Element-plus
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
    },
};