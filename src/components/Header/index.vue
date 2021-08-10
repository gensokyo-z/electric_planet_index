<!--顶部header组件-->
<template>
  <header class="component-header is-fixed">
    <div class="component-header-content">
      <a class="header-logo"
         @click="goUrl('homePage')">
        <img src="@/assets/images/logo.png"
             alt="logo" class="logo-img">
        <img src="@/assets/images/logo_text.png" alt="logo_text" class="logo-text">
      </a>
      <div class="header-nav">
        <div :class="['nav-item', {'selected':item.checked}]"
             v-for="(item, index) in navList"
             :key="index"
             @click="handlerNav(item)">{{ item.name }}
        </div>
      </div>
      <Search @getSearch="getSearch"
              v-show="showSearchList.includes($route.path)"
              ref="search"/>
      <div class="header-write"
           v-if="$state.token">发布<img src="@/assets/images/post.png" alt="">
        <ul class="post-menu hidden">
          <li @click="goUrl('/post?type=Dynamic')">发布动态</li>
          <li @click="goUrl('/post?type=Article')">发布文章</li>
          <li @click="goUrl('/post?type=Video')">发布视频</li>
        </ul>
      </div>
      <div class="flex-cc msg"
           v-if="$state.token"
           @click="goUrl('/message')">
        <img src="@/assets/images/alert.png" alt="" class="ico-alert">
        <div class="badeg" v-if="msgCount>0">{{ msgCount }}</div>
      </div>
      <div class="header-login">
        <div v-if="$state.token"
             class="user-info">
          <img :src="avatar" class="avatar">
          <span class="user-name">{{ $state.userInfo.username }}</span>
          <div class="logout hidden">
            <div class="user-panel ">
              <ul class="user-menu">
                <li class="user-menu-item"
                    @click="goUrl('/mine')">个人中心
                </li>
                <li class="user-menu-item"
                    @click="goUrl('/profile')">发布信息管理
                </li>
                <li class="user-menu-item"
                    @click="goUrl('/fl')"
                >粉丝/关注管理
                </li>
              </ul>
              <div class="logout-btn">
                <button @click="logout">退出登录</button>
              </div>
            </div>
          </div>
        </div>
        <div class="unLogin" v-else>
          <img :src="avatar" class="avatar">
          <a class="login-item"
             @click="showLogin">登录/注册</a>
        </div>

      </div>
    </div>
    <Login ref="login"/>
  </header>
</template>

<script type="text/babel">
import util from '@/utils/util';
import { logout } from '@/api/auth';

