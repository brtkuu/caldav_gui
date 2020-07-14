const fs = require("fs");
const util = require("util");
const pathExists = util.promisify(fs.exists);
const unlink = util.promisify(fs.unlink);

async function deleteEvent(calDirs, file) {
	for (ele of calDirs.collections) {
		const exists = await pathExists(`${calDirs.path}${ele}/${file}.ics`);
		if (exists) {
			const deleted = await unlink(`${calDirs.path}${ele}/${file}.ics`);
			return deleted;
		}
	}
}
module.exports = deleteEvent;
