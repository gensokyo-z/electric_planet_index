import request from '@/utils/request';

// 刷新token

export function refresh(data = {}) {
  return request({
    url: '/api/auth/refresh',
    method: 'post',
    data
  });
}

// 登录
export function login(data = {}) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  });
}

// 发送短信
export function sendSms(data = {}) {
  return request({
    url: '/api/sms/captcha',
    method: 'post',
    data
  });
}

// 退出
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  });
}
// 获取公众号appid

export function getWechatAppid() {
  return request({
    url: '/api/wechat/appid',
    method: 'get'
  });
}

// 绑定微信
export function bindWechat(data = {}) {
  return request({
    url: '/api/wechat/bind',
    method: 'post',
    data
  });
}

// 微信登录接口
export function wxLogin(data = {}) {
  return request({
    url: '/api/wechat/login',
    method: 'post',
    data
  });
}

// 绑定并登录
export function bindAndLogin(data = {}) {
  return request({
    url: '/api/wechat/bindAndLogin',
    method: 'post',
    data
  });
}

// 获取微信js-sdk配置
export function getWechatJsSdk(data = {}) {
  return request({
    url: '/api/wechat/jssdk',
    method: 'post',
    data
  });
}
