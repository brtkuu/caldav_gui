import Vue from "vue";
import Router from "vue-router";
import MonthView from "./views/Month.vue";
import DayView from './views/DayView.vue';

Vue.use(Router);

export default new Router({
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