<template>
  <section class="profile">
    <div class="layout">
      <Header />
      <main class="main"
        style="padding-top:50px">
        <div class="account-container">
          <h2 class="section-title">基本资料</h2>
          <div class="section-main">
            <dl>
              <dt>头像</dt>
              <dd>
                <img class="user-avatar"
                  :src="profile.avatar" />
                <div class="avatar-button">
                  <div>
                    <el-upload action=""
                      :http-request="upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload">
                      <div class="secondary-button">选择头像</div>
                    </el-upload>
                  </div>
                  <div class="tip">支持JPG、GIF、PNG格式图片，不超过5M</div>
                </div>
              </dd>
              <dt>姓名</dt>
              <dd>
                <el-input type="text"
                  v-model="profile.username"
                  size="mini"></el-input>
                <!-- <div class="tip">最多不超过12个字符</div> -->
              </dd>
              <dt>性别</dt>
              <dd>
                <el-radio-group v-model="profile.gender"
                  size="mini">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                  <el-radio :label="3">保密</el-radio>
                </el-radio-group>
              </dd>
              <dt>生日</dt>
              <dd>
                <el-date-picker v-model="profile.birthday"
                  type="date"
                  size="mini"
                  placeholder="选择日期">
                </el-date-picker>
              </dd>
              <dt>地区</dt>
              <dd>
                <Cascader @setRegions="setRegions"
                  :regions="regions" />
              </dd>
              <dt>简介</dt>
              <dd>
                <el-input type="textarea"
                  placeholder="请输入内容"
                  v-model="profile.intro"
                  maxlength="30"
                  :rows="3"
                  clearable
                  resize="none"
                  show-word-limit>
                </el-input>
                <div class="tip">最多不超过30个字符</div>
              </dd>
            </dl><button class="primary-button"
              @click="savaProflie">保存</button>
          </div>
        </div>
      </main>
    </div>
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
        birthday: '',
        gender: 0,
        intro: '',
        province: '',
        city: '',
        district: ''
      },
      formData: {},
      regions: ''
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
        birthday: this.$state.userInfo.birthday || '2000-1-1',
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
        birthday: this.initDate(this.profile.birthday),
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
    }
  },
  components: {
    Cascader: () => import('@/components/Cascader')
  }
};
</script>
<style scoped src='./profile.less' lang="less" rel="stylesheet/less">
</style>
