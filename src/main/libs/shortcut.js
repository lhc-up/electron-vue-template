const {
    app,
    BrowserWindow
} = require("electron");
const globalShortcut = require("electron").globalShortcut;
class Shortcut{
    register(keys='Command+Control+Alt+F4'){
        globalShortcut.register(keys, function () {
            let allWindow = BrowserWindow.getAllWindows();
            for(let index =0;index < allWindow.length ;index++){
                let win=allWindow[index]
                if(win.webContents && !win.webContents.isDevToolsOpened()){
                    win.webContents.openDevTools({mode: 'detach'});
                }
            }
        })
    }
    
}
app.on('will-quit', function () {
    globalShortcut.unregisterAll()
});
module.exports=new Shortcut();