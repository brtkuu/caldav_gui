<template>
	<div class="agendaContainer">
		<date-display v-on:show="displayEvents()"></date-display>
	<div class="agendaBody">
		<ul @click="clickEvent" ref="eventList" class="eventsList">
		</ul>
	</div>
    <button class="addEventBtn" @click="openAddView">Add Event</button>
	<transition name="fade" mode="out-in" :duration="350">
	<add-event v-if="this.$store.state.modals.addEventModal" class="addEvent"></add-event>
	<event-info class="eventInfo" v-if="this.$store.state.modals.eventInfoModal" v-bind:event='clickedEvent'></event-info>
	</transition>
	<transition name="fade" mode="out-in" :duration="350">
	<update-event class="updateEvent" v-if="this.$store.state.modals.updateEventModal"  v-bind:event='clickedEvent'></update-event>
	</transition>
  </div>
</template>
<script>
import AddEvent from "../components/addEvent";
import EventModal from "../components/eventModal";
import DateDisplay from "../components/dateDisplay";
import UpdateEvent from "../components/updateEvent";

export default {
	name: "AgendaView",
	components: {
		"add-event": AddEvent,
		"event-info": EventModal,
		"date-display": DateDisplay,
		"update-event": UpdateEvent,
	},
	data() {
		return {
			clickedEvent: undefined,
		};
	},
	methods: {
		displayEvents() {
			this.$refs.eventList.textContent = "";
			const d = new Date(
				`${this.$store.state.currentYear} ${this.$store.state
					.currentMonth + 1}, ${this.$store.state.clickedDate}`
			);
			this.$store.state.events.forEach((ele, index) => {
				const event = this.createEvent(ele, d);
				if (event) {
					event.id = index;
					this.$refs.eventList.appendChild(event);
				}
			});
		},
		openAddView() {
			this.$store.commit("toggleAddEventView");
		},
		createEvent(ele, d) {
			const eventDateStart = new Date(ele.start);
			const eventDateEnd = new Date(ele.end);
			if (this.$isDate(ele, d)) {
				const eventLabel = document.createElement("li");
				const dates = this.$setDates(eventDateEnd, eventDateStart);

				eventLabel.innerHTML = `${
					dates.startHour &&
					dates.startMinutes &&
					(dates.startHour != dates.endHour ||
						dates.startMinutes != dates.endMinutes)
						? dates.startHour + ":" + dates.startMinutes
						: ""
				} ${ele.summary}`;
				eventLabel.classList.add("eventListLabel");
				return eventLabel;
			}
			return null;
		},
		clickEvent() {
			this.clickedEvent = this.$store.state.events[event.target.id];
			this.$store.commit("toggleInfoEventView");
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
.updateEvent {
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
