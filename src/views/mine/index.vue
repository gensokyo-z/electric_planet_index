<template>
  <section class="mine">
    <div class="layout">
      <Header />
      <div class="community-container">
        <div class="community-main">
          <div class="user-info">
            <div class="left">
              <div class="avatar">
                <img :src="avatar">
                <div class="name-desc">
                  <div class="name">{{userInfo.username}}</div>
                  <div class="desc">{{userInfo.intro || '请输入个人简介'}}</div>
                </div>
              </div>
            </div>
            <div class="right">
              <ul>
                <li><label>获赞</label><span>{{userInfo.all_likes_count || 0}}</span></li>
                <li><label>粉丝</label><span>{{userInfo.followed_count || 0}}</span></li>
                <li><label>关注</label><span>{{userInfo.follower_count || 0}}</span></li>
              </ul>
              <div class="editor">
                <el-button @click="goto('/profile')">修改个人资料</el-button>
              </div>
            </div>
          </div>
          <div class="tab-box">
            <div :class="['tab',{'active':type === 'dynamic'}]">动态</div>
            <div :class="['tab',{'active':type === 'participate'}]">评论</div>
          </div>
          <div class="card-list"
            v-loading="loading">
            <div class="card"
              v-for="(item, index) in cardList"
              :key="index">
              <NewCard :type.sync="type"
                :content="item" />
            </div>
          </div>
          <div class="footer-btn"
            v-show="!loading">
            <el-button @click="loadMore">{{finished?'~~~到底了~~~':'加载更多'}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex';
import NewCard from '@/components/NewCard';
import { setUserInfo, getUserDynamic, getUserParticipation } from '@/api/user';
import util from '@/utils/util';

export default {
  name: 'mine',
  data() {
    return {
      loading: true,
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
      per_page: 12,
      current_page: 1,
      last_page: 0
    };
  },
  computed: {
    ...mapState(['userInfo']),
    avatar() {
      return this.userInfo.avatar ? this.userInfo.avatar : util.defaultAvatar();
    }
  },
  mounted() {
    this.getPosts('dynamic');
    // this.getPosts('participate', false);
  },
  methods: {
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
    getPosts(type, flag) {
      this.loading = true;
      switch (type) {
        case 'dynamic':
          getUserDynamic({ page: this.page, per_page: this.per_page, type: ['0', '1'] })
            .then(res => {
              if (res.code === 200 && res.data.length > 0) {
                this.last_page = res.last_page;
                let arr = [];
                res.data.forEach(e => {
                  e.media = [];
                  e.planet = {};
                  // e.subType = 'review';
                  // e.user.name = e.user.username;
                  // e.user.avatar = util.defaultAvatar(e.user.avatar);
                  // e.thumb_pic = util.getFirstImg(e.content);
                  // e.thumb_video = util.getFirstVideo(e.content);
                  if (e.tags && e.tags.length > 4) {
                    e.tags.splice(4, e.tags.length - 4);
                  }
                  // if (e.media && e.media.media_type[0] === 'video') {
                  //   e.mediaType = 'video';
                  // } else {
                  //   e.mediaType = 'pic';
                  // }
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
                        e.title = e.related.likable.post.title;
                      } else {
                        e.title = '';
                      }
                    }
                    e.subType = 'awesome';
                    break;
                  case 'comments':
                    e.content = e.related.content;
                    e.title = e.related.post && e.related.post.title;
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
    }
  },
  components: {
    NewCard
  }
};
</script>
<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
