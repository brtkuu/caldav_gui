import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue';
import MonthView from './views/Month.vue';
import WeekView from './views/Week.vue';

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/month',
      name: 'monthview',
      component: MonthView
    },
    {
      path: '/week',
      name: 'weekview',
      component: WeekView
    }
  ]
})