import Vue from "vue";
import Vuex from "vuex";
var fs = require("fs");

import { ipcRenderer } from "electron";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		currentDate: new Date(),
		currentMonth: undefined,
		currentYear: undefined,
		clickedDate: undefined,
		currentWeek: undefined,
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
			eventInfoModal: false,
			updateEventModal: false,
		},
		collections: undefined,
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
				if (state.currentMonth == 0) {
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
				state.clickedMonth
					? state.clickedMonth--
					: (state.clickedMonth = state.currentMonth);
				state.currentDate++;
			}
		},
		
		toggleAddEventView(state) {
			state.modals.addEventModal = !state.modals.addEventModal;
		},
		toggleInfoEventView(state) {
			state.modals.eventInfoModal = !state.modals.eventInfoModal;
		},
		updateEvents(state) {
			state.events = [];
			ipcRenderer.send("get-data");
		},
		changeUpdateView(state) {
			state.modals.updateEventModal = !state.modals.updateEventModal;
		},
	},
	actions: {},
	getters: {},
});
