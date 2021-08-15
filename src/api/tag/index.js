import request from '@/utils/request';

// 加入星球
export function getTags() {
  return request({
    url: `/api/admin/v2/tags`,
    method: 'get'
  });
}

// 标签列表
export function getAllTags() {
  return request({
    url: `/api/admin/tags`,
    method: 'get'
  });
}

// 获取用户自定义标签
export function getCustomTags() {
  return request({
    url: `/api/feed/user/customTags`,
    method: 'get'
  });
}

// 设置用户自定义标签
export function setCustomTags(data) {
  return request({
    url: `/api/feed/user/customTags`,
    method: 'post',
    data
  });
}
