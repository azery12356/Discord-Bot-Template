const chalk = require("chalk"),
      fs = require("fs");
// Usage: log(<message>:string)
// Simply log in console and in a file
async function log(msg) {
    const string = `[LOG][${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Brussels' })}]    ${msg}`;
    console.log(chalk.grey(string));
    fs.writeFileSync("./logs/logs.log", string + `\n`, { flag: 'a+' });
}
// Usage: warn(<message>:string)
// Send a warning in console and in logs file
async function warn(msg) {
    const string = `[WARN][${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Brussels' })}]    ${msg}`;
    console.log(chalk.yellow(string));
    fs.writeFileSync("./logs/logs.log", string + `\n`, { flag: 'a+' });
}
// Usage: error(<message>:string)
// Throw an error in console and log in file
async function error(msg) {
    const string = `[ERROR][${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Brussels' })}]    ${msg}`;
    console.log(chalk.red(string));
    fs.writeFileSync("./logs/error.log", string + `\n`, { flag: 'a+' });
}

module.exports = { log, warn, error };