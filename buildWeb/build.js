/**
* Tip:    打包web端
* Author: haoluo
* Data:   2020-03-01
**/
process.env.NODE_ENV = 'production';
const webpack = require('webpack');
const chalk = require("chalk");
const webpackConfig = require('./webpack.config.js');

// 删除历史打包数据
require("del")(["./dist/*"]);

// 这里是单页面打包，只产生一个html文件
// 如果想针对每个路由都打包出一个html文件，这里提供下思路：
// 引入路由文件，遍历路由，拿到路径，针对每个路由，实例化一个HtmlWebpackPlugin插件，即可生成一个html文件
// webpackDevConfig.plugins.push(new HtmlWebpackPlugin({
//     template: './src/index.ejs',
//     filename: `.${routerPah}`,
//     title: "加载中...",
//     inject: false,
//     hash: true,
//     minify: false,
//     cache: false
// }))
const compiler = webpack(webpackConfig);
compiler.run((err, stats) => {
    if (err) {
        console.log("打包web端遇到Error！");
        reject(chalk.red(err));
    } else {
        let log = "";
        stats.compilation.errors.forEach(key => {
            log += chalk.red(`${key}:${stats.compilation.errors[key]}`) + "\n";
        });
        stats.compilation.warnings.forEach(key => {
            log += chalk.yellow(key) + "\n";
        });
        Object.keys(stats.compilation.assets).forEach(key => {
            log += chalk.blue(key) + "\n";
        });
        log += chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s\n`) + "\n";
        console.log(log);
    }
});