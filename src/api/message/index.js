import request from '@/utils/request';

// 粉丝列表
export function getFollowers(params = {}) {
  return request({
    url: '/api/feed/messages/followers',
    method: 'get',
    params
  });
}

// 点赞列表
export function getLiked(params = {}) {
  return request({
    url: '/api/feed/messages/liked',
    method: 'get',
    params
  });
}
// 评论列表

export function getComments(params = {}) {
  return request({
    url: '/api/feed/messages/comments',
    method: 'get',
    params
  });
}

// @列表
export function getAts(params = {}) {
  return request({
    url: '/api/feed/messages/ats',
    method: 'get',
    params
  });
}

//  消息-动态

export function getDynamic(params = {}) {
  return request({
    url: '/api/feed/messages/dynamic',
    method: 'get',
    params
  });
}
