import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import 'lib-flexible';
import global from '@/utils/global';
import router from './routers/';
import './routers/intercept';
// import VConsole from 'vconsole';
import store from './stores';
import * as filters from './filters/';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import './styles/main.less';
Vue.use(ElementUI);
Vue.use(VueClipboard);
Vue.use(global);
// new VConsole();
// import FastClick from 'fastclick';

// FastClick.attach(document.body);

// FastClick.prototype.focus = (ele) => { 'use strict'; ele.focus(); }; //修改focus()方法

Vue.config.errorHandler = (err, vm, info) => {
  console.error(err);
};

Vue.config.devtools = process.env.NODE_ENV === 'development';
Vue.config.productionTip = process.env.NODE_ENV === 'production';

window.EventBus = new Vue();

// 注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

window.electricPlanetApp = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
