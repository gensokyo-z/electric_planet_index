<template>
  <section class="index-detail">
    <van-nav-bar :title="content.title"
      left-arrow
      fixed
      placeholder
      @click-left="goBack">
      <template #right>
        <div class="flex por">
          <!-- <button class="nav-release"
                  @click="addPlanet">{{btnName}}</button> -->
          <!-- <van-icon name="ellipsis"
                    @click="hiddenMeun=!hiddenMeun" /> -->
          <div :class="['meun-box', 'poa', `${hiddenMeun?'hidden':'flex-col'}`]">
            <div class="meun">转发</div>
            <div class="meun">举报</div>
            <div class="meun">下架</div>
            <div class="meun">删除</div>
          </div>
        </div>
      </template>
    </van-nav-bar>
    <van-skeleton title
      avatar
      :row="10"
      :loading="loading">
      <div class="content-body">
        <template v-if="content.source === 'user'">
          <div class="name-card flex-v">
            <img class="avatar"
              :src="content.user.avatar" />
            <div class="name">{{content.user.username}}</div>
          </div>
        </template>
        <template v-else-if="content.source === '微博'">
          <div class="name-card flex-v">
            <img class="avatar"
              :src="content.weiboAvatar" />
            <div class="name">@{{content.title}}</div>
          </div>
        </template>
        <div class="content-title text-two"
          v-if="content.source !== '微博'">{{content.title}}</div>
        <div class="planet"
          @click="$router.push(`/planetdetail?id=${content.planet_id}`)">
          <a class="item"><span>{{content.planet.name}}</span></a>
          <a v-for="(item,index) in content.tags"
            :key="index"
            class="tag">#{{item.name}}</a>
        </div>
        <div class="content-main"
          v-html="content.content"></div>
      </div>
      <div class="talk-area"
        ref="talkArea">
        <div class="title">评论<span class="total">{{content.comments_count}}条</span></div>
        <TalkCard :content="item"
          v-for="(item, index) in commentList"
          :key="index" />
      </div>
      <TalkApprovalShare :content.sync="content"
        class="main-tool" />
    </van-skeleton>

    <div class="home-page"
      @click="$router.push('/')"
      v-show="$route.query.share">
      <img src="@/assets/images/home.png">
    </div>
    <iframe class="full-screen"
      :src="content.url"
      v-if="flash"></iframe>
  </section>
</template>
<script>
import Vue from 'vue';
import { NavBar, Icon, Field, Skeleton, ImagePreview } from 'vant';
import { getPostsDetail, getPostsComments } from '@/api/post';
import util from '@/utils/util';
import TalkApprovalShare from '@/components/TalkApprovalShare';
Vue.use(NavBar);
Vue.use(Icon);
Vue.use(Field);
Vue.use(Skeleton);
export default {
  components: {
    TalkApprovalShare,
    TalkCard: () => import('@/components/TalkCard')
  },
  data() {
    return {
      flash: true,
      loading: true,
      id: this.$route.query.id || '',
      hiddenMeun: true,
      comment: '',
      content: {
        planet: {},
        tags: [],
        user: {}
      },
      commentList: []
    };
  },
  mounted() {
    this.$bus.$on('snedComment', () => {
      this.getDetail(true);
    });
    this.getDetail(false);
    // document.querySelector('#app').addEventListener('click', () => {
    //   this.hiddenMeun = false
    // })
  },
  methods: {
    conutDown(time = 700) {
      setTimeout(() => {
        this.flash = false;
        this.loading = false;
      }, time);
    },
    getDetail(flag) {
      getPostsDetail(this.id).then(res => {
        if (res.code === 200) {
          let time = 700;
          if (res.data.source === 'user') {
            res.data.user.avatar = util.defaultAvatar(res.data.user.avatar);
          } else if (res.data.source === '微博') {
            time = 1000;
            res.data.weiboAvatar = util.defaultAvatar('');
          }
          res.data.thumb_pic = util.getFirstImg(res.data.content);
          this.content = res.data;
          if (this.content.url) {
            this.conutDown(time);
          } else {
            this.flash = false;
            this.loading = false;
          }
          getPostsComments({ id: this.id, page: 1 }).then(res => {
            if (res.code === 200) {
              res.data.forEach(e => {
                e.comments_count = e.second_comments_count;
                e.user.avatar = e.user.avatar ? e.user.avatar : require('@/assets/images/def_avatar.png');
              });
              this.commentList = res.data;
              if (flag) {
                const talkArea = this.$refs.talkArea;
                if (talkArea) {
                  setTimeout(() => {
                    talkArea.scrollIntoView(true);
                  }, 100);
                }
              }
            }
          });
        }
      });
    },
    goBack() {
      this.$router.back();
    },
    addPlanet() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '是否加入该星球'
        })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    sendComment() {},
    previewImg(img) {
      ImagePreview([img]);
    }
  },
  computed: {
    btnName() {
      return '加入';
    }
  }
};
</script>
<style scoped src='./detail.less' lang="less" rel="stylesheet/less">
</style>
