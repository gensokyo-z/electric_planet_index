import request from '@/utils/request';

// 新增文章
export function addPosts(data) {
  return request({
    url: `/api/feed/post`,
    method: 'post',
    data: data
  });
}
// 点赞文章
export function postLike(id) {
  return request({
    url: `/api/feed/posts/${id}/likes`,
    method: 'post'
  });
}

// 点赞取消文章
export function postUnlike(id) {
  return request({
    url: `/api/feed/posts/${id}/unlike`,
    method: 'post'
  });
}

// 获取文章一级评论列表（分页）
export function getPostsComments(params = {}) {
  return request({
    url: `/api/feed/posts/v2/${params.id}/comments`,
    method: 'get',
    params
  });
}

// 获取详情
export function getPostsDetail(id) {
  return request({
    url: `/api/feed/posts/${id}`,
    method: 'get'
  });
}

// 评论文章
export function postsComments(data = {}) {
  return request({
    url: `/api/feed/posts/${data.id}/comments`,
    method: 'post',
    data
  });
}

// 点赞评论
export function commentsLikes(id) {
  return request({
    url: `/api/feed/comments/${id}/likes`,
    method: 'post'
  });
}

// 点赞取消文章
export function commentsUnlikes(id) {
  return request({
    url: `/api/feed/comments/${id}/unlike`,
    method: 'post'
  });
}

// 关注某人
export function follows(id) {
  return request({
    url: `/api/feed/users/${id}/follow`,
    method: 'post'
  });
}

// 获取文章二级评论列表（分页）
export function getComments(params = {}) {
  return request({
    url: `/api/feed/comments/${params.id}`,
    method: 'get',
    params
  });
}

// 进行二级评论

export function comments(params = {}) {
  return request({
    url: `/api/feed/comments/v2/${params.id}`,
    method: 'post',
    params
  });
}
