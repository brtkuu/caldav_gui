import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import isDate from './vueFunctions/isDate';
import setDates from './vueFunctions/setDates';

Vue.config.productionTip = false;
Vue.prototype.$isDate = isDate;
Vue.prototype.$setDates = setDates;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')