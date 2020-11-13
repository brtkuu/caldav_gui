<template>
  <div class="dayContainer">
    <date-display class="dateDisplay"></date-display>
    <div class="hoursTable">
      <div @dblclick="openAddView()" class="hourDiv"></div>
    </div>
    <add-event v-if="this.$store.state.modals.addEventModal" class="addEvent"></add-event>
    <event-info
      class="eventInfo"
      v-if="this.$store.state.modals.eventInfoModal && clickedEvent"
      v-bind:event="this.clickedEvent"
    ></event-info>
	<update-event class="updateEvent" v-if="this.$store.state.modals.updateEventModal"  v-bind:event='clickedEvent'></update-event>
  </div>
</template>
<script>
import DateDisplay from "../components/dateDisplay";
import EventModal from "../components/eventModal";
import AddEvent from "../components/addEvent";
import UpdateEvent from "../components/updateEvent";

export default {
	name: "DayView",
	components: {
		"date-display": DateDisplay,
		"event-info": EventModal,
		"add-event": AddEvent,
		"update-event": UpdateEvent,
	},
	date() {
		return {
			clickedEvent: false,
		};
	},
	methods: {
		writeHours() {
			const hoursRows = 25; // number of hours + one for all_day_events
			for (let i = -1; i < hoursRows; i++) {
				const hourLabelFull = document.createElement("p");
				const hoursTable = document.querySelector(".hoursTable");
				hourLabelFull.classList.add("hourLabel");
				if (i == -1) {
					hourLabelFull.textContent = `All Day`;
					hourLabelFull.classList.add("alldayHour");
				} else {
					hourLabelFull.textContent = `${i}:00`;
					hourLabelFull.style.gridColumn = "1/2";
				}
				hoursTable.appendChild(hourLabelFull);
			}
		},
		displayEvents() {
			const d = new Date(
				`${this.$store.state.currentYear} ${this.$store.state
					.currentMonth + 1}, ${this.$store.state.clickedDate}`
			);
			this.$store.state.events.forEach((ele, index) => {
				let offSetEle = 0;
				const event = this.createEvent(ele, d);
				if (event) {
					event.id = index;
					event.addEventListener('click', () => {
						this.clickedEvent = this.$store.state.events[index];
						this.$store.commit("toggleInfoEventView");
					} )
					const hours = new Date(ele.start).getHours() + 1;
					const minutes = new Date(ele.start).getMinutes();
					const durationHours =
						new Date(ele.end).getHours() -
						new Date(ele.start).getHours();
					const durationMinutes =
						new Date(ele.end).getMinutes() -
						new Date(ele.start).getMinutes();
					let topOffset = hours * 30 + minutes * 0.5 + 30;
					const duration = durationHours * 30 + durationMinutes * 0.5;
					if (!duration) {
						event.classList.add("allDayEvent");
						topOffset = 0;
					}
					event.style.top = `${topOffset}px`;
					const offSetsArr = document.querySelectorAll(
						".eventDayLabel"
					);

					offSetsArr.forEach((ele) => {
						if (
							topOffset >= ele.offsetTop &&
							topOffset <= ele.offsetTop + ele.clientHeight
						) {
							offSetEle++;
							event.style.left = duration
								? `${315 * offSetEle}px`
								: "0";
						}
					});

					event.style.height = `${duration ? duration : 40}px`;
					event.style.lineHeight = duration
						? `${durationHours * 30 + durationMinutes * 0.5}px`
						: 40 + "px";

					document.querySelector(".hourDiv").appendChild(event);
				}
			});
		},
		createEvent(ele, d) {
			const eventDateStart = new Date(ele.start);
			const eventDateEnd = new Date(ele.end);
			if (this.$isDate(ele, d)) {
				const eventLabel = document.createElement("p");
				const dates = this.$setDates(eventDateEnd, eventDateStart);

				eventLabel.innerHTML = `${
					dates.startHour &&
					dates.startMinutes &&
					(dates.startHour != dates.endHour ||
						dates.startMinutes != dates.endMinutes)
						? dates.startHour +
						  ":" +
						  dates.startMinutes +
						  "-" +
						  dates.endHour +
						  ":" +
						  dates.endMinutes
						: ""
				} ${ele.summary}`;
				eventLabel.classList.add("eventDayLabel");
				return eventLabel;
			}
			return null;
		},
		openAddView() {
			this.$store.commit("toggleAddEventView");
		},
	},
	mounted() {
		this.writeHours();
		this.displayEvents();
	},
};
</script>
<style >
.hoursTable {
	display: grid;
	grid-template-columns: 60px 1fr;
	grid-template-rows: 60px repeat(23, 30px);
}
.hourDiv {
	position: relative;
	display: block;
	grid-column: 2/3;
	grid-row: 1/24;
}
.hourLabel {
	text-align: center;
	border-top: 1px solid white;
	background-color: RGB(101, 57, 124);
	color: white;
	line-height: 30px;
	font-size: 10px;
}
.eventDayLabel {
	position: absolute;
	display: inline-block;
	color: white;
	background-color: rgba(103, 67, 112, 0.753);
	margin-left: 30px;
	font-size: 16px;
	overflow: hidden;
	width: 320px;
	text-align: center;
	padding: 0 5px 0 5px;
	transition: background-color 0.4s, font-size 0.4s;
	border: 1px solid black;

	line-height: 60px;
}
.eventDayLabel:hover {
	cursor: pointer;
	font-size: 26px;
	background-color: rgb(103, 67, 112);
	z-index: 1;
}
.eventInfo {
	position: fixed;
}
.addEvent {
	position: fixed;
}
.allDayEvent {
	position: relative;
	display: inline-block;
	line-height: 40px;
	height: 6 0px;
	width: 200px;
	margin: 10px 10px 0 10px;
}
.alldayHour {
	line-height: 40px;
}
.updateEvent {
	position: fixed;
	top: 50%;
}
</style>
