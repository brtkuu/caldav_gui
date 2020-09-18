const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function discoverCal(confPath) {
	try {
		await exec(`vdirsyncer -c ${confPath} discover`);
	} catch (err) {
		console.log("Can't discover calendar");
		throw err;
	}
}

module.exports = discoverCal;
