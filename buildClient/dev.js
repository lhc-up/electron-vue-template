/**
 * @name: 本地调试APP
 * @author: luohao
 * @date: 2020-05-11
 * @desc: ------------------------
 * npm run devApp 调试客户端
 * 参数：dev  为开发环境
 * 参数：test 为测试环境
 * 不传[test/dev]参数，默认为release正式环境
*/
process.env.NODE_ENV = 'development';

const path = require('path');
const fs = require('fs');
const repl = require('repl');
const chalk = require('chalk');
const webpack = require('webpack');
const electron = require('electron');
const consoleInfo = require('./libs/consoleInfo.js');
const { mainBuilder } = require('./child/buildMain.js');
const { updateBuilder } = require('./child/buildUpdate.js');

const dev = {
    // 版本信息
    setup: {},
    run() {
        // 初始化版本信息
        this.initSetup();
        // 写出版本配置文件
        this.writeVersionConfig();
        // 写出上下文
        this.writeContext();
        // 启动调试
        this.runDev();
    },
    // 初始化版本信息
    initSetup() {
        // 得到原始版本文件信息
        const setup = require('../config/version.js');
        const runTimeObj = {
            dev: '开发版',
            test: '测试版',
            release: '正式版'
        };
        setup.versionType = 'release';
        setup.versionName = runTimeObj.release;
        // 发布时间
        setup.publishTime = Date.now();
        Object.keys(runTimeObj).forEach(key => {
            if (process.argv.indexOf(key) > 1) {
                setup.versionType = key;
                setup.versionName = runTimeObj[key];
            };
        });
        // 输出运行环境
        consoleInfo.runTime(setup.versionType);
        this.setup = setup;
    },
    // 写出版本配置文件
    writeVersionConfig() {
        fs.writeFileSync(path.join(__dirname, '../config/version.js'), `module.exports = ${JSON.stringify(this.setup, null, 4)}`);
    },
    // 写出上下文
    writeContext() {
        // 得到上下文基础配置
        const context = require('../src/render/libs/interface/baseContext.js');
        // 得到各环境服务地址
        const { serverUrl } = require('../config/proxyConfig.js');
        context.api = serverUrl[this.setup.versionType] + context.api;
        fs.writeFileSync(path.join(__dirname, '../src/render/libs/interface/context.js'), `module.exports = ${JSON.stringify(context, null, 4)}`);
    },
    // 启动调试
    runDev() {
        Promise.all([this.devRenderer(), updateBuilder(), mainBuilder()]).then(() => {
            this.startElectron();
        }).catch(err => {
            console.log(err);
            process.exit();
        });
    },
    // 调试渲染进程
    devRenderer() {
        return new Promise((resolve, reject) => {
            console.log('启动渲染进程调试......');
            const WebpackDevServer = require('webpack-dev-server');
            const devServerConfig = require('../config/devServerConfig.js');
            const webpackConfig = require('./webpack.render.config.js');
            webpackConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true));
            webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
            
            const { host, port, proxy } = devServerConfig;
            const compiler = webpack(webpackConfig);
            compiler.hooks.done.tap('done', stats => {
                const compilation = stats.compilation
                Object.keys(compilation.assets).forEach(key => {
                    console.log(chalk.blue(key));
                });
                compilation.warnings.forEach(key => {
                    console.log(chalk.yellow(key));
                });
                compilation.errors.forEach(key => {
                    console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`));
                });
                console.log(chalk.green(`time：${(stats.endTime - stats.startTime) / 1000} s\n`) +
                    chalk.white('渲染进程调试完毕'));
                // 输出运行环境
                consoleInfo.runTime(this.setup.versionType);
                resolve('');
            })
            new WebpackDevServer(
                compiler, {
                    contentBase: webpackConfig.output.path,
                    publicPath: webpackConfig.output.publicPath,
                    inline: true,
                    hot: true,
                    quiet: true,
                    progress: true,
                    disableHostCheck: true,
                    historyApiFallback: {
                        disableDotRule: true
                    },
                    port,
                    host,
                    proxy
                }
            ).listen(port, host, err => {
                if (err) return reject(err);
                console.log(`Listening at http://${host}:${port}`);
            });
        });
    },
    // 启动Electron
    startElectron() {
        const { spawn } = require('child_process');
        const electronProcess = spawn(electron, [path.join(__dirname, '../app/main.js')]);
        //'--inspect=5858',
        electronProcess.stdout.on('data', data => {
            this.electronLog(data, 'blue')
        });
        electronProcess.stderr.on('data', data => {
            this.electronLog(data, 'red')
        });
        electronProcess.on('close', () => {
            this.callRepl('Electron Closed');
        });
    },
    // 美化Electron输出
    electronLog(data, color) {
        let log = '';
        data.toString().split(/\r?\n/).forEach(line => log += `\n${line}`);
        if (/[0-9A-z]+/.test(log)) {
            console.log(
                chalk[color].bold('┏ Electron -------------------') +
                log +
                chalk[color].bold('┗ ----------------------------')
            )
        }
    },
    // 重新打包，只打包主进程
    reBuildApp() {
        mainBuilder('development').then(() => {
            this.startElectron();
        }).catch(err => {
            this.callRepl(err);
        });
    },
    // 调出交互模块
    callRepl(tipText) {
        var tip = `${tipText}，reStart?(${chalk.green('Y')}/n)`;
        const r = repl.start({
            prompt: tip,
            eval: (cmd, context, filename, callback) => {
                if (cmd === '' || cmd === '\n' || cmd === 'Y\n' || cmd === 'y\n') {
                    console.log('\n重新进行调试...');
                    r.close();
                    this.reBuildApp();
                } else {
                    process.exit();
                }
                callback(null);
            }
        });
    }
};

dev.run();