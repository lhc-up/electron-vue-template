/*
* Tip:    打包渲染进程
* Author: haoluo
* Data:   2020-02-29
*/
const chalk = require('chalk');
const webpack = require('webpack');
const viewRenderConfig = require('../webpack.render.config.js');
function viewBuilder() {
    return new Promise((resolve, reject) => {
        console.log('打包渲染进程......');
        const viewRenderCompiler = webpack(viewRenderConfig);
        viewRenderCompiler.run((err, stats) => {
            if (err) {
                console.log('打包渲染进程遇到Error！');
                reject(chalk.red(err));
            } else {
                let log = '';
                stats.compilation.errors.forEach(key => {
                    log += chalk.red(`${key}:${stats.compilation.errors[key]}`) + '\n';
                });
                stats.compilation.warnings.forEach(key => {
                    log += chalk.yellow(key) + '\n';
                });
                Object.keys(stats.compilation.assets).forEach(key => {
                    log += chalk.blue(key) + '\n';
                });
                log += chalk.green(`time：${(stats.endTime - stats.startTime) / 1000} s\n`) + '\n';
                resolve(`${log}`);
            }
        });
    });
}
module.exports = {
    viewBuilder
}