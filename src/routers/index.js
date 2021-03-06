import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const routes = [
  // {
  //   path: '/index',
  //   component: () => import(/* webpackChunkName: "index" */ '@/views/index/index.vue'),
  //   name: 'home',
  //   meta: {
  //     title: '电动星球',
  //     keepAlive: true
  //   }
  // },
  {
    path: '/index',
    name: 'index',
    component: () => import(/* webpackChunkName: "index" */ '@/views/index'),
    meta: {
      title: '电动星球',
      keepAlive: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login'),
    meta: {
      title: '登录',
      keepAlive: false
    }
  },
  {
    path: '/planet',
    name: 'planet',
    component: () => import(/* webpackChunkName: "planet" */ '@/views/planet'),
    meta: {
      title: '星球',
      keepAlive: false
    }
  },
  {
    path: '/planetdetail',
    name: 'planetdetail',
    component: () => import(/* webpackChunkName: "planetdetail" */ '@/views/planet/detail'),
    meta: {
      title: '星球详情',
      keepAlive: false
    }
  },
  {
    path: '/docdetail',
    name: 'docdetail',
    component: () => import(/* webpackChunkName: "docdetail" */ '@/views/index/detail.vue'),
    meta: {
      title: '文章详情',
      keepAlive: false
    }
  },
  {
    path: '/post',
    name: 'post',
    component: () => import(/* webpackChunkName: "post" */ '@/views/post/index.vue'),
    meta: {
      title: '发布文章',
      keepAlive: false
    }
  },
  // {
  //   path: '/postedit',
  //   name: 'postedit',
  //   component: () => import(/* webpackChunkName: "postedit" */ '@/views/post/edit.vue'),
  //   meta: {
  //     title: '编辑文章',
  //     keepAlive: false
  //   }
  // },
  {
    path: '/message',
    name: 'message',
    component: () => import(/* webpackChunkName: "message" */ '@/views/message/index.vue'),
    meta: {
      title: '我的消息',
      keepAlive: false
    }
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import(/* webpackChunkName: "mine" */ '@/views/mine/index.vue'),
    meta: {
      title: '个人中心',
      keepAlive: false
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/mine/profile.vue'),
    meta: {
      title: '编辑个人资料',
      keepAlive: false
    }
  },
  {
    path: '/error',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '@/views/error'),
    meta: {
      title: '404页',
      keepAlive: false
    }
  },
  {
    path: '*',
    redirect: '/index'
  }
];
// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
//   return originalPush.call(this, location).catch(err => err);
// };
const router = new Router({
  mode: 'history',
  base: process.env.NODE_ENV === 'development' ? '' : '/community/',
  routes
});

export default router;
