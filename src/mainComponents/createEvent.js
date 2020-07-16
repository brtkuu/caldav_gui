const fs = require("fs");
const createEventDate = require("./createEventDates");

module.exports = function(data, calDirs, ID) {
	const startDate = createEventDate(data.start, data.allDay);
	console.log(data);

	const endDate = createEventDate(data.end, data.allDay);

	let freq = data.freq ? `\nRRULE:FREQ=${data.freq}` : "";
	freq += data.interval ? `;INTERVAL=${data.interval}` : "";
	freq += +data.count ? `;COUNT=${data.count}` : "";
	console.log(freq);
	const newEvent = `BEGIN:VCALENDAR\nPRODID:-//Nextcloud calendar v1.6.5\nVERSION:2.0\nCALSCALE:GREGORIAN\nBEGIN:VEVENT\nUID:${ID}\nSUMMARY:${
		data.title
	}\nDESCRIPTION:${data.description}\nLOCATION:${
		data.location
	}\nCLASS:PUBLIC\nSTATUS:${
		data.status
	}\nDTSTART;${startDate}\nDTEND;${endDate}${freq}\nEND:VEVENT\nEND:VCALENDAR`;

	fs.writeFile(
		`${calDirs.path}/${data.collection}/${ID}.ics`,
		newEvent,
		(err) => {
			if (err) {
				throw err;
			}
		}
	);
};
