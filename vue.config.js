const { defineConfig } = require("@vue/cli-service");
// 能够自动导入Element-plus的所需组件
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
module.exports = defineConfig({
    transpileDependencies: true,
});
const path = require("path");
// Gzip压缩
const CompressionPlugin = require("compression-webpack-plugin");
// Node.js用的
const os = require("os");
// 启用多线程打包，加快打包速度
const HappyPack = require("happypack");
// CPU能有多少线程，就用多少
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

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
        // 是否为HTTPS协议，这里为是
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
        // 打包可视化——npm install --save-dev webpack-bundle-analyzer
        // config.plugin("webpack-bundle-analyzer").use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);

        // 加速打包——缓存+多线程打包
        config.cache(true);
        // npm install happypack --save-dev
        config.plugin("happypack").use(
            new HappyPack({
                id: "happy-babel-js",
                loaders: ["babel-loader?cacheDirectory=true"],
                threadPool: happyThreadPool,
            })
        );

        // 在生产环境下，在打包时进行gzip压缩，就不用等服务器端动态压缩了，提高性能
        if (process.env.NODE_ENV === "production") {
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

            // Gzip压缩
            config.plugin("compression-webpack-plugin").use(
                new CompressionPlugin({
                    // 匹配文件名
                    test: /\.js$|\.html$|\.css$/,
                    // 对超过10k的数据压缩，这里单位为字节
                    threshold: 10240,
                    // 不删除源文件
                    deleteOriginalAssets: false,
                    //只有压缩率比这个值小的文件才会被处理，压缩率=压缩大小/原始大小，如果压缩后和原始文件大小没有太大区别，就不用压缩
                    minRatio: 0.8,
                })
            );

            // 拆包
            config.optimization.splitChunks({
                // 对于需要动态加载的内容，抽出来
                chunks: "async",
                maxInitialRequests: Infinity,
                minSize: 30000, // 依赖包超过30000bit将被单独打包
                automaticNameDelimiter: "-",
                cacheGroups: {
                    vue: {
                        name: "vue",
                        test: /[\\/]node_modules[\\/]vue[\\/]/,
                        priority: -10,
                    },
                    "vue-router": {
                        name: "vue-router",
                        test: /[\\/]node_modules[\\/]vue-router[\\/]/,
                        priority: -10,
                    },
                    "element-plus": {
                        name: "element-plus",
                        test: /[\\/]node_modules[\\/]element-plus[\\/]/,
                        priority: 10,
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
            // 去掉调试信息
            config.optimization.minimizer("terser").tap((args) => {
                Object.assign(args[0].terserOptions.compress, {
                    // 删除所有调式带有console的
                    drop_console: true,
                    drop_debugger: true,
                    // 生产模式 console.log 去除
                    pure_funcs: ["console.log", "console.table"],
                });
                return args;
            });
            // 兼容更多的浏览器——ES6转ES5，转换后在本地打不开是正常的
            config.entry("main").add("babel-polyfill");
            config.entry.app = ["babel-polyfill", "./src/main.js"];
        }
        // 如果在开发环境下
        else {
            // 优化速度
            config.optimization.minimize(false);
        }
    },
    // 语法转换也要包括第三方库
    // transpileDependencies: [/node_modules/],
    // 生产环境禁用eslint
    lintOnSave: process.env.NODE_ENV !== "production",
};