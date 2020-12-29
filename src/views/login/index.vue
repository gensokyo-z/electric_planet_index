<template>
  <section class="login">
    <div class="page-back">
      <i class="iconfont iconnav-dark"></i>
    </div>
    <div class="logo"
         v-show="!showFrom"></div>
    <div class="login-msg">欢迎来到电动星球</div>
    <div class="btn-box"
         v-show="!showFrom">
      <div class="wx-box">
        <button class="wx"
                @click="wxLogin">微信账号快捷登陆</button>
        <i class="iconfont icondenglu-weixin"></i>
      </div>
      <button class="change-mobile"
              @click="showFrom = true">输入手机号登陆/注册</button>
    </div>
    <div class="form"
         v-show="showFrom">
      <div class="form-item">
        <i class="iconfont icondenglu-dianhua"></i>
        <input type="tel"
               v-model.trim="form.phone"
               maxlength="11"
               placeholder="请输入手机号码">
      </div>
      <div class="form-item">
        <i class="iconfont icondenglu-mima"></i>
        <input type="tel"
               v-model.trim="form.code"
               oninput="if(value.length>6)value=value.slice(0,6)"
               placeholder="请输入短信验证码">
        <span class="down-code"
              @click="sendCode">{{second === 60 ? '输入验证码': `重新发送${second}s`}}</span>
      </div>
      <div class="login-btn"
           @click="handleLogin">登&ensp;录</div>
      <div class="tips">未注册用户登陆默认为新注册用户</div>
    </div>
    <!-- <div class="footer-tips"
         :class="{white:!showFrom}"><a>《服务条款》</a> 与 <a>《隐私政策》</a></div> -->
  </section>
</template>

<script>
import {  } from 'element-ui';
import {
  login,
  sendSms,
  getWechatAppid,
  wxLogin
  // bindAndLogin, bindWechat, getWechatJsSdk
} from '@/api/auth';
import util from '@/utils/util';
let timer = null;
export default {
  name: 'login',
  data () {
    return {
      showFrom: false,
      mobileReg: /^1\d{10}$/,
      second: 60,
      form: {
        phone: '',
        code: ''
      },
      appId: '',
      redirect: ''
    };
  },
  created () {
    if (this.$route.query.code && this.$route.query.state === 'wxlogin') {
      wxLogin({ code: this.$route.query.code }).then(res => {
        if (res.code === 200) {
          util.setcookie('TOKEN', res.data.access_token);
          this.$store.commit('setToken', res.data.access_token);
          this.$router.replace('/index');
        }
      });
    }
  },
  methods: {
    sendCode () {
      if (this.second !== 60) return;
      if (!this.mobileReg.test(this.form.phone)) {
        Toast('请输入正确的手机号码');
        return false;
      }
      const obj = {
        phone: this.form.phone
      };
      sendSms(obj)
        .then(res => {
          if (res.code === 200) {
            Toast('验证码已经发送到您的手机');
            this.calcTime();
          } else {
            Toast(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    validcode () {
      if (!this.mobileReg.test(this.form.phone)) {
        Toast('请输入正确的手机号码');
        return false;
      }
      if (this.isPhone) {
        if (!this.form.code) {
          Toast('请输入短信验证码');
          return false;
        }
        if (this.form.code.length < 6) {
          Toast('请输入6位短信验证码');
          return false;
        }
      }
      return true;
    },
    wxLogin () {
      getWechatAppid().then(res => {
        if (res.code === 200) {
          this.appId = res.data.app_id;
          location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9e3256b652743b0a&redirect_uri=https%3A%2F%2Fddxq.tech%2Fh5%2Flogin&response_type=code&scope=snsapi_userinfo&state=wxlogin#wechat_redirect`;
        }
      });
    },
    handleLogin () {
      if (this.validcode) {
        let obj = {
          phone: this.form.phone,
          captcha: this.form.code
        };
        login(obj)
          .then(res => {
            if (res.code === 200) {
              util.setcookie('TOKEN', res.data.access_token);
              this.$store.commit('setToken', res.data.access_token);
              if (this.redirect) {
                location.href = (decodeURIComponent(this.redirect));
              } else {
                this.$router.replace('/index');

              }
            } else {
              Toast(res.msg);
            }
          })
          .catch(err => {
            Toast(err.msg);
          });
      }
    },
    calcTime () {
      timer && clearInterval(timer);
      timer = setInterval(() => {
        if (!this.second--) {
          clearInterval(timer);
          timer = null;
          this.second = 60;
        }
      }, 1000);
    }
  },
  beforeDestroy () {
    timer && clearInterval(timer);
  }
};
</script>

<style scoped  lang="less" rel="stylesheet/less" src='./index.less' >
</style>
