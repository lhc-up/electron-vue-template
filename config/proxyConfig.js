/**
* Tip:    代理配置
* Author: haoluo
* Data:   2020-02-25
* Tips:
* 1、服务端各环境地址在serverUrl中配置
* 2、需要代理的接口地址添加到proxyPath中，以数组形式，后端未统一上下文的情况下比较有用，比如接口地址既有/api开头，又有/sys开头的
**/

// 各环境后端服务地址
const serverUrl = {
    // 开发环境
    dev: 'http://backend.dev.com:8088',
    // 测试环境
    test: 'http://backend.test.com',
    // 正式环境
    release: 'https://backend.release.com'
}

// 需要代理的请求路径
const proxyPath = ['/api/', '/sys/'];

// 各环境对应的代理配置
const proxyMap = {
    // 最终结果
    // 'dev|test|release': {
    //     '/api/': {
    //         target: serverUrl.dev|test|release,
    //         secure: false,
    //         changeOrigin: true
    //     },
    //     '/api/sys/': {target: serverUrl.dev|test|release}
    // }
}
Object.keys(serverUrl).forEach(env => {
    // env环境代理信息
    proxyMap[env] = {};
    proxyPath.forEach(pathItem => {
        proxyMap[env][pathItem] = {
            target: serverUrl[env],
            secure: false,
            changeOrigin: true
        }
    });
});

module.exports = { proxyMap, serverUrl };