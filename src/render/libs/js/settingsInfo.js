// electron-settings浅封装
const settings = require('electron-settings');
const version = require("@config/version.js");

// 系统名（electron-vue-template） + 环境
const APP_NAME = 'electron-vue-template';
const settingsInfo = `${APP_NAME}.${version.versionType}`;

/**
 * 对象里面是否有这个属性
 * @param {String} obj 
 * @param {String} key 属性
 * @return {Boolean} 
 */
function hasKey(obj, key) {
    return settings.has(`${settingsInfo}.${obj}.${key}`);
}

/**
 * 对象里面获取这个属性的值
 * @param {String} obj 
 * @param {String} key 属性
 */
function getVal(obj, key) {
    return settings.get(`${settingsInfo}.${obj}.${key}`);
}

/**
 * 设置对象里面的属性的值
 * @param {String} obj 
 * @param {String} key 属性
 * @param {String} val 值
 */
function setVal(obj, key, val) {
    settings.set(`${settingsInfo}.${obj}.${key}`, val);
}

module.exports = {
    hasKey,
    getVal,
    setVal
}