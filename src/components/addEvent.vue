<template>
  <div class="container">
    <form>
	<div class="label">
      <label for="title">Title:</label>
      <input ref="title" type="text" name="title" id="title" />
	  </div>
	  <div class="label">
      <label for="allday">All day event:</label>
      <input type="checkbox" name="allday" id="alldayyes" @click="allDayEvent" checked />
      </div>
	  <div class="label">
      <label for="start">Start hour:</label>
      <input type="time" name="start" id="start" disabled/>
      <label for="end">End hour:</label>
      <input type="time" name="end" id="end" disabled />
      <label for="description">
        Description:
      </label>
      <textarea name="description" id="description" cols="70" rows="5"></textarea>
      <label for="location">Location:</label>
      <input type="text" name="location" id="location" />
      </div>
	  <div class="label">
      <label for="status">Status:</label>
      <select name="status" id="status">
        <option value="CONFIRMED">Confirmed</option>
        <option value="TENTATIVE">Tentative</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      </div>
	  <div class="label">
      <label for="collection">Collection:</label>
      <select name="collection" id="collection">
        <option
          v-for="(collection, index) in this.$store.state.collections"
          :key="index"
        >{{ collection }}</option>
      </select>
      </div>
	  <div class="label">
      <label for="repeat">Repeating:</label>
      <select name="repeat" id="freq">
        <option value="NONE">None</option>
        <option value="DAILY">Every day</option>
        <option value="WEEKLY">Every week</option>
        <option value="MONTHLY">Every month</option>
        <option value="YEARLY">Every year</option>
      </select>
      </div>
	  <div class="label">
      <label for="every">Repeat every:</label>
      <input type="number" for="every" id="every" min="1" disabled/>
     </div>
	  <div class="label">
      <label for="endAfter">End after:</label>
      <input type="number" for="endAfter" min="1" id="endAfter" disabled />
      </div>
	  
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
			const count = document.getElementById("endAfter").value;
			const interval = document.getElementById("every").value;
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
				interval,
				count,
			};
			ipcRenderer.send("createEvent", event);
			this.$store.state.events = [];
			this.$store.commit("updateEvents");
			ipcRenderer.send("syncCalendar", event);
		},
		closeAddView() {
			this.$store.commit("toggleAddEventView");
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
	mounted() {
		this.$refs.title.focus();
		const repeating = document.getElementById("freq");
		repeating.addEventListener("change", () => {
			if (repeating.value == "NONE") {
				document.getElementById("endAfter").disabled = true;
				document.getElementById("every").disabled = true;
				return;
			}
			document.getElementById("endAfter").disabled = false;
			document.getElementById("every").disabled = false;
		});
	},
};
</script>
<style scoped>
.container {
	position: fixed;
	top: 50%;
	width: 420px;
	height: 500px;
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
.label {
	width: 100%;
	text-align: center;
	margin-bottom: 4px;
}
</style>
