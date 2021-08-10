<template>
  <footer class='footer flex-col'>
    <div class='flex logo'>
      <img src='@/assets/images/logo_text2.png' alt=''>
      <span>智能电动车的记事本</span>
    </div>
    <div class='flex link'>
      <a>关于</a><a>联系我们</a><a>商务合作</a><a>下载APP</a>
    </div>
    <div class='backup'>
      备案号：粤ICP备2020101099号-1
    </div>
    <div class='code flex-aend'>
      <img :src='qrCode'>
      <div class='flex-col'>
        <span>扫描关注</span>
        <span>电动星球公众号</span>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'Footer',
  data() {
    return {
      qrCode: '//ddxq.tech/community/ddxq.jpg'
    };
  },
  methods: {
    goUrl() {
      window.location.href = '//ddxq.tech';
    }
  }
};
</script>
<style lang='less' scoped>
.footer {
  padding: 12px 24px;

  .logo {
    margin-bottom: 24px;

    > img {
      width: 70px;
      //height: 22px;
      margin-right: 13px;
    }

    > span {
      font-size: 14px;
      line-height: 20px;
      color: #5c6573;
    }
  }

  .link {
    margin-bottom: 18px;

    > a {
      margin-right: 7px;
      line-height: 10px;
      font-size: 14px;
      color: #39393b;
      cursor: pointer;
    }

    a + a {
      padding-left: 8px;
      border-left: 1px solid #39393b;
    }
  }

  .backup {
    margin-bottom: 17px;
    font-size: 14px;
    line-height: 20px;
    color: #929da5;
  }

  .code {
    > img {
      width: 88px;
      height: 88px;
      margin-right: 8px;
    }
    span{
      font-size: 14px;
      line-height: 20px;
      color: #929DA5;
    }
  }
}
</style>
