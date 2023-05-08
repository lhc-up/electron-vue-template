// 访问electron对象
const {
    remote,
    ipcRenderer
} = require('electron');
window.isClient = true;