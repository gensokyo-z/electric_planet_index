<template>
  <section class="profile">
    <!-- <van-nav-bar title="编辑个人资料"
                 left-arrow
                 fixed
                 placeholder
                 @click-left="goBack">
      <template #right>
        <button class="nav-release"
                @click="savaProflie">保存</button>
      </template>
    </van-nav-bar>
    <div class="up-load-avatar">
      <van-uploader :after-read="afterRead"
                    :max-size="500 * 1024"
                    @oversize="onOversize">
        <img class="avatar"
             :src="profile.avatar" />
        <button class="btn-change-avatar">更换头像</button>
      </van-uploader>
    </div>
    <div class="data-box">
      <van-form>
        <van-field v-model="profile.username"
                   label="姓名："
                   placeholder="请输入姓名" />
        <van-field v-model="profile.intro"
                   label="简介："
                   placeholder="请输入简介" />
        <div class="gender-box">
          <label>性别：</label>
          <van-radio-group v-model="profile.gender"
                           direction="horizontal">
            <van-radio v-for="(item, index) in genderList"
                       :key="index"
                       :name="item.value">
              {{item.name}}
              <template #icon="props">
                <svg class="icon"
                     aria-hidden="true">
                  <use :xlink:href="props.checked?'#iconwode-xuanze':'#iconwode-weixuanzhong'"></use>
                </svg>
              </template>
            </van-radio>
          </van-radio-group>
        </div>
        <van-field v-model="profile.birthday"
                   label="生日："
                   placeholder="请输入生日"
                   readonly
                   @click="bindBirthday" />
        <van-field v-model="region"
                   label="地区："
                   readonly
                   placeholder="请选择地区"
                   @click="bindRegion" />
      </van-form>
    </div>
    <van-popup v-model="popupDateVisible"
               round
               position="bottom"
               :style="{ height: '50%' }">
      <van-datetime-picker v-model="birthday"
                           type="date"
                           title="请选择生日"
                           :min-date="minDate"
                           :max-date="maxDate"
                           @confirm="choiceBirthday"
                           @cancel="cancelBirthday" />
    </van-popup>
    <van-popup v-model="popupRegionVisible"
               round
               position="bottom"
               :style="{ height: '50%' }">
      <van-area title="选择地区"
                :area-list="areaList"
                :columns-placeholder="['请选择', '请选择', '请选择']"
                @confirm="choiceRegion"
                @cancel="cancelRegion" />
    </van-popup> -->
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
                  <div><label>
                      <el-upload action=""
                        :http-request="upload"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <div class="secondary-button">选择头像</div>
                      </el-upload>
                    </label></div>
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
                <Cascader />
              </dd>
              <dt>简介</dt>
              <dd>
                <el-input type="textarea"
                  placeholder="请输入内容"
                  v-model="profile.intro"
                  maxlength="30"
                  rows="5"
                  clearable
                  resize="none"
                  show-word-limit>
                </el-input>
                <div class="tip">最多不超过30个字符</div>
              </dd>
            </dl><button class="primary-button">保存</button>
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
      formData: {}
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
        birthday: this.$state.userInfo.birthday || new Date(2000, 1, 1),
        gender: this.$state.userInfo.gender,
        intro: this.$state.userInfo.intro,
        province: this.$state.userInfo.province,
        city: this.$state.userInfo.city,
        district: this.$state.userInfo.district
      };
      this.region = this.$state.userInfo.district ? `${this.$state.userInfo.province}-${this.$state.userInfo.city}-${this.$state.userInfo.district}` : '';
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
    // bindBirthday() {
    //   this.popupDateVisible = true;
    // },
    // bindRegion() {
    //   this.popupRegionVisible = true;
    // },
    // choiceBirthday(e) {
    //   let year = e.getFullYear();
    //   let month = e.getMonth();
    //   let date = e.getDate();
    //   this.profile.birthday = `${year}-${month}-${date}`;
    //   this.popupDateVisible = false;
    // },
    // cancelBirthday() {
    //   this.popupDateVisible = false;
    // },
    // choiceRegion(e) {
    //   if (!e[2]) {
    //     return this.$toast('请选择完整的三级行政区');
    //   }
    //   this.profile.province = e[0].name;
    //   this.profile.city = e[1].name;
    //   this.profile.district = e[2].name;
    //   this.region = `${this.profile.province}-${this.profile.city}-${this.profile.district}`;
    //   this.popupRegionVisible = false;
    // },
    // cancelRegion() {
    //   this.popupRegionVisible = false;
    // },
    handleAvatarSuccess() {},
    savaProflie() {
      this.formData = {
        username: this.profile.username,
        avatar: this.profile.avatar.includes('base64') ? '' : this.profile.avatar,
        intro: this.profile.intro,
        birthday: this.profile.intro,
        gender: this.profile.gender,
        province: this.profile.province,
        city: this.profile.city,
        district: this.profile.district
      };
      setUserInfo(this.formData).then(res => {
        if (res.code === 200) {
          this.$router.back();
          // this.$toast('修改个人信息成功');
          this.$store.dispatch('getInfo');
        } else {
          // this.$toast(res.msg);
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
