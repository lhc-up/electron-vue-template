const { devServerConfig, hostMap } = require('./devServerConfig');
module.exports = {
    version: [1, 0, 0],
    context: {
        api: '/api',
        page: '/page'
    },
    hostMap,
    devServer: devServerConfig
}