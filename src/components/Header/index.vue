<!--顶部header组件-->
<template>
  <header class="component-header is-fixed">
    <div class="component-header-content">
      <a class="header-logo">
        <img src="@/assets/images/logo.png"
             alt="logo"><span>电动星球</span>
      </a>
      <div class="header-nav"></div>
      <Search @getSerch="getSerch" />
      <div class="down"></div>
      <div class="header-login">
        <a class="login-item">注册</a>
        <a class="login-item">登录</a>
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
  .header-logo {
    margin: 10px 229px 10px 0;
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
    width: 226px;
  }
  .down {
    width: 178px;
  }
  .header-login {
    display: flex;
    align-items: center;
    .login-item {
      padding: 0 10px;
      line-height: 50px;
      color: #2c2e3b;
      cursor: pointer;
    }
  }
}
</style>
