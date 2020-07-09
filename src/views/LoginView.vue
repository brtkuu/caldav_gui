<template>
<div>
    <form>
        <label for="serverurl">Server URL: </label><input name="serverurl" /><br>
        <label for="login">Login: </label><input name="login" /><br>
        <label for="password">Password: </label><input name="password" type="password"/><br>
		<label for="collection">Collection: </label><input name="collection" type="collection"/><br>
    </form>
    <button @click="createConfig">Create config</button>

	<form>
        <label for="configPath">Your config path: </label><input id="configpath" name="configPath" /><br>
    </form>
	<button @click="setConfig">Set config</button>
</div>
</template>
<script>
import { ipcRenderer } from "electron";

export default {
	name: "Login",
	methods: {
		createConfig() {
			const inputs = document.querySelectorAll("input");
			const dataConf = {
				url: inputs[0].value,
				login: inputs[1].value,
				password: inputs[2].value,
				collections: inputs[3].value.split(","),
			};
			ipcRenderer.send("create-config", dataConf);
		},
		setConfig() {
			const configPath = document.querySelector("#configpath").value;
			ipcRenderer.send("set-config", configPath);
		},
	},
};
</script>
<style scoped>
form {
	position: relative;
	text-align: center;
	font-size: 25px;
	margin-top: 50px;
}
input {
	font-size: 23px;
	margin-top: 5px;
}
button {
	display: block;
	margin: 20px auto 0 auto;
	font-size: 25px;
}
</style>
