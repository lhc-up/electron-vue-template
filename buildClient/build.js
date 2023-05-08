const fs = require('fs');
const path = require('path');
const consoleInfo = require('./libs/consoleInfo.js');
const del = require('del');
const { version } = require('../config/index.js');

const build = {
    run() {
        // 删除历史打包数据
        del(['./app/*', './pack/*']);
        // 打包
        this.buildApp();
    },
    // 打包
    buildApp() {
        const { viewBuilder } = require('./child/buildRender.js');
        const { preloadBuilder } = require('./child/buildPreload.js');
        // 打包preload和渲染进程
        Promise.all([preloadBuilder(), viewBuilder()]).then((resolve) => {
            const viewRenderConfig = require('./webpack.render.config.js');
            resolve.forEach(res => console.log('打包输出===>', res));
            let outpath = path.join(__dirname, '../pack/');
            console.log(`打包渲染进程完毕！压缩小版本!`);
            try {
                fs.mkdirSync(outpath)
            } catch (e) {
                //console.log(e);//路径已存在
            }
            // 要压缩的文件夹
            let zipPath = viewRenderConfig.output.path;
            let fileName = process.env.PROXY_ENV + '-' + version.join('.');
            // 压缩的文件
            let filePath = path.join(zipPath, `../pack/${fileName}.zip`);
            this.compress(zipPath, filePath, 7, (type, msg) => {
                if (type === 'error') {
                    Promise.reject('压缩文件时出错：' + msg);
                } else {
                    // 打包主进程和自动更新
                    this.packMainAndUpdate();
                    console.log(`压缩包大小为：${(msg / 1024 / 1024).toFixed(2)}MB`);
                }
            });
        }).catch(err => {
            console.error('打包【preload】-【view】出错，输出===>', err);
            process.exit(1);
        });
    },
    // 打包主进程和自动更新
    packMainAndUpdate() {
        const { mainBuilder } = require('./child/buildMain.js');
        mainBuilder().then(res => {
            const electronBuilder = require('electron-builder');
            const packageJson = require('../package.json');
            console.log('打包输出===>', res)
            packageJson.version = version.slice(0, 3).join('.');
            fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(packageJson, null, 4));
            electronBuilder.build().then(() => {
                // 输出运行环境
                consoleInfo.runTime(process.env.PROXY_ENV);
                // 删除无用日志文件
                del(['./pack/*.yaml', './pack/*.yml', './pack/*.blockmap']);
                this.buildEnd();
            }).catch(error => {
                console.error(error);
            });
        }).catch(err => {
            console.error('打包【main】-【update】错误输出===>', err);
            process.exit(2);
        });
    },
    //压缩指定目录的文件
    compress(filePath, zipPath, level=9, callback) {
        // 压缩文件所用
        const archiver = require('archiver');
        // 修复压缩包插件中文名称bug
        require('./libs/admzip.js');
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level }
        });
        // 通过管道方法将输出流存档到文件
        archive.pipe(output);
        archive.directory(filePath, false);
        archive.on('error', err => {
            if (callback) callback('error', err);
        });
        output.on('close', () => {
            let size = archive.pointer();
            if (callback) callback('success', size);
        });
        // 完成归档
        archive.finalize();
    },
    // 打包结束处理
    buildEnd() {
        // 打开文件管理器
        const { spawn } = require('child_process');
        const dirPath = path.join(__dirname, '..', 'pack');
        if (process.platform === 'darwin') {
            spawn('open', [dirPath]);
        } else if (process.platform === 'win32') {
            spawn('explorer', [dirPath]);
        } else if (process.platform === 'linux') {
            spawn('nautilus', [dirPath]);
        }
    }
};

build.run();