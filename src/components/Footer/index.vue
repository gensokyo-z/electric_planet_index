<template>
  <footer class="component-footer">
    <div class="footer-layout">
      <article class="top w flex-aend  ">
        <div class="left">
          <div class="flex-col logo"
            @click="goUrl">
            <h1 class="yellow">电动</h1>
            <h1>星球</h1>
          </div>
          <div class="desc">
            <h2>智能电动车的记事本</h2>
          </div>
        </div>
        <div class="middle">
          <div class="title">
            <router-link to="/index"
              tag="span">星球首页</router-link>
            <router-link to="/planet"
              tag="span">星球社区</router-link>
          </div>
          <div class="addr">地址：广东省广州市番禺区南国奥园小资天堂小资5街106房</div>
        </div>
        <div class="right flex-col-cc">
          <img :src="qrCode">
          <span>扫描关注</span>
          <span>电动星球公众号</span>
        </div>
      </article>
      <article class="bottom w">
        <a href="https://beian.miit.gov.cn/#/Integrated/index"
          target="_blank">网站备案号：粤ICP备2020101099号-1</a>
      </article>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'Footer',
  components: {},
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
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.component-footer {
  padding: 30px 0;
  height: 260px;
  background-color: #000;
  color: #fff;
  .footer-layout {
    margin: -13px auto;
    width: 1200px;
  }
  .top {
    padding-bottom: 29px;
    border-bottom: 1px solid #797979;
    .left {
      margin-right: 76px;
      .logo {
        margin-bottom: 30px;
        cursor: pointer;
        h1 {
          line-height: 1.2em;
        }
        .yellow {
          color: #efd306;
        }
      }
      .desc {
        font-size: 18px;
        font-weight: 600;
      }
    }
    .middle {
      margin-right: 460px;
      width: 400px;
      height: 120px;
      font-size: 14px;
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      .title {
        padding-top: 20px;
        span{
          padding-right: 30px;
          cursor: pointer;
        }
      }
    }
    .right {
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
  .bottom {
    padding-top: 40px;
    a {
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>
