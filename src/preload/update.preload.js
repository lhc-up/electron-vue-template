const fse = require('fs-extra');
const path = require('path');
const url = require('url');
const { ipcRenderer } = require('electron');
const { app, getGlobal, getCurrentWindow } = require('@electron/remote');
const StreamZip = require('node-stream-zip');
// const pkgPath = path.join(app.getPath('userData'), 'pkg');
const tempPath = app.getPath('temp');
const pkgPath = '/Users/luohao/Desktop/temp';
import * as Event from '@/render/libs/js/event.js';

// 保存下载好的版本更新文件
Event.addEventListener('preload-update-save-zip-pkg', async function savePkg({ versionInfo, arraybuffer }) {
    try {
        fse.ensureDirSync(pkgPath);
        const savePath = path.join(pkgPath, path.basename(versionInfo.zipUrl));
        fse.writeFileSync(savePath, Buffer.from(arraybuffer));

        const zip = new StreamZip.async({ file: savePath });
        const extractDir = savePath.replace(path.extname(savePath), '');
        fse.ensureDirSync(extractDir);
        await zip.extract(null, extractDir);
    } catch(err) {
        console.log(err);
    }
});
Event.addEventListener('preload-update-save-exe-pkg', function savePkg({ versionInfo, arraybuffer }) {
    // 安装包保存在临时目录即可
    const savePath = path.join(tempPath, path.basename(versionInfo.exeUrl));
    fse.writeFileSync(savePath, Buffer.from(arraybuffer));
});

// 获取本地的版本更新文件
Event.addEventListener('preload-update-pkg-list', function getPkgList({ pkgList=[] }) {
    const fileList = fse.readdirSync(pkgPath).filter(v => {
        return path.extname(v) === '.zip';
    }).map(v => {
        return {
            zip: path.join(pkgPath, v),
            dir: path.join(pkgPath, v).replace('.zip', '')
        }
    });
    pkgList.push(...fileList);
});

Event.addEventListener('preload-update-load-pkg', ({ pkg }) => {
    const win = getCurrentWindow();
    const indexUrl = path.join(pkg.dir, 'index.html');
    const preloadUrl = path.join(pkg.dir, 'preload.js');

    // 这里是直接打开了版本文件，实际业务经常是在客户端启动的时候就去判断本地是否有更新包，有的话直接打
    // 则可以在新建窗口的时候把更新包的文件夹地址传给构造函数
    win.webContents.loadURL(url.pathToFileURL(indexUrl).href);
    win.webContents.session.setPreloads([url.pathToFileURL(preloadUrl).href]);
});

Event.addEventListener('preload-update-install-exe', ({ versionInfo }) => {
    const execPath = path.join(tempPath, path.basename(versionInfo.exeUrl));
    if (!fse.existsSync(execPath)) {
        alert('安装包不存在');
        return;
    }
    // 重新启动项目
    app.relaunch({ execPath });
    app.exit(1);
});