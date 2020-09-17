export default {
    //设置用户信息
    setUserInfo(state, userInfo) {
        if (!userInfo) {
            state.userInfo = {};
        }
        for (let key in userInfo) {
            state.userInfo[key] = userInfo[key];
        }
    }
}