<template>
  <div id="app">
    <!-- <transition :name="direction"> -->
    <router-view v-if="!$route.meta.keepAlive"
                 class="page" />
    <!-- </transition> -->
    <!-- <transition :name="direction"> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"
                   class="page"></router-view>
    </keep-alive>
    <!-- </transition> -->
    <layout v-if="!isLogin"></layout>
  </div>
</template>

<script>
// import wx from 'wx'
export default {
  name: 'App',
  data () {
    return {
      isLogin: false
    };
  },
  computed: {
    // 动态设置过渡样式
    direction: function () {
      const currentPath = this.$route.path;
      const localRoute = (window.electricPlanetApp && window.electricPlanetApp.localRoute) || [];
      // console.log(localRoute, currentPath);
      // eslint-disable-next-line
      const index = localRoute.indexOf(currentPath);
      let tranName = '';
      tranName = 'fade'; // 首页，渐显
      // if (localRoute.length === 0) {
      //   tranName = 'fade'; // 首页，渐显
      // } else if (index >= 0) {
      // tranName = 'page-back'; // 回退，右划
      // } else {
      //   tranName = 'page-go'; // 进入新页面，左划
      // }
      return tranName;
    }
  },
  watch: {
    $route (to, from) {
      this.isLogin = typeof to.meta.isFooter === 'boolean' && !to.meta.isFooter;
    }
  },
  created () {
    // wx.config({
    //   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //   appId: 'wx72e3cff551efae8f', // 必填，公众号的唯一标识
    //   timestamp: '', // 必填，生成签名的时间戳
    //   nonceStr: '', // 必填，生成签名的随机串
    //   signature: '', // 必填，签名
    //   jsApiList: [] // 必填，需要使用的JS接口列表
    // });
  },
  methods: {}
};
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: @colorFont;
  font-size: @fontSizeH3;

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.01s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  .page {
    transition: all 0.8s ease-in-out;
  }
  .page-go-enter-active {
    transform: translate3d(100%, 0, 0);
    // transition: all 0.8s ease-in-out;
  }
  .page-go-enter-to {
    transform: translate3d(0, 0, 0);
    // transition: all 0.8s ease-in-out;
  }
  .page-go-leave-active {
    transform: translate3d(0, 0, 0);
    // transition: all 0.8s ease-in-out;
  }
  .page-go-leave-to {
    transform: translate3d(-100%, 0, 0);
    // transition: all 0.8s ease-in-out;
  }
  .page-back-enter-active {
    transform: translate3d(-100%, 0, 0);
    // transition: all 0.8s ease-in-out;
  }
  .page-back-enter-to {
    transform: translate3d(0, 0, 0);
    // transition: all 0.8s ease-in-out;
  }
  .page-back-leave-active {
    transform: translate3d(0, 0, 0);
    // transition: all 0.8s ease-in-out;
  }
  .page-back-leave-to {
    transform: translate3d(100%, 0, 0);
    // transition: all 0.8s ease-in-out;
  }
}
</style>
