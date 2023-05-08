require("./libs/runCheck.js")(); //禁止打开多份
require('./libs/compress.js');
const shortcut = require("./libs/shortcut.js"); //注册快捷键
const { app, BrowserWindow, ipcMain } = require("electron");
const remote = require('@electron/remote/main');
remote.initialize();

const BaseWindow = require('./win/baseWindow.js');

// (electron) The default value of app.allowRendererProcessReuse is deprecated, it is currently "false".  
// It will change to be "true" in Electron 9.  
// For more information please check https://github.com/electron/electron/issues/18397
// 手动设置为false，跟当前默认值保持一致，同时可清除终端中的log警告
app.allowRendererProcessReuse = false;

// 禁用硬件加速
app.disableHardwareAcceleration();

//注册全局变量
Object.assign(global, {
    // 页面跟路径配置，优先使用此配置，考虑到小版本更新时，版本之间的切换
    wwwroot: __dirname,
    // 区分不同域下的cookie
    cookie: {}
});

app.on('ready', () => {
    //注册快捷键打开控制台事件
    shortcut.register('Command+Control+Alt+F5');
    const win = new BaseWindow();
    win.create();
});

app.on('window-all-closed', function () {
    setTimeout(() => {
        const allwindow = BrowserWindow.getAllWindows();
        if (allwindow.length === 0) app.exit(1);
    }, 500);
});