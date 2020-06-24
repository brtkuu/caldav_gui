<template>
<div>
    <p class="headerDate">
    {{ this.$store.state.clickedDate != undefined
				? this.$store.state.clickedDate
				: this.$store.state.today.getDate() }} {{this.$store.state.months[this.$store.state.currentMonth] }} {{ this.$store.state.currentYear }}
    </p>
</div>
</template>
<script>
export default {
	name: "DayView",
	mounted() {
		this.$store.state.currentMonth = this.$store.state.currentDate.getMonth();
		this.$store.state.currentYear = this.$store.state.currentDate.getFullYear();
	},
};
</script>
<style scoped>
.headerDate {
	text-align: center;
	font-size: 40px;
}
</style>
