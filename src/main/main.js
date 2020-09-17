require("./libs/runCheck.js")(); //禁止打开多份
require('./libs/compress.js');
const shortcut = require("./libs/shortcut.js"); //注册快捷键
const { app, BrowserWindow, ipcMain } = require("electron");
const { setVal } = require('@/render/libs/js/settingsInfo.js');

let updateWin = require('./update.js');
let indexWin = require('./index.js');
let startWin;

// (electron) The default value of app.allowRendererProcessReuse is deprecated, it is currently "false".  
// It will change to be "true" in Electron 9.  
// For more information please check https://github.com/electron/electron/issues/18397
// 手动设置为false，跟当前默认值保持一致，同时可清除终端中的log警告
app.allowRendererProcessReuse = false;

// 禁用硬件加速
app.disableHardwareAcceleration();

//注册全局变量
// 页面跟路径配置，优先使用此配置，考虑到小版本更新时，版本之间的切换
global.wwwroot = {
    path: __dirname
};
global.cookie = "";
//主窗口id，在创建主窗口的js中获取并修改此处
global.windowIds = {
    main: 0
};

app.on('ready', () => {
    //注册快捷键打开控制台事件
    shortcut.register('Command+Control+Alt+F5');
    startWin = updateWin.create();
});
//启动主窗体
ipcMain.on('create-main', (event, arg) => {
    // h5页面指向指定版本
    global.wwwroot.path = arg.newVersionPath || __dirname;
    if (arg.version) setVal('version','smallVersion', arg.version);
    indexWin.create();
    startWin.destroy();
});

app.on('window-all-closed', function () {
    setTimeout(() => {
        let allwindow = BrowserWindow.getAllWindows();
        if (allwindow.length === 0) app.exit(1);
    }, 500);
});