<template>
<div class="dateDisplayContainer">
    <div class="agendaNav">
      <button class="agendaNavBtn" @click="previewDay">BACK</button>
      <button class="agendaNavBtn" @click="nextDay">NEXT</button>
    </div>
    <p class="agendaHeader">
      {{ this.$store.state.clickedDate
      ? this.$store.state.clickedDate
      : this.$store.state.currentDate.getDate() }}
      {{ this.$store.state.months[this.$store.state.currentMonth] }} {{ this.$store.state.currentYear }}
    </p>
</div>
</template>
<script>
export default {
	name: "DateDisplay",
	methods: {
		nextDay() {
			if (!this.$store.state.clickedDate) {
				this.$store.state.clickedDate = new Date().getDate();
			}
			this.$store.commit("incrementClkDay");
			this.$emit("show");
		},
		previewDay() {
			if (!this.$store.state.clickedDate) {
				this.$store.state.clickedDate = this.$store.state.currentDate.getDate();
			}
			this.$store.commit("decrementClkDay");
			this.$emit("show");
		},
	},
};
</script>
<style scoped>
.dateDisplayContainer {
	background-color: white;
}
.agendaHeader{
	font-size: 20px;
}
</style>
