<template>
  <section class="index-detail">
  </section>
</template>
<script>
import Vue from 'vue';
import { getPostsDetail, getPostsComments } from '@/api/post';
import util from '@/utils/util';
export default {
  components: {
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
