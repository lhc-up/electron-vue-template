# electron-vue-template

### 安装依赖

```bash
git clone https://github.com/luohao8023/electron-vue-template.git
cd electron-vue-template
npm install
```

### 调试客户端

```bash
npm run dev dev
npm run dev test
npm run dev
```

npm run dev是客户端调试命令，最后一位是环境参数，表示需要调试的是哪个环境，  
同时devServer会代理到对应的后端服务，不加环境参数则默认未release环境，具体配置在config文件夹下。

### 调试web端

```bash
npm run devweb dev
npm run devweb test
npm run devweb
```

### 打包客户端

```bash
npm run build
```  

客户端打包产物除了安装包之外，还包含渲染进程的zip压缩包，用于自动更新小版本使用。  
根目录的update.json是版本更新配置文件。  
updateFiles文件夹中有1.0.0.1小版本文件，可用于模拟自动更新。  
小版本自动更新效果需要打包后才能看到，因为调试环境下，页面访问的始终是本地最新代码。  

### 打包web端

```bash
npm run buildweb
```

- [ ] 区分客户端和web端
- [ ] 全局异常捕获，崩溃日志、上报
- [ ] auto-updater
- [ ] 多窗口
- [ ] 原生模块
- [ ] chrome插件
- [ ] 主进程断点调试
- [ ] 单实例检查，同时只能启动一个客户端
- [ ] 注册全局快捷键，打开调试窗口
- [ ] 主进程代码加密
- [ ] 注册自定义协议，web端唤醒，传递参数
- [ ] 分阶段打包，生成免安装程序、构建exe
- [ ] 自定义nsis脚本
