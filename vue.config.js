const { defineConfig } = require("@vue/cli-service");
// 能够自动导入Element-plus的所需组件
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
module.exports = defineConfig({
    transpileDependencies: true,
});
const path = require("path");

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
                // 若后端接口地址为https协议，就配置为true
                secure: true,
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
    // 其他配置（不能直接将plugins添加到下面，而是外面要有configureWebpack）
    configureWebpack: {
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
                "@i": path.resolve(__dirname, "./src/assets"),
            },
            // 解决部分const等ES6语法未转换的难题
            mainFields: ["main", "module"],
        },
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
    chainWebpack: (config) => {
        // “npm install image-webpack-loader”，能够压缩图片
        config.module
            .rule("image")
            .test(/\.(png|jpe?g|gif)(\?.*)?$/)
            .use("image-webpack-loader")
            .loader("image-webpack-loader")
            .options({
                // 此处为ture的时候不会启用压缩处理,目的是为了开发模式下调试速度更快
                disable: process.env.NODE_ENV === "development",
            })
            .end();

        // 拆包
        config.optimization.splitChunks({
            chunks: "all",
            maxInitialRequests: Infinity,
            minSize: 30000, // 依赖包超过30000bit将被单独打包
            automaticNameDelimiter: "-",
            cacheGroups: {
                vue: {
                    name: "vue",
                    test: /[\\/]node_modules[\\/]vue[\\/]/,
                    priority: -10,
                },
                vuex: {
                    name: "vuex",
                    test: /[\\/]node_modules[\\/]vuex[\\/]/,
                    priority: -10,
                },
                "vue-router": {
                    name: "vue-router",
                    test: /[\\/]node_modules[\\/]vue-router[\\/]/,
                    priority: -10,
                },
                axios: {
                    name: "axios",
                    test: /[\\/]node_modules[\\/]axios[\\/]/,
                    priority: -10,
                },
                "element-plus": {
                    name: "element-plus",
                    test: /[\\/]node_modules[\\/]element-plus[\\/]/,
                    priority: -10,
                },
                // 提取重复引用公共库
                common: {
                    name: "chunk-common",
                    chunks: "initial",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 1,
                    reuseExistingChunk: true,
                    enforce: true,
                },
                vendors: {
                    name: "vendors",
                    test: /[\\/]node_modules[\\/]/,
                    priority: -20,
                    reuseExistingChunk: true,
                    enforce: true,
                    minSize: 0, //大于0个字节
                    minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        });
        // 兼容更多的浏览器——ES6转ES5，转换后在本地打不开是正常的
        config.entry("main").add("babel-polyfill");
        config.entry.app = ["babel-polyfill", "./src/main.js"];
    },
    // 语法转换也要包括第三方库
    transpileDependencies: [/node_modules/],
    // 生产环境禁用eslint
    lintOnSave: !process.env.NODE_ENV !== "production",
};