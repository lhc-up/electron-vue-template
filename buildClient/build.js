/**
 * @name: 构建APP
 * @author: luohao
 * @date: 2020-05-11
 * @desc: ------------------------
 * npm run buildApp 调试客户端
 * 参数：dev  为开发环境
 * 参数：test 为测试环境
 * 参数：show 为演示环境
 * 不传[show/test/dev]参数，默认为release正式环境
 * setup:  https://www.electron.build/configuration/configuration
*/
process.env.NODE_ENV = 'production';
const fs = require('fs');
const path = require('path');
const consoleInfo = require('./libs/consoleInfo.js');
const del = require('del');

const build = {
    // 版本信息
    setup: {},
    run() {
        // 删除历史打包数据
        del(['./app/*', './pack/*']);
        // 初始化版本信息
        this.initSetup();
        // 写出版本配置文件
        this.writeVersionConfig();
        // 写出上下文
        this.writeContext();
        // 打包
        this.buildApp();
    },
    // 初始化版本信息
    initSetup() {
        // 得到原始版本文件信息
        const setup = require('../config/version.js');
        const runTimeObj = {
            dev: '开发版',
            test: '测试版',
            release: '正式版'
        };
        setup.versionType = 'release';
        setup.versionName = runTimeObj.release;
        // 发布时间
        setup.publishTime = Date.now();
        Object.keys(runTimeObj).forEach(key => {
            if (process.argv.indexOf(key) > 1) {
                setup.versionType = key;
                setup.versionName = runTimeObj[key];
            }
        });
        // 输出运行环境
        consoleInfo.runTime(setup.versionType);
        this.setup = setup;
    },
    // 写出版本配置文件
    writeVersionConfig() {
        fs.writeFileSync(path.join(__dirname, '../config/version.js'), `module.exports = ${JSON.stringify(this.setup, null, 4)}`);
    },
    // 写出上下文
    writeContext() {
        // 得到上下文
        const context = require('../src/render/libs/interface/baseContext.js');
        // 得到各环境服务地址
        const { serverUrl } = require('../config/proxyConfig.js');
        context.api = serverUrl[this.setup.versionType] + context.api;
        fs.writeFileSync(path.join(__dirname, '../src/render/libs/interface/context.js'), `module.exports = ${JSON.stringify(context, null, 4)}`);
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
            let fileName = this.setup.versionType + '-' + this.setup.version.join('.');
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
        const { updateBuilder } = require('./child/buildUpdate.js');
        const { mainBuilder } = require('./child/buildMain.js');
        Promise.all([mainBuilder(), updateBuilder()]).then(resolve => {
            const electronBuilder = require('electron-builder');
            const packageJson = require('../package.json');
            resolve.forEach(res => console.log('打包输出===>', res));
            packageJson.version = this.setup.version.slice(0, 3).join('.');
            fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(packageJson, null, 4));
            electronBuilder.build().then(() => {
                // 输出运行环境
                consoleInfo.runTime(this.setup.versionType);
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