<template>
  <section class='login'>
    <el-dialog class='login-dialog'
               :visible.sync='visible'
               append-to-body
               :lock-scroll='false'
               :close-on-click-modal='false'
               :show-close='false'
               :before-close='closeDialog'
               width='422px'>
      <div class='top por'>
        <span class='title-desc'>{{ isOthers ? '第三方' : '欢迎来到' }}</span>
        <p class='title'>
          <span>{{ isOthers ? '首次登录需绑定手机' : '电动星球' }}</span>
        </p>
        <img src='@/assets/images/Close_Square.png' alt='' class='close' @click='closeDialog'>
      </div>
      <div class='input-box'>
        <p class='label'>手机号</p>
        <el-input type='tel'
                  :maxlength='11'
                  placeholder='请输入手机号'
                  v-model='phone'
                  class='phone'></el-input>
        <p class='label'>验证码&emsp;<span class='err' v-show='inputErr'>验证码输入有误</span></p>
        <div class='flex por'>
          <el-input type='tel'
                    :maxlength='6'
                    v-model='verify'
                    @keyup.native.enter='handleLogin'
                    placeholder='请输入验证码'
                    :class="['verify',{err:inputErr}]"></el-input>
          <span :class="['get-verify' , {gary:second !== 60}]"
                @click='sendCode'>{{ second === 60 ? '发送验证码' : `倒计时&nbsp;${second}s` }}</span>
        </div>
        <div class='protocol'>
          <div class='apply' @click='isApply=!isApply'>
            <img src='@/assets/images/Tick_Square.png' alt='' v-show='isApply'>
            <img src='@/assets/images/Square.png' alt='' v-show='!isApply'>
            <a>同意协议</a>
          </div>
          <a class='forget'>忘记密码？</a>
        </div>
        <button class='btn_r login_btn'
                @click='handleLogin'>登录/注册
        </button>
      </div>
      <div class='others-login flex flex-cc'
           v-if='!isOthers'>
        <div @click='wechatLogin' class='wx' @mouseenter='hoverWx= true' @mouseleave='hoverWx = false'>
          <img src='@/assets/images/weixin.png' alt='' v-show='!hoverWx'>
          <img src='@/assets/images/weixin_hover.png' alt='' v-show='hoverWx'>
        </div>
        <!-- <a class="qq"
           href="/login/qqLogin"></a>
        <a class="weibo"
           href="/login/weiboLogin"></a> -->
      </div>
      <div class='login-desc'>登录和注册代表同意电动星球 <br />
        <a href='#' target='_blank'>《隐私政策》</a>和<a
          href='#' target='_blank'>《用户协议》</a>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { sendSms, wxLogin, bindAndLogin, wxRegister, bindWx } from '@/api/auth';
import util from '@/utils/util';

