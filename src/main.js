import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import $ from 'jquery';
import axios from 'axios';
import store from "./store";


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
window.jQuery = $;
window.$ = $;
axios.defaults.withCredentials = true; // 允许携带cookie

// 挂载
new Vue({
  router,
  store:store,
  render: h => h(App)
}).$mount('#app')

axios.interceptors.request.use(
  config => {
  // 判断是否存在token，如果存在的话，则每个http header都加上token
    let token = sessionStorage.getItem('Authorization')
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  });
