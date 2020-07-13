<template>
  <div class="container">
    <form action>
      <label for="title">Title:</label>
      <input type="text" name="title" id="title" />
      <br />
      <label for="allday">All day event:</label>
      <input type="checkbox" name="allday" id="alldayyes" @click="allDayEvent" checked/>
      <br />
      <label for="start">Start hour:</label>
      <input type="time" name="start" id="start" disabled/>
      <label for="end">End hour:</label>
      <input type="time" name="end" id="end" disabled/>
      <label for="description">
        Description:
        <br />
      </label>
      <textarea name="description" id="description" cols="70" rows="5"></textarea>
      <label for="location">Location:</label>
      <input type="text" name="location" id="location" />
      <br />
      <label for="status">Status:</label>
      <select name="status" id="status">
        <option value="CONFIRMED">Confirmed</option>
        <option value="TENTATIVE">Tentative</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <br />
      <label for="collection">Collection:</label>
      <select name="collection" id="collection">
        <option
          v-for="(collection, index) in this.$store.state.collections"
          :key="index"
        >{{ collection }}</option>
      </select>
      <br />
      <label for="repeat">Repeating:</label>
      <select name="repeat" id="freq">
        <option value="NONE">None</option>
        <option value="DAYLI">Every day</option>
        <option value="WEEKLY">Every week</option>
        <option value="MONTHLY">Every month</option>
        <option value="YEARLY">Every year</option>
      </select>
      <br />
    </form>
    <button @click="addEvent()">Add</button>
    <div @click="closeAddView" class="close"></div>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";

export default {
	name: "AddEvent",
	methods: {
		addEvent() {
			const inputs = document.querySelectorAll("input");
			const startHour = inputs[2].value.split(":");
			const endHour = inputs[3].value.split(":");
			const selectStatus = document.getElementById("status").value;
			const selectCollection = document.getElementById("collection")
				.value;
			const selectFreq = document.getElementById("freq").value;
			const event = {
				allDay: inputs[1].checked,
				start: [
					this.$store.state.currentYear,
					this.$store.state.currentMonth + 1,
					this.$store.state.clickedDate * 1,
					startHour[0] * 1,
					startHour[1] * 1,
				],
				end: [
					this.$store.state.currentYear,
					this.$store.state.currentMonth + 1,
					this.$store.state.clickedDate * 1,
					endHour[0] * 1,
					endHour[1] * 1,
				],
				title: inputs[0].value,
				description: document.querySelector("textarea").value,
				location: inputs[4].value,
				status: selectStatus,
				collection: selectCollection,
				freq: selectFreq != "NONE" ? selectFreq : null,
			};
			ipcRenderer.send("createEvent", event);
			this.$store.state.events = [];
			this.$store.commit("updateEvents");
			this.$store.commit("closeAddEventView");
			ipcRenderer.send("syncCalendar");
			setTimeout(() => {
				const location = this.$route.fullPath;
				this.$router.replace("/");
				this.$nextTick(() => this.$router.replace(location));
			}, 100);
		},
		closeAddView() {
			this.$store.commit("closeAddEventView");
		},
		allDayEvent() {
			document.querySelector("#start").disabled = !document.querySelector(
				"#start"
			).disabled;
			document.querySelector("#end").disabled = !document.querySelector(
				"#end"
			).disabled;
		},
	},
};
</script>
<style scoped>
.container {
	width: 420px;
	height: 440px;
	border: 1px solid;
	background-color: #fff;
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
