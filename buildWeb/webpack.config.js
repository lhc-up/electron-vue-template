const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
function resolve (dir) {
    return path.join(__dirname, '..', dir)
}
const devMode= process.env.NODE_ENV === 'development';
var webpackBaseConfig= {
    mode: devMode ? "development" : "production",
    entry: {
        main: ['./src/render/index.js']
    },
    output: {
        path: path.join(__dirname, '../dist/'),
        publicPath: '/',
        filename: `./js/[name]-[hash].js`,
        chunkFilename: `./js/[name]-[hash].js`
    },
    optimization: {
        runtimeChunk: false,
        minimize: !devMode,
        splitChunks: {
            chunks: 'initial',
            cacheGroups: {
                vendor: {
                    test: /node_modules\//,
                    name: "vendor",
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
                use:[
                    {
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                less:(devMode?['css-hot-loader']:[]).concat([
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
                                ]),
                                css:(devMode?['css-hot-loader']:[]).concat([
                                    MiniCssExtractPlugin.loader,
                                    {
                                        loader: "css-loader",
                                    }
                                ])
                            }
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: [resolve('src')],
                loader: 'babel-loader?cacheDirectory=true'
            },
            {
                test: /\.css$/,
                use: (devMode?['css-hot-loader']:[]).concat([
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ])
            },
            {
                test: /\.less$/,
                use: (devMode?['css-hot-loader']:[]).concat([
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
                ])
            }
        ]
    },
    resolve: {
        extensions: ['.js','.json', '.vue'],
        modules: [
            resolve('src'),
            resolve('node_modules')
        ],
        alias: {
            '@': path.resolve(__dirname, "../src")
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': devMode ? '"development"' : '"production"'
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? `./css/[name].css`:`./css/[name]-[hash].css`,
            ignoreOrder: true
        }),
        new HtmlWebpackPlugin({
            template: './src/render/index.ejs',
            filename: './index.html',
            title: "加载中...",
            inject: false,
            hash: true,
            mode:devMode //是否是调试模式
        }),
        new VueLoaderPlugin()
    ]
}
module.exports = webpackBaseConfig;
