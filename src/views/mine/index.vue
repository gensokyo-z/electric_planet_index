<template>
  <section class="mine">
    <div class="layout">
      <Header />
      <div class="community-container">
        <div class="community-main">
          <div class="personal-aside">
            <div class="personal-nav">
              <div class="info-area">
                <div class="personal-top">
                  <div class="avatar">
                    <img :src="avatar">
                  </div>
                  <div class="top-right">
                    <a class="account-link" @click="goto('/profile')">编辑资料</a>
                  </div>
                </div>
                <div class="personal-name">
                  <span class="name">{{userInfo.username}}</span>
                </div>
                <div class="personal-privilege">
                  <div class="personal-intro">{{userInfo.intro || '请输入个人简介'}}</div>
                </div>
                <div class="personal-data">
                  <a class="data-item">
                    <div class="data-number">{{userInfo.all_likes_count}}</div>
                    <div class="data-name">点赞</div>
                  </a>
                  <div class="data-line"></div>
                  <a class="data-item">
                    <div class="data-number">{{userInfo.followers_count}}</div>
                    <div class="data-name">粉丝</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="personal-main">
            <section class="section-simple data-section">
              <h3 class="data-title">数据概览</h3>
              <div class="section-main">
                <ul class="data-list">
                  <li class="data-item"
                      @click="bindTab('dynamic')">
                    <div class="data-name">动态</div>
                    <div class="data-number">{{dynamicCount}}</div>
                  </li>
                  <li class="data-item"
                      @click="bindTab('participate')">
                    <div class="data-name">参于</div>
                    <div class="data-number">{{msgCount}}</div>
                  </li>
                  <!-- <li class="data-item">
                    <div class="data-name">点赞</div>
                    <div class="data-number">{{userInfo.all_likes_count}}</div>
                  </li>
                  <li class="data-item">
                    <div class="data-name">粉丝</div>
                    <div class="data-number">{{userInfo.followers_count}}</div>
                  </li> -->
                </ul>
                <div class="write-wrapper">
                  <div>写作是最好的自我投资</div>
                  <a class="primary-button"
                     @click="goto('/post')">开始创作</a>
                </div>
              </div>
            </section>
            <section class="content-section">
              <div class="card-list">
                <div class="infinite-scroll"
                     style="overflow-y: auto">
                  <ul class="infinite-list"
                      v-infinite-scroll="onLoad"
                      :infinite-scroll-disabled="finished"
                      :infinite-scroll-distance="300">
                    <template v-if="type === 'dynamic'">
                      <li v-for="(item, index1) in cardList"
                          :key="index1">
                        <MsgCard :type.sync="type"
                                 :subType.sync="item.subType"
                                 :content="item" />
                      </li>
                    </template>
                    <template v-else>
                      <li v-for="(item, index2) in cardList"
                          :key="index2">
                        <MsgCard :type.sync="type"
                                 :subType.sync="item.subType"
                                 :content="item" />
                      </li>
                    </template>
                  </ul>
                  <p v-show="loading">加载中...</p>
                  <p v-show="finished"
                     id="footer">{{page===last_page?'没有更多了':''}}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
// import Vue from 'vue';
import { mapState } from 'vuex';
// import { PullRefresh, Popup, Field, List } from 'vant';
import { setUserInfo, getUserDynamic, getUserParticipation } from '@/api/user';
import util from '@/utils/util';

export default {
  name: 'mine',
  data () {
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
      msgCount: 0,
      page: 1,
      per_page: 10,
      current_page: 1,
      last_page: -1,
      ajax: false,
    };
  },
  computed: {
    ...mapState(['userInfo']),
    avatar () {
      return this.userInfo.avatar ? this.userInfo.avatar : util.defaultAvatar();
    }
  },
  mounted () {
    this.getPosts('dynamic')
    this.getPosts('participate', false);
  },
  methods: {
    onLoad (flag) {
      // this.getPosts(this.type);
    },
    goto (path) {
      this.$router.push(path);
    },
    getPosts (type, flag) {
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
        case 'participate':
          getUserParticipation({ page: 1 }).then(res => {
            if (res.code === 200 && res.data.length > 0) {
              res.data.forEach(e => {
                switch (e.related_type) {
                  case 'likes':
                    if (e.related.likable_type === 'posts') {
                      e.content = e.related.likable;
                      e.title = e.related.likable && e.related.likable.title;
                    } else {
                      // e.title = e.related.likable && e.related.likable.title;
                      e.content = e.related.likable;
                      if (e.related.likable && e.related.likable.post) {
                        e.title = e.related.likable.post.title
                      } else {
                        e.title = ''
                      }
                    }
                    e.subType = 'awesome';
                    break;
                  case 'comments':
                    e.content = e.related.content;
                    e.title = e.related.post && e.related.post.title
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
        default:
          break;
      }
    },
    bindTab (type) {
      this.finished = false;
      this.type = type;
      this.cardList = [];
      this.getPosts(type, true);
    },
    logout () {
      this.$router.push('/login');
    },
    openIntroductionEdit () {
      this.tempObj.intro = this.userInfo.intro;
      this.showIntroductionPop = true;
    },
    handleConfirm (flag) {
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
    // TabBar: () => import('./components/TabBar'),
    MsgCard: () => import('@/components/MsgCard')
  }
};
</script>
<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
