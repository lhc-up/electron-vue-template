const {
    app,
    BrowserWindow
} = require("electron");
module.exports=()=>{
    // 单实例检查
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) return app.quit();
    app.on('second-instance', () => {
        let myWindows = BrowserWindow.getAllWindows();
        myWindows.forEach(win => {
            if (win && !win.isDestroyed()) {
                if (win.isMinimized()) win.restore();
                win.focus();
            }
        });
    });
}