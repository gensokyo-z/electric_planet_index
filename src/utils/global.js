// import * as dictionary from './dictionary'
import { Message, MessageBox, Loading } from 'element-ui';
import Bus from './bus'; // 事件总线
// import Confirm from '@/components/Confirm'; // 确认
// import Actionsheet from '@/components/Actionsheet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import stores from '@/stores';
export default function(Vue) {
  // Vue.prototype.$message = Message;
  Vue.prototype.$message = msg => {
    return Message.info({
      message: msg,
      offset: 70
    });
  };
  Vue.prototype.$message.warning = function(msg) {
    return Message.warning({
      message: msg,
      offset: 70
    });
  };
  Vue.prototype.$message.error = function(msg) {
    return Message.error({
      message: msg,
      offset: 70
    });
  };

  Vue.prototype.$message.success = function(msg) {
    return Message.success({
      message: msg,
      offset: 70
    });
  };
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$store = stores;
  Vue.prototype.$state = stores.state;
  Vue.prototype.$bus = Bus;
  // 全局定义组件
  Vue.component('Header', Header);
  Vue.component('Footer', Footer);
}
