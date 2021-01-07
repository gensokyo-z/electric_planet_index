<template>
  <section class="share-content"
           ref="dowmImg">
    <div class="share-header">
      <img class="avatar"
           src="@/assets/images/logo.png">
    </div>
    <div class="share-body">
      <div class="header-title">
        <div class="left">
          <svg class="icon"
               aria-hidden="true">
            <use xlink:href="#icontab-shouye-xingqiu"></use>
          </svg>
          <span></span>
          <span class="planet"
                v-if="content.planet">{{content.planet.name}}</span>
        </div>
      </div>
      <div class="content-body">
        <div class="item-title">{{content.title}}</div>
        <div class="item-content"
             v-html="content.content"></div>
      </div>
      <div class="content-footer">
        <div class="left">
          <div class="user-info">
            <img class="logo"
                 :src="content.user.avatar">
            <span>{{content.user.username}}</span>
          </div>
          <div class="info"
               v-if="content.planet">扫码查看更多{{content.planet.name}}相关内容</div>
        </div>
        <div class="right">
          <div class="qr-code"
               ref="qrCode"></div>
        </div>
      </div>
    </div>
    <div class="footer-btn">
      <a @click="saveImg">
        <svg class="icon"
             aria-hidden="true">
          <use xlink:href="#iconfenxiang-baocun"></use>
        </svg>
        <span>保存图片</span>
      </a>
      <a>
        <svg class="icon"
             aria-hidden="true">
          <use xlink:href="#iconfenxiang-fenxiang"></use>
        </svg>
        <span @click="showVanShare = true">分享链接</span>
      </a>
    </div>

  </section>
</template>
<script>
import Vue from 'vue';
import QRCode from 'QRCode';
import html2canvas from 'html2canvas';
export default {
  props: {
    content: {
      type: Object,
      default: () => { }
    },
    showShare: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      showVanShare: false,
      options: [
        // { name: '微信', icon: 'wechat' },
        // { name: '微博', icon: 'weibo' },
        // { name: 'QQ', icon: 'qq' },
        { name: '复制链接', icon: 'link' },
      ],
      data: {
        qrCode: null
      }
    };
  },
  methods: {
    onSelect (option) {
      this.showVanShare = false;
      switch (option.name) {
        case '微信':
          this.$message('分享到微信')
          break;
        case '微博':
          this.$message('分享到微博')
          break;
        case 'QQ':
          this.$message('分享到QQ')
          break;
        default:
          this.$copyText('http://ddxq.tech/h5/postdetail?share=1&id=' + this.content.id).then(
            () => {
              this.$message('复制成功!内容已经拷贝至剪贴板.');
            },
            () => {
              this.$message('复制失败');
            }
          );
          break;
      }
    },
    dataURLToBlob (dataurl) {
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
    saveImg () {
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
    }
  },
  watch: {
    showShare: {
      handler (val) {
        if (val) {
          // eslint-disable-next-line no-unused-vars
          this.qrCode = new QRCode(this.$refs.qrCode, {
            text: location.href,
            width: 92,
            height: 92,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.L
          });
        } else {
          const codeHtml = this.$refs.qrCode // document.getElementById("qrcode");
          codeHtml.innerHTML = '';
        }
      },
      deep: true
    },
    // 图片转换格式的方法 直接使用就好  不需要知道为什么
  }
};
</script>
<style lang="less" scoped>
.share-content {
  width: 632px;
  .share-header {
    width: 100%;
    height: 128px;
    background: #ffdd27;
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      width: 72px;
      height: 72px;
    }
    border-radius: 50px 50px 0 0;
  }
  .share-body {
    width: 100%;
    padding: 48px 32px 32px 32px;
    background-color: #fff;
    .header-title {
      margin-bottom: 34px;
      padding: 16px;
      width: 100%;
      height: 64px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 0%, rgba(255, 255, 255, 0.04) 100%);
      border-radius: 32px 32px 0 0;
      .left {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 16px;
          width: 48px;
          height: 48px;
        }
        span:nth-of-type(1) {
          padding-right: 16px;
          font-size: 28px;
          color: rgba(0, 0, 0, 0.45);
        }
        .planet {
          font-size: 28px;
          color: rgba(0, 0, 0, 0.9);
        }
      }
    }
    .content-body {
      margin-top: 48px;
      .item-title {
        height: 104px;
        overflow: hidden;
        font-size: 36px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
        line-height: 57px;
      }
      .item-content {
        margin-top: 32px;
        height: 176px;
        overflow: hidden;
        font-size: 29px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 44px;
      }
    }
    .content-footer {
      margin-top: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left,
      .right {
        display: flex;
      }
      .left {
        flex-direction: column;
        .user-info {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          span {
            font-size: 29px;
            color: rgba(0, 0, 0, 0.9);
          }
        }
        .avatar {
          margin-right: 16px;
          width: 48px;
          height: 48px;
        }
        .info {
          font-size: 24px;
          color: rgba(0, 0, 0, 0.45);
        }
      }
      .right {
        .qr-code {
          padding: 5px;
          width: 108px;
          height: 108px;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          /deep/ canvas,
          /deep/ img {
            width: 94px;
            height: 94px;
          }
        }
      }
    }
  }
  .footer-btn {
    width: 100%;
    background: #eeeeee;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 0 50px 50px;
    a {
      display: flex;
      align-items: center;
      margin: 38px 0;
      padding: 0 76px;
      justify-content: center;
      &:nth-of-type(1) {
        border-right: 1px solid #ccc;
      }
      span {
        font-size: 29px;
      }
      .icon {
        width: 27px;
        height: 27px;
        margin-right: 16px;
      }
    }
  }
}
</style>
