<template>
  <div id="app">
    <header>
      <router-link to="/" exact>Home</router-link>
      <span>&nbsp;|&nbsp;</span>
      <router-link to="/month" exact>Months</router-link>
      <span>&nbsp;|&nbsp;</span>
      <router-link to="/day" exact>Day</router-link>
    </header>
    <router-view />
  </div>
</template>

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
</style>
