<template>
  <div id="app">
    <header>
      <router-link to="/month" exact>Month</router-link>
      <span class="space">|</span>
      <router-link to="/agenda" exact>Agenda</router-link>
      <span class="space">|</span>
      <router-link to="/day" exact>Day</router-link>
	  <span class="space">|</span>
      <router-link to="/week" exact>Week</router-link>
      <button class="syncButton" @click="syncCalendar">Sync</button>
      <button class="todayButton" @click="today">Today</button>
    </header>
    <router-view class="routerView" />
  </div>
</template>
<script>
import { ipcRenderer } from "electron";

export default {
	name: "App",
	
	methods: {
		syncCalendar() {
			ipcRenderer.send("syncCalendar");
			this.$store.commit("updateEvents");
		},
		today() {
			this.$store.state.currentMonth = new Date().getMonth();
			this.$store.state.currentYear = new Date().getFullYear();
			this.$store.state.clickedDate = new Date().getDate();
			const location = this.$route.fullPath;
			this.$router.replace("/");
			this.$nextTick(() => this.$router.replace(location));
		},
	},
	mounted() {
		ipcRenderer.send("calendar-start");

		ipcRenderer.on("got-data", (_event, data) => {
			this.$store.state.events = data;
		});

		ipcRenderer.on("config-created", () => {
			ipcRenderer.send("calendar-start");
		});

		ipcRenderer.on("config-error", () => {
			this.$router.push({ name: "loginview" });
		});

		ipcRenderer.on("set-correct", () => {
			ipcRenderer.send("calendar-start");
			this.$store.commit("updateEvents");
		});

		ipcRenderer.on("config-correct", (_event, data) => {
			this.$store.commit("updateEvents");
			this.$store.state.collections = data;
			this.$router.push({ name: "monthview" });
		});

		ipcRenderer.on("refreshview", () => {
			this.$store.state.modals.eventInfoModal = false;
			this.$store.state.modals.addEventModal = false;
			const location = this.$route.fullPath;
			this.$router.replace("/");
			this.$nextTick(() => this.$router.replace(location));
		});

		this.$store.state.currentMonth = this.$store.state.currentDate.getMonth();
		this.$store.state.currentYear = this.$store.state.currentDate.getFullYear();
	},
};
</script>
<style>
* {
	font-family: "sans-serif", cursive;
}
header {
	font-size: 24px;
	background-color: rgb(82, 148, 161);
	text-align: center;
	color: white;
	width: 100vw;
}
header a {
	text-decoration: none;
	color: white;
}
.router-link-active {
	font-weight: 900;
}
.syncButton {
	position: absolute;
	left: 100%;
	transform: translateX(-105%);
	font-size: 22px;
	background-color: transparent;
	border: none;
	cursor: pointer;
	color: white;
}
.todayButton {
	position: absolute;
	font-size: 22px;
	background-color: transparent;
	border: none;
	cursor: pointer;
	left: 0%;
	transform: translateX(5%);
	color: white;
}
.space {
	margin: 0 5px 0 5px;
}
</style>
