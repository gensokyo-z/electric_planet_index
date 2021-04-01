<template>
  <section class="login">
    <el-dialog class="login-dialog"
      :visible.sync="visible"
      append-to-body
      :lock-scroll="false"
      :close-on-click-modal="false"
      :before-close="closeDialog"
      width="390px">
      <div class="top"
        v-if="!isOthers">
        <p class="title">
          <span>快捷登录注册</span>
        </p>
        <span class="title-desc">未注册的手机号码将自动注册并登录</span>
      </div>
      <div class="top"
        v-else>
        <p class="title">
          <span>首次第三方登录需绑定手机</span>
        </p>
        <span class="title-desc">首次第三方登录需要验证手机号码</span>
      </div>
      <div class="input-box">
        <el-input type="tel"
          :maxlength="11"
          placeholder="请输入手机号"
          v-model="phone"
          class="phone"></el-input>
        <div class="flex relative">
          <el-input type="tel"
            :maxlength="6"
            v-model="verify"
            @keyup.native.enter="handleLogin"
            placeholder="请输入验证码"
            class="verify"></el-input>
          <span class="get-verify"
            @click="sendCode">{{second === 60 ? '获取验证码': `重新发送${second}s`}}</span>
        </div>
        <button class="btn_r login_btn"
          @click="handleLogin">登录</button>
      </div>
      <div class="others-login flex flex-middle"
        v-if="!isOthers">
        <p>第三方账号登录:</p>
        <a class="iconfont iconweixin"
          @click="wechatLogin"></a>
        <!-- <a class="qq"
           href="/login/qqLogin"></a>
        <a class="weibo"
           href="/login/weiboLogin"></a> -->
      </div>
      <!-- <div class="login-desc">登录和注册代表同意电动星球<a href="/about#privacy" target="_blank">《隐私政策》</a>和<a href="/about#user-agreement" target="_blank">《用户协议》</a></div> -->
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
      code: ''
    };
  },
  beforeCreate() {
    // 微信跳转code
    if (this.$route.query.code && this.$route.query.state === 'wechat') {
      util.setStorage('wxCode', this.$route.query.code);
      this.$router.push(this.$route.path);
    }
    // 绑定微信
    if (this.$route.query.code && this.$route.query.state === 'bind') {
      util.setStorage('bindCode', this.$route.query.code);
      this.$router.push(this.$route.path);
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
      sendSms(obj)
        .then(res => {
          if (res.code === 200) {
            this.$message('验证码已经发送到您的手机');
            this.calcTime();
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {
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
        path(obj)
          .then(res => {
            if (res.code === 200) {
              let token = this.isOthers ? this.code : res.data.access_token;
              util.setcookie('TOKEN', token);
              this.$store.commit('setToken', token);
              this.$store.dispatch('getInfo');
              this.closeDialog();
              // window.location.reload();
            }
          })
          .catch(err => {
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
      })
        .then(res => {
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
        })
        .catch(() => {
          this.isOthers = true;
          this.visible = true;
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
      }, 200);
    }
  },
  beforeDestroy() {
    timer && clearInterval(timer);
  }
};
</script>

<style lang="less" scoped>
.login-dialog {
  .flex {
    display: flex;
  }
  .relative {
    position: relative;
  }
  /deep/ .el-dialog {
    border-radius: 4px;
    .el-dialog__header {
      padding: 0;
      .el-dialog__headerbtn {
        top: 44px;
        right: -54px;
        font-size: 24px;
        .el-dialog__close {
          color: #fff;
        }
      }
    }
    .el-dialog__body {
      padding: 0;
      height: 560px;
      width: 310px;
      margin: 0 auto;
    }
  }
  .top {
    padding-top: 50px;
    width: 310px;
    margin: 0 auto 50px;
    .title {
      font-size: 22px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: #333;
      line-height: 30px;
    }
    .title-desc {
      font-size: 12px;
      color: #8c8e90;
      text-align: left;
    }
  }
  .input-box {
    /deep/ .el-input {
      padding: 0;
      margin: 0;
      min-height: 50px;
      min-width: 100px;
      input {
        min-height: 50px;
        min-width: 100px;
        color: #333;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        border: none;
        width: 310px;
        height: 50px;
        border-radius: 10em;
        background: #f9f9fa;
        display: block;
        margin: 0 auto;
        text-indent: 20px;
      }
    }
    .phone {
      margin-bottom: 16px;
    }
    .btn_r {
      width: 310px;
      height: 50px;
      background: #ffe019;
      padding: 10px 20px;
      border-radius: 10em;
      border: none;
      outline: unset;
      cursor: pointer;
      display: block;
      margin: 30px auto;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
    .get-verify {
      position: absolute;
      top: 14px;
      right: 24px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 16px;
      font-weight: 400;
      color: #666;
      line-height: 22px;
    }
  }
  .others-login {
    margin: 50px auto 0;
    width: 310px;
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #333;
    line-height: 20px;
    .iconweixin {
      color: #52b576;
      font-size: 40px;
      &:hover {
        color: #7bf1a6;
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
}
</style>
