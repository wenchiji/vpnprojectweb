import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import $ from 'jquery';
import axios from 'axios';
import Blob from './excal/Blob.js'
import Export2Excel from './excal/Export2Excel.js'


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
window.jQuery = $;
window.$ = $;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
