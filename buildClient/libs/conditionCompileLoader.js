/**
 * by: haoluo 2020年08月11日
 * name: 条件编译webpack loader
 * notes: 条件编译，而不是条件执行！匹配标识必须成对出现，不支持嵌套
*/

// 使用方式：(ELECTRON需要在引入loader时配置)
/* IF_ELECTRON */
// I am run in Electron mode
/* END_IF_ELECTRON */

const loaderUtils = require('loader-utils');

module.exports = function(source) {
    // 读取配置
    const { conditions={} } = loaderUtils.getOptions(this);

    return replacer(source, conditions);
};

// 替换
function replacer(source, conditions) {
    // \/\*+\s*IF_(\w+)(?:\s*\*+\/)：匹配：/* IF_condition */，condition类似的条件是可配置的，捕获一下，便于使用
    // ([\s\S]+?)：匹配符合条件的代码
    // (?:\/\*+\s*)END_IF_\1\s*\*+\/：匹配：/* END_IF_condition */，\1引用前面捕获到的condition
    const reg = /\/\*+\s*IF_(\w+)(?:\s*\*+\/)([\s\S]+?)(?:\/\*+\s*)END_IF_\1\s*\*+\//g;
    return source.replace(reg, (match, $1, $2) => {
        // $1为匹配到的condition，配置中如果存在则取配置中的值，否则默认为false
        // $2为符合条件的代码（不包含外面的条件）
        // condition的值为true时表示符合条件，显示匹配的代码；否则，把符合条件的代码替换为''
        return !!conditions[$1] ? $2 : '';
    });
}