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
		} else {
			for (const file of names) {
				events.push(await createObject(calDirs, ele, file));
			}
		}
	}
	return events;
}
async function createObject(calDirs, ele, file) {
	const data = ical.parseFile(`${calDirs.path}/${ele}/${file}`);
	if (data[Object.keys(data)[0]].rrule) {
		let res = await readfile(`${calDirs.path}/${ele}/${file}`, {
			encoding: "utf-8",
		});
		res = res.slice(0, 400);
		const fileData = fromEntries(
			res.split("\n").map((line) => line.split(":"))
		);
		const frequency = fileData.RRULE.split("=");
		data[Object.keys(data)[0]].rrule = frequency[1];
	}
	return new Promise((resolve, rejects) => {
		resolve(data[Object.keys(data)[0]]);
	});
}
module.exports = getData;
