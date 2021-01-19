<template>
  <section class="mine">
    <div class="header">
      <div class="avatar"><img :src="avatar"></div>
      <div class="name-card">
        <span class="name">{{userInfo.username}}</span>
        <span class="desc"
          @click="openIntroductionEdit">{{userInfo.intro}}<svg class="icon"
            aria-hidden="true"
            v-if="accountType==='me'">
            <use xlink:href="#iconedit"></use>
          </svg></span>
      </div>
      <div class="btn-box">
        <button class="edit"
          v-if="accountType==='me'"
          @click="goto('/profile')">编辑资料</button>
        <button class="appoint"
          v-else>+&nbsp;关注</button>
      </div>
    </div>
    <div class="flex header-footer">
      <div class="data-board">
        <div class="item"
          @click="goto('/message?type=msg&subType=awesome')">
          <span class="name">点赞</span>
          <span class="data">{{userInfo.all_likes_count}}</span>
        </div>
        <!-- <div class="item"
             @click="goto('/message?type=msg&subType=fans')">
          <span class="name">关注</span>
          <span class="data">{{userInfo.followed_count}}</span>
        </div> -->
        <div class="item"
          @click="goto('/message?type=msg&subType=fans')">
          <span class="name">粉丝</span>
          <span class="data">{{userInfo.followers_count}}</span>
        </div>
      </div>
      <button class="logout"
        @click="logout">退出登录</button>
    </div>
    <TabBar :type.sync="type"
      @bindTab="bindTab"
      :dynamicCount="dynamicCount"
      :msgCount="msgCount" />

    <div class="card-list">
      <!-- <van-list v-model="loading"
        :finished="finished"
        offset="300"
        @load="onLoad"> -->
        <template v-if="type==='dynamic'">
          <MsgCard :type.sync="type"
            :subType.sync="item.subType"
            v-for="(item, index) in cardList"
            :key="index"
            :content="item" />
        </template>
        <template v-else>
          <MsgCard :type.sync="type"
            :subType.sync="item.subType"
            v-for="(item, index) in cardList"
            :key="index"
            :content="item" />
        </template>
      <!-- </van-list> -->
    </div>
    <!-- <van-popup v-model="
               showIntroductionPop"
      round
      position="bottom"
      :style="{ height: '50%' }"> -->
      <div class="editDialog"
        ref="editDialog">
        <div class="title-box">
          <div class="cancle"
            @click="handleConfirm(false)">取消</div>
          <div class="title">个人简介</div>
          <div class="confirm"
            @click="handleConfirm(true)">保存</div>
        </div>
        <div class="input-box">
          <van-field v-model="tempObj.intro"
            type="textarea"
            placeholder="填写个人简介更容易获得别人的关注哦…" />
        </div>
      </div>
    <!-- </van-popup> -->
    <div class="footer-pad"></div>
  </section>
</template>
<script>
// import Vue from 'vue';
import { mapState } from 'vuex';
// import { PullRefresh, Popup, Field, List } from 'vant';
import { setUserInfo, getUserDynamic, getUserParticipation } from '@/api/user';
import util from '@/utils/util';
// Vue.use(PullRefresh);
// Vue.use(List);
// Vue.use(Popup);
// Vue.use(Field);
export default {
  name: 'mine',
  data() {
    return {
      loading: false,
      finished: false,
      accountType: 'me',
      type: 'dynamic',
      // subType: 'review',
      intro: '',
      showIntroductionPop: false,
      tempObj: {},
      cardList: [],
      dynamicCount: 0,
      msgCount: 0
    };
  },
  computed: {
    ...mapState(['userInfo']),
    avatar() {
      return this.userInfo.avatar ? this.userInfo.avatar : util.defaultAvatar();
    }
  },
  mounted() {
    this.getPosts('dynamic')
    this.getPosts('participate', false);
  },
  methods: {
    onLoad(flag) {
      this.getPosts(this.type);
    },
    goto(path) {
      this.$router.push(path);
    },
    getPosts(type, flag) {
      switch (type) {
        case 'dynamic':
          getUserDynamic({ page: 1 }).then(res => {
            if (res.code === 200 && res.data.length) {
              res.data.forEach(e => {
                e.subType = 'review';
                e.user.name = e.user.username;
                e.user.avatar = util.defaultAvatar(e.user.avatar);
                e.thumb_pic = util.getFirstImg(e.content);
                e.thumb_video = util.getFirstVideo(e.content);
              });
              this.cardList = res.data;
              this.dynamicCount = res.total;
            }
            this.finished = true;
          });
          break;
        default:
          getUserParticipation({ page: 1 }).then(res => {
            if (res.code === 200 && res.data.length > 0) {
              res.data.forEach(e => {
                switch (e.related_type) {
                  case 'likes':
                    e.title = e.related.likable && e.related.likable.title;
                    e.content = e.related.likable;
                    e.subType = 'awesome';
                    break;
                  case 'comments':
                    e.title = e.related.post && e.related.post.title;
                    e.content = e.related.content;
                    e.subType = 'review';
                    break;
                  default:
                    break;
                }
                // console.log(e);
                e.user = {
                  avatar: this.$state.userInfo.avatar,
                  name: this.$state.userInfo.username
                };
                e.user.avatar = util.defaultAvatar(e.user.avatar);
                e.thumb_pic = util.getFirstImg(e.content);
                e.thumb_video = util.getFirstVideo(e.content);
              });
              // console.log(object);

              if (flag) {
                this.cardList = res.data;
              }
              this.msgCount = res.total;
            }
            this.finished = true;
          });
          this.cardList = [];
          break;
      }
    },
    bindTab(type) {
      this.finished = false;
      this.type = type;
      this.cardList = [];
      this.getPosts(type, true);
    },
    logout() {
      this.$router.push('/login');
    },
    openIntroductionEdit() {
      this.tempObj.intro = this.userInfo.intro;
      this.showIntroductionPop = true;
    },
    handleConfirm(flag) {
      this.showIntroductionPop = false;
      if (flag) {
        this.tempObj = {
          username: this.userInfo.username,
          avatar: this.userInfo.avatar,
          intro: this.userInfo.intro,
          birthday: this.userInfo.birthday,
          gender: this.userInfo.gender
        };
        setUserInfo(this.tempObj).then(res => {
          if (res.code === 200) {
            this.$toast('修改简介成功');
          } else {
            this.$toast(res.msg);
          }
        });
      } else {
        this.tempObj.intro = '';
      }
    }
  },
  components: {
    TabBar: () => import('./components/TabBar'),
    MsgCard: () => import('@/components/MsgCard')
  }
};
</script>
<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
