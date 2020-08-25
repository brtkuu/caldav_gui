const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function discoverCal(confPath) {
	const {
		stdout,
		stderr
	} = await exec(`vdirsyncer -c ${confPath} discover`);
}

module.exports = discoverCal;