import currentWeekNumber from "current-week-number";

export default function (ele, startDate, today) {
	if (!ele.count) {
		return true;
	}
	startDate.setHours(0, 0, 0, 0);
	today.setHours(0, 0, 0, 0);
	const secounds = {
		DAILY: 24,
		WEEKLY: 168,
		MONTHLY: 720,
		YEARLY: 8766,
	};
	const days = (today.getTime() - startDate.getTime()) / 3600000;
	if (!ele.interval) {
		return days >= 0 && days <= ele.count * secounds[ele.rrule];
	}
	const intervals = {
		DAILY: today.getDate() - startDate.getDate(),
		WEEKLY: currentWeekNumber(today) - currentWeekNumber(startDate),
		MONTHLY: today.getMonth() - startDate.getMonth(),
		YEARLY: today.getFullYear() - startDate.getFullYear(),
	};
	const isCorrect = intervals[ele.rrule] % ele.interval == 0;
	return (
		days >= 0 &&
		isCorrect &&
		days < ele.count * secounds[ele.rrule] * ele.interval
	);
}