import request from '@/utils/request';

// 获取最新文章

export function getNewest(params = {}) {
  return request({
    url: '/api/feed/index/v2/newest',
    method: 'get',
    params
  });
}

// 获取热门文章

export function getHotest(params = {}) {
  return request({
    url: '/api/feed/index/hotest',
    method: 'get',
    params
  });
}

// 获取热门文章

export function getBanners(params = {}) {
  return request({
    url: '/api/admin/banners',
    method: 'get',
    params
  });
}
