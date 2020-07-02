<template>
  <div class="dayContainer">
    <div class="dayNav">
      <button class="dayNavBtn" @click="previewDay">BACK</button>
      <button class="dayNavBtn" @click="nextDay">NEXT</button>
    </div>
    <p class="dayHeader">
      {{ this.$store.state.clickedDate != undefined
      ? this.$store.state.clickedDate
      : this.$store.state.today.getDate() }}
      {{ this.$store.state.months[this.$store.state.currentMonth] }} {{ this.$store.state.currentYear }}
    </p>
	<div class="dayBody">
		<ul @click="clickEvent" class="eventsList"></ul>
	</div>
    <button class="addEvent" @click="openAddView">Add Event</button>
    <add-event v-if="this.$store.state.modals.addEventModal" class="addEvent"></add-event>
	<event-info class="eventInfo" v-if="this.$store.state.modals.eventInfoModal" v-bind:event='clickedEvent'></event-info>

  </div>
</template>
<script>
import AddEvent from "../components/addEvent";
import EventModal from "../components/eventModal";

export default {
	name: "DayView",
	components: {
		"add-event": AddEvent,
		"event-info": EventModal,
	},
	data() {
		return {
			clickedEvent: undefined,
		};
	},
	methods: {
		displayEvents() {
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
		nextDay() {
			if (this.$store.state.clickedDate == undefined) {
				this.$store.state.clickedDate = this.$store.state.today.getDate();
			}
			this.$store.commit("incrementClkDay");
			document.querySelector(".eventsList").innerHTML = "";
			this.displayEvents();
		},
		previewDay() {
			if (this.$store.state.clickedDate == undefined) {
				this.$store.state.clickedDate = this.$store.state.today.getDate();
			}
			this.$store.commit("decrementClkDay");
			document.querySelector(".eventsList").innerHTML = "";
			this.displayEvents();
		},
		openAddView() {
			this.$store.commit("openAddEventView");
		},
		createEvent(ele, d) {
			const eventDateStart = new Date(ele.start);
			const eventDateEnd = new Date(ele.end);
			console.log(eventDateStart);
			if (
				eventDateStart.getDate() == d.getDate() &&
				eventDateStart.getMonth() == d.getMonth() &&
				eventDateStart.getFullYear() == d.getFullYear()
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
.dayHeader {
	text-align: center;
	font-size: 50px;
}
.dayNav {
	display: flex;
	justify-content: space-between;
}
.dayNavBtn {
	margin: 10px;
	font-size: 14px;
}
.addEvent {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 1;
}
.eventsList {
	list-style: none;
	align-items: center;
}
.eventListLabel {
	height: 40px;
	margin: 20px auto 10px auto;
	text-align: center;
	font-size: 30px;
	width: 400px;
	border-bottom: 3px solid;
	transition: font-size 0.2s ease-in-out, box-shadow 0.1s ease-in-out;
	overflow: hidden;
}
.eventListLabel:hover {
	font-size: 35px;
	cursor: pointer;
	box-shadow: -1px 12px 8px -5px rgba(179, 179, 179, 1);
}
.eventInfo {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 1;
}
</style>
