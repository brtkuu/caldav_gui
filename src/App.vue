<template>
  <div id="app">
    <header>
      <router-link to="/month" exact>Month</router-link>
      <span>&nbsp;|&nbsp;</span>
      <router-link to="/agenda" exact>Agenda</router-link>
      <span>&nbsp;|&nbsp;</span>
      <router-link to="/day" exact>Day</router-link>
      <button class="syncButton" @click="syncCalendar">Sync</button>
      <button class="todayButton" @click="today">Today</button>
    </header>
    <router-view />
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
			setTimeout(() => {
				const location = this.$route.fullPath;
				this.$router.replace("/");
				this.$nextTick(() => this.$router.replace(location));
			}, 100);
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
		ipcRenderer.on("got-data", (event, data) => {
			this.$store.state.events.push(data);
		});
		ipcRenderer.on("config-created", (event, data) => {
			ipcRenderer.send("calendar-start");
		});
		ipcRenderer.on("config-error", (event, data) => {
			console.log(data);
			this.$router.push({ name: "loginview" });
		});
		ipcRenderer.on("set-correct", (event, data) => {
			ipcRenderer.send("calendar-start");
			this.$store.commit("updateEvents");
		});
		ipcRenderer.on("config-correct", (event, data) => {
			this.$store.commit("updateEvents");
			console.log(data);
			setTimeout(() => {
				this.$router.push({ name: "monthview" });
			}, 100);
		});
		this.$store.state.currentMonth = this.$store.state.currentDate.getMonth();
		this.$store.state.currentYear = this.$store.state.currentDate.getFullYear();
	},
};
</script>
<style >
* {
	font-family: "Nova Square", cursive;
}
header {
	font-size: 30px;
	background-color: RGB(82, 148, 161);
	text-align: center;
	color: white;
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
	font-size: 30px;
	background-color: transparent;
	border: none;
	cursor: pointer;
	color: white;
}
.todayButton {
	position: absolute;
	font-size: 30px;
	background-color: transparent;
	border: none;
	cursor: pointer;
	left: 0%;
	transform: translateX(5%);
	color: white;
}
</style>
