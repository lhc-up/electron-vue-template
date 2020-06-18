# electron-vue-template
###### 安装依赖
`npm install`
###### 调试客户端
`npm run dev dev`
`npm run dev test`
`npm run dev`
npm run dev是客户端调试命令，最后一位是环境参数，表示需要调试的是哪个环境，同时devServer会代理到对应的后端服务，不加环境参数则默认未release环境，具体配置在config文件夹下。
###### 调试web端
`npm run devweb dev`
`npm run devweb test`
`npm run devweb`
###### 打包客户端
`npm run build`
客户端打包产物除了安装包之外，还包含渲染进程的zip压缩包，用于自动更新小版本使用。
###### 打包web端
`npm run buildweb`
