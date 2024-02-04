const console = require('console');

function prepare(color, ...logs) {
    const aLogs = [];
    for (let iter = 0; iter < logs.length; iter += 1) {
        aLogs.push(`\x1b${color}`);
        aLogs.push(typeof logs[iter] === 'object' ? JSON.stringify(logs[iter], null, 2) : logs[iter]);
    }
    aLogs.push('\x1b[0m');
    console.log(...aLogs);
}

console.black = (...logs) => prepare('[30m', ...logs);
console.red = (...logs) => prepare('[31m', ...logs);
console.green = (...logs) => prepare('[32m', ...logs);
console.yellow = (...logs) => prepare('[33m', ...logs);
console.blue = (...logs) => prepare('[34m', ...logs);
console.magenta = (...logs) => prepare('[35m', ...logs);
console.cyan = (...logs) => prepare('[36m', ...logs);
console.white = (...logs) => prepare('[37m', ...logs);

module.exports = console;
