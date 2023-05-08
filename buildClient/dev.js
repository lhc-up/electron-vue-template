const path = require('path');
const repl = require('repl');
const chalk = require('chalk');
const webpack = require('webpack');
const electron = require('electron');
const { mainBuilder } = require('./child/buildMain.js');
const config = require('../config/index.js');

const dev = {
    run() {
        // 启动调试
        this.runDev();
    },
    // 启动调试
    runDev() {
        Promise.all([this.devRenderer(), mainBuilder()]).then(() => {
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
            const webpackConfig = require('./webpack.render.config.js');
            webpackConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true));
            webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
            
            const { host, port, proxy } = config.devServer;
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
        const electronProcess = spawn(electron, ['--inspect=5858', path.join(__dirname, '../app/main.js')]);
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