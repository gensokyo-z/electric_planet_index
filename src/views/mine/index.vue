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
        <ul @click="$router.push('/follow')">
          <li><label>获赞</label><span>{{userInfo.belikeds || 0}}</span></li>
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
        :class="['tab',{'active':type === 'comment'}]"
        @click="chnageTab('comment')">评论</div>
    </div>
    <template v-if="type === 'dynamic'">
      <div class="card-list"
        :class="{isWechat:$state.isWechat}"
        v-loading="loading">
        <div class="card"
          v-for="(item, index) in cardList"
          :key="index">
          <NewCard :content="item" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="comment-list"
        v-loading="loading">
        <div class="comment"
          v-for="(item, index) in cardList"
          :key="index">
          <CommentCard :content="item"
            @getData="chnageTab('comment')" />
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
import { getUserDynamic, getUserComments, getOtheruser, getOthusernews, followUser } from '@/api/user';
import util from '@/utils/util';
export default {
  name: 'mine',
  data() {
    return {
      isMy: this.$route.path === '/mine',
      loading: true,
      finished: false,
      type: 'dynamic',
      cardList: [],
      page: 1,
      per_page: 12,
      userInfo: {}
    };
  },
  computed: {
    avatar() {
      return this.userInfo.avatar ? this.userInfo.avatar : util.defaultAvatar();
    }
  },
  created() {
    if (Number(this.$route.query.id) === this.$state.userInfo.id) {
      return this.$router.push('/mine');
    }
    if (!this.isMy) {
      this.getOtheruser();
    } else {
      this.userInfo = this.$state.userInfo;
    }
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    chnageTab(type) {
      this.type = type;
      this.getClear();
    },
    getOtheruser() {
      return new Promise((resolve, reject) => {
        getOtheruser({ id: this.$route.query.id }).then(res => {
          this.userInfo = res.data;
          resolve();
        });
      });
    },
    loadMore() {
      if (this.finished) {
        return;
      }
      this.page++;
      this.getPosts();
    },
    getClear() {
      this.finished = false;
      this.cardList = [];
      this.page = 1;
      this.getPosts();
    },
    goto(path) {
      this.$router.push(path);
    },
    getPosts() {
      this.loading = true;
      let arr = [];
      switch (this.type) {
        case 'dynamic':
          const path = this.isMy ? getUserDynamic : getOthusernews;
          const obj = {
            page: this.page,
            per_page: this.per_page
          };
          if (this.isMy) {
            obj.type = ['0', '1', '2'];
          } else {
            obj.id = this.$route.query.id;
          }
          path(obj)
            .then(res => {
              if (res.code === 200 && res.data.length > 0) {
                res.data.forEach(e => {
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
                  if (e.type === 0 && !e.desc_content) {
                    e.desc_content = e.content;
                  }
                  if (e.type === 0 || e.type === 1) {
                    e.mediaType = 'pic';
                  } else {
                    e.mediaType = 'video';
                  }
                  arr.push(e);
                });
                this.cardList = this.cardList.concat(arr);
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
        case 'comment':
          getUserComments({ page: this.page, per_page: this.per_page }).then(res => {
            if (res.code === 200 && res.data.length > 0) {
              res.data.forEach(e => {
                let year = new Date().getFullYear();
                if (e.created_at.includes(year)) {
                  e.created_at = e.created_at.substr(5, e.created_at.length - 1);
                }
                if (e.post) {
                  e.title = e.post.title;
                } else {
                  e.title = e.parentcomments.content;
                }
                arr.push(e);
              });
              this.cardList = this.cardList.concat(arr);
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
    folloed() {
      return new Promise((resolve, reject) => {
        if (this.userInfo.hasbefolloed) {
          resolve();
        } else {
          followUser(this.$route.query.id).then(res => {
            this.getOtheruser();
            this.$store.dispatch('getInfo');
            resolve();
          });
        }
      });
    }
  },
  components: {
    NewCard,
    CommentCard: () => import('@/components/CommentCard')
  }
};
</script>
<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
