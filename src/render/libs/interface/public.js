/*
    by: tengma 2018年07月27日
    name: 公共接口
*/
var context =require('./context.js');
let publicUrl = {
    getCaptcha: context.api +  "/sys/captcha.jpg",//获取验证码3.0
    getUser: context.api + '/sys/getUserInfo', //获取用户信息3.0
    loginUrl: context.api + '/sys/login', //登录3.0
    logOut: context.api + '/sys/logout', //登出3.0
    addLog: context.api + '/operator/addLog', //添加日志3.0
    getUpdateUrl:context.name + '/update/update.json' //检测更新3.0
};

export default publicUrl;
