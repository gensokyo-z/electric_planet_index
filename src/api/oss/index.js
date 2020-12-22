import request from '@/utils/request';

// 直接上传文件
export function getUserInfo(params = {}) {
  return request({
    url: '/api/oss/upload',
    method: 'upload',
    params
  });
}

//  获取oss web端签名
export function getOssToken(params = {}) {
  return request({
    url: '/api/oss/token',
    method: 'get',
    params
  });
}
