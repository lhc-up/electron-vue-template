const os = require('os');
const webpack = require('webpack');
const chalk = require('chalk');
const consoleInfo = require('../buildClient/libs/consoleInfo.js');

const dev = {
    run() {
        // 删除历史打包数据
        require('del')(['./dist/*']);
        this.runDev();
    },
    // 启动调试
    runDev() {
        const WebpackDevServer = require('webpack-dev-server');
        const { devServer } = require('../config/index.js');
        const webpackConfig = require('./webpack.config.js');
        webpackConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true));
        webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());

        // 输出运行环境
        consoleInfo.runTime(process.env.PROXY_ENV);

        let { host, port, proxy, openBrowserAfterComplete } = devServer;
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
            consoleInfo.runTime(process.env.PROXY_ENV);//输出运行环境
            if (openBrowserAfterComplete) {
                const cmd = os.platform() === 'win32' ? 'explorer' : 'open';
                require('child_process').exec(`${cmd} 'http://${host}:${port}'`);
                devServer.openBrowserAfterComplete = false;
            }
            console.log(`Listening at http://${host}:${port}`);
        });
    }
};

dev.run();