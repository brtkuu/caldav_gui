<template>
  <div id="app">
    <header>
      <router-link to="/" exact>Home</router-link>
      <span>&nbsp;|&nbsp;</span>
      <router-link to="/month" exact>Months</router-link>
      <span>&nbsp;|&nbsp;</span>
      <router-link to="/day" exact>Day</router-link>
      <button class="syncButton" @click="syncCalendar">Sync</button>
	  <button class="todayButton" @click="today">Today</button>
    </header>
    <router-view/>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";

export default {
	name: "App",
	methods: {
		syncCalendar() {
			ipcRenderer.send("syncCalendar");
		},
		today() {
			this.$store.state.currentMonth = new Date().getMonth();
			this.$store.state.currentYear = new Date().getFullYear();
			this.$store.state.clickedDate = new Date().getDate();
			this.$store.state.clickedMonth = new Date().getMonth();
			this.$store.state.clickedYear = new Date().getFullYear();
			const location = this.$route.fullPath;
			this.$router.replace("/");
			this.$nextTick(() => this.$router.replace(location));
		},
	},
	mounted() {
		this.$store.state.currentMonth = this.$store.state.currentDate.getMonth();
		this.$store.state.currentYear = this.$store.state.currentDate.getFullYear();
		ipcRenderer.on("calSync", (event, data) => {
			console.log(data);
		});
	},
};
</script>
<style >
* {
	font-family: "Nova Square", cursive;
}
header {
	font-size: 30px;
	background-color: rgb(189, 189, 189);
	text-align: center;
}
header a {
	text-decoration: none;
	color: black;
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
}
.todayButton {
	position: absolute;
	font-size: 30px;
	background-color: transparent;
	border: none;
	cursor: pointer;
	left: 0%;
	transform: translateX(5%);
}
</style>
