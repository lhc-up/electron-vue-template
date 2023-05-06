/**
 * devServer相关配置
 */
const hostMap = {
    dev: 'https://dev.server.com:8088',
    test: 'https://test.server.com',
    release: 'https://server.com'
}

const proxyPath = ['/api/', '/sys/'];

const proxyMap = {};
Object.keys(hostMap).forEach(env => {
    proxyMap[env] = {};
    proxyPath.forEach(prefix => {
        const target = hostMap[env];
        proxyMap[env][prefix] = {
            target,
            secure: false,
            changeOrigin: true,
            headers: {
                Referer: target
            }
        }
    });
});

// 导出服务配置
module.exports = {
    devServerConfig: {
        host: '127.0.0.1',
        port: 8888,
        openBrowserAfterComplete: true,
        proxy: proxyMap[process.env.PROXY_ENV]
    },
    hostMap
}