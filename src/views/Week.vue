<template>
    <div class="container">
        <div class="daysLabel"><div></div></div>
        <div class="daysContainer">
            
        </div>
    </div>
</template>
<script>
export default {
	name: "Week",
	methods: {
		createWeek() {
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
				// if (
				// 	d.getMonth() == this.$store.state.currentDate.getMonth() &&
				// 	d.getDate() == this.$store.state.currentDate.getDate() &&
				// 	d.getFullYear() ==
				// 		this.$store.state.currentDate.getFullYear()
				// ) {
				// 	div.classList.add("currentWeekDate");
				// }
				document.querySelector(".daysLabel").appendChild(div);
			}
		},
	},
	mounted() {
		this.$store.commit("previewWeek");
		this.$store.commit("nextWeek");
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
