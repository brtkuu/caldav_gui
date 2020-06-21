<template>
  <div class="container">
    <div class="calendar">
      <div class="month">
        <div class="back" v-on:click="change(false)">back</div>
        <div class="monthLabel"></div>
        <div class="next" v-on:click="change(true)">next</div>
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
      <div class="dayOfMonth"></div>
    </div>
    <div class="info"></div>
  </div>
</template>
<script>
export default {
  name: "MonthView",
  date() {
    return {
      currentDate: undefined,
      months: undefined,
      monthNumber: undefined,
      year: undefined
    };
  },
  methods: {
    // drawing calendar table with correct days of week
    createTable() {
      for (let i = 1; i < 35; i++) {
        const calendarElement = document.createElement("div");
        const calendarElementLabel = document.createElement("p");
        calendarElement.id = i;
        calendarElementLabel.classList.add("dayLabel");
        calendarElement.classList.add("day");
        const d = new Date(
          `${this.months[this.monthNumber]} ${i}, ${this.year}`
        );
        if (i == 1) {
          if (!d.getDay()) {
            calendarElement.style.gridColumn = 7;
          } else {
            calendarElement.style.gridColumn = d.getDay();
          }
        }
        if (
          d.getDay() + 1 &&
          this.months[d.getMonth()] == this.months[this.monthNumber]
        ) {
          calendarElementLabel.innerHTML = i;
          calendarElement.appendChild(calendarElementLabel);
          document.querySelector(".dayOfMonth").appendChild(calendarElement);
        } else {
          break;
        }
      }
    },
    setLabel() {
      const monthInfo = document.querySelector(".monthLabel");
      monthInfo.innerHTML = this.months[this.monthNumber] + " " + this.year;
    },
    change(direction) {
      if (direction) {
        if (this.monthNumber == 11) {
          this.monthNumber = 0;
          this.year++;
        } else {
          this.monthNumber++;
        }
      } else {
        if (this.monthNumber == 0) {
          this.monthNumber = 11;
          this.year--;
        } else {
          this.monthNumber--;
        }
      }
      document.querySelector(".dayOfMonth").innerHTML = "";
      this.setLabel();
      this.createTable();
    }
  },
  mounted() {
    this.currentDate = new Date();
    this.monthNumber = this.currentDate.getMonth();
    this.year = this.currentDate.getFullYear();
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
      "December"
    ]),
      this.setLabel();
    this.createTable();
  }
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
  position: relative;
  height: 50px;
  width: 100%;
  background-color: white;
}

.daysOfWeek {
  display: grid;
  height: 30px;
  grid-template-columns: repeat(7, 1fr);
  background-color: rgb(202, 202, 202);
  grid-gap: 5px;
  line-height: 30px;
}

.day {
  cursor: pointer;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  height: 80px;
  padding: 3px;
  background-color: rgb(190, 190, 190);
}

.dayLabel {
  cursor: pointer;
  height: 25px;
  width: 25px;
  line-height: 25px;
  text-align: center;
  border: 1px solid black;
  border-radius: 20px;
}

.day:hover .dayLabel {
  background-color: rgb(155, 155, 155);
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
</style>
