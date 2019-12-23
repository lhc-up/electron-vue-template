/**
* Tip:    打包主进程
* Author: haoluo
* Data:   2019-12-23
**/

const mainWebpackConfig = require('../webpack.main.config.js');
const webpack = require('webpack');
const chalk = require('chalk');
const del = require('del');

// 构建主进程
function buildMain() {
    return new Promise((resolve, reject) => {
        console.log('打包APP主进程......');
        let log = '';
        // 删除历史打包数据
        del(['./app/main.js']);
        const mainCompiler = webpack(mainWebpackConfig);
        mainCompiler.run((err, stats) => {
            let errorInfo = '';
            if (err) {
                console.log('打包主进程遇到Error！');
                reject(chalk.red(err));
            } else {
                Object.keys(stats.compilation.assets).forEach(key => {
                    log += chalk.blue(key) + '\n';
                })
                stats.compilation.warnings.forEach(key => {
                    log += chalk.yellow(key) + '\n';
                })
                stats.compilation.errors.forEach(key => {
                    errorInfo += chalk.red(`${key}:${stats.compilation.errors[key]}`) + '\n';
                })
                log += errorInfo+ chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s\n`) + "\n";
                if(errorInfo){
                    reject(errorInfo)
                }else{
                    resolve(log);
                }
                console.log('打包主进程完毕！', log);
            }
        });
    });
}

module.exports = {
    buildMain
}