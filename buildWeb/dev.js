/**
 * @name: 本地调试
 * @author: luohao
 * @date: 2020-05-11
 * @desc: ------------------------
 * npm run dev 调试客户端
 * 参数：dev  为开发环境
 * 参数：test 为测试环境
 * 参数：show 为演示环境
 * 不传[show/test/dev]参数，默认为release正式环境
*/
process.env.NODE_ENV = 'development';
const os = require('os');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const consoleInfo = require('../buildClient/libs/consoleInfo.js');

const dev = {
    run() {
        // 删除历史打包数据
        require('del')(['./dist/*']);
        this.writeContext();
        this.runDev();
    },
    // 写出上下文
    writeContext() {
        // 得到上下文
        const context = require('../src/render/libs/interface/baseContext.js');
        fs.writeFileSync(path.join(__dirname, '../src/render/libs/interface/context.js'), `module.exports = ${JSON.stringify(context, null, 4)}`);
    },
    // 启动调试
    runDev() {
        const WebpackDevServer = require('webpack-dev-server');
        const devServerConfig = require('../config/devServerConfig.js');
        const webpackConfig = require('./webpack.config.js');
        webpackConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true));
        webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());

        // 输出运行环境
        consoleInfo.runTime(devServerConfig.currEnv);

        let { host, port, proxy } = devServerConfig;
        // 同时调试web端和客户端，区分端口
        port += 1;
        const compiler = webpack(webpackConfig);
        new WebpackDevServer(
            compiler, {
                contentBase: webpackConfig.output.path,
                publicPath: webpackConfig.output.publicPath,
                inline: true,
                hot: true,
                hotOnly: true,
                quiet: true,
                progress: true,
                compress: true,
                disableHostCheck: true,
                historyApiFallback: {
                    disableDotRule: true
                },
                port,
                host,
                proxy
            }
        ).listen(port, host, err => {
            if (err) return console.log(err);
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
            consoleInfo.runTime(devServerConfig.currEnv);//输出运行环境
            if (devServerConfig.openBrowserAfterComplete) {
                const cmd = os.platform() === 'win32' ? 'explorer' : 'open';
                require('child_process').exec(`${cmd} 'http://${host}:${port}'`);
                devServerConfig.openBrowserAfterComplete = false;
            }
            console.log(`Listening at http://${host}:${port}`);
        });
    }
};

dev.run();