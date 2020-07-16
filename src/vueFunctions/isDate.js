import range from "./inRange";

export default function(ele, d) {
	const eventDateStart = new Date(ele.start);
	const inRange = range(ele, eventDateStart, d);
	return (
		(eventDateStart.getDate() == d.getDate() &&
			eventDateStart.getMonth() == d.getMonth() &&
			eventDateStart.getFullYear() == d.getFullYear() &&
			inRange) ||
		(ele.rrule == "WEEKLY" &&
			eventDateStart.getTime() < d.getTime() &&
			d.getDay() == eventDateStart.getDay() &&
			inRange) ||
		(ele.rrule == "DAILY" &&
			eventDateStart.getTime() < d.getTime() &&
			inRange) ||
		(ele.rrule == "MONTHLY" &&
			eventDateStart.getTime() < d.getTime() &&
			eventDateStart.getDate() == d.getDate() &&
			inRange) ||
		(ele.rrule == "YEARLY" &&
			eventDateStart.getTime() < d.getTime() &&
			eventDateStart.getFullYear() < d.getFullYear() &&
			eventDateStart.getDate() == d.getDate() &&
			eventDateStart.getMonth() == d.getMonth() &&
			inRange)
	);
}
