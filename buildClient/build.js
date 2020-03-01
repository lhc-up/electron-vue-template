/**
* Tip:    打包
* Author: haoluo
* Data:   2019-10-30
**/
process.env.NODE_ENV = 'production';
const path = require('path');
const fs = require('fs');
const del = require("del");
const chalk = require('chalk');
const builder = require('electron-builder');
const { spawn } = require('child_process');
const renderConfig = require('./webpack.render.config.js');
const { buildMain } = require('./child/buildMain.js');
const { buildPreload } = require('./child/buildPreload.js');
const { buildRender } = require('./child/buildRender.js');
const { buildUpdate } = require('./child/buildUpdate.js');
const { compress } = require('./libs/compress.js');
const setup = require('../config/version.js');
// 删除历史打包数据
del(['./app/*']);

console.log(chalk.green('打包客户端.......'));

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
    const filePath = path.join(zipPath, `../pack/${fileName}.zip`);
    compress(zipPath, filePath, 7 , (type,msg) => {
        if (type === 'error'){
            Promise.reject('压缩文件时出错：' + msg);
        } else {
            console.log(`压缩包大小为：${(msg / 1024 / 1024).toFixed(2)}MB`);
        }
    });
    Promise.all([buildMain(), buildUpdate()]).then(resolve => {
        resolve.forEach(log => {
            console.log('打包输出===>', log)
        });
        builder.build().then(() => {
            del(['./pack/*.yaml', './pack/*.blockmap']);
            openFileManager();
        });
    }).catch(err => {
        console.error('打包【main】-【update】错误输出===>', err);
        process.exit(2);
    });
}).catch(err => {
    console.error('打包【preload】-【render】出错，输出===>', err);
    process.exit(1);
});

function openFileManager() {
    // 打开文件管理器
    let dirPath = path.join(__dirname, '..', 'pack');
    if (process.platform === 'darwin') {
        spawn('open', [dirPath]);
    } else if (process.platform === 'win32') {
        spawn('explorer', [dirPath]);
    } else if (process.platform === 'linux') {
        spawn('nautilus', [dirPath]);
    }
}