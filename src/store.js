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
		events: [],
		modals: {
			addEventModal: false,
		}
	},
	mutations: {
		incrementMonth(state) {
			state.currentMonth++;
		},
		incrementYear(state) {
			state.currentYear++;
		},
		decrementMonth(state) {
			state.currentMonth--;
		},
		decrementYear(state) {
			state.currentYear--;
		},
		incrementClkDay(state) {
			const d = new Date(
				`${state.months[state.currentMonth]} ${state.clickedDate}, ${
					state.currentYear
				}`
			);
			state.clickedDate++;
			const a = new Date(
				`${state.months[state.currentMonth]} ${state.clickedDate}, ${
					state.currentYear
				}`
			);
			if (a.getMonth() != d.getMonth()) {
				state.clickedDate = 1;
				if (state.currentMonth == 11) {
					state.currentMonth = 0;
					state.currentYear++;
				} else {
					state.currentMonth++;
				}
				state.clickedMonth = state.currentMonth;
				console.log(state.clickedMonth);
				console.log(state.currentMonth);
				state.currentDate++;
			}
		},
		decrementClkDay(state) {
			const d = new Date(
				`${state.months[state.currentMonth]} ${state.clickedDate}, ${
					state.currentYear
				}`
			);
			state.clickedDate--;
			const a = new Date(
				`${state.months[state.currentMonth]} ${state.clickedDate}, ${
					state.currentYear
				}`
			);
			if (a.getMonth() != d.getMonth()) {
				console.log(state.currentMonth);
				if (state.currentMonth == 0) {
					console.log("zero");
					state.currentMonth = 11;
					state.clickedMonth = 11;
					state.currentYear--;
					state.clickedYear--;
				} else {
					state.currentMonth--;
				}
				state.clickedDate =
					32 -
					new Date(
						state.currentYear,
						state.currentMonth,
						32
					).getDate();
				state.clickedMonth != undefined ?
					state.clickedMonth--
					:
					(state.clickedMonth = state.currentMonth);
				state.currentDate++;
			}
		},
		openAddEventView(state) {
			state.modals.addEventModal = true;
		},
		closeAddEventView(state) {
			state.modals.addEventModal = false;
		},
	},
	actions: {},
	getters: {},
});