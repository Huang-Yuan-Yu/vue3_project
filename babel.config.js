module.exports = {
    // 对babel进行配置
    presets: [
        [
            "@vue/app",
            {
                useBuiltIns: "entry",
                polyfills: ["es6.promise", "es6.symbol"],
            },
        ],
    ],
    // 下面这行是JSX需要配置的，以及分包打包
    plugins: ["@vue/babel-plugin-jsx", "@babel/plugin-syntax-dynamic-import"],
};