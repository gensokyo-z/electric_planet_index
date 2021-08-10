<template>
  <section class='fans-list'>
    <img class='left-arr' src='@/assets/images/arr.png' alt=''>
    <div class='wrapper flex-v'>
      <div :class="['item', 'flex-co-c' ,{active:item.active}]" v-for='(item,index) in fansList' :key='index'
           @click='checkFan(item)'>
        <div class='bg flex-cc'>
          <img :src='item.avatar' alt='' class='avatar'>
        </div>
        <span class='name'>{{ item.username }}</span>
      </div>
    </div>
    <img class='right-arr' src='@/assets/images/arr.png' alt=''>
  </section>
</template>

<script>
import { getFollower } from '@/api/user';

export default {
  name: 'FansList',
  data() {
    return {
      fansList: []
    };
  },
  mounted() {
    this.getFollower();
  },
  methods: {
    checkFan(item) {
      this.fansList.forEach(e => {
        e.active = e.id === item.id;
      });
      this.$emit('getUserId', item.user_id);
    },
    getFollower() {
      getFollower().then(res => {
        res.data.forEach(e => {
          e.avatar = e.user.avatar;
          e.username = e.user.username;
          e.active = false;
        });
        this.fansList = res.data;
        this.$emit('getUserId', 0);
      });
    }
  }
};
</script>

<style scoped lang='less'>
.fans-list {
  padding: 25px 40px;
  position: relative;
  background: #fff;
  margin-bottom: 10px;

  .wrapper {
    .item {
      cursor: pointer;
      margin-right: 20px;


      &.active {
        .bg {
          border-radius: 50%;
          background: linear-gradient(127.75deg, #ed7656 0%, #ffd7cc 100%);
        }
      }

      .bg {
        width: 72px;
        height: 72px;
        margin-bottom: 7px;
      }

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;

      }

      .name {
        font-size: 12px;
        line-height: 17px;
        color: #39393b;
      }
    }
  }

  .left-arr, .right-arr {
    position: absolute;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    cursor: pointer;
    top: 50%;
    margin-top: -13px;
  }

  .left-arr {
    transform: rotateZ(180deg);
    left: 10px;
  }

  .right-arr {
    right: 10px;
  }
}
</style>
