import request from '@/utils/request';

// 个人信息
export function getUserInfo(params = {}) {
  return request({
    // url: '/api/feed/user',
    url: '/api/feed/user/openplatuser',
    method: 'get',
    params
  });
}

// wx个人信息
export function getWxUserInfo(params = {}) {
  return request({
    url: '/api/feed/user/openplatuser',
    method: 'get',
    params
  });
}

// 编辑个人信息
export function setUserInfo(data = {}) {
  return request({
    url: '/api/feed/user',
    method: 'patch',
    data
  });
}

// 我的动态
export function getUserDynamic(params = {}) {
  return request({
    url: '/api/feed/user/v2/dynamic',
    method: 'get',
    params
  });
}

// 我的动态
export function getUserParticipation(params = {}) {
  return request({
    url: '/api/feed/user/participation',
    method: 'get',
    params
  });
}
