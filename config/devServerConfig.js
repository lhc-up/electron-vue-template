/**
* Tip:    devServer的配置
* Author: haoluo
* Data:   2020-02-25
* Tips:   使用以下命令启动各环境配置,npm run dev [dev|test|release]
**/
const { proxyMap } = require("./proxyConfig.js");
const envList = ["dev", "test", "release"];

// 默认代理到正式环境
let proxy = proxyMap.release;
let currEnv = "release";

// 根据进程参数选择代理地址
envList.forEach(env => {
    if (process.argv.indexOf(env) > 1) {
        currEnv = env;
        proxy = proxyMap[env] || proxy;
    }
});
// 导出服务配置
module.exports = {
    host: '127.0.0.1',
    port: 8098,
    // 当前运行环境
    currEnv,
    // 调试完打开浏览器
    openBrowserAfterComplete: true,
    proxy
};