const webpack = require('webpack');
const chalk = require('chalk');
const consoleInfo = require('../buildClient/libs/consoleInfo.js');
const webpackConfig = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const fse = require('fs-extra');
const path = require('path');

const build = {
    run() {
        // 输出运行环境
        consoleInfo.runTime(process.env.PROXY_ENV);
        fse.emptyDirSync(path.resolve(__dirname, '../dist'));
        this.addPluginForWebpack();
        this.buildApp();
    },
    // 打包
    buildApp() {
        const compiler = webpack(webpackConfig);
        compiler.run((err, stats) => {
            if (err) {
                console.log(chalk.red(err));
                process.exit(0);
            }
            let log = '';
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
            console.log(log);
            // 输出运行环境
            consoleInfo.runTime(process.env.PROXY_ENV);
        });
    },
    // 添加额外的webpack插件
    addPluginForWebpack() {
        // 添加htmlWebpackPlugin，打包多页面
        const routers = require('../src/render/router/index.js');
        this.addHtmlWebpackPlugin(routers);
        this.addProgressPlugin();
    },
    // 添加进度插件
    addProgressPlugin() {
        // 显示打包进度
        webpackConfig.plugins.push(new ProgressBarPlugin({
            format: '正在打包 [:bar] ' + chalk.green.bold(':percent'),
            width: 50,
            summary: false
        }));
    },
    // 给每一条路由添加htmlWebpackPlugin插件，从而打包对应的页面
    addHtmlWebpackPlugin(routers) {
        routers.forEach(item => {
            let htmlPath = item.path;
            webpackConfig.plugins.push(new HtmlWebpackPlugin({
                template: './src/render/index.ejs',
                filename: `.${htmlPath}`,
                favicon: false,
                inject: 'body',
                hash: true,
                minify: false,
                cache: false
            }));
            if (item.children instanceof Array && item.children.length) {
                this.addHtmlWebpackPlugin(item.children);
            }
        });
    }
};

build.run();