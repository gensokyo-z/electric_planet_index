import Vue from 'vue';
import Vuex from 'vuex';
import util from '@/utils/util';
import axios from 'axios';
import { getOssToken } from '@/api/oss';
import { getJoinedPlanetList } from '@/api/planet';
import { getUserInfo } from '@/api/user';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: util.getcookie('TOKEN'),
    userInfo: {},
    userPlanet: [],
    endPoint: '//planetoss.oss-cn-hangzhou.aliyuncs.com'
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUserPlanet(state, userPlanet) {
      state.userPlanet = userPlanet;
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
              commit('setUserInfo', res.data); // 用户所有信息
              resolve(res.data);
            } else {
              reject(res.message);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getUserPlanetList({ commit }) {
      return new Promise((resolve, reject) => {
        getJoinedPlanetList()
          .then(response => {
            if (response.code === 200) {
              response.data.forEach(e => {
                e.avatar = e.avatar.includes('//') ? e.avatar : require('@/assets/images/timg.jpg');
              });
              commit('setUserPlanet', response.data);
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
      formData.append('key', `${params.dir}${filename}`);
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
