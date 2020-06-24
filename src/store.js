import Vue from "vue";
import Vuex from "vuex";
var fs = require("fs");

import {
  ipcRenderer
} from "electron";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentDate: new Date(),
    today: new Date(),
    currentMonth: undefined,
    currentYear: undefined,
    dayView: false,
    clickedDate: undefined,
    clickedMonth: undefined,
    clickedYear: undefined,
    months: [
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
    ],
  },
  mutations: {
    incrementMonth(state) {
      state.currentMonth++
    },
    incrementYear(state) {
      state.currentYear++
    },
    decrementMonth(state) {
      state.currentMonth--
    },
    decrementYear(state) {
      state.currentYear--
    },
    incrementClkDay(state) {
      state.clickedDate++
    },
    decrementClkDay(state) {
      state.clickedDate--
    },
  },
  actions: {},
  getters: {},
});