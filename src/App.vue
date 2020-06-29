<template>
  <div id="app">
    <header>
      <router-link to="/" exact>Home</router-link>
      <span>&nbsp;|&nbsp;</span>
      <router-link to="/month" exact>Months</router-link>
      <span>&nbsp;|&nbsp;</span>
      <router-link to="/day" exact>Day</router-link>
      <button class="syncButton" @click="syncCalendar">Sync</button>
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
	transform: translateX(-100%);
	font-size: 25px;
}
</style>
