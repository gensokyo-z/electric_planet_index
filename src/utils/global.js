// import * as dictionary from './dictionary'
import { Toast, Dialog } from 'vant';
import Bus from './bus'; // 事件总线
import Confirm from '@/components/Confirm'; // 确认
import Actionsheet from '@/components/Actionsheet';
import Footer from '@/components/Footer'; // footer
import stores from '@/stores'; // footer
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
  Vue.prototype.$confirm = Confirm.API;
  Vue.prototype.$toast = Toast;
  Vue.prototype.$store = stores;
  Vue.prototype.$state = stores.state;
  Vue.prototype.$bus = Bus;
  Vue.prototype.$dialog = Dialog;

  // 全局定义组件
  Vue.component('Actionsheet', Actionsheet);
  Vue.component('Layout', Footer);
}
