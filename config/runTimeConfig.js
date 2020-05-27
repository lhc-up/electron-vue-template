//服务配置
let serverUrl = {
    dev: 'http://12345:808',//开发环境
    show: 'http://55444.1111.cn',//演示环境
    test: 'http://55444.1111.cn',//测试环境
    release: 'http://55444.1111.cn'//正式环境
}
let router = ['/wj/api/', '/wj/supervisor/'];
let server = {
    //最终结果
    /*'dev|show|test|release': {
        '/wj/api/': {target: serverUrl.dev|show|test|release},
        '/wj/update/': {target: serverUrl.dev}
    } */
}
Object.keys(serverUrl).forEach(item => {
    server[item] = {};
    let target = serverUrl[item];
    router.forEach(routerItem => {
        server[item][routerItem] = { target, secure: false, changeOrigin: true }
    });
});
module.exports = { server, serverUrl };