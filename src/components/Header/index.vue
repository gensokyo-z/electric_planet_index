<!--顶部header组件-->
<template>
  <header class="component-header is-fixed">
    <div class="component-header-content">
      <a class="header-logo"
         @click="goUrl('/')">
        <img src="@/assets/images/logo.png"
             alt="logo"><span>电动星球</span>
      </a>
      <div class="header-nav">
        <div :class="['nav-item', {'selected':item.checked}]"
             v-for="(item, index) in navList"
             :key="index"
             @click="handlerNav(item)">{{item.name}}</div>

      </div>
      <Search @getSerch="getSerch"
              v-show="$route.path ==='/'"
              ref="search" />
      <div class="header-write"
           v-if="$state.token"
           @click="goUrl('/post')"><i class="iconfont iconbiji"></i> 写文章</div>
      <div class="header-login">
        <div v-if="$state.token"
             class="user-info">
          <span>{{$state.userInfo.username}}</span>
          <img :src="avatar">
          <div class="logout hide">
            <div class="user-panel">
              <ul class="user-menu">
                <li class="user-menu-item"
                    @click="goUrl('/mine')">个人中心</li>
                <li class="user-menu-item"
                    @click="logout">退出</li>
              </ul>
            </div>
          </div>
        </div>
        <a class="login-item"
           v-else
           @click="goUrl('/login')">注册/登录</a>

      </div>
    </div>
  </header>
</template>

<script type="text/babel">
import util from '@/utils/util'
import { logout } from '@/api/auth'
export default {
  name: 'BaseHeader',
  data () {
    return {
      navList: [
        {
          name: '资讯',
          path: '/',
          checked: false
        }, {
          name: '星球',
          path: '/planet',
          checked: false
        }, {
          name: '消息',
          path: '/message',
          checked: false
        }
      ]
    };
  },
  computed: {
    avatar () {
      if (this.$state.userInfo && this.$state.userInfo.avatar) {
        return this.$state.userInfo.avatar
      } else {
        return util.defaultAvatar('')
      }
    }
  },
  methods: {
    getSerch (kw) {
      this.$emit('getSerch', kw)
    },
    goUrl (url) {
      if (url === '/login') {
        url += '?redirect=' + encodeURIComponent(location.href)
      }
      this.$router.push(url)
    },
    handlerNav (item) {
      this.$router.push(item.path)
    },
    logout () {
      logout().then(() => {
        util.delcookie('TOKEN');
        this.$router.push('/login')
      })
    },
    setSearch (kw) {
      this.$refs.search.keyWord = kw
    }
  },
  mounted () {
    this.navList.forEach(e => {
      if (e.path === this.$route.path) {
        e.checked = true
      }
    })
  },
  components: {
    Search: () => import('../Search')
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
.component-header {
  display: flex;
  height: 50px;
  background-color: hsla(0, 0%, 100%, 0.95);
  color: #424242;
  border-bottom: 1px solid #f7f7fa;
  &.is-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 200;
  }
}
.component-header-content {
  margin: 0 auto;
  padding: 0 50px;
  width: 1300px;
  display: flex;
  cursor: pointer;
  .header-logo {
    margin: 10px 80px 10px 0;
    width: 120px;
    height: 30px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    img {
      margin-right: 5px;
      width: 30px;
      height: 30px;
    }
  }
  .header-nav {
    // width: 226px;
    display: flex;
    margin-right: auto;
    .nav-item {
      position: relative;
      display: block;
      margin: 0 15px;
      height: 50px;
      line-height: 50px;
      cursor: pointer;
      &.selected {
        font-weight: 700;
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          display: block;
          width: 100%;
          height: 3px;
          background-color: #ffe000;
          border-radius: 5px;
        }
      }
    }
  }
  .header-write {
    display: block;
    margin: 12px 20px;
    padding: 0 15px;
    line-height: 26px;
    background-color: #ffe000;
    border-radius: 15px;
  }
  .header-login {
    display: flex;
    align-items: center;
    .login-item {
      padding: 0 20px;
      line-height: 24px;
      color: #2c2e3b;
      display: block;
      border-radius: 15px;
      border: 1px solid #afb3ba;
      cursor: pointer;
    }
    .user-info {
      position: relative;
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #2c2e3b;
      .hide {
        display: none;
      }
      .logout {
        padding-top: 50px;
        transform: translate(10px, 40px);
        position: absolute;
        z-index: 100;
        .user-panel {
          position: relative;
          width: 150px;
          background-color: #fff;
          box-shadow: 0 0 4px 0 rgba(8, 15, 19, 0.06);
          border-radius: 4px;
          &::before {
            content: '';
            position: absolute;
            top: -6px;
            right: 18px;
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #fff;
          }
          .user-menu-item {
            border-bottom: 1px solid #f2f2f2;
            display: block;
            padding: 15px 20px;
            font-size: 14px;
            line-height: 20px;
            &:hover {
              background-color: #f5f5f5;
              color: #8a8a8a;
            }
          }
        }
      }
      &:hover .logout {
        display: block;
      }
    }
    img {
      margin: 10px 0 10px 20px;
      width: 30px;
      height: 30px;
      background-size: cover;
      background-position: 50%;
      border-radius: 15px;
      cursor: pointer;
      overflow: hidden;
    }
  }
}
</style>
