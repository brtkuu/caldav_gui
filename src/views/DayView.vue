<template>
  <div class="dayContainer">
    <date-display class="dateDisplay"></date-display>
    <div class="hoursTable">
		<div @click="clickEvent" @dblclick="openAddView" class="hourDiv"></div>
	</div>
		<add-event v-if="this.$store.state.modals.addEventModal" class="addEvent"></add-event>
		<event-info class="eventInfo" v-if="this.$store.state.modals.eventInfoModal" v-bind:event='clickedEvent'></event-info>
  </div>
</template>
<script>
import DateDisplay from "../components/dateDisplay";
import EventModal from "../components/eventModal";
import AddEvent from "../components/addEvent";

export default {
	name: "DayView",
	components: {
		"date-display": DateDisplay,
		"event-info": EventModal,
		"add-event": AddEvent,
	},
	date() {
		return {
			clickedEvent: undefined,
		};
	},
	methods: {
		writeHours() {
			for (let i = -1; i < 25; i++) {
				const hourLabelFull = document.createElement("p");
				const hoursTable = document.querySelector(".hoursTable");
				hourLabelFull.classList.add("hourLabel");
				if (i == -1) {
					hourLabelFull.innerHTML = `All Day`;
				} else {
					hourLabelFull.innerHTML = `${i}:00`;
				}
				hourLabelFull.style.gridColumn = "1/2";
				hoursTable.appendChild(hourLabelFull);
			}
		},
		displayEvents() {
			const d = new Date(
				`${this.$store.state.currentYear} ${this.$store.state
					.currentMonth + 1}, ${this.$store.state.clickedDate}`
			);
			this.$store.state.events.forEach((ele, index) => {
				const event = this.createEvent(ele, d);
				if (event) {
					event.id = index;
					const hours = new Date(ele.start).getHours();
					const minutes = new Date(ele.start).getMinutes();
					const durationHours =
						new Date(ele.end).getHours() -
						new Date(ele.start).getHours();
					const durationMinutes =
						new Date(ele.end).getMinutes() -
						new Date(ele.start).getMinutes();
					const topOffset = hours * 80 + minutes * 1.34;
					const duration =
						durationHours * 80 + durationMinutes * 1.34;
					event.style.top = `${topOffset + (duration ? 80 : 0)}px`;
					const offSetsArr = document.querySelectorAll(
						".eventDayLabel"
					);
					offSetsArr.forEach((ele) => {
						if (
							topOffset >= ele.offsetTop &&
							topOffset <= ele.offsetTop + ele.clientHeight
						) {
							event.style.left = duration ? "315px" : "0";
						}
					});
					if (duration) {
						event.style.height = `${duration}px`;
						event.style.lineHeight = `${durationHours * 80 +
							durationMinutes * 1.34}px`;
					} else {
						event.classList.add("allDayEvent");
					}
					document.querySelector(".hourDiv").appendChild(event);
				}
			});
		},
		createEvent(ele, d) {
			const eventDateStart = new Date(ele.start);
			const eventDateEnd = new Date(ele.end);
			if (
				(eventDateStart.getDate() == d.getDate() &&
					eventDateStart.getMonth() == d.getMonth() &&
					eventDateStart.getFullYear() == d.getFullYear()) ||
				(ele.rrule == "WEEKLY" &&
					eventDateStart.getTime() < d.getTime() &&
					d.getDay() == eventDateStart.getDay()) ||
				(ele.rrule == "DAILY" &&
					eventDateStart.getTime() < d.getTime()) ||
				(ele.rrule == "MONTHLY" &&
					eventDateStart.getTime() < d.getTime() &&
					eventDateStart.getDate() == d.getDate()) ||
				(ele.rrule == "YEARLY" &&
					eventDateStart.getTime() < d.getTime() &&
					eventDateStart.getFullYear() < d.getFullYear() &&
					eventDateStart.getDate() == d.getDate() &&
					eventDateStart.getMonth() == d.getMonth())
			) {
				const eventLabel = document.createElement("p");
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

				eventLabel.innerHTML = `${
					startHour &&
					startMinutes &&
					(startHour != endHour || startMinutes != endMinutes)
						? startHour +
						  ":" +
						  startMinutes +
						  "-" +
						  endHour +
						  ":" +
						  endMinutes
						: ""
				} ${ele.summary}`;
				eventLabel.classList.add("eventDayLabel");
				return eventLabel;
			}
			return null;
		},
		clickEvent() {
			if (event.target.id) {
				console.log("click");
				this.clickedEvent = this.$store.state.events[event.target.id];
				this.$store.commit("openInfoEventView");
			}
		},
		openAddView() {
			this.$store.commit("openAddEventView");
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
	grid-template-columns: 80px 1fr;
	grid-template-rows: repeat(24, 80px);
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
	line-height: 80px;
	font-size: 18px;
}
.eventDayLabel {
	position: absolute;
	/* width: 250px; */
	background-color: rgba(103, 67, 112, 0.753);
	margin-left: 30px;
	font-size: 24px;
	overflow: hidden;
	width: 320px;
	text-align: center;
	padding: 0 5px 0 5px;
	transition: background-color 0.4s, font-size 0.4s;
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
	line-height: 50px;
	height: 6 0px;
	width: 200px;
	margin: 10px 10px 0 10px;
}
</style>
