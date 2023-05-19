# [添加Chrome扩展](https://www.electronjs.org/docs/latest/api/session#sesloadextensionpath-options)  

```javascript
const { app, session } = require('electron');
app.on('ready', async () => {
    await session.defaultSession.loadExtension(
        // 解压后的插件目录，不支持crx格式
        // 可使用在线工具(https://www.ezyzip.com/cn-crx.html)进行解压
        extensionPath, 
        {
            allowFileAccess: true
        }
    );
    // 创建窗口
});
```

具体代码实现见：`src/main/libs/extensions.js`、`src/main/main.js`

### 注意

`Electron`并非支持所有的`Chrome`插件，引入插件时需要考虑插件中是否使用了`Electron`不支持的API，[参考文档](https://www.electronjs.org/docs/latest/api/extensions#supported-extensions-apis)
