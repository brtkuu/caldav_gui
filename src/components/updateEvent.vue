<template>
<div class="container">
    <form action>
	  <div class="label">
      <label for="title" >Title:</label>
      <input type="text" name="title" id="title" :value="event.summary"/>
      </div>
	  <div class="label">
      <label for="allday">All day event:</label>
      <input type="checkbox" name="allday" id="alldayyes" @click="allDayEvent"  />
      </div>
	  <div class="label">
      <label for="start">Start hour:</label>
      <input type="time" name="start" id="start" v-bind:value="startHour"/>
      <label for="end">End hour:</label>
      <input type="time" name="end" id="end" v-bind:value="endHour" />
      <label for="description">
        Description:
      </label>
      <textarea name="description" id="description" cols="70" rows="5" :value="event.description"></textarea>
      <label for="location">Location:</label>
      <input type="text" name="location" id="location" :value="event.location"/>
      </div>
	  <div class="label">
      <label for="status">Status:</label>
      <select name="status" id="status" :value="event.status">
        <option value="CONFIRMED">Confirmed</option>
        <option value="TENTATIVE">Tentative</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      </div>
	  <div class="label">
      <label for="collection">Collection:</label>
      <select name="collection" id="collection" :value="event.collection">
        <option
          v-for="(collection, index) in this.$store.state.collections"
          :key="index"
        >{{ collection }}</option>
      </select>
      </div>
	  <div class="label">
      <label for="repeat">Repeating:</label>
      <select name="repeat" id="freq" :value="event.rrule">
        <option value="NONE">None</option>
        <option value="DAILY">Every day</option>
        <option value="WEEKLY">Every week</option>
        <option value="MONTHLY">Every month</option>
        <option value="YEARLY">Every year</option>
      </select>
      </div>
	  <div class="label">
      <label for="every">Repeat every:</label>
      <input type="number" for="every" id="every" :value="event.interval"/>
      </div>
	  <div class="label">
      <label for="endAfter">End after:</label>
      <input type="number" for="endAfter" id="endAfter" :value="event.count" />
      </div>
    </form>
    <div @click="closeUpdateView" class="close"></div>
    <div @click="updateEvent">Update</div>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";

export default {
	name: "UpdateEvent",
	props: ["event"],
	data() {
		return {
			startHour: `${new Date(this.event.start).getHours()}:${
				new Date(this.event.start).getMinutes() <= 0
					? "0" + new Date(this.event.start).getMinutes()
					: new Date(this.event.start).getMinutes()
			}`,
			endHour: `${new Date(this.event.end).getHours()}:${
				new Date(this.event.end).getMinutes() <= 0
					? "0" + new Date(this.event.end).getMinutes()
					: new Date(this.event.end).getMinutes()
			}`,
			startDate: new Date(this.event.start),
			endDate: new Date(this.event.end),
		};
	},
	methods: {
		closeUpdateView() {
			this.$store.commit("changeUpdateView");
		},
		allDayEvent() {
			document.querySelector("#start").disabled = !document.querySelector(
				"#start"
			).disabled;
			document.querySelector("#end").disabled = !document.querySelector(
				"#end"
			).disabled;
		},
		updateEvent() {
			const inputs = document.querySelectorAll("input");
			const startHour = inputs[2].value.split(":");
			const endHour = inputs[3].value.split(":");
			const selectStatus = document.getElementById("status").value;
			const selectCollection = document.getElementById("collection")
				.value;
			const selectFreq = document.getElementById("freq").value;
			const count = document.getElementById("endAfter").value;
			const interval = document.getElementById("every").value;
			const updatedEvent = {
				allDay: inputs[1].checked,
				start: [
					this.startDate.getFullYear(),
					this.startDate.getMonth() + 1,
					this.startDate.getDate(),
					startHour[0] * 1,
					startHour[1] * 1,
				],
				end: [
					this.endDate.getFullYear(),
					this.endDate.getMonth() + 1,
					this.endDate.getDate(),
					endHour[0] * 1,
					endHour[1] * 1,
				],
				title: inputs[0].value,
				description: document.querySelector("textarea").value,
				location: inputs[4].value,
				status: selectStatus,
				collection: selectCollection,
				freq: selectFreq != "NONE" ? selectFreq : null,
				interval,
				count,
				uid: this.event.uid,
			};
			this.$store.commit("changeUpdateView");
			ipcRenderer.send("update-event", updatedEvent);
			this.$store.state.events = [];
			this.$store.commit("updateEvents");
			ipcRenderer.send("syncCalendar", event);
		},
	},
	mounted() {
		if (this.startHour == this.endHour) {
			document.querySelector("#alldayyes").checked = true;
			document.querySelector("#start").disabled = true;
			document.querySelector("#end").disabled = true;
		}
	},
};
</script>
<style lang="css" scoped>
.container {
	position: absolute;
	width: 420px;
	height: 500px;
	border: 1px solid;
	background-color: #fff;
    z-index: 10;
}
input {
	font-size: 20px;
}
label {
	line-height: 30px;
}
form {
	font-size: 20px;
	margin: 35px 5px 10px 10px;
}
select {
	font-size: 20px;
}
#title {
	width: 250px;
}
#description {
	margin-left: auto;
	margin-right: auto;
	overflow: scroll;
	resize: none;
}
.close {
	position: absolute;
	right: 10px;
	top: 10px;
	width: 32px;
	height: 32px;
	opacity: 0.3;
}
.close:hover {
	opacity: 1;
}
.close:before,
.close:after {
	position: absolute;
	left: 15px;
	content: " ";
	height: 33px;
	width: 2px;
	background-color: #333;
}
.close:before {
	transform: rotate(45deg);
}
.close:after {
	transform: rotate(-45deg);
}
</style>
