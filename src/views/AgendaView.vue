<template>
	<div class="agendaContainer">
		<date-display v-on:show="displayEvents()"></date-display>
	<div class="agendaBody">
		<ul @click="clickEvent" class="eventsList">
		</ul>
	</div>
    <button class="addEventBtn" @click="openAddView">Add Event</button>
	<transition name="fade" mode="out-in" :duration="350">
	<add-event v-if="this.$store.state.modals.addEventModal" class="addEvent"></add-event>
	<event-info class="eventInfo" v-if="this.$store.state.modals.eventInfoModal" v-bind:event='clickedEvent'></event-info>
	</transition>
  </div>
</template>
<script>
import AddEvent from "../components/addEvent";
import EventModal from "../components/eventModal";
import DateDisplay from "../components/dateDisplay";

export default {
	name: "AgendaView",
	components: {
		"add-event": AddEvent,
		"event-info": EventModal,
		"date-display": DateDisplay,
	},
	data() {
		return {
			clickedEvent: undefined,
		};
	},
	methods: {
		displayEvents() {
			document.querySelector(".eventsList").innerHTML = "";
			const d = new Date(
				`${this.$store.state.currentYear} ${this.$store.state
					.currentMonth + 1}, ${this.$store.state.clickedDate}`
			);
			this.$store.state.events.forEach((ele, index) => {
				const event = this.createEvent(ele, d);
				if (event) {
					event.id = index;
					document.querySelector(".eventsList").appendChild(event);
				}
			});
		},
		openAddView() {
			this.$store.commit("openAddEventView");
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
				const eventLabel = document.createElement("li");
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
						? startHour + ":" + startMinutes
						: ""
				} ${ele.summary}`;
				eventLabel.classList.add("eventListLabel");
				return eventLabel;
			}
			return null;
		},
		clickEvent() {
			this.clickedEvent = this.$store.state.events[event.target.id];
			this.$store.commit("openInfoEventView");
		},
	},
	mounted() {
		if (this.$store.state.clickedDate == undefined) {
			this.$store.state.clickedDate = new Date().getDate();
		}
		this.displayEvents();
	},
};
</script>
<style>
.agendaHeader {
	text-align: center;
	font-size: 50px;
	background-color: RGB(139, 186, 196);
	color: white;
}
.agendaNav {
	display: flex;
	justify-content: space-between;
}
.agendaNavBtn {
	margin: 10px;
	font-size: 14px;
}
.addEvent {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 1;
	font-size: 25px;
}
.addEventBtn {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	z-index: 1;
	font-size: 25px;
	margin-top: 20px;
}
.eventsList {
	list-style: none;
	align-items: center;
}
.eventListLabel {
	height: 40px;
	margin: 20px auto 10px auto;
	text-align: center;
	font-size: 20px;
	width: 400px;
	transition: font-size 0.2s ease-in-out;
	overflow: hidden;
	background-color: RGB(103, 67, 112);
	color: white;
	border-radius: 40px;
	line-height: 40px;
}
.eventListLabel:hover {
	font-size: 35px;
	cursor: pointer;
}
.eventInfo {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 1;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}
</style>
