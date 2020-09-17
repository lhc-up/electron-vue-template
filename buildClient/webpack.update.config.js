/*
* Tip:    自动更新配置
* Author: haoluo
* Data:   2020-02-29
*/
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const Autoprefixer = require('autoprefixer');
const context = require('../src/render/libs/interface/context.js');
module.exports ={
    mode: process.env.NODE_ENV,
    entry: {
        main: ['./src/render/update/index.js']
    },
    output: {
        path:  path.join(__dirname, '../app/'),
        publicPath: '',
        filename: `./js/[name].[hash:8].js`,
        chunkFilename: `./js/[name].[hash:8].js`,
        globalObject: 'this'
    },
    node: {
        fs: 'empty',
        __dirname: false
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
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [Autoprefixer]
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(gif|svg|png|jpe?g|ico|hdr)(\?\S*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        esModule: false,
                        limit: 2048,
                        name: `.${context.name}/images/[name].[hash:8].[ext]`
                    }
                }]
            },
            {
                test: /\.(eot|ttf|woff|woff2|otf)(\?\S*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        esModule: false,
                        limit: 2048,
                        name: `.${context.name}/images/[name].[ext]`
                    }
                }]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.vue'],
        alias: {
            '@': path.resolve(__dirname, '../src'),
            '@config': path.resolve(__dirname, '../config'),
            '@images': path.resolve(__dirname, '../src/render/libs/images')
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
            inject: 'body'
        }),
        new VueLoaderPlugin()
    ],
    target: 'electron-renderer'
}
