/*
Name:    渲染进程配置
Author: haoluo
Date:   2019-10-30
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const devMode = process.env.NODE_ENV === 'development';

module.exports = {
    mode: devMode ? 'development' : 'production',
    entry: {
        main: './src/render/index.js'
    },
    output: {
        path: path.join(__dirname, '../app/'),
        publicPath: devMode ? '/' : '',
        filename: './js/[name].[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.vue'],
        alias: {
            '@': path.resolve(__dirname, "../src"),
            '@config': path.resolve(__dirname, "../config")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/render/index.ejs',
            filename: './index.html',
            title: 'electron-vue-template',
            inject: false,
            hash: true,
            mode: devMode
        }),
        new VueLoaderPlugin()
    ],
    target: 'electron-renderer'
}