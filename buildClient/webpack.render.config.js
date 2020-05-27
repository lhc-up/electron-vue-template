/*
Name:    渲染进程配置
Author: haoluo
Date:   2019-10-30
 */
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Autoprefixer = require('autoprefixer');
const context = require('../src/render/libs/interface/context.js');

// 是否是调试模式
const devMode = process.env.NODE_ENV === 'development';
module.exports = {
    mode: process.env.NODE_ENV,
    devtool: devMode ? 'eval-source-map' : false,
    entry: {
        main: ['@babel/polyfill', './src/render/electron.js']
    },
    output: {
        path: path.join(__dirname, '../app/'),
        publicPath: devMode ? '/' : '',
        filename: './js/[name].[hash:8].js',
        globalObject: 'this'
    },
    node: {
        fs: 'empty'
    },
    optimization: {
        runtimeChunk: false,
        minimize: !devMode,
        splitChunks: {
            chunks: 'initial',
            cacheGroups: {
                vendor: {
                    test: /node_modules\//,
                    name: 'vendor',
                    priority: 10,
                    enforce: true
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
                test: /\.css$/,
                use: (devMode ? ['css-hot-loader'] : []).concat([
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
                    }
                ])
            },
            {
                test: /\.less$/,
                use: (devMode ? ['css-hot-loader'] : []).concat([
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
                ])
            },
            {
                test: /\.(gif|svg|png|jpe?g|ico|hdr)(\?\S*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        esModule: false,
                        limit: 2048,
                        name: `.${context.name}/images/[name].[ext]`
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
            '@': path.resolve(__dirname, "../src"),
            '@config': path.resolve(__dirname, "../config")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/render/index.ejs',
            filename: './index.html',
            title: 'electron-vue-template',
            inject: 'body',
            hash: true,
            mode: devMode
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? `[name]-render.css` : `[name]-render.[hash:8].css`,
            chunkFilename: devMode ? '[name]-render.css' : '[name]-render.[hash:8].css',
            ignoreOrder: true
        }),
        new VueLoaderPlugin()
    ],
    target: 'electron-renderer'
}