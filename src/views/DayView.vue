<template>
<div class="dayContainer">
    <div class="dayNav"><button class="dayNavBtn" @click="previewDay">BACK</button><button class="dayNavBtn" @click="nextDay">NEXT</button></div>
    <p class="dayHeader">
    {{ this.$store.state.clickedDate != undefined
				? this.$store.state.clickedDate
				: this.$store.state.today.getDate() }}
                 {{ this.$store.state.clickedMonth != undefined ? this.$store.state.months[this.$store.state.clickedMonth] : this.$store.state.months[this.$store.state.today.getMonth()] }} {{ this.$store.state.clickedYear != undefined ? this.$store.state.clickedYear : this.$store.state.today.getFullYear()}}
    </p>
</div>
</template>
<script>
export default {
	name: "DayView",
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
</style>
