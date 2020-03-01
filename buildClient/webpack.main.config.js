/**
* Tip:    主进程打包配置
* Author: haoluo
* Data:   2019-12-23
**/
const path=require('path');
const webpack = require('webpack');
const { dependencies } = require('../package.json');
module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        main: ['./src/main/main.js'],
    },
    output: {
        path: path.join(process.cwd(), 'app'),
        libraryTarget: 'commonjs2',
        filename: './[name].js'
    },
    node: {
        fs: 'empty',
        __dirname: false
    },
    optimization: {
        runtimeChunk: false,
        minimize: true
    },
    externals: [
        ...Object.keys(dependencies || {})
    ],
    resolve: {
        extensions: ['.js', '.json', '.vue'],
        alias: {
            '@': path.resolve(__dirname, "../src"),
            '@config': path.resolve(__dirname, "../config")
        }
    },
    plugins:[
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    ],
    target: 'electron-main'
};