/**
* Tip:    devServer的配置
* Author: haoluo
* Data:   2020-02-25
* Tips:   使用以下命令启动各环境配置,npm run dev [dev|test|release]
**/

let envList = ['dev', 'test', 'release'];
let currentEnv = 'release';
let envArg = process.argv[2];

if (envArg && envList.includes(envArg)) {
    currentEnv = envArg;
}
//导出服务配置
module.exports = {
    url: '127.0.0.1',
    port: 8098,
    // 运行环境
    currentEnv: currentEnv,
    // 调试完打开浏览器
    devComplateOpened: true
};