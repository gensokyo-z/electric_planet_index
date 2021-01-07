/* eslint-disable */
import Axios from 'axios';

let axios = Axios.create({
  baseURL: '/',
  transformRequest: [
    function(data) {
      let ret = [];
      for (let i in data) {
        ret.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
      }
      return ret.join('&');
    }
  ],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
axios.interceptors.response.use(
  data => {
    let result = data.data;
    if (result && result.status) {
      if (result.status != 200) {
        return Promise.reject(result);
      } else {
        return Promise.resolve(result);
      }
    } else if (result && typeof result !== 'object') {
      // 由于后台部分接口返回的格式不一致，需要额外处理
      result = { status: 500, message: '网络繁忙，请稍后再试', data: null };
      return Promise.reject(result);
    }
    return Promise.resolve(result);
  },
  () => {
    return Promise.reject({ status: 501, message: '系统错误，请稍后再试', data: null });
  }
);

let $http = {
  commonData: {},
  mergeData(data) {
    let mergeData = this.commonData || {};
    data.platform = mergeData.platform;
    data.token = mergeData.token;
    mergeData.appid && (data.appid = mergeData.appid);
    mergeData.openid && (data.openid = mergeData.openid);
    mergeData.nonce && (data.nonce = mergeData.nonce);
    mergeData.timeStamp && (data.timeStamp = mergeData.timeStamp);
    mergeData.coname && (data.coname = mergeData.coname);
    // mergeData.kd100sign && (data.kd100sign = mergeData.kd100sign);
  },
  request(method, url, data = {}) {
    if (!data.data) data.data = {};
    let body = {
      method: method,
      url: url,
      timeout: typeof data.timeout === 'number' ? data.timeout : 10000
    };
    this.mergeData(data.data);
    if (method === 'post') {
      body.data = data.data;
    }  else {
      body.params = data.data;
    }
    return axios(body)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(res => {
        if (res.status == 403) {
          // 未登录
          if (data.handleLogin === false) return;
          $http.vm.$router.push({
            name: 'login'
          });
          return Promise.reject(res);
        } else {
          if (data.handleFail !== false) {
            $http.$message(res.message);
          }
          return Promise.reject(res);
        }
      });
  },
  get(url, data) {
    return $http.request('get', url, data);
  },
  post(url, data) {
    return $http.request('post', url, data);
  },
  put(url, data) {
    return $http.request('put', url, data);
  },
  patch(url, data) {
    return $http.request('patch', url, data);
  },
  delete(url, data) {
    return $http.request('delete', url, data);
  },
  upload(url, data) {
    return Axios.post(url, data.data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: data.timeout || 30000
    })
      .then(res => {
        res = res.data;
        if (res.status == 200) {
          return Promise.resolve(res.data);
        } else {
          return Promise.reject(res);
        }
      })
      .catch(res => {
        return Promise.reject(res);
      });
  },
  axios: Axios
};
// function install(Vue) {
//   $http.$message = Vue.prototype.$message;
//   Vue.prototype.$http = $http;
// }
export default { $http
  // , install
 };
