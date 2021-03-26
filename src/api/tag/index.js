import request from '@/utils/request';

// 加入星球
export function getTags() {
  return request({
    url: `/api/admin/v2/tags`,
    method: 'get'
  });
}