let timer = null;
export default {
  name: 'Login',
  data() {
    return {
      visible: false,
      phone: '',
      verify: '',
      isOthers: false,
      mobileReg: /^1\d{10}$/,
      second: 60,
      code: '',
      hoverWx: false,
      isApply: true,
      inputErr: false
    };
  },
  created() {
    const url = location.href;
    // 微信跳转code
    if (url.indexOf('code=') !== -1 && url.indexOf('state=wechat') !== -1) {
      util.setStorage('wxCode', url.match(/code=([0-9a-zA-z-_]+)/)[1]);
      this.$router.push(url.match(/\/community\/([a-zA-Z]+)/)[1]);
    }
    // 绑定微信
    if (url.indexOf('code=') !== -1 && url.indexOf('state=bind') !== -1) {
      util.setStorage('bindCode', url.match(/code=([0-9a-zA-z-_]+)/)[1]);
      this.$router.push(url.match(/\/community\/([a-zA-Z]+)/)[1]);
    }
  },
  mounted() {
    this.$bus.$on('login', flag => {
      this.visible = flag;
    });
    if (util.getStorage('wxCode')) {
      this.code = util.getStorage('wxCode');
      util.setStorage('wxCode', '');
      this.wxLogin();
    } else if (util.getStorage('bindCode')) {
      this.code = util.getStorage('bindCode');
      util.setStorage('bindCode', '');
      this.bindWx();
    }
  },
  methods: {
    sendCode() {
      if (this.second !== 60) return;
      if (!this.mobileReg.test(this.phone)) {
        this.$message('请输入正确的手机号码');
        return false;
      }
      const obj = {
        phone: this.phone
      };
      sendSms(obj).then(res => {
        if (res.code === 200) {
          this.$message('验证码已经发送到您的手机');
          this.calcTime();
        } else {
          this.$message(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    validcode() {
      if (!this.mobileReg.test(this.phone)) {
        this.$message('请输入正确的手机号码');
        return false;
      } else if (!this.verify) {
        this.$message('请输入短信验证码');
        return false;
      } else if (this.verify.length < 6) {
        this.$message('请输入6位短信验证码');
        return false;
      }
      return true;
    },
    handleLogin() {
      if (this.validcode()) {
        let obj = {
          phone: this.phone,
          captcha: this.verify
        };
        let path = null;
        if (this.isOthers && this.code) {
          path = wxRegister;
          obj.token = this.code;
        } else {
          path = bindAndLogin;
        }
        path(obj).then(res => {
          if (res.code === 200) {
            let token = this.isOthers ? this.code : res.data.access_token;
            util.setcookie('TOKEN', token);
            this.$store.commit('setToken', token);
            this.$store.dispatch('getInfo');
            this.closeDialog();
            // window.location.reload();
          }
        }).catch(err => {
          if (err.code === 1012) {
            this.isOthers = false;
            this.verify = '';
          }
        });
      }
    },
    bindWx() {
      bindWx({
        code: this.code
      }).then(res => {
        this.$store.dispatch('getInfo');
      });
    },
    wxLogin(type) {
      wxLogin({
        code: this.code
      }).then(res => {
        if (res.code === 200) {
          if (res.data.haveuser === 0) {
            util.setcookie('TOKEN', res.data.user.access_token);
            this.$store.commit('setToken', res.data.user.access_token);
            this.$store.dispatch('getInfo').then(() => {
              this.closeDialog();
            });
          } else {
            this.isOthers = true;
            this.visible = true;
            this.code = res.data.user.access_token;
          }
        }
      }).catch(() => {
        this.isOthers = true;
        this.visible = true;
        this.inputErr = true;
      });
    },
    calcTime() {
      timer && clearInterval(timer);
      timer = setInterval(() => {
        if (!this.second--) {
          clearInterval(timer);
          timer = null;
          this.second = 60;
        }
      }, 1000);
    },
    wechatLogin() {
      let uri = encodeURIComponent(window.location.href);
      // let uri = encodeURIComponent('https://www.ddxq.tech/community/index');
      window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=wxba4899f4541e74cb&redirect_uri=${uri}&response_type=code&scope=snsapi_login&state=wechat#wechat_redirect`;
    },
    closeDialog() {
      this.visible = false;
      setTimeout(() => {
        this.code = '';
        this.phone = '';
        this.verify = '';
        this.isOthers = false;
        this.isApply = true;
        this.inputErr = false;
      }, 200);
    }
  },
  beforeDestroy() {
    timer && clearInterval(timer);
  }
};
</script>

<style lang='less' scoped>
.login-dialog {

  /deep/ .el-dialog {
    .el-dialog__header {
      padding: 0;
    }

    .el-dialog__body {
      padding: 0;
      height: 617px;
      width: 422px;
      margin: 0 auto;
    }
  }

  .top {
    padding-top: 35px;
    width: 350px;
    margin: 0 auto 18px;

    .title {
      font-family: PingFang SC;
      font-style: normal;
      color: #191919;
      font-weight: 600;
      font-size: 30px;
      line-height: 42px;
    }

    .title-desc {
      margin-bottom: 4px;
      font-size: 16px;
      color: #5c6573;
      line-height: 22px;
      text-align: left;
    }

    .close {
      position: absolute;
      top: 42px;
      right: 0;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }

  .input-box {
    display: flex;
    flex-direction: column;

    /deep/ .el-input {
      padding: 0;
      margin: 0;
      min-height: 50px;
      min-width: 100px;

      input {
        color: #191919;
        font-size: 14px;
        width: 350px;
        height: 50px;
        border: 1px solid #eaeaea;
        box-sizing: border-box;
        border-radius: 4px;
        display: block;
        margin: 0 auto;
      }

      &.err {
        input {
          border-color: #ed7656;
        }
      }
    }

    .phone {
      margin-bottom: 18px;
    }

    .btn_r {
      width: 350px;
      height: 50px;
      padding: 10px 20px;
      border: none;
      outline: unset;
      cursor: pointer;
      display: block;
      margin: 24px auto;
      font-size: 16px;
      color: #929da5;
      border-radius: 4px;
      background: #39393b;

      &:hover {
        color: #fff;
        background: #d5d5d5;
      }
    }

    .get-verify {
      position: absolute;
      top: 14px;
      right: 64px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 400;

      line-height: 22px;
      color: #929da5;
      &.gary {
        color: #191919;
        cursor: default;
      }

      &::before {
        position: absolute;
        top: -4px;
        left: -26px;
        content: '';
        width: 1px;
        height: 30px;
        background: #eaeaea;
      }
    }

    .label {
      margin-left: 36px;
      padding-bottom: 10px;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 22px;
      color: #5c6573;

      .err {
        color: #ed7656;
      }
    }
  }

  .protocol {
    margin: 20px 36px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .apply {
      display: flex;
      align-items: center;
      cursor: pointer;

      > img {
        margin-right: 5px;
        width: 14px;
        height: 14px;
      }

      > a {
        font-size: 14px;
        color: #929da5;
      }
    }

    .forget {
      color: #929da5;
      cursor: pointer;
    }
  }

  .others-login {
    margin: 0 auto;
    width: 310px;
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #333;
    line-height: 20px;

    .wx {
      border: 1px solid #eaeaea;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #39393b;
      color: #929da5;

      img {
        width: 36px;
        height: 36px;
      }

      &:hover {
        border: none;
        color: #fff;
        background: #d5d5d5;
      }
    }

    a {
      width: 40px;
      height: 40px;
      margin-left: 16px;
      cursor: pointer;
      border-radius: 50%;
    }
  }

  .login-desc {
    margin: 24px 36px 0;
    text-align: center;
  }
}
</style>
