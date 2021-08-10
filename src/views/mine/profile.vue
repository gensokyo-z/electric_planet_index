<template>
  <section class='profile'>
    <header class='profile-head flex-c-b'>
      <span class='title'>设置个人资料</span>
      <button class='save' @click='savaProfile'>保存</button>
    </header>
    <main class='profile-main flex-col'>
      <div class='avatar flex-v'>
        <el-upload action=''
                   :http-request='upload'
                   :show-file-list='false'
                   :on-success='handleAvatarSuccess'
                   :before-upload='beforeAvatarUpload'>
          <div class='avatar-img'>
            <img :src='profile.avatar' alt=''>
            <div class='avatar-mask hidden'>
              <div class='flex-col-cc'>
                <img src='@/assets/images/move.png' alt=''>
                <span>点击更换</span>
              </div>
            </div>
          </div>
        </el-upload>
        <div class='avatar-info flex-col'>
          <p><label>头像</label></p>
          <p class='desc'>照片上传规格要求：格式为JPG , JPEG ,</p>
          <p class='desc'>GIF 或者png. 大小 10MB以内。</p>
        </div>
      </div>
      <div class='nickname item'>
        <p><label>昵称</label> <span class='desc'>在社区中显示，最多20字。</span></p>
        <el-input class='nick-input'
                  type='text'
                  placeholder='在此输入您的昵称'
                  v-model='profile.username'
                  size='mini'></el-input>
      </div>
      <div class='item gender'>
        <p><label>性别</label></p>
        <el-radio-group v-model='profile.gender'
                        size='mini'>
          <el-radio-button :label='1'>男</el-radio-button>
          <el-radio-button :label='2'>女</el-radio-button>
          <el-radio-button :label='3'>保密</el-radio-button>
        </el-radio-group>
      </div>
      <div class='item regions'>
        <p><label>所在城市</label></p>
        <Cascader @setRegions='setRegions'
                  :regions='regions' />
      </div>
      <div class='item sign'>
        <p><label>签名</label><span>最多设置50字</span></p>
        <el-input type='textarea'
                  placeholder='在此设置您的签名'
                  v-model='profile.intro'
                  maxlength='50'
                  :rows='5'
                  clearable
                  resize='none'
                  show-word-limit>
        </el-input>
      </div>
      <div class='item wx flex-col'>
        <p><label>绑定</label></p>
        <div class='flex-c-b'>
          <p><span class='key'>手机号码</span><span class='value'>{{ phoneHidden }}</span></p>
          <a class='btn' @click='bindPhone'>更换手机号</a>
        </div>
        <div class='flex-c-b'>
          <p><span class='key'>微信</span><span class='value'>{{ $state.userInfo.unionid ? '已' : '未' }}绑定</span></p>
          <a class='btn' @click='bindWx'>{{ $state.userInfo.unionid ? '解绑' : '绑定' }}微信</a>
        </div>
      </div>
    </main>
    <el-dialog class='login-dialog'
               :visible.sync='phoneVisible'
               append-to-body
               :lock-scroll='false'
               :close-on-click-modal='false'
               :show-close='false'
               :before-close='closeDialog'
               width='422px'>
      <div class='top por'>
        <span class='title-desc'>更换手机号</span>
        <p class='title'>
          <span>新手机号</span>
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
        <button class='btn_r login_btn'
                @click='handleLogin'>完成
        </button>
      </div>
    </el-dialog>
    <el-dialog :visible='bindWxDialog'
               custom-class='bind-wx-dialog'
               width='390px'
               top='30vh'
               :show-close='false'>
      <div class='title'>确认解除绑定？</div>
      <div class='desc'>解除绑定后，将暂时无法从第三方快捷登录，需要验证手机后才可快捷登录。</div>
      <div class='btn-box'>
        <el-button class='btn'
                   @click='bindWxDialog = false'>取消
        </el-button>
        <el-button class='btn comfirm'>确认</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { setUserInfo } from '@/api/user';
