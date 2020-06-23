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
  },
  mutations: {
    nextWeek(state) {
      const day = state.currentDate.getDate();
      const month = state.currentDate.getMonth();
      const year = state.currentDate.getFullYear();
      state.currentDate = new Date(`${month + 1} ${day + 7}, ${year}`);
    },
    previewWeek(state) {
      const day = state.currentDate.getDate();
      const month = state.currentDate.getMonth();
      const year = state.currentDate.getFullYear();
      state.currentDate = new Date(`${month + 1} ${day - 7}, ${year}`);
    }
  },
  actions: {},
  getters: {}
})