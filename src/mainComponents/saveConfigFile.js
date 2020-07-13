const os = require("os");
const fs = require("fs");

function saveConfigFile(configFile) {
	return new Promise((resolve, reject) => {
		fs.writeFile(
			`${os.homedir()}/.config/sealcal/config.txt`,
			configFile,
			(err) => {
				if (err) {
					throw err;
				}
				confPath = configFile;
				resolve(configFile);
			}
		);
	});
}

module.exports = saveConfigFile;
