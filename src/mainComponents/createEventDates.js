function createEventDate(date, allDay) {
	return `${
		allDay
			? `VALUE=DATE:${date[0]}${
					`${date[1]}`.length == 2 ? date[1] : "0" + date[1]
			  }${`${date[2]}`.length == 2 ? date[2] : "0" + date[2]}`
			: `TZID=Europe/Warsaw:${date[0]}${
					`${date[1]}`.length == 2 ? date[1] : "0" + date[1]
			  }${`${date[2]}`.length == 2 ? date[2] : "0" + date[2]}T${
					`${date[3]}`.length == 2 ? date[3] : "0" + date[3]
			  }${`${date[4]}`.length == 2 ? date[4] : "0" + date[4]}00`
	}`;
}

module.exports = createEventDate;
