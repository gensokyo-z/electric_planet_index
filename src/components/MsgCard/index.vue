<template>
  <section class="msg-card">
    <div class="left">
      <img :src="avatar">
    </div>
    <div class="right">
      <div class="time">{{content.created_at}}</div>
      <div class="name">
        <span>{{username}}</span>
        <template v-if="type === 1">
          <span>评论了你的</span>
        </template>
        <template v-if="type === 2">
          <span>点赞了你的</span>
        </template>
        <template v-if="type === 3">
          <span>@了你的</span>
        </template>
        <template v-if="type === 4">
          <span>关注了你</span>
        </template>
      </div>
      <div class="comment">
        <p class="title">&emsp;&emsp;{{content.title}}</p>
        <p class="content">{{content.content}}</p>
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
      type: Number,
      default: 1
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
      this.content.follow = !this.content.follow;
      this.$refs.inputItem.showInput = true;
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
        return '';
      }
    }
  }
};
</script>
<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
