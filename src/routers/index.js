import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "index" */ '@/views/index/index.vue'),
    name: 'home',
    meta: {
      title: '电动星球',
      keepAlive: false,
    }
  },
  {
    path: '/index',
    name: 'index',
    component: () => import(/* webpackChunkName: "index" */ '@/views/index'),
    meta: {
      title: '电动星球',
      keepAlive: false,
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login'),
    meta: {
      title: '登录',
      keepAlive: false,
    }
  },
  {
    path: '/postdetail',
    name: 'postDetail',
    component: () => import(/* webpackChunkName: "docdetail" */ '@/views/index/detail.vue'),
    meta: {
      title: '文章详情',
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
