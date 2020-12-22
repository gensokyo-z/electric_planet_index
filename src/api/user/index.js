import request from '@/utils/request';

// 个人信息
export function getUserInfo(data = {}) {
  return request({
    url: '/api/feed/user',
    method: 'get',
    data
  });
}

// 个人信息
export function setUserInfo(data = {}) {
  return request({
    url: '/api/feed/user',
    method: 'patch',
    data
  });
}

// 我的动态
export function getUserDynamic(data = {}) {
  return request({
    url: '/api/feed/user/dynamic',
    method: 'get',
    data
  });
}

// 我的动态
export function getUserParticipation(data = {}) {
  return request({
    url: '/api/feed/user/participation',
    method: 'get',
    data
  });
}
