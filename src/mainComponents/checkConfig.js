const os = require("os");
const fs = require("fs");
const util = require("util");
const pathExists = util.promisify(fs.exists);

async function checkConfig() {
	const exists = await pathExists(`${os.homedir()}/.config/sealcal`);
	if (!exists) {
		fs.mkdir(`${os.homedir()}/.config/sealcal`, (err) => {
			if (err) {
				throw err;
			}
		});
	}
}
module.exports = checkConfig;
