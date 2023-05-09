const webpack = require('webpack');
const chalk = require('chalk');
const consoleInfo = require('../buildClient/libs/consoleInfo.js');
const fse = require('fs-extra');
const path = require('path');

const dev = {
    run() {
        fse.emptyDirSync(path.resolve(__dirname, '../dist'));
        this.runDev();
    },
    // 启动调试
    runDev() {
        const WebpackDevServer = require('webpack-dev-server');
        const { devServer } = require('../config/index.js');
        const webpackConfig = require('./webpack.config.js');

        // 输出运行环境
        consoleInfo.runTime(process.env.PROXY_ENV);

        let { host, port, proxy } = devServer;
        // 同时调试web端和客户端，区分端口
        port += 1;
        const compiler = webpack(webpackConfig);
        new WebpackDevServer(
            {
                hot: true,
                compress: true,
                historyApiFallback: {
                    disableDotRule: true
                },
                open: true,
                port,
                host,
                proxy
            },
            compiler
        ).start().catch(err => {
            console.log(err);
        });
        compiler.hooks.done.tap('done', stats => {
            const compilation = stats.compilation;
            Object.keys(compilation.assets).forEach(key => {
                console.log(chalk.blue(key));
            });
            compilation.warnings.forEach(key => {
                console.log(chalk.yellow(key));
            });
            compilation.errors.forEach(key => {
                console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`));
            });
            console.log(chalk.green(`time：${(stats.endTime - stats.startTime) / 1000} s\n`) + chalk.white('调试完毕'));
            consoleInfo.runTime(process.env.PROXY_ENV);//输出运行环境
        });
    }
};

dev.run();