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
        <div class="nav-item selected">资讯</div>
        <div class="nav-item">星球</div>
        <div class="nav-item ">消息</div>
        <div class="nav-item">发布</div>
      </div>
      <Search @getSerch="getSerch" />
      <div class="down"></div>
      <div class="header-login">
        <a class="login-item"
           @click="goUrl('/login')">注册/登录</a>
      </div>
    </div>
  </header>
</template>

<script type="text/babel">
export default {
  name: 'BaseHeader',
  data () {
    return {};
  },
  computed: {
  },
  methods: {
    getSerch (kw) {
      console.log(kw);
    },
    goUrl (url) {
      if (url === '/login') {
        url += '?redirect=' + encodeURIComponent(location.href)
      }
      this.$router.push(url)
    }
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
  .down {
    width: 178px;
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
  }
}
</style>
