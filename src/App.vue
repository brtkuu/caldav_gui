<template>
  <div id="app">
    <header>
      <router-link to="/" exact>Home</router-link>
      <span>&nbsp;|&nbsp;</span>
      <router-link to="/month" exact>Months</router-link>
      <span>&nbsp;|&nbsp;</span>
      <router-link to="/week" exact>Week</router-link>
    </header>
    <router-view />
  </div>
</template>

<style scoped>
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
</style>
