import request from '@/utils/request';

// 标签列表
export function getTags() {
  return request({
    url: `/api/admin/tags`,
    method: 'get'
  });
}
