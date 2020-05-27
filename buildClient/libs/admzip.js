const fs=require("fs");
const file="./node_modules/adm-zip/zipEntry.js";
//检测文件是否存在
try {
    fs.statSync(file);
    let fileData=fs.readFileSync(file, 'utf8');
    fileData = "var iconv = require('iconv-lite');\n" + fileData;
    let firstIndex=fileData.indexOf("set entryName (val) {");
    let lastIndex=fileData.indexOf("}",firstIndex);
    if(firstIndex>0 && lastIndex > firstIndex){
        let lang=`set entryName (val) {
            var nameTemp = iconv.decode(val, 'GBK');
            _entryName = Utils.toBuffer(val);
            var lastChar = _entryName[_entryName.length - 1];
            _isDirectory = (lastChar === 47) || (lastChar === 92);
            _entryHeader.fileNameLength = _entryName.length;
            _entryName = nameTemp;
        }`;
        fileData=fileData.substr(0,firstIndex)+lang+fileData.substr(lastIndex+1);
    }
    fs.writeFileSync(file,fileData,{encoding:"utf8"});
} catch (e) {
    console.log("如果在项目中未使用到adm-zip,可删除此脚本引用："+__dirname+"/adm-zip.js");
}
//原始数据
/*
`set entryName (val) {
    _entryName = Utils.toBuffer(val);
    var lastChar = _entryName[_entryName.length - 1];
    _isDirectory = (lastChar === 47) || (lastChar === 92);
    _entryHeader.fileNameLength = _entryName.length;
},`
*/
