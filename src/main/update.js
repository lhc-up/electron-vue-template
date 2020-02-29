const {
    BrowserWindow
} = require("electron");
const process = require("process");
const path = require("path");
const url = require("url");
const devMode=process.env.NODE_ENV === "development";
let mainWindow=null;

//创建窗口
function createWindow() {
    let indexUrl = url.pathToFileURL(path.join(__dirname, 'update.html')).href;
    mainWindow = new BrowserWindow({
        title: "检查更新",
        width: 670,
        height: 420,
        minWidth:670,
        minHeight:420,
        maxWidth:670,
        maxHeight:420,
        offscreen:true,
        autoHideMenuBar:true, //隐藏菜单栏
        backgroundColor:"#fff",
        simpleFullscreen:true,
        resizable: false, //可否调整大小
        minimizable: false, //可否最小化
        maximizable: false, //可否最大化
        fullscreen: false, //MAC下是否可以全屏
        skipTaskbar: false, //在任务栏中显示窗口
        acceptFirstMouse: true, //是否允许单击页面来激活窗口
        allowRunningInsecureContent:true,//允许一个 https 页面运行 http url 里的资源
        webPreferences: {
            devTools: true, //是否允许打开调试模式
            webSecurity:false,//禁用安全策略
            allowDisplayingInsecureContent:true,//允许一个使用 https的界面来展示由 http URLs 传过来的资源
            allowRunningInsecureContent: true, //允许一个 https 页面运行 http url 里的资源
            nodeIntegration: true//5.x以上版本，默认无法在渲染进程引入node模块，需要这里设置为true
        }
    })
    mainWindow.loadURL(indexUrl);
    mainWindow.on('closed', function() {
        mainWindow = null
    });
    return mainWindow;
}

module.exports={
    create(_callback){
        if(mainWindow && !mainWindow.isDestroyed()){
            mainWindow.destroy();
        }
        mainWindow=createWindow();
        if(_callback instanceof Function)_callback(mainWindow);
        return mainWindow;
    }
}