<template>
  <div class="container">
    <div class="daysLabel">
      <div></div>
    </div>
    <div class="daysContainer"></div>
  </div>
</template>
<script>
export default {
	name: "Week",
	methods: {
		createWeek() {
			const today = new Date();
			const day = this.$store.state.currentDate.getDay();
			console.log(this.$store.state.currentDate);
			const startDate = this.$store.state.currentDate.getDate() - day + 1;
			console.log(startDate);
			for (let i = startDate; i < startDate + 7; i++) {
				const d = new Date(
					`${this.$store.state.currentDate.getMonth() +
						1} ${i}, ${this.$store.state.currentDate.getFullYear()}`
				);
				const div = document.createElement("div");
				div.classList.add("weekDayLabel");
				div.innerHTML = `${d.getDate()}.${
					d.getMonth() < 10
						? "0" + (d.getMonth() + 1)
						: d.getMonth() + 1
				}`;
				if (
					d.getMonth() == today.getMonth() &&
					d.getDate() == today.getDate() &&
					d.getFullYear() == today.getFullYear()
				) {
					div.classList.add("currentWeekDate");
				}
				document.querySelector(".daysLabel").appendChild(div);
			}
		},
	},
	mounted() {
		this.createWeek();
	},
};
</script>
<style>
.daysLabel {
	display: grid;
	grid-template-columns: repeat(8, 1fr);
}
.daysContainer {
	display: grid;
	grid-template-columns: repeat(8, 1fr);
}
.weekDayLabel {
	text-align: center;
}
.currentWeekDate {
	color: red;
}
</style>
