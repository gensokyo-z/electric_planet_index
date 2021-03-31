<template>
  <section class="mine">
    <div class="user-info">
      <div class="left">
        <div class="avatar">
          <img :src="avatar"
            v-show="userInfo.username">
          <div class="name-desc">
            <div class="name">{{userInfo.username}}</div>
            <div class="desc">{{userInfo.intro || '请输入个人简介'}}</div>
          </div>
        </div>
      </div>
      <div class="right">
        <ul>
          <li><label>获赞</label><span>{{userInfo.all_likes_count || 0}}</span></li>
          <li><label>粉丝</label><span>{{userInfo.followers_count || 0}}</span></li>
          <li><label>关注</label><span>{{userInfo.followed_count || 0}}</span></li>
        </ul>
        <div class="editor">
          <el-button @click="goto('/profile')"
            v-if="isMy">修改个人资料</el-button>
          <el-button @click="folloed"
            :class="{folloed:userInfo.hasbefolloed}"
            v-else>{{userInfo.hasbefolloed?'已关注':'关注'}}</el-button>
        </div>
      </div>
    </div>
    <div class="tab-box">
      <div :class="['tab',{'active':type === 'dynamic'}]"
        @click="chnageTab('dynamic')">动态</div>
      <div v-if="isMy"
        :class="['tab',{'active':type === 'participate'}]"
        @click="chnageTab('participate')">评论</div>
    </div>
    <template v-if="type === 'dynamic'">
      <div class="card-list"
        v-loading="loading">
        <div class="card"
          v-for="(item, index) in cardList"
          :key="index">
          <NewCard :type.sync="type"
            :content="item" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="msg-list"
        v-loading="loading">
        <div class="msg"
          v-for="(item, index) in cardList"
          :key="index">
          <MsgCard :type="1"
            :content="item" />
        </div>
      </div>
    </template>
    <div class="footer-btn"
      v-show="!loading">
      <el-button @click="loadMore">{{finished?'~~~到底了~~~':'加载更多'}}</el-button>
    </div>

  </section>
</template>
<script>
import NewCard from '@/components/NewCard';
import { setUserInfo, getUserDynamic, getUserParticipation, getOtheruser, getOthusernews, followUser } from '@/api/user';
import util from '@/utils/util';
export default {
  name: 'mine',
  data() {
    return {
      isMy: this.$route.path === '/mine',
      loading: true,
      finished: false,
      accountType: 'me',
      type: 'dynamic',
      intro: '',
      showIntroductionPop: false,
      tempObj: {},
      cardList: [],
      dynamicCount: 0,
      msgCount: 0,
      page: 1,
      per_page: 12,
      current_page: 1,
      last_page: 0,
      userInfo: {}
    };
  },
  computed: {
    avatar() {
      return this.userInfo.avatar ? this.userInfo.avatar : util.defaultAvatar();
    }
  },
  created() {
    if (!this.isMy) {
      this.getOtheruser();
    } else {
      this.userInfo = this.$state.userInfo;
    }
  },
  mounted() {
    if (this.isMy) {
      this.getPosts('dynamic');
    } else {
      this.getOthusernews();
    }
  },
  methods: {
    chnageTab(type) {
      this.type = type;
      this.finished = false;
      this.cardList = [];
      this.page = 0;
      this.loadMore(type);
    },
    loadMore(type) {
      if (this.finished) {
        return;
      }
      this.page++;
      this.getPosts(type);
    },
    goto(path) {
      this.$router.push(path);
    },
    getPosts(type) {
      this.loading = true;
      switch (type) {
        case 'dynamic':
          getUserDynamic({ page: this.page, per_page: this.per_page, type: ['0', '1', '2'] })
            .then(res => {
              if (res.code === 200 && res.data.length > 0) {
                this.last_page = res.last_page;
                let arr = [];
                res.data.forEach(e => {
                  e.media = [];
                  if (e.type === 0 && !e.thumb_pic) {
                    if (e.media && e.media.length > 0 && e.media[0].media_link) e.thumb_pic = e.media[0].media_link;
                  }
                  e.planet = {
                    planet_id: 0,
                    name: ''
                  };
                  if (e.tags && e.tags.length > 4) {
                    e.tags.splice(4, e.tags.length - 4);
                  }
                  if (e.type === 0 || e.type === 1) {
                    e.mediaType = 'pic';
                  } else {
                    e.mediaType = 'video';
                  }
                  arr.push(e);
                });
                this.cardList = this.cardList.concat(arr);
                this.dynamicCount = res.total;
                if (res.last_page === res.current_page) {
                  this.finished = true;
                }
              } else {
                this.finished = true;
              }
              this.loading = false;
            })
            .catch(err => {
              console.log(err);
            });
          break;
        case 'participate':
          getUserParticipation({ page: 1 }).then(res => {
            if (res.code === 200 && res.data.length > 0) {
              this.last_page = res.last_page;
              let arr = [];
              res.data.forEach(e => {
                switch (e.related_type) {
                  case 'likes':
                    if (e.related.likable_type === 'posts') {
                      e.content = e.related.likable.content;
                      e.title = e.related.likable && e.related.likable.title;
                    } else {
                      // e.title = e.related.likable && e.related.likable.title;
                      e.content = e.related.likable.content;
                      if (e.related.likable && e.related.likable.post) {
                        e.title = e.related.likable.post.title;
                      } else {
                        e.title = '';
                      }
                    }
                    e.subType = 'awesome';
                    break;
                  case 'comments':
                    e.content = e.related && e.related.content;
                    e.title = e.related && e.related.post && e.related.post.title;
                    e.subType = 'review';
                    break;

                  default:
                    break;
                }
                // console.log(e);
                e.user = {
                  avatar: util.defaultAvatar(this.$state.userInfo.avatar),
                  name: this.$state.userInfo.username
                };
                arr.push(e);
              });
              this.cardList = this.cardList.concat(arr);
              this.dynamicCount = res.total;
              if (res.last_page === res.current_page) {
                this.finished = true;
              }
            } else {
              this.finished = true;
            }
            this.loading = false;
          });
          break;
        default:
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
      this.$bus.$emit('login', true);
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
    },
    getOtheruser() {
      return new Promise((resolve, reject) => {
        getOtheruser({ id: this.$route.query.id }).then(res => {
          this.userInfo = res.data;
          resolve();
        });
      });
    },
    getOthusernews() {
      return new Promise((resolve, reject) => {
        getOthusernews({ id: this.$route.query.id }).then(res => {
          if (res.code === 200 && res.data.length > 0) {
            this.last_page = res.last_page;
            let arr = [];
            res.data.forEach(e => {
              e.media = [];
              e.planet = {};
              if (e.tags && e.tags.length > 4) {
                e.tags.splice(4, e.tags.length - 4);
              }
              arr.push(e);
            });
            this.cardList = this.cardList.concat(arr);
            this.dynamicCount = res.total;
            if (res.last_page === res.current_page) {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
          this.loading = false;
          resolve();
        });
      });
    },
    folloed() {
      return new Promise((resolve, reject) => {
        followUser(this.$route.query.id).then(res => {
          this.getOtheruser();
          resolve();
        });
      });
    }
  },
  components: {
    NewCard,
    MsgCard: () => import('@/components/MsgCard')
  }
};
</script>
<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
