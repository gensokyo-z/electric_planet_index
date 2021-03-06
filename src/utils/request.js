import axios from 'axios';
import qs from 'qs';
import store from '@/stores';
import router from '@/routers/';
import { Message } from 'element-ui';
import util from '@/utils/util';
import Bus from '@/utils/bus'; // 事件总线
// 消息提示 显示时间
const duration = 5 * 1000;
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10 * 1000 // request timeout
});

// request拦截器
service.interceptors.request.use(
  config => {
    // ie浏览器缓存get请求数据
    if (config.method === 'get' && 'ActiveXObject' in window) {
      config.headers['Pragma'] = 'no-cache';
    }
    if (config.method === 'post') {
      const data = qs.parse(config.data);
      config.data = qs.stringify({
        ...data
      });
    } else {
      config.params = {
        ...config.params
      };
    }
    if (store.state.token) {
      config.headers['Authorization'] = `Bearer ${store.state.token}`;
    }
    let url = config.url;
    // 设置cancelToken对象
    config.cancelToken = new axios.CancelToken(cancel => {
      store.state._axiosPromiseCancel.push(cancel);
    });
    const loginUrlList = ['/api/auth/login', '/api/sms/captcha'];
    if (!loginUrlList.includes(url) && router.currentRoute.name === 'login' && util.getcookie('TOKEN')) {
      // 取消当前请求
      store.state._axiosPromiseCancel[store.state._axiosPromiseCancel.length - 1]();
      console.log(config);
      return config;
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    let result = response.data;
    // 请求不成功处理
    if (response.status !== 200) {
      Message({
        message: result.msg,
        duration,
        type: 'error'
      });
      return Promise.reject('error');
    } else {
      if (result.code === 200) {
        return Promise.resolve(result);
      } else if (result.code === 401) {
        Message.closeAll();
        Message({
          message: '请登录后再操作',
          duration,
          type: 'error'
        });
        util.delcookie('TOKEN');
        Bus.$emit('login', true);
        // if (router.currentRoute.name !== 'login') {
        //   router.push('/login');
        // }
        return Promise.reject(result);
      } else {
        Message.closeAll();
        Message({
          message: result && result.msg ? result.msg : '无效的返回数据',
          duration,
          type: 'error'
        });
        return Promise.reject(result);
      }
    }
  },
  // 请求报错处理
  error => {
    console.log('err' + error); // for debug
    const response = error.response;
    const info = (response && response.data) || {}; // 自定义封装data
    // if (response === undefined) {
    //   Message({
    //     message: '服务请求超时！',
    //     duration,
    //     type: 'error'
    //   });
    //   return Promise.reject(error);
    // }
    if (response.code === 500 || response.code === 504) {
      Message({
        message: info.message || '后端服务异常，请联系管理员！',
        duration
      });
      return Promise.reject(error);
    }
    if (response.code === 401) {
      if (info.error_description === 'Bad credentials') {
        Message({
          message: '用户名或密码错误！',
          duration,
          type: 'error'
        });
      } else {
        Message({
          message: '请求数据格式错误！',
          duration,
          type: 'error'
        });
      }
      return Promise.reject(error);
    }

    if (response.code === 404) {
      Message({
        message: '未找到指定资源！',
        duration,
        type: 'error'
      });
      return Promise.reject(error);
    }
    Message({
      message: info.message,
      duration,
      type: 'error'
    });
    return Promise.reject(error);
  }
);

export default service;
