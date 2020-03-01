/*
Tip:    自动更新配置
Author: haoluo
Data:   2020-02-29
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports ={
    mode: process.env.NODE_ENV,
    entry: {
        main: ['./src/render/update/index.js']
    },
    output: {
        path:  path.join(__dirname, '../app/'),
        publicPath: '',
        filename: `./js/[name].[hash:8].js`,
        globalObject: 'this'
    },
    node: {
        fs: 'empty',
        __dirname:false
    },
    optimization: {
        runtimeChunk: false,
        minimize: true,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    minChunks: 1000
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                use:[
                    {
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                less: [
                                    MiniCssExtractPlugin.loader,
                                    {
                                        loader: "css-loader",
                                    },
                                    {
                                        loader:"less-loader",
                                        options: {
                                            javascriptEnabled: true
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader:"less-loader",
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.vue'],
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `./[name].[hash:8].css`
        }),
        new HtmlWebpackPlugin({
            template: './src/render/update/index.ejs',
            filename: './update.html',
            title: "检查更新",
            inject: false
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new VueLoaderPlugin()
    ],
    target: 'electron-renderer'
}
