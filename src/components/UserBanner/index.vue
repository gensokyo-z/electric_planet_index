<template>
  <section class='author'>
    <div class='author-box flex-v' v-show='userInfo.id'>
      <img :src='userInfo.avatar' alt='' class='avatar'>
      <div class='info flex-col'>
        <span class='name'>{{ userInfo.username }}</span>
        <span class='intro worldhidden'>{{ userInfo.intro || '这里是一段文案对这个星球的介绍内容，内容最多显示150个字，在设置的时候就提示' }}</span>
        <div v-if='isMine'>
          <button class='join' @click="goUrl('/profile')">
            <div class='flex-v'>
              <span>修改个人信息</span>
            </div>
          </button>
        </div>
        <div v-else>
          <button :class="['join',{folloed:userInfo.hasbefolloed}]"
                  @click='folloed'>
            <div class='flex-v'>
              <img src='@/assets/images/move.png'
                   alt='' v-if='!userInfo.hasbefolloed'>
              <span>{{ userInfo.hasbefolloed ? '已关注' : '关注' }}</span>
            </div>
          </button>
        </div>
      </div>
      <div class='data flex-c-b'>
        <div class='authors flex-co-c'>
          <span class='label'>帖子数</span>
          <span class='count'>{{ userInfo.posts_count }}</span>
        </div>
        <div class='fans flex-co-c'>
          <span class='label'>粉丝数</span>
          <span class='count'>{{ userInfo.followers_count }}</span>
        </div>
        <div class='posts flex-co-c'>
          <span class='label'>已关注</span>
          <span class='count'>{{ userInfo.followed_count }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getOtheruser, followUser } from '@/api/user';

export default {
  name: 'UserBanner',
  data() {
    return {
      isMine: true,
      userInfo: {}
    };
  },
  created() {
    this.isMine = window.location.href.includes('mine');
  },
  mounted() {
    if (this.isMine) {
      this.userInfo = this.$state.userInfo;
    } else {
      this.getOtheruser();
    }
  },
  methods: {
    goUrl(url) {
      this.$router.push(url);
    },
    getOtheruser() {
      const id = this.$route.params.userId;
      getOtheruser({ id }).then(res => {
        this.userInfo = res.data;
      });
    },
    folloed() {
      if (!this.userInfo.hasbefolloed) {
        followUser(this.$route.params.userId).then(res => {
          this.$message.success('关注成功')
          this.getOtheruser();
          this.$store.dispatch('getInfo');
        });
      }
    }
  }
};
</script>

<style scoped lang='less'>
.author {
  padding-top: 20px;

  .author-box {
    width: 1120px;
    padding: 42px 33px;
    background: #fff;
    margin-bottom: 10px;

    .avatar {
      width: 115px;
      height: 115px;
      border-radius: 50%;
      margin-right: 30px;
    }

    .name {
      margin-bottom: 4px;
      font-weight: 600;
      font-size: 24px;
      line-height: 34px;
      color: #191919;
    }

    .intro {
      margin-bottom: 23px;
      width: 500px;
      font-size: 14px;
      line-height: 20px;
      color: #5c6573;
    }

    .join {
      padding: 8px 33px;
      background: #39393b;
      border-radius: 17px;
      cursor: pointer;
      border: 1px solid #39393b;

      &.folloed {
        background: #fff;

        span {
          color: #39393b;

        }
      }

      img {
        width: 16px;
        height: 16px;
        margin-right: 2px;
      }

      span {

        font-size: 13px;
        line-height: 18px;
        color: #fff;
      }
    }

    .data {
      width: 254px;
      margin-left: auto;

      .authors, .fans {
        position: relative;

        &:after {
          content: '';
          position: absolute;
          top: 8px;
          left: 73px;
          height: 24px;
          width: 1px;
          background: #929da5;
        }
      }

      .authors, .fans, .posts {
        .label {
          margin-bottom: 14px;
          font-size: 12px;
          line-height: 17px;
          color: #576073;
        }

        .count {
          font-size: 14px;
          line-height: 20px;
          color: #141b29;
        }
      }
    }
  }
}
</style>
