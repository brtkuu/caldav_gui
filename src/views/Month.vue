<template>
  <div class="container" v-on:today="createTable">
    <div class="calendar">
      <div class="month">
        <div class="back" @click="change(false)">back</div>
        <div class="monthLabel"></div>
        <div class="next" @click="change(true)">next</div>
      </div>
      <div class="daysOfWeek">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
      </div>
      <div class="dayOfMonth" @click="clicked"></div>
    </div>
  </div>
</template>
<script>
import Router from "vue-router";

export default {
	name: "MonthView",
	date() {
		return {
			currentDate: undefined,
			months: undefined,
			monthNumber: undefined,
			year: undefined,
		};
	},
	methods: {
		// drawing calendar table with correct days of week
		zeroPad(num, places) {
			String(num).padStart(places, "0");
		},
		createTable() {
			for (let i = 1; i < 32; i++) {
				const calendarElement = document.createElement("div");
				const calendarElementLabel = document.createElement("p");
				calendarElement.id = i;
				calendarElementLabel.id = i;
				calendarElementLabel.classList.add("dayLabel");
				calendarElement.classList.add("day");
				const d = new Date(
					`${this.months[this.$store.state.currentMonth]} ${i}, ${
						this.$store.state.currentYear
					}`
				);
				if (i == 1) {
					if (!d.getDay()) {
						calendarElement.style.gridColumn = 7;
					} else {
						calendarElement.style.gridColumn = d.getDay();
					}
				}

				calendarElementLabel.innerHTML = i;
				calendarElement.appendChild(calendarElementLabel);
				this.$store.state.events.forEach((ele, index) => {
					const event = this.dispEvent(ele, d);
					if (event) {
						event.id = index;
						calendarElement.appendChild(event);
					}
				});

				if (
					d.getDay() + 1 &&
					this.months[d.getMonth()] ==
						this.months[this.$store.state.currentMonth]
				) {
					document
						.querySelector(".dayOfMonth")
						.appendChild(calendarElement);
				} else {
					break;
				}
			}
		},
		setLabel() {
			const monthInfo = document.querySelector(".monthLabel");
			monthInfo.innerHTML =
				this.months[this.$store.state.currentMonth] +
				" " +
				this.$store.state.currentYear;
		},
		change(direction) {
			if (direction) {
				if (this.$store.state.currentMonth == 11) {
					this.$store.state.currentMonth = 0;
					this.$store.commit("incrementYear");
				} else {
					this.$store.commit("incrementMonth");
				}
			} else {
				if (this.$store.state.currentMonth == 0) {
					this.$store.state.currentMonth = 11;
					this.$store.commit("decrementYear");
				} else {
					this.$store.commit("decrementMonth");
				}
			}
			document.querySelector(".dayOfMonth").innerHTML = "";
			this.setLabel();
			this.createTable();
		},
		clicked() {
			const month = document.querySelector(".monthLabel").innerText;
			const monthArr = month.split(" ");
			this.$store.state.currentMonth = this.$store.state.months.indexOf(
				monthArr[0]
			);
			this.$store.state.clickedDate = event.target.id;
			this.$store.state.currentYear = monthArr[1] * 1;
			this.$router.push({ name: "dayview" });
		},
		dispEvent(ele, d) {
			const eventDateStart = new Date(ele.start);
			const eventDateEnd = new Date(ele.end);
			if (
				eventDateStart.getDate() == d.getDate() &&
				eventDateStart.getMonth() == d.getMonth() &&
				eventDateStart.getFullYear() == d.getFullYear()
			) {
				const eventLabel = document.createElement("p");
				const endHour =
					eventDateEnd.getHours() != 0
						? eventDateEnd.getHours()
						: "0" + eventDateEnd.getHours();
				const endMinutes =
					eventDateEnd.getMinutes() == 2
						? eventDateEnd.getMinutes()
						: "0" + eventDateEnd.getMinutes();

				const startHour =
					eventDateStart.getHours() != 0
						? eventDateStart.getHours()
						: "0" + eventDateStart.getHours();
				const startMinutes =
					eventDateStart.getMinutes() == 2
						? eventDateStart.getMinutes()
						: "0" + eventDateStart.getMinutes();

				eventLabel.innerHTML = `${
					startHour &&
					startMinutes &&
					(startHour != endHour || startMinutes != endMinutes)
						? startHour + ":" + startMinutes
						: ""
				} ${ele.summary}`;
				eventLabel.classList.add("eventLabel");
				return eventLabel;
			}
			return null;
		},
	},
	mounted() {
		console.log("mounted");
		(this.months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		]),
			this.setLabel();
		this.createTable();
		this.$store.commit("closeAddEventView");
	},
};
</script>
<style lang="css">
* {
  margin: 0;
  padding: 0;
}

.container {
  display: block;
}

.calendar {
  background-color: rgb(255, 255, 255);
}

.info {
  background-color: rgb(117, 117, 117);
}

.dayOfMonth {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
  border-top: 1px solid black;
  border-left: 1px solid black;
}

.month {
  display: flex;
  justify-content: space-between;
}

.daysOfWeek {
  display: grid;
  height: 30px;
  grid-template-columns: repeat(7, 1fr);
  background-color: rgb(202, 202, 202);
  grid-gap: 5px;
  line-height: 30px;
  text-align: center;
}

.day {
  cursor: pointer;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  height: 150px;
  padding: 3px;
  background-color: rgb(190, 190, 190);
}

.dayLabel {
  cursor: pointer;
  height: 25px;
  width: 25px;
  line-height: 25px;
  text-align: center;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 20px;
  opacity: 0.5;
}

.day:hover .dayLabel {
  background-color: rgb(155, 155, 155);
  opacity: 1;
}
.currentDate {
  color: white;
  background-color: red;
  opacity: 1;
}
.next {
  cursor: pointer;
  text-align: center;
  display: inline-block;
  position: relative;
  width: 50px;
  height: 50px;
  line-height: 50px;
}

.back {
  cursor: pointer;
  line-height: 50px;
  text-align: center;
  display: inline-block;
  position: relative;
  width: 50px;
  height: 50px;
}

.monthLabel {
  text-align: center;
  display: inline-block;
  width: 490px;
  line-height: 50px;
}
.eventLabel{
	font-size: 15px;
}
</style>
