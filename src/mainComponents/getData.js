const fs = require("fs");
const util = require("util");
const os = require("os");

const ical = require("ical");

const readdir = util.promisify(fs.readdir);

const readfile = util.promisify(fs.readFile);

const fromEntries = require("fromentries");

async function getData(calDirs) {
	const events = [];
	for (const ele of calDirs.collections) {
		const names = await readdir(`${calDirs.path}/${ele}`);
		if (names === undefined) {
			console.log("undefined");
			return;
		}
		for (const file of names) {
			events.push(await createObject(calDirs, ele, file));
		}
	}
	return events;
}
async function createObject(calDirs, ele, file) {
	let data = ical.parseFile(`${calDirs.path}/${ele}/${file}`);
	if (data[Object.keys(data)[0]].rrule) {
		let res = await readfile(`${calDirs.path}/${ele}/${file}`, {
			encoding: "utf-8",
		});
		res = res.slice(0, 400);
		const fileData = fromEntries(
			res.split("\n").map((line) => line.split(":"))
		);
		const frequency = fileData.RRULE.split(/=|;/g);
		data[Object.keys(data)[0]].rrule = frequency[1];
		if (frequency[2] == "COUNT") {
			data[Object.keys(data)[0]].count = frequency[3];
			data[Object.keys(data)[0]].interval = frequency[5];
		}
		if (frequency[2] == "INTERVAL") {
			data[Object.keys(data)[0]].interval = frequency[3];
			data[Object.keys(data)[0]].count = frequency[5];
		}

		// if (frequency[2] == "INTERVAL" || ) {
		// 	Object.assign(data[Object.keys(data)[0]], {
		// 		interval: frequency[3]
		// 	});
		// }
	}
	return new Promise((resolve, rejects) => {
		resolve(data[Object.keys(data)[0]]);
	});
}
module.exports = getData;
