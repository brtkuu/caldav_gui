import Vue from "vue";
import Router from "vue-router";
import MonthView from "./views/Month.vue";
import AgendaView from "./views/AgendaView.vue";
import DayView from "./views/DayView.vue";
import LoginView from "./views/LoginView.vue";
import LoadingView from "./views/LoadingView.vue";

Vue.use(Router);

export default new Router({
	routes: [{
			path: "/",
			name: "loadingview",
			component: LoadingView,
		},
		{
			path: "/month",
			name: "monthview",
			component: MonthView,
		},
		{
			path: "/agenda",
			name: "agendaview",
			component: AgendaView,
		},
		{
			path: "/day",
			name: "dayview",
			component: DayView,
		},
		{
			path: "/login",
			name: "loginview",
			component: LoginView,
		},
	],
});