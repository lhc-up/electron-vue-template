const { devServerConfig, hostMap } = require('./devServerConfig');
const { PLATFORM, PROXY_ENV } = process.env;
module.exports = {
    version: [1, 0, 0],
    context: {
        api: `${PLATFORM === 'electron' ? hostMap[PROXY_ENV] : ''}/api`,
        page: '/page'
    },
    hostMap,
    devServer: devServerConfig
}