const util = require('util');
const exec = util.promisify(require("child_process").exec);

async function syncCalendar(confPath) {
    const {
        stdout,
        stderr
    } = await exec(`vdirsyncer -c ${confPath} sync`);
}
module.exports = syncCalendar;