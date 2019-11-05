export default {
    //设置用户信息
    setUserInfo(state, config) {
        if (!config) {
            state.userInfo = {};
        }
        for (var objName in config) {
            state.userInfo[objName] = config[objName];
        }
    }
}