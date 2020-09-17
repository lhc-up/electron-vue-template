const {
    ipcMain
} = require("electron");
//压缩
const fs = require('fs');
const archiver = require('archiver')//压缩文件所用
const AdmZip = require('adm-zip')//读取文件内容所用
const path = require('path');
//压缩上传数据
ipcMain.on('main-compress-path', (event, arg) => {
    compress(arg.filePath, arg.zipPath, arg.level, (result, info) => {
        if (arg.callbackTag) event.sender.send(arg.callbackTag, result, arg.zipPath, info);
    });
});
// 解压最新的下载包文件夹
ipcMain.on('main-unzip-file', (event, arg) => {
    let unzip = new AdmZip(path.join(arg.inPath, arg.fileName));
    unzip.extractAllTo(path.join(arg.outPath, arg.fileNameWithOutExt), true);
    event.returnValue = "";
});

//获取压缩文件
ipcMain.on('main-get-compress-file', (event, path, fileName, type) => {
    event.returnValue = getInfo(path, fileName, type);
});
//不解压的情况下读取相关文件
function getInfo(path, fileName, type) {
    let fileInfo;
    let zip = new AdmZip(path);
    let zipEntries = zip.getEntries();
    zipEntries.forEach((item) => {
        if (item.name === fileName) {
            fileInfo = item.getData();
        }
    });
    return type === "json" ? JSON.parse(fileInfo.toString()) : fileInfo;
}
//压缩指定目录的文件
function compress(filePath, zipPath, level, callback) {
    var output = fs.createWriteStream(zipPath);
    var archive = archiver('zip', {
        zlib: { level: level ? level : 9 }
    });
    // 通过管道方法将输出流存档到文件
    archive.pipe(output);
    archive.directory(filePath, false);
    archive.on('error', function (err) {
        callback("error", "压缩错误" + err);
    });
    output.on('close', function () {
        let size = archive.pointer();
        callback("success", size);
    });
    //完成归档
    archive.finalize();
}
