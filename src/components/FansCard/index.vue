<template>
  <section class="fans-card">
    <div class="left">
      <img :src="avatar"
        @click="goUrl(`/other?id=${content.user_id}`)">
    </div>
    <div class="right">
      <div class="name">
        <span>{{username}}</span>
        <div class="data-box">
          <label>获赞</label><span>{{content.belikes}}</span>
          <label>粉丝</label><span>{{content.follers||content.followers}}</span>
          <label>关注</label><span>{{content.followNums}}</span>
        </div>
      </div>
      <button :class="{active:content.pivot &&!content.has_followed}"
        @click="follow">{{(!content.pivot ||content.has_followed)?'已关注':'关注'}}</button>
    </div>
  </section>
</template>
<script>
import util from '@/utils/util';
import { followUser } from '@/api/user';
export default {
  name: 'FansCard',
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {
    goUrl(url) {
      this.$router.push(url);
    },
    follow() {
      followUser(this.content.user_id).then(res => {
        this.$emit('getData');
      });
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
