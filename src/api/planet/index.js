import request from '@/utils/request';

// 加入星球
export function joinPlanet(id) {
  return request({
    url: `/api/feed/planets/${id}/join`,
    method: 'post'
  });
}

// 退出星球
export function quitPlanet(id) {
  return request({
    url: `/api/feed/planets/${id}/quit`,
    method: 'post'
  });
}

// 获取星球下的文章（分页）
export function getPlanetPosts(params) {
  return request({
    url: `/api/feed/planets/${params.id}/posts`,
    method: 'get',
    params
  });
}

// 获取星球列表
export function getPlanetList() {
  return request({
    url: `/api/feed/planets`,
    method: 'get'
  });
}

// 获取星球列表(joined)
export function getJoinedPlanetList() {
  return request({
    url: `/api/feed/planets/user/joined`,
    method: 'get'
  });
}

// 获取星球详情
export function getPlanetDetail(id) {
  return request({
    url: `/api/feed/planets/${id}`,
    method: 'get'
  });
}