import { sendSms, bindAndLogin, wxRegister } from '@/api/auth';
import util from '@/utils/util';

let timer = null;
export default {
  data() {
    return {
      profile: {
        username: '',
        avatar: '',
        gender: 0,
        intro: '',
        province: '',
        city: '',
        district: ''
      },
      formData: {},
      regions: '',
      bindWxDialog: false,
      phoneVisible: false,
      mobileReg: /^1\d{10}$/,
      second: 60,
      phone: '',
      verify: '',
      inputErr: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.profile = {
        username: this.$state.userInfo.username,
        avatar: this.$state.userInfo.avatar ? this.$state.userInfo.avatar : require('@/assets/images/def_avatar.png'),
        gender: this.$state.userInfo.gender,
        intro: this.$state.userInfo.intro,
        province: this.$state.userInfo.province,
        city: this.$state.userInfo.city,
        district: this.$state.userInfo.district
      };
      this.regions = this.$state.userInfo.district ? `${this.$state.userInfo.province}-${this.$state.userInfo.city}-${this.$state.userInfo.district}` : '';
    },
    upload(file) {
      this.uploadOSS(file).then(imgPath => {
        this.profile.avatar = imgPath;
      });
    },
    async uploadOSS(content) {
      // eslint-disable-next-line
      let params = await this.$store.dispatch('getOssToken').then(res => {
        return res.data;
      });
      params.file = content.file;
      params.dir = 'user_a/';
      // eslint-disable-next-line
      let data = await this.$store.dispatch('setParams', params);
      // eslint-disable-next-line
      let url = this.$store.state.endPoint;
      // eslint-disable-next-line
      let imgPath = url + '/' + data.get('key');
      return this.$store.dispatch('upload', { url, data }).then(res => {
        return imgPath;
      });
    },
    beforeAvatarUpload(file) {
      // this.$toast('文件大小不能超过 500kb');
    },
    setRegions(name, type) {
      switch (type) {
        case 'province':
          this.regions = name;
          this.profile.province = name;
          break;
        case 'city':
          this.regions += `-${name}`;
          this.profile.city = name;
          break;
        case 'county':
          if (name) {
            this.regions += `-${name}`;
            this.profile.district = name;
          }
          break;
        default:
          break;
      }
    },
    handleAvatarSuccess() {},
    initDate(date) {
      date = new Date(date);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    savaProfile() {
      this.formData = {
        username: this.profile.username,
        avatar: this.profile.avatar.includes('base64') ? '' : this.profile.avatar,
        intro: this.profile.intro,
        gender: this.profile.gender,
        province: this.profile.province,
        city: this.profile.city,
        district: this.profile.district
      };
      setUserInfo(this.formData).then(res => {
        if (res.code === 200) {
          this.$router.back();
          this.$message.success('修改个人信息成功');
          this.$store.dispatch('getInfo');
        } else {
          this.$message(res.msg);
        }
      });
    },
    bindWx() {
      if (this.$state.userInfo.unionid) {
        this.bindWxDialog = true;
      } else {
        let uri = encodeURIComponent(window.location.href);
        window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=wxba4899f4541e74cb&redirect_uri=${uri}&response_type=code&scope=snsapi_login&state=bind#wechat_redirect`;
      }
    },
    bindPhone() {
      this.phoneVisible = true;
    },
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
    closeDialog() {
      this.phoneVisible = false;
      setTimeout(() => {
        this.phone = '';
        this.verify = '';
        this.inputErr = false;
      }, 200);
    }
  },
  beforeDestroy() {
    timer && clearInterval(timer);
  },
  computed: {
    phoneHidden() {
      const phone = this.$state.userInfo.phone;
      return phone;
    }
  },
  components: {
    Cascader: () => import('@/components/Cascader')
  }
};
</script>
<style scoped src='./profile.less' lang='less' rel='stylesheet/less'>
</style>
