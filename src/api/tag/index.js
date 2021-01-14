import request from '@/utils/request';

// 标签列表
export function getTags() {
  return request({
    url: `/api/admin/tags`,
    method: 'get'
  });
}

// 修改标签
export function editTag(params) {
  return request({
    url: `/api/admin/tags/${params.id}`,
    method: 'put',
    data: params
  });
}

// 删除标签
export function delTag(id) {
  return request({
    url: `/api/admin/tags/${id}`,
    method: 'delete'
  });
}

// 新增标签
export function addTag(data) {
  return request({
    url: '/api/admin/tags',
    method: 'post',
    data: data
  });
}

// 标签列表
export function getTagList(query) {
  return request({
    url: '/api/admin/tags',
    method: 'get',
    params: query
  });
}

// 标签详情

export function getTagDetail(id) {
  return request({
    url: `/api/admin/tags/${id}`,
    method: 'get'
  });
}
