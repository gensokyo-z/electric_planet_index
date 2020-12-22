// import * as dictionary from './dictionary'
import Vue from 'vue';
import { Message, MessageBox, Loading, InfiniteScroll } from 'element-ui';
import Bus from './bus'; // 事件总线
// import Confirm from '@/components/Confirm'; // 确认
// import Actionsheet from '@/components/Actionsheet';
import Header from '@/components/Header'; // footer
import stores from '@/stores'; // footer
Vue.use(InfiniteScroll);
export default function(Vue) {
  // 全局注册字典
  // Object.defineProperty(Vue.prototype, '$dictionary', {
  //   get: function() {
  //     return dictionary
  //   }
  // });

  // const needAuth = stores.getInfo().then(res => {
  //   console.log(res);
  // });
  // Vue.prototype.$confirm = Confirm.API;Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$store = stores;
  Vue.prototype.$state = stores.state;
  Vue.prototype.$bus = Bus;

  // 全局定义组件
  // Vue.component('Actionsheet', Actionsheet);
  Vue.component('Header', Header);
}
