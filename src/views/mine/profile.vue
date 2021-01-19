<template>
  <section class="profile">
    <van-nav-bar title="编辑个人资料"
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
    </van-popup>
  </section>
</template>
<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import areaList from '@/utils/area';
import { fixedBody, looseBody } from '@/utils/fixedH5Bug';
import { NavBar, Popup, DatetimePicker, Picker, Uploader, Form, Field, RadioGroup, Radio, Area } from 'vant';
import { setUserInfo } from '@/api/user';
Vue.use(Form);
Vue.use(Field);
Vue.use(NavBar);
Vue.use(Popup);
Vue.use(DatetimePicker);
Vue.use(Picker);
Vue.use(Uploader);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Area);
export default {
  data () {
    return {
      profile: {
        username: '',
        avatar: '',
        birthday: '',
        gender: 0,
        intro: ''
      },
      formData: {},
      avatar: '',
      region: '',
      areaList,
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(),
      genderList: [
        { name: '男', value: 1 },
        { name: '女', value: 2 },
        { name: '保密', value: 3 }
      ],
      popupDateVisible: false,
      birthday: new Date(2000, 1, 1),
      popupRegionVisible: false
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  mounted () {
    this.init();
  },
  methods: {
    goBack () {
      this.$router.back();
    },
    init () {
      this.profile = {
        username: this.userInfo.username,
        avatar: this.userInfo.avatar ? this.userInfo.avatar : require('@/assets/images/def_avatar.png'),
        birthday: this.userInfo.birthday,
        gender: this.userInfo.gender,
        intro: this.userInfo.intro,
        province: this.userInfo.province,
        city: this.userInfo.city,
        district: this.userInfo.district
      };
      this.region = this.userInfo.district ? `${this.userInfo.province}-${this.userInfo.city}-${this.userInfo.district}` : '';
    },
    afterRead (file) {
      this.uploadOSS(file).then(imgPath => {
        this.profile.avatar = imgPath;
      });
    },
    async uploadOSS (content) {
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
    onOversize (file) {
      this.$toast('文件大小不能超过 500kb');
    },
    bindBirthday () {
      this.popupDateVisible = true;
    },
    bindRegion () {
      this.popupRegionVisible = true;
    },
    choiceBirthday (e) {
      let year = e.getFullYear();
      let month = e.getMonth();
      let date = e.getDate();
      this.profile.birthday = `${year}-${month}-${date}`;
      this.popupDateVisible = false;
    },
    cancelBirthday () {
      this.popupDateVisible = false;
    },
    choiceRegion (e) {
      if (!e[2]) {
        return this.$toast('请选择完整的三级行政区');
      }
      this.profile.province = e[0].name;
      this.profile.city = e[1].name;
      this.profile.district = e[2].name;
      this.region = `${this.profile.province}-${this.profile.city}-${this.profile.district}`;
      this.popupRegionVisible = false;
    },
    cancelRegion () {
      this.popupRegionVisible = false;
    },
    savaProflie () {
      this.formData = {
        username: this.profile.username,
        avatar: this.profile.avatar.includes('base64') ? '' : this.profile.avatar,
        intro: this.profile.intro,
        birthday: this.profile.intro,
        gender: this.profile.gender,
        province: this.profile.province,
        city: this.profile.city,
        district: this.profile.district
      }
      setUserInfo(this.formData).then(res => {
        if (res.code === 200) {
          this.$router.back();
          this.$toast('修改个人信息成功');
          this.$store.dispatch('getInfo');
        } else {
          this.$toast(res.msg);
        }
      });
    }
  },
  watch: {
    popupDateVisible (val) {
      if (val) {
        fixedBody();
      } else {
        looseBody();
      }
    }
  }
};
</script>
<style scoped src='./profile.less' lang="less" rel="stylesheet/less">
</style>
