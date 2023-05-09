const path=require('path');
const { dependencies } = require('../package.json');
module.exports = {
    mode:process.env.NODE_ENV,
    entry: {
        preload:['./src/preload/index.js']
    },
    output: {
        path: path.join(__dirname, '../app/'),
        libraryTarget: 'commonjs2',
        filename: './[name].js'
    },
    optimization: {
        runtimeChunk: false,
        minimize: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: [
        ...Object.keys(dependencies || {})
    ],
    resolve: {
        extensions: ['.js'],
        fallback: {
            url: require.resolve('url')
        },
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    plugins: [],
    target: 'electron-renderer'
}