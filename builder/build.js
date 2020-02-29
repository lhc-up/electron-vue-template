/**
* Tip:    打包
* Author: haoluo
* Data:   2019-10-30
**/
process.env.NODE_ENV = 'production';
const path = require('path');
const del = require("del");
const renderConfig = require('./webpack.render.config.js');
const { buildMain } = require('./child/buildMain.js');
const { buildPreload } = require('./child/buildPreload.js');
const { buildRender } = require('./child/buildRender.js');
const { buildUpdate } = require('./child/buildUpdate.js');
const { compress } = require('./libs/compress.js');
const setup = require('../config/version.js');
// 删除历史打包数据
del(['./app/*']);

Promise.all([buildPreload(), buildRender()]).then(resolve => {
    resolve.forEach(log => {
        console.log('打包输出===>', log);
    });
    const outpath = path.join(__dirname, '../pack/');
    try {
        fs.mkdirSync(outpath);
    } catch(e) {
        console.log('已创建pack文件夹', e);
    }
    console.log('打包渲染进程完毕！压缩小版本!');
    const zipPath = renderConfig.output.path;
    const fileName = setup.versionType + '-' + setup.version.join('.');
    const filePath = path.join(zipPath, `../${fileName}.zip`);
    compress(zipPath, filePath, 7 , (type,msg) => {
        if (type === 'error'){
            Promise.reject('压缩文件时出错：' + msg);
        } else {
            console.log(`压缩包大小为：${(msg / 1024 / 1024).toFixed(2)}MB`);
        }
    });
    Promise.all([buildMain(), buildUpdate()]).then(resplve => {
        resolve.forEach(log => {
            console.log('打包输出===>', log)
        });
        // TODO:打包生成安装文件
    }).catch(err => {
        console.error('打包【main】-【update】错误输出===>', err);
        process.exit(2);
    });
}).catch(err => {
    console.error('打包【preload】-【render】出错，输出===>', err);
    process.exit(1);
});