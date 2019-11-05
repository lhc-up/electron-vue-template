/**
* Tip:    调试渲染进程
* Author: haoluo
* Data:   2019-10-30
**/
process.env.NODE_ENV = 'development';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackHotMiddleware = require('webpack-hot-middleware');
const chalk = require('chalk');
const http = require('http');
function devRender() {
    console.log('启动渲染进程调试......');
    const webpackDevConfig = require('./webpack.render.config.js');
    const compiler = webpack(webpackDevConfig);
    new WebpackDevServer(
        compiler, {
            contentBase: webpackDevConfig.output.path,
            publicPath: webpackDevConfig.output.publicPath,
            open: true,//打开默认浏览器
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
    ).listen(8099, function(err) {
        if (err) return console.log(err);
        console.log(`Listening at http://localhost:8099`);
    });
    compiler.hooks.done.tap('doneCallback', (stats) => {
        const compilation = stats.compilation;
        Object.keys(compilation.assets).forEach(key => console.log(chalk.blue(key)));
        compilation.warnings.forEach(key => console.log(chalk.yellow(key)));
        compilation.errors.forEach(key => console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`)));
        console.log(chalk.green(`${chalk.white('渲染进程调试完毕\n')}time:${(stats.endTime-stats.startTime)/1000} s`));
    });
}

function getHtml(res) {
    http.get(`http://localhost:8099`, (response) => {
        response.pipe(res);
    }).on('error', (err) => {
        console.log(err);
    });
}

devRender();