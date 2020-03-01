const fs = require('fs');
const archiver = require('archiver');
// 压缩指定目录的文件
function compress(filePath, zipPath, level=9, callback) {
    var output = fs.createWriteStream(zipPath);
    var archive = archiver('zip', {
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
}

module.exports = {
    compress
}