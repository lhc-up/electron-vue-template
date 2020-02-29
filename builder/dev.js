/**
* Tip:    调试渲染进程
* Author: haoluo
* Data:   2019-10-30
**/
process.env.NODE_ENV = 'development';//开发模式
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackHotMiddleware = require('webpack-hot-middleware');
const chalk = require('chalk');
const http = require('http');
const repl = require('repl');
const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');
const { buildMain } = require('./child/buildMain.js');
const { buildPreload } = require('./child/buildPreload.js');
const { buildUpdate } = require('./child/buildUpdate.js');
const devServerConfig = require('../config/devServerConfig.js');

const url = devServerConfig.url;
const port = devServerConfig.port;

// 构建渲染进程
function devRender() {
    console.log('启动渲染进程调试......');
    const webpackDevConfig = require('./webpack.render.config.js');
    const compiler = webpack(webpackDevConfig);
    new WebpackDevServer(
        compiler, {
            contentBase: webpackDevConfig.output.path,
            publicPath: webpackDevConfig.output.publicPath,
            open: false,//打开默认浏览器
            inline: true,//刷新模式
            hot: true,//热更新
            quiet: true,//除第一次编译外，其余不显示编译信息
            progress: true,//显示打包进度
            setup(app) {
                app.use(webpackHotMiddleware(compiler));
                app.use('*', (req, res, next) => {
                    if (String(req.originalUrl).indexOf('.html') > 0) {
                        console.log(req.originalUrl)
                        getHtml(res);
                    } else {
                        next();
                    }
                });
            }
        }
    ).listen(port, function(err) {
        if (err) return console.log(err);
        console.log(`Listening at http://${url}:${port}`);
    });
    compiler.hooks.done.tap('doneCallback', (stats) => {
        const compilation = stats.compilation;
        Object.keys(compilation.assets).forEach(key => console.log(chalk.blue(key)));
        compilation.warnings.forEach(key => console.log(chalk.yellow(key)));
        compilation.errors.forEach(key => console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`)));
        console.log(chalk.green(`${chalk.white('渲染进程调试完毕\n')}time:${(stats.endTime-stats.startTime)/1000} s`));
    });
}

// 启动Electron
function startElectron() {
    let electronProcess = spawn(electron, [path.join(process.cwd(), 'app/main.js')]);
    electronProcess.stdout.on('data', data => {
        // 正常输出为蓝色
        electronLog(data, 'blue');
    });
    electronProcess.stderr.on('data', data => {
        // 错误信息为红色
        electronLog(data, 'red');
    });
    // 监听关闭，并调出交互模块，快捷重启
    electronProcess.on('close', () => {
        callRepl("Electron Closed");
    });
}

//调出交互模块
function callRepl(tipText) {
    var tip = `${tipText}，reStart?(${chalk.green("Y")}/n)`;
    const r = repl.start({
        prompt: tip,
        eval: (cmd, context, filename, callback) => {
            if (cmd === "" || cmd === "\n" || cmd === "Y\n" || cmd === "y\n") {
                console.log("\n重新进行调试...");
                r.close();
                reBuildApp();
            } else {
                process.exit();
            }
            callback(null);
        }
    });
}

// 重启
function reBuildApp() {
    Promise.all([buildMain(), buildPreload()]).then(() => {
        startElectron();
    }).catch(err => {
        callRepl(err);
    });
}

// 美化输出
function electronLog(data, color) {
    let log = '';
    data.toString().split(/\r?\n/).forEach(line => {
        log += `\n${line}`;
    });
    if (/[0-9A-z]+/.test(log)) {
        console.log(
            chalk[color].bold('┏ Electron -------------------') + 
            log + 
            chalk[color].bold('┗ ----------------------------')
        );
    }
}

function getHtml(res) {
    http.get(`http://${url}:${port}`, (response) => {
        response.pipe(res);
    }).on('error', (err) => {
        console.log(err);
    });
}

// 构建
function build() {
    Promise.all([buildMain(), buildPreload(), buildUpdate(), devRender()]).then(() => {
        startElectron();
    }).catch(err => {
        console.log(err);
        process.exit();
    });
}

build();