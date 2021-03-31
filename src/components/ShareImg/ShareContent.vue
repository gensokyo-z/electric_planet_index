<template>
  <section class="share-content"
    ref="dowmImg">
    <div class="share-header">
      <img class="logo"
        src="@/assets/images/logo.png">
      <span>电动星球</span>
    </div>
    <div class="share-body">
      <div class="header-title">
        <div class="left">
          <img :src="content.planetBg"
            class="icon">
          <span></span>
          <span class="planet"
            v-if="content.planet">{{content.planet.name}}</span>
        </div>
      </div>
      <div class="content-body">
        <div class="item-title">{{content.title}}</div>
        <div class="item-content">
          <div class="qr-code"
            ref="qrCode"></div>
        </div>
      </div>
      <div class="content-footer">
        <div class="user">
          <!-- <div class="user-info">
            <img class="avatar"
              :src="content.user.avatar">
            <span>{{content.user.username}}</span>
          </div> -->
          <div class="info">用微信扫描二维码</div>
          <div class="info">分享至好友和朋友圈</div>
        </div>
      </div>
    </div>

  </section>
</template>
<script>
import QRCode from 'QRCode';
import html2canvas from 'html2canvas';
export default {
  props: {
    content: {
      type: Object,
      default: () => {}
    },
    showShare: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      qrCode: null
    };
  },
  mounted() {
    // this.getCode();
  },
  methods: {
    dataURLToBlob(dataurl) {
      let arr = dataurl.split(',');
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    /* 保存图片的方法（即按钮点击触发的方法）
      第一个参数为需要保存的div的id名
      第二个参数为保存图片的名称 */
    saveImg() {
      let canvasID = this.$refs.dowmImg;
      let that = this;
      let a = document.createElement('a');
      html2canvas(canvasID, {
        useCORS: true,
        height: canvasID.scrollHeight, // canvas高
        width: canvasID.scrollWidth, // canvas宽
        backgroundColor: 'transparent'
      }).then(canvas => {
        let dom = document.body.appendChild(canvas);
        dom.style.display = 'none';
        a.style.display = 'none';
        document.body.removeChild(dom);
        let blob = that.dataURLToBlob(dom.toDataURL('image/png'));
        a.setAttribute('href', URL.createObjectURL(blob));
        // 这块是保存图片操作  可以设置保存的图片的信息
        a.setAttribute('download', '下载' + '.png');
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(blob);
        document.body.removeChild(a);
      });
    },
    getCode() {
      let url = '';
      if (this.$route.path === '/planetdetail') {
        url = `https://www.ddxq.tech/community/docdetail?id=${this.content.id}`;
      } else {
        url = location.href;
      }
      // eslint-disable-next-line no-unused-vars
      this.qrCode = new QRCode(this.$refs.qrCode, {
        text: url,
        width: 180,
        height: 180,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L
      });
    }
  },
  watch: {
    showShare: {
      handler(val) {
        if (val) {
          this.getCode();
        } else {
          const codeHtml = this.$refs.qrCode; // document.getElementById("qrcode");
          codeHtml.innerHTML = '';
        }
      },
      deep: true
    }
    // 图片转换格式的方法 直接使用就好  不需要知道为什么
  }
};
</script>
<style lang="less" scoped>
.share-content {
  width: 300px;
  border-radius: 20px;
  box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.1);
  .share-header {
    width: 100%;
    height: 50px;
    background: #ffdd27;
    display: flex;
    align-items: center;
    justify-content: center;

    .logo {
      width: 30px;
      height: 30px;
    }
    span {
      padding-left: 10px;
      color: rgba(0, 0, 0, 0.9);
      font-size: 18px;
      font-weight: 600;
    }
    border-radius: 20px 20px 0 0;
  }
  .share-body {
    width: 100%;
    padding: 28px 16px 16px 16px;
    background-color: #fff;
    border-radius: 0 0 20px 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    .header-title {
      margin-bottom: 17px;
      padding: 16px;
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(90deg, rgba(0, 0, 0, 0.1) 0%, rgba(226, 226, 226, 0.04) 100%);
      border-radius: 16px 16px 0 0;
      .left {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 8px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        span:nth-of-type(1) {
          padding-right: 8px;
          font-size: 18px;
          color: rgba(0, 0, 0, 0.45);
        }
        .planet {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.9);
        }
      }
    }
    .content-body {
      margin-top: 12px;
      .item-title {
        margin-left: 20px;
        overflow: hidden;
        font-size: 18px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
      }
      .item-content {
        margin-top: 16px;
        .qr-code {
          padding: 5px;
          width: 180px;
          height: 180px;
          margin: 0 auto;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          /deep/ canvas,
          /deep/ img {
            width: 167px;
            height: 167px;
          }
        }
      }
    }
    .content-footer {
      margin-top: 24px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .user {
        display: flex;
      }
      .user {
        flex-direction: column;
        width: 100%;
        .user-info {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          span {
            font-size: 18px;
            color: rgba(0, 0, 0, 0.9);
          }
          .avatar {
            margin-right: 16px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }
        }

        .info {
          width: 100%;
          margin: 0 auto;
          text-align: center;
          font-size: 18px;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
  }
}
</style>
