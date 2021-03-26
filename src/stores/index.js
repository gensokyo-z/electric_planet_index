import Vue from 'vue';
import Vuex from 'vuex';
import util from '@/utils/util';
import axios from 'axios';
import Bus from '@/utils/bus';
import { getOssToken } from '@/api/oss';
import { getJoinedPlanetList, getPlanetList } from '@/api/planet';
import { getUserInfo } from '@/api/user';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: util.getcookie('TOKEN'),
    userInfo: {},
    userPlanet: [],
    allPlanet: [],
    endPoint: '//planetoss.oss-cn-hangzhou.aliyuncs.com',
    _axiosPromiseCancel: []
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUserPlanet(state, userPlanet) {
      state.userPlanet = userPlanet;
    },
    setAllPlanet: (state, allPlanet) => {
      state.allPlanet = allPlanet;
    },
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo;
    }
  },
  actions: {
    getInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(res => {
            if (res.code === 200) {
              if (/^1[\d]{10}/.test(res.data.username)) {
                res.data.username = res.data.username.substring(0, 3) + '****' + res.data.username.substring(7, 10);
              }
              commit('setUserInfo', res.data); // 用户所有信息
              this._actions.getUserPlanetList[0]();
              resolve(res.data);
            }
          })
          .catch(error => {
            // getWxUserInfo().then(res => {
            //   if (res.code === 200) {
            //     commit('setUserInfo', res.data); // 用户所有信息
            //     this._actions.getUserPlanetList[0]();
            //     resolve(res.data);
            //   }
            // });
            reject(error);
          });
      });
    },
    needAuth({ commit }, cb) {
      if (!this.state.token) {
        this._actions.getInfo[0]()
          .then(res => {
            typeof cb === 'function' && cb();
          })
          .catch(() => {
            Bus.$emit('login', true);
            // router.push('/login?redirect=' + encodeURIComponent(location.href));
          });
      } else {
        typeof cb === 'function' && cb();
      }
    },
    getAllPlanetList({ commit }) {
      return new Promise((resolve, reject) => {
        if (this.state.allPlanet.length > 0) {
          resolve(this.state.allPlanet);
        } else {
          getPlanetList()
            .then(response => {
              if (response.code === 200) {
                commit('setAllPlanet', response.data);
                resolve(response.data);
              } else {
                reject();
              }
            })
            .catch(error => {
              reject(error);
            });
        }
      });
    },
    getUserPlanetList({ commit }) {
      return new Promise((resolve, reject) => {
        getJoinedPlanetList()
          .then(response => {
            if (response.code === 200) {
              commit('setUserPlanet', response.data);
              resolve(response.data);
            } else {
              reject();
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getOssToken({ commit }) {
      return new Promise((resolve, reject) => {
        getOssToken()
          .then(response => {
            if (response.code === 200) {
              resolve(response);
            } else {
              reject();
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    setParams({ commit }, params) {
      // 设置请求参数
      const formData = new FormData();
      const filename = `${util.random_string(5)}.${params.file.type.split('/')[1]}`;
      // 文件名字，可设置路径
      formData.append('key', `${params.dir}/${filename}`);
      // policy规定了请求的表单域的合法性
      formData.append('policy', params.policy);
      // Bucket 拥有者的Access Key Id
      formData.append('OSSAccessKeyId', params.OSSAccessKeyId);
      // 让服务端返回200,不然，默认会返回204
      formData.append('success_action_status', '200');
      // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
      // formData.append('callback', params.callback);
      formData.append('signature', params.signature);
      formData.append('name', filename);
      // 需要上传的文件filer
      formData.append('file', params.file, filename);
      return formData;
    },
    upload({ commit }, { url, data }) {
      // 上传文件
      return new Promise((resolve, reject) => {
        axios
          .post(url, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
});
