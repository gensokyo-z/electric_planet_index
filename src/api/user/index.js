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

// 我的参于
export function getUserParticipation(params = {}) {
  return request({
    url: '/api/feed/user/participation',
    method: 'get',
    params
  });
}

// 我的评论
export function getUserComments(params = {}) {
  return request({
    url: '/api/feed/user/comments',
    method: 'get',
    params
  });
}

// 获取他人信息
export function getOtheruser(params = {}) {
  return request({
    url: '/api/feed/user/otheruser',
    method: 'get',
    params
  });
}

// 获取用户动态
export function getOthusernews(params = {}) {
  return request({
    url: '/api/feed/user/othusernews',
    method: 'get',
    params
  });
}

// 关注某人

export function followUser(id) {
  return request({
    url: `/api/feed/users/${id}/follow`,
    method: 'post'
  });
}

// 关注列表
export function getFollower(params = {}) {
  return request({
    url: '/api/feed/user/follow',
    method: 'get',
    params
  });
}
