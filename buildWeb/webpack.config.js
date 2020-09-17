/**
 * @name: web端打包配置
 * @author: luohao
 * @date: 2020-05-11
 * @desc: 
*/
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Autoprefixer = require('autoprefixer');
const context = require('../src/render/libs/interface/context.js');

// 是否是调试模式
const devMode = process.env.NODE_ENV === 'development';
var webpackBaseConfig = {
    mode: process.env.NODE_ENV,
    devtool: devMode ? 'eval-source-map' : false,
    entry: {
        main: ['@babel/polyfill', './src/render/index.js']
    },
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        publicPath: '/',
        filename: `.${context.name}/js/[name]${devMode ?  '' : '-[hash:8]'}.js`,
        chunkFilename: `.${context.name}/js/[name]${devMode ? '' : '-[hash]'}.js`,
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
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    },
                    {
                        loader: path.resolve('buildClient/libs/conditionCompileLoader.js'),
                        options: {
                            conditions: {
                                // 不配置默认为false
                                'ELECTRON': false,
                                'WEB': true
                            }
                        }
                    }
                ]
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
                    }, {
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
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.vue'],
        modules: [
            path.resolve(process.cwd(), 'src'),
            path.resolve(process.cwd(), 'node_modules')
        ],
        alias: {
            '@': path.resolve(process.cwd(), 'src'),
            '@config': path.resolve(__dirname, '../config'),
            '@images': path.resolve(__dirname, '../src/render/libs/images')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/render/index.ejs',
            filename: './index.html',
            title: 'Electron-vue-template',
            inject: 'body',
            favicon: false
        }),
        new MiniCssExtractPlugin({
            filename: `.${context.name}/css/[name]${devMode ? '' : '-[hash]'}.css`,
            chunkFilename: `.${context.name}/css/[name]${devMode ? '' : '-[hash]'}.css`,
            ignoreOrder: true
        }),
        new VueLoaderPlugin()
    ]
}
module.exports = webpackBaseConfig;