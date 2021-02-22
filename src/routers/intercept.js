import router from './index';
import util from '@/utils/util';
import store from '@/stores/index.js';
const whiteList = ['/', '/index', '/planet', '/docdetail', '/planetdetail', '/login', '/error'];
// 路由导航守卫
router.beforeEach(async (to, from, next) => {
  // 登录权限
  // if (to.meta.requireAuth) {
  if (!whiteList.includes(to.path)) {
    // 判断是否校验登录权限
    if (!util.getcookie('TOKEN')) {
      // 判断是否登录，根据实际业务处理
      next({
        path: '/login'
      });
      return;
    }
  }
  if (util.getcookie('TOKEN')) {
    // 用户信息
    const hasRoles = store.state.userInfo && Object.keys(store.state.userInfo).length > 0;
    if (hasRoles) {
      // nginx重定向到index.html，前端主动跳转到首页
      if (to.fullPath === '/index.html') {
        return next({ path: '/' });
      } else {
        // 路由发生变化修改页面title
        if (to.meta.title) {
          document.title = to.meta.title;
        } else {
          document.title = '电动星球';
        }
        return next();
      }
    } else {
      try {
        // 检测是否有用户信息
        await store.dispatch('getInfo');
        await store.dispatch('getUserPlanetList');
        await store.dispatch('getAllPlanetList');
      } catch (error) {
        console.log(error);
      }
      // 路由发生变化修改页面title
      if (to.meta.title) {
        document.title = to.meta.title;
      } else {
        document.title = '电动星球';
      }
      return next();
    }
  }
  // 路由发生变化修改页面title
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = '电动星球';
  }
  next();
});

router.afterEach((to, from) => {
  if (!(from.path === '/' && from.name === null)) {
    setLocalRoute(to, from);
  }
});

function setLocalRoute(to, from) {
  // 本地已访问页面路由,存5条
  const localRoute = window.electricPlanetApp.localRoute || [];
  const from_index = localRoute.indexOf(from.path);
  const to_index = localRoute.indexOf(to.path);
  if (from_index < 0) {
    localRoute.unshift(from.path);
    to_index >= 0 && localRoute.splice(to_index, 1);
  }
  if (localRoute.length > 5) {
    localRoute.splice(0, 1);
  }
}
