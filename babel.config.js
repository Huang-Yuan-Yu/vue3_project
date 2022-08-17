module.exports = {
    // 对babel进行配置，由此命令安装——npm i --save babel-polyfill
    presets: [
        [
            "@vue/app",
            {
                useBuiltIns: "entry",
                polyfills: [
                    "es6.promise",
                    "es6.symbol",
                    "es6.array.find-index",
                    "es7.array.includes",
                    "es6.string.includes",
                ],
            },
        ],
    ],
    // 下面这行是JSX需要配置的，以及分包打包
    plugins: ["@vue/babel-plugin-jsx", "@babel/plugin-syntax-dynamic-import"],
};