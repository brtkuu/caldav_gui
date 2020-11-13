<template>
  <div class="eventInfoContainer">
    <h1 id="" class="eventTitle">{{event.summary}}</h1>
    <p class="infoLabel">Duration: {{duration}}</p>
    <p class="infoLabel">Desctiption: {{event.description}}</p>
    <p class="infoLabel">Location: {{event.location}}</p>
    <p class="infoLabel">Status: {{event.status}}</p>
    <div @click="closeEventInfo" class="closeInfo"></div>
    <div :id="event.uid" @click="deleteEvent" class="deleteEvent">Delete</div>
	<div @click="updateEvent" class="updateEvent">Edit</div>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";

export default {
	name: "EventModal",
	props: ["event", "id"],
	data() {
		return {
			startDate: undefined,
			endDate: undefined,
			durationStart: undefined,
			durationEnd: undefined,
			duration: undefined,
			updateEventFlag: false,
		};
	},
	methods: {
		closeEventInfo() {
			this.$store.commit("toggleInfoEventView");
		},
		createDates() {
			this.startDate = new Date(this.event.start);
			this.endDate = new Date(this.event.end);
			this.durationStart = `${
				`${this.startDate.getHours()}`.length == 2
					? this.startDate.getHours()
					: "0" + this.startDate.getHours()
			}:${
				`${this.startDate.getMinutes()}`.length == 2
					? this.startDate.getMinutes()
					: "0" + this.startDate.getMinutes()
			}`;

			this.durationEnd = `${
				`${this.endDate.getHours()}`.length == 2
					? this.endDate.getHours()
					: "0" + this.endDate.getHours()
			}:${
				`${this.endDate.getMinutes()}`.length == 2
					? this.endDate.getMinutes()
					: "0" + this.endDate.getMinutes()
			}`;

			this.duration =
				this.durationStart != this.durationEnd
					? `${this.durationStart} - ${this.durationEnd}`
					: "All day";
		},
		deleteEvent() {
			ipcRenderer.send("deleteEvent", event.target.id);
			ipcRenderer.once("item-deleted", (event, data) => {
				ipcRenderer.send("get-data");
			});
		},
		updateEvent() {
			this.$store.commit("toggleInfoEventView");
			this.$store.commit("changeUpdateView");
		},
	},
	mounted() {
		console.log(this.$store.state.modals.eventInfoModal);
		this.createDates();	
	},
};
</script>
<style scoped>
.deleteEvent {
	position: absolute;
	top: 90%;
	height: 30px;
	width: 60px;
	background-color: rgb(235, 37, 37);
	border: 2px solid;
	border-radius: 20px;
	left: 50%;
	transform: translateX(-50%);
	text-align: center;
	line-height: 30px;
}
.deleteEvent:hover {
	cursor: pointer;
	background-color: rgb(194, 24, 24);
}
.eventInfoContainer {
	height: 400px;
	width: 400px;
	background-color: white;
	border: 1px solid;
}
.eventTitle {
	text-align: center;
	margin-top: 40px;
}
.infoLabel {
	text-align: center;
	font-size: 20px;
	margin: 10px 0 10px 0;
}
.closeInfo {
	position: absolute;
	right: 10px;
	top: 10px;
	width: 32px;
	height: 32px;
	opacity: 0.3;
}
.closeInfo:hover {
	opacity: 1;
}
.closeInfo:before,
.closeInfo:after {
	position: absolute;
	left: 15px;
	content: " ";
	height: 33px;
	width: 2px;
	background-color: #333;
}
.closeInfo:before {
	transform: rotate(45deg);
}
.closeInfo:after {
	transform: rotate(-45deg);
}
.updateEvent {
	position: absolute;
	top: 75%;
	height: 30px;
	width: 60px;
	background-color: green;
	border: 2px solid;
	border-radius: 20px;
	left: 50%;
	transform: translateX(-50%);
	text-align: center;
	line-height: 30px;
}
.updateEvent:hover {
	cursor: pointer;
}
</style>
