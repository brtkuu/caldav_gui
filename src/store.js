import Vue from 'vue'
import Vuex from 'vuex'
var fs = require("fs");

import {
  ipcRenderer
} from 'electron';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentDate: new Date(),
    today: new Date(),
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
    nextWeek(state) {
      const day = state.currentDate.getDate();
      let month = state.currentDate.getMonth();
      const year = state.currentDate.getFullYear();
      let newDate = new Date(`${state.months[month]} ${day + 7}, ${year}`);
      if (month != newDate.getMonth()) {
        newDate = new Date(`${state.months[++month]} ${1}, ${year}`)
      }
      state.currentDate = newDate;
    },
    previewWeek(state) {
      const day = state.currentDate.getDate();
      let month = state.currentDate.getMonth();
      const year = state.currentDate.getFullYear();
      let newDate = new Date(`${state.months[month]} ${day - 7}, ${year}`);
      if (month != newDate.getMonth()) {
        newDate = new Date(`${state.months[--month]} ${31}, ${year}`)
      }
      state.currentDate = newDate;
    }
  },
  actions: {},
  getters: {}
})