const chalk = require('chalk');
module.exports = {
    runTime(val) {
        console.log(
            chalk.black.bgYellow('当前环境为：')
            + chalk.yellow.bgRed.bold(val)
            + chalk.black.bgYellow('环境'));
    }
}