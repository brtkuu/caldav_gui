const fs = require("fs");
const util = require("util");
const pathExists = util.promisify(fs.exists);
const unlink = util.promisify(fs.unlink);

function deleteEvent(calDirs, file) {
	calDirs.collections.forEach(async (ele) => {
		const exists = await pathExists(`${calDirs.path}/${ele}/${file}.ics`);
		if (exists) {
			await unlink(`${calDirs.path}/${ele}/${file}.ics`);
		} else {
		}
	});
}
module.exports = deleteEvent;
