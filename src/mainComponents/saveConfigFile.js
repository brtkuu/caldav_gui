const os = require("os");
const fs = require("fs");

function saveConfigFile(configFile) {
	return new Promise((resolve, reject) => {
		fs.writeFile(
			`${os.homedir()}/.config/sealcal/config.txt`,
			configFile, {
				flag: "w"
			},
			(err) => {
				if (err) {
					console.log(err);
					throw err;
				}
				resolve(configFile);
			}
		);
	});
}

module.exports = saveConfigFile;