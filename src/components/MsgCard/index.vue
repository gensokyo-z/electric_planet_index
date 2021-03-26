<template>
  <section class="msg-card">
    <div class="left">
      <img :src="avatar">
      <span class="name">{{username}}</span>
    </div>
    <div class="right">
      <div class="comment"
        v-show="type === 1">赞了这条动态<span>{{content.created_at}}</span></div>
      <div class="appoint"
        v-show="type === 'appoint'">@用户<span class="comment">
          <img :src="content.thumb_pic"
            v-show="content.thumb_pic">
          <div class="title">{{content.title}}</div>
        </span><span>{{content.created_at}}</span></div>
      <div class="review"
        v-show="type === 'review'">
        <div class="title">{{content.content}}</div>
        <span>{{content.created_at}}</span>
      </div>
      <div class="follow"
        v-if="type === 'fans'">关注了你<span>{{content.created_at}}</span></div>
      <!-- 粉丝tab不显示 -->
      <div class="doc"
        v-else
        v-show="content.title">
        <div class="content">
          <img :src="content.thumb_pic"
            v-show="content.thumb_pic">
          <div class="title">{{content.title}}</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import util from '@/utils/util';
export default {
  name: 'MsgCard',
  props: {
    type: {
      type: String,
      default: ''
    },
    content: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {
    bindEvent() {
      if (this.subType === 'fans') {
        this.content.follow = !this.content.follow;
      } else {
        this.$refs.inputItem.showInput = true;
      }
    },
    goUrl(url) {
      this.$router.push(url);
    }
  },
  computed: {
    avatar() {
      if (this.content.user && this.content.user.avatar) {
        return this.content.user.avatar;
      } else {
        return util.defaultAvatar('');
      }
    },
    username() {
      if (this.content.user && this.content.user.username) {
        return this.content.user.username;
      } else {
        return '临时用户';
      }
    }
  }
};
</script>
<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
