export default function(eventDateEnd, eventDateStart) {
	const endHour =
		eventDateEnd.getHours() != 0
			? eventDateEnd.getHours()
			: "0" + eventDateEnd.getHours();
	const endMinutes =
		`${eventDateEnd.getMinutes()}`.length == 2
			? eventDateEnd.getMinutes()
			: "0" + eventDateEnd.getMinutes();

	const startHour =
		eventDateStart.getHours() != 0
			? eventDateStart.getHours()
			: "0" + eventDateStart.getHours();
	const startMinutes =
		`${eventDateStart.getMinutes()}`.length == 2
			? eventDateStart.getMinutes()
			: "0" + eventDateStart.getMinutes();

	return {
		startHour,
		startMinutes,
		endHour,
		endMinutes,
	};
}
