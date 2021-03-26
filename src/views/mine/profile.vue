<template>
  <section class="profile">
    <div class="layout">
      <Header />
      <main class="main"
        style="padding-top:50px">
        <div class="account-container">
          <h2 class="section-title">设置</h2>
          <div class="section-main">
            <div class="left">
              <div class="top">
                <div class="avatar">
                  <img class="user-avatar"
                    :src="profile.avatar" />
                  <div class="avatar-button">
                    <el-upload action=""
                      :http-request="upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload">
                      <div class="secondary-button">选择头像</div>
                    </el-upload>
                  </div>
                </div>
                <div class="dl">
                  <div class="item">
                    <label>头像</label>
                    <div class="tip">照片上传规格要求：
                      格式为JPG , JPEG , GIF 或者png. 大小 10MB以内.</div>
                  </div>
                  <div class="item">
                    <label>昵称</label>
                    <el-input type="text"
                      v-model="profile.username"
                      size="mini"></el-input>
                    <!-- <div class="tip">最多不超过12个字符</div> -->
                  </div>
                  <div class="item">
                    <label>性别</label>
                    <el-radio-group v-model="profile.gender"
                      size="mini">
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                      <el-radio :label="3">保密</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="item">
                    <label>所在地</label>
                    <Cascader @setRegions="setRegions"
                      :regions="regions" />
                  </div>
                </div>
              </div>
              <div class="sign">
                <label>签名</label>
                <div class="tip">最多不超过20个字</div>
                <el-input type="textarea"
                  placeholder="请输入内容"
                  v-model="profile.intro"
                  maxlength="20"
                  :rows="1"
                  clearable
                  resize="none"
                  show-word-limit>
                </el-input>
              </div>
              <div class="save">
                <button class="primary-button"
                  @click="savaProflie">保存</button>
              </div>
            </div>
            <div class="right">
              <div class="phone">
                <div class="l-side">
                  <img src="../../assets/images/phone.png">
                  <label>手机号码</label>
                </div>
                <div class="r-side">
                  <span>{{$state.userInfo.phone}}</span>
                </div>
              </div>
              <div class="wx">
                <div class="l-side">
                  <img src="../../assets/images/wx.png">
                  <label>{{$state.userInfo.unionid?$state.userInfo.username:'微信昵称'}}
                    <span>{{$state.userInfo.unionid?'已':'未'}}绑定</span>
                  </label>

                </div>
                <div class="r-side">
                  <button class="wx-button"
                    @click="bindWx">{{$state.userInfo.unionid?'解绑':'绑定'}}微信</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <el-dialog :visible="bindWxDialog"
      custom-class="bind-wx-dialog"
      width="390px"
      top="30vh"
      :show-close="false">
      <div class="title">确认解除绑定？</div>
      <div class="desc">解除绑定后，将暂时无法从第三方快捷登录，需要验证手机后才可快捷登录。</div>
      <div class="btn-box">
        <el-button class="btn"
          @click="bindWxDialog = false">取消</el-button>
        <el-button class="btn comfirm">确认</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { setUserInfo } from '@/api/user';
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
      bindWxDialog: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    goBack() {
      this.$router.back();
    },
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
    savaProflie() {
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
    }
  },
  components: {
    Cascader: () => import('@/components/Cascader')
  }
};
</script>
<style scoped src='./profile.less' lang="less" rel="stylesheet/less">
</style>
