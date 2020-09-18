const util = require('util');
const exec = util.promisify(require("child_process").exec);

async function syncCalendar(confPath) {
    try {
        await exec(`vdirsyncer -c ${confPath} sync`);
    } catch (err) {
        console.log("Can't sync calendar");
        throw err;
    }
}
module.exports = syncCalendar;
