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

// 微信登录接口
export function wxLogin(data = {}) {
  return request({
    url: '/api/wechat/openplatlogin',
    method: 'post',
    data
  });
}

// 微信注册接口
export function wxRegister(data = {}) {
  return request({
    url: '/api/wechat/firstbindphone',
    method: 'post',
    data
  });
}

// 绑定并登录
export function bindAndLogin(data = {}) {
  return request({
    url: '/api/wechat/phone/login',
    method: 'post',
    data
  });
}

// 绑定微信
export function bindWx(data = {}) {
  return request({
    url: '/api/wechat/v2/bind',
    method: 'post',
    data
  });
}
