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
  </div>
</template>

<script>
// import wx from 'wx'
// import Vue from 'vue';
export default {
  name: 'App',
  data() {
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
    $route(to, from) {
      this.isLogin = typeof to.meta.isFooter === 'boolean' && !to.meta.isFooter;
    }
  },
  created() {
    this.checkBrowser()
    // wx.config({
    //   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //   appId: 'wx72e3cff551efae8f', // 必填，公众号的唯一标识
    //   timestamp: '', // 必填，生成签名的时间戳
    //   nonceStr: '', // 必填，生成签名的随机串
    //   signature: '', // 必填，签名
    //   jsApiList: [] // 必填，需要使用的JS接口列表
    // });
    this.$store.dispatch('getAllPlanetList');
  },
  methods: {
    checkBrowser() {
      let browser = {
        versions: (function () {
          let u = navigator.userAgent;
          // var app = navigator.appVersion;
          return {
            // 移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, // IE内核
            presto: u.indexOf('Presto') > -1, // opera内核
            webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, // 是否iPad
            webApp: u.indexOf('Safari') === -1 // 是否web应该程序，没有头部与底部
          };
        })(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
      };
      if (browser.versions.mobile) {
        // // 判断是否是移动设备打开。
        // var ua = navigator.userAgent.toLowerCase(); // 获取判断用的对象
        // if (ua.match(/MicroMessenger/i) === 'micromessenger') {
        //   // 或if(ua.indexOf('micromessenger') != -1){}
        //   // 在微信中打开
        // }
        // if (ua.match(/WeiBo/i) === 'weibo') {
        //   // 在新浪微博客户端打开
        // }
        // if (ua.match(/QQ/i) === 'qq') {
        //   // 在QQ空间打开
        // }
        // if (browser.versions.ios) {
        //   // 是否在IOS浏览器打开
        // }
        // if (browser.versions.android) {
        //   // 是否在安卓浏览器打开
        // }
        location.href = 'https://ddxq.tech/h5';
      } else {
        // 否则就是PC浏览器打开
        // location.href = 'https://huawei.kuaidi100.com/page/errorpage?errorMsg=' + this.msg;
      }
    }
  }
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