export default {
  name: 'BaseHeader',
  data() {
    return {
      showSearchList: ['/index'],
      navList: [
        {
          name: '首页',
          path: '/index',
          checked: false
        },
        {
          name: '关注',
          path: '/attention',
          checked: false
        }
        // {
        //   name: '星球视频',
        //   path: '/video',
        //   checked: false
        // }
        // {
        //   name: '消息',
        //   path: '/message',
        //   checked: false
        // }
      ],
      msgCount: 0
    };
  },
  computed: {
    avatar() {
      if (this.$state.userInfo && this.$state.userInfo.avatar) {
        return this.$state.userInfo.avatar;
      } else {
        return util.defaultAvatar('');
      }
    }
  },
  methods: {
    getSearch(kw) {
      this.$emit('getSearch', kw);
    },
    showLogin() {
      this.$refs.login.visible = true;
    },
    goUrl(url) {
      if (url === '/login') {
        return this.$bus.$emit('login', true);
      } else if (url === 'homePage') {
        return (window.location.href = '//ddxq.tech');
      }
      this.$router.push(url);
    },
    handlerNav(item) {
      this.$router.replace(item.path);
    },
    logout() {
      logout().then(() => {
        util.delcookie('TOKEN');
        window.location.href = '//ddxq.tech';
      });
    },
    setSearch(kw) {
      this.$refs.search.keyWord = kw;
    }
  },
  components: {
    Search: () => import('../Search'),
    Login: () => import('../Login')
  },
  watch: {
    $route(val) {
      if (val.path) {
        this.navList.forEach(e => {
          e.checked = e.path === this.$route.path;
        });
      }
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.component-header {
  display: flex;
  height: 64px;
  background-color: #39393b;
  color: #424242;

  &.is-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2001;
  }
}

.component-header-content {
  margin: 0 auto;
  padding-right: 50px;
  width: 1300px;
  display: flex;
  align-items: center;

  .header-logo {
    margin-right: 56px;
    width: 120px;
    height: 30px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;

    .logo-img {
      margin-right: 10px;
      width: 30px;
      height: 30px;
    }

    .logo-text {
      width: 80px;
      height: 20px;
    }

    cursor: pointer;
  }

  .header-nav {
    // width: 226px;
    display: flex;
    margin-right: auto;

    .nav-item {
      position: relative;
      display: block;
      margin-right: 40px;
      line-height: 36px;
      font-size: 16px;

      color: #fff;
      cursor: pointer;

      &.selected {
        font-weight: 700;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          display: block;
          width: 100%;
          height: 5px;
          background: #ed7656;
          border-radius: 20px;
        }
      }
    }
  }

  .header-write {
    position: relative;
    margin-right: 109px;
    padding: 7px 46px;
    font-size: 14px;
    color: #fff;
    line-height: 20px;
    background: #ed7656;
    border-radius: 17px;
    cursor: pointer;

    > img {
      width: 8px;
      height: 8px;
    }

    &:hover {
      .post-menu {
        display: block;
      }
    }

    .post-menu {
      padding-top: 50px;
      position: absolute;
      top: -6px;
      left: 6px;
      filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25));
      > li {
        width: 120px;
        padding: 7px 32px;
        color: #5c6573;
        background: #fff;

        &:hover {
          background: #f5f5f5;
          color: #191919;
          font-weight: 600;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: 40px;
        right: 50px;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #fff;
      }
    }
  }

  .msg {
    position: relative;
    cursor: pointer;
  }

  .ico-alert {
    color: #fff;
    margin-right: 20px;
    width: 24px;
    height: 24px;
  }

  .badeg {
    position: absolute;
    top: -6px;
    right: 4px;
    padding: 1px 5px;
    font-size: 12px;
    border-radius: 9.5px;
    background: #ed7656;
    border: 2px solid #39393b;
    color: #fff;

  }

  .header-login {
    display: flex;
    align-items: center;

    .unLogin {
      display: flex;
      align-items: center;
      padding: 0 20px;
      line-height: 24px;
      // color: #2c2e3b;
      color: #fff;
      cursor: pointer;
    }

    .user-info {
      position: relative;
      display: flex;
      align-items: center;
      font-size: 16px;
      // color: #2c2e3b;
      color: #fff;
      border-radius: 8px;

      .logout {
        padding-top: 50px;
        transform: translate(-70px, 72px);
        position: absolute;
        top: -65px;
        right: -50px;
        z-index: 100;
        border-radius: 8px;
        filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25));

        .user-panel {
          position: relative;
          width: 275px;
          background-color: #fff;
          box-shadow: 0 0 4px 0 rgba(8, 15, 19, 0.06);

          &::before {
            content: '';
            position: absolute;
            top: -10px;
            right: 20px;
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 10px solid #fff;
          }

          .user-menu {
            padding-top: 21px;

            .user-menu-item {
              display: block;
              padding: 15px 20px;
              font-size: 14px;
              line-height: 20px;
              color: #333;

              &:hover {
                background-color: #f5f5f5;
                color: #8a8a8a;
              }
            }
          }
        }

        .logout-btn {
          margin: 0 20px;
          text-align: center;
          border-top: 1px solid #eaeaea;

          button {
            margin: 18px 0 28px 0;
            background: #fff;
            padding: 8px 90px;
            font-size: 13px;
            border: 1px solid #39393b;
            box-sizing: border-box;
            border-radius: 17px;
            cursor: pointer;
          }
        }
      }

      &:hover .logout {
        display: block;
      }
    }

    .avatar {
      margin: 10px 5px 10px 30px;
      width: 30px;
      height: 30px;
      background-size: cover;
      background-position: 50%;
      border-radius: 15px;
      cursor: pointer;
      overflow: hidden;
    }

    .user-name {
      color: #fff;
      font-size: 12px;
      line-height: 17px;
    }
  }
}
</style>
