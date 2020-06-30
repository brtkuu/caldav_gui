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
      {{ this.$store.state.clickedMonth != undefined ? this.$store.state.months[this.$store.state.clickedMonth] : this.$store.state.months[this.$store.state.currentMonth] }} {{ this.$store.state.clickedYear != undefined ? this.$store.state.clickedYear : this.$store.state.today.getFullYear()}}
    </p>
    <button class="addEvent" @click="openAddView">Add Event</button>
    <add-event v-if="this.$store.state.addEventModal" class="addEvent"></add-event>

  </div>
</template>
<script>
import AddEvent from "../components/addEvent";

export default {
	name: "DayView",
	components: {
		"add-event": AddEvent,
	},
	methods: {
		nextDay() {
			if (this.$store.state.clickedDate == undefined) {
				this.$store.state.clickedDate = this.$store.state.today.getDate();
			}
			this.$store.commit("incrementClkDay");
		},
		previewDay() {
			if (this.$store.state.clickedDate == undefined) {
				this.$store.state.clickedDate = this.$store.state.today.getDate();
			}
			this.$store.commit("decrementClkDay");
		},
		openAddView() {
			this.$store.commit("openAddEventView");
		},
	},
	mounted() {
		if (this.$store.state.clickedDate == undefined) {
			this.$store.state.clickedDate = new Date().getDate();
		}
	},
};
</script>
<style scoped>
.dayHeader {
	text-align: center;
	font-size: 40px;
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
</style>
