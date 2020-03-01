/**
* Tip:    调试web端
* Author: haoluo
* Data:   2020-03-01
**/
process.env.NODE_ENV = 'development';
const os = require('os');
const path = require('path');
const http = require('http');
const webpack = require('webpack');
const chalk = require("chalk");
const WebpackDevServer = require('webpack-dev-server');
const webpackDevConfig = require('./webpack.config.js');
const devServerConfig = require('../config/devServerConfig.js');

const url = devServerConfig.url;
const port = devServerConfig.port;

webpackDevConfig.entry.main.unshift("webpack-hot-middleware/client?reload=true&" + `http://${url}:${port}`);
webpackDevConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
webpackDevConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
webpackDevConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
webpackDevConfig.output.path = path.join(__dirname, "./");

function getHtml(res) {
    http.get(`http://${url}:${port}`, (response) => {
        response.pipe(res);
    }).on('error', (err) => {
        console.log(err);
    });
}
const compiler = webpack(webpackDevConfig);
new WebpackDevServer(
    compiler, {
        contentBase: webpackDevConfig.output.path,
        publicPath: webpackDevConfig.output.publicPath,
        inline: true,
        hot: true, //热更新
        quiet: true,
        port: port, //设置端口号
        progress: true, //显示打包的进度
        proxy: devServerConfig.proxy||{},
        setup(app) {
            app.use(require('webpack-hot-middleware')(compiler));
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
).listen(port, url, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Listening at http://${url}:${port}`);
});
compiler.hooks.done.tap("done", function(stats) {
    var compilation = stats.compilation;
    Object.keys(compilation.assets).forEach(key => {
        console.log(chalk.blue(key));
    })
    compilation.warnings.forEach(key => {
        console.log(chalk.yellow(key));
    })
    compilation.errors.forEach(key => {
        console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`));
    })
    console.log(chalk.green(`time：${(stats.endTime-stats.startTime)/1000} s\n`) + chalk.white("调试完毕"));
    if (devServerConfig.devComplateOpened) {
        var cmd = os.platform() === "win32" ? 'explorer' : 'open';
        require('child_process').exec(`${cmd} "http://${url}:${port}"`);
        devServerConfig.devComplateOpened=false;
    }
});
