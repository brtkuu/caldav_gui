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
  mutations: {},
  actions: {},
  getters: {},
});