<template>
  <section class='user-card flex-col'>
    <template v-if='$state.token'>
      <div class='user flex'
           @click='goUrl(`/mine`)'>
        <img class='avatar'
             :src='avatar'
             alt='头像'>
        <div class='flex-col name-card'>
          <span class='name'>{{ username }}</span>
          <span class='desc'>{{ $state.userInfo.auth_info }}</span>
        </div>
      </div>
      <div class='account-data flex-c-b'>
        <div class='flex-col-cc item'><label>帖子数</label><span>{{ belikeds }}</span></div>
        <div class='flex-col-cc item'><label>粉丝</label><span>{{ followersCount }}</span></div>
        <div class='flex-col-cc item'><label>已关注</label><span>{{ followedCount }}</span></div>
      </div>
      <div class='posts flex-c-b'>
        <div class='flex-col-cc item' @click="goUrl('/post?type=Dynamic')">
          <img src='@/assets/images/icon_d.png'
               alt=''><span>发动态</span></div>
        <div class='flex-col-cc item' @click="goUrl('/post?type=Article')">
          <img src='@/assets/images/icon_p.png'
               alt=''><span>发文章</span></div>
        <div class='flex-col-cc item' @click="goUrl('/post?type=Video')">
          <img src='@/assets/images/icon_v.png'
               alt=''><span>发视频</span></div>
      </div>
    </template>
    <template v-else>
      <div class='unlogin'>
        <div class='avatar flex-v'>
          <img src='@/assets/images/def_avatar.png' alt=''>
          <span>未登录</span>
        </div>
        <button class='login-btn' @click='openLogin'>登录/注册</button>
      </div>
    </template>
  </section>
</template>
<script>
import util from '@/utils/util';

export default {
  name: 'UserCard',
  data() {
    return {
    };
  },
  methods: {
    goUrl(url) {
      this.$router.push(url);
    },
    openLogin() {
      this.$bus.$emit('login', true);
    }
  },
  computed: {
    avatar() {
      if (this.$state.userInfo && this.$state.userInfo.avatar) {
        return this.$state.userInfo.avatar;
      } else {
        return util.defaultAvatar('');
      }
    },
    username() {
      if (this.$state.userInfo && this.$state.userInfo.username) {
        return this.$state.userInfo.username;
      } else {
        return '';
      }
    },
    belikeds() {
      if (this.$state.userInfo && this.$state.userInfo.belikeds) {
        return this.$state.userInfo.belikeds;
      } else {
        return 0;
      }
    },
    followersCount() {
      if (this.$state.userInfo && this.$state.userInfo.followers_count) {
        return this.$state.userInfo.followers_count;
      } else {
        return 0;
      }
    },
    followedCount() {
      if (this.$state.userInfo && this.$state.userInfo.followed_count) {
        return this.$state.userInfo.followed_count;
      } else {
        return 0;
      }
    }
  }
};
</script>
<style scoped lang='less'>
.user-card {
  margin-bottom: 11px;
  padding: 16px 20px 16px;
  background: #fff;

  .user {
    margin-bottom: 24px;

    .avatar {
      margin-right: 16px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .name-card {
      padding: 5px 0;

      .name {
        margin-bottom: auto;
        font-size: 14px;
        color: #141b29;
      }

      .desc {
        color: #8992a3;
      }
    }
  }

  .account-data, .posts {
    padding: 0 12px;

    .item {
      cursor: pointer;

      img {
        margin-bottom: 8px;
        width: 24px;
        height: 24px;
      }

      label {
        margin-bottom: 4px;
        font-size: 12px;
        line-height: 17px;
        color: #576073;
      }

      span {
        font-size: 14px;
        color: #141b29;
      }
    }
  }

  .account-data {
    padding-bottom: 24px;
    border-bottom: 1px solid #eaeaea;
  }

  .posts {
    margin-top: 24px;
    padding-bottom: 12px;

  }

  .unlogin {
    .avatar {
      margin-bottom: 24px;

      > img {
        margin-right: 16px;
        width: 50px;
        height: 50px;
      }

      > span {
        font-weight: 600;
        font-size: 14px;
        color: #141b29;
      }

    }

    .login-btn {
      padding: 8px 100px;
      cursor: pointer;
      width: 100%;
      background: #fff;
      font-size: 13px;
      color: #39393b;
      border: 1px solid #39393b;
      box-sizing: border-box;
      border-radius: 17px;
    }
  }
}
</style>
