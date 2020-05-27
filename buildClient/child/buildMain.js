/**
* Tip:    打包主进程
* Author: haoluo
* Data:   2019-12-23
**/

const chalk = require('chalk');
const webpack = require('webpack');
const mainRenderConfig = require('../webpack.main.config.js');
function mainBuilder() {
    return new Promise((resolve, reject) => {
        console.log('打包APP主进程......');
        let log = '';
        // 删除历史打包数据
        require('del')(['./app/main.js']);
        const mainRenderCompiler = webpack(mainRenderConfig);
        mainRenderCompiler.run((err, stats) => {
            if (err) {
                console.log('打包主进程遇到Error！');
                reject(chalk.red(err));
            } else {
                Object.keys(stats.compilation.assets).forEach(key => {
                    log += chalk.blue(key) + '\n';
                });
                stats.compilation.warnings.forEach(key => {
                    log += chalk.yellow(key) + '\n';
                });
                stats.compilation.errors.forEach(key => {
                    log += chalk.red(`${key}:${stats.compilation.errors[key]}`) + '\n';
                });
                log += chalk.green(`time：${(stats.endTime - stats.startTime) / 1000} s\n`) + '\n';
                console.log('打包主进程完毕！');
                resolve(log);
            }
        });
    });
}
module.exports = {
    mainBuilder
};