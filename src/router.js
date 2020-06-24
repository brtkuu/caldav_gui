import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import MonthView from "./views/Month.vue";
import DayView from './views/DayView.vue';

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  routes: [{
      path: "/month",
      name: "monthview",
      component: MonthView,
    },
    {
      path: "/day",
      name: "dayview",
      component: DayView,
    },
  ],
});