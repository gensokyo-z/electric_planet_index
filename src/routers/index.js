import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import(/* webpackChunkName: "index" */ '@/views/index'),
    meta: {
      title: '电动星球',
      keepAlive: false
    }
  },
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
    path: '/planet',
    name: 'planet',
    component: () => import(/* webpackChunkName: "planet" */ '@/views/planet/index.vue'),
    meta: {
      title: '星球',
      keepAlive: false
    }
  },
  {
    path: '/message',
    name: 'message',
    component: () => import(/* webpackChunkName: "message" */ '@/views/message/index.vue'),
    meta: {
      title: '消息',
      keepAlive: false
    }
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import(/* webpackChunkName: "mine" */ '@/views/mine/index.vue'),
    meta: {
      title: '我的',
      keepAlive: false
    }
  },
  {
    path: '/creatdoc',
    name: 'creatdoc',
    component: () => import(/* webpackChunkName: "creatdoc" */ '@/views/creatdoc/index.vue'),
    meta: {
      title: '发布文章',
      isFooter: false
    }
  },
  {
    path: '/docdetail',
    name: 'docdetail',
    component: () => import(/* webpackChunkName: "docdetail" */ '@/views/index/detail.vue'),
    meta: {
      title: '文章详情',
      keepAlive: false,
      isFooter: false
    }
  },
  {
    path: '/planetdetail',
    name: 'planetdetail',
    component: () => import(/* webpackChunkName: "planetdetail" */ '@/views/planet/detail.vue'),
    meta: {
      title: '星球详情',
      keepAlive: false,
      isFooter: false
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/mine/profile.vue'),
    meta: {
      title: '个人资料',
      keepAlive: false,
      isFooter: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: {
      title: '登录',
      isFooter: false
    }
  },
  {
    path: '/error',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '@/views/error'),
    meta: {
      title: '404页',
      keepAlive: false,
      isFooter: false
    }
  },
  {
    path: '*',
    redirect: '/'
  }
];
// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
//   return originalPush.call(this, location).catch(err => err);
// };
const router = new Router({
  mode: 'history',
  base: process.env.NODE_ENV === 'development' ? '' : '/h5/',
  routes
});

export default router;
