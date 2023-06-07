# electron-vue-template

**1、一套代码同时构建web端和客户端，提升开发效率；**  
**2、总结、实现桌面端特有需求，构建媲美原生应用的客户端。注意：需做好web代码和客户端代码的隔离。**

- [x] 区分客户端和web端
- [x] 检查更新
- [ ] 录音
- [ ] 全局异常捕获，崩溃日志、上报
- [ ] auto-updater
- [ ] 多窗口
- [ ] 原生模块、dll
- [x] chrome插件
- [ ] 主进程断点调试
- [ ] 单实例检查，同时只能启动一个客户端
- [x] 注册全局快捷键，打开调试窗口
- [ ] 主进程代码加密
- [ ] 注册自定义协议，web端唤醒，传递参数
- [ ] 分阶段打包，生成免安装程序、构建exe
- [ ] 自定义nsis脚本
- [ ] 按条件编译
- [ ] 根据png格式的logo，打包时自动生成.ico或.icns格式的图片
- [ ] 数据库
- [ ] 录屏
- [ ] 共享桌面
- [ ] 不同系统安装包，Windows、Mac、Linux、国产操作系统等
- [ ] Mac新建日程

## 安装依赖

```bash
git clone https://github.com/luohao8023/electron-vue-template.git
cd electron-vue-template
npm install
```

## 本地调试

### 客户端

```bash
npm start
```

start实际执行的命令是 `cross-env NODE_ENV=development PROXY_ENV=dev PLATFORM=electron node ./buildClient/dev.js`，`PROXY_ENV`表示请求的后端服务环境，不同开发阶段，我们可能需要连接到后端服务的不同环境。  
切换环境只需修改`PROXY_ENV`为对应环境的标识即可，具体配置在config文件夹下。

### web端

```bash
npm run start:web
```

## 打包

### 打包客户端

```bash
npm run build
```  

客户端打包产物除了安装包之外，还包含渲染进程的zip压缩包，用于热更新使用。  
根目录的update.json是版本更新配置文件，实际场景可能是从接口获取版本配置。  
updateFiles文件夹中有1.0.0.1小版本文件，可用于模拟自动更新。  
小版本自动更新效果需要打包后才能看到，因为调试环境下，页面访问的始终是本地最新代码。  

### 打包web端

```bash
npm run build:web
```
