const path = require('path');
const { session } = require('electron');
import installExtension, { VUEJS_DEVTOOLS} from 'electron-devtools-installer';

const isDev = process.env.NODE_ENV === 'development';

// 资源目录
const resourceDir = isDev ? path.join(process.cwd(), 'resources') : process.resourcesPath;
// 插件目录
const extensionsDir = path.join(resourceDir, 'extensions');

export async function addVueDevtool() {
    // 通用加载方式
    // const extensionPath = path.join(extensionsDir, 'vue-devtool');
    // await session.defaultSession.loadExtension(extensionPath, {
    //     allowFileAccess: true
    // });

    // 使用electron-devtools-installer包，添加常用的devtool
    await installExtension(VUEJS_DEVTOOLS);
}