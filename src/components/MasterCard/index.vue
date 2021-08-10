<template>
  <section class='master-card flex-col' v-show='masterList.length>0'>
    <div class='master-header flex-c-b'>
      <span class='title'>达人推荐</span>
      <div class='flex-cc reset'>
        <img src='@/assets/images/re.png' alt='' class='re'>
        <span class='reset'>换一换</span>
      </div>
    </div>
    <div class='master-list flex-col'>
      <div class='item flex-v' v-for='(item,index) in masterList' :key='index'
           @click='goUrl(`/author/${item.id}`)'>
        <img :src='item.avatar' alt='' class='avatar'>
        <div class='info flex-col'>
          <span class='name'>{{ item.username }}</span>
          <span class='desc worldhidden'>{{ item.intro }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getRecommend } from '@/api/user';

export default {
  name: 'MasterCard',
  data() {
    return {
      masterList: [],
      current_page: 1,
      per_page: 15,
      last_page: 1
    };
  },
  mounted() {
    this.getRecommend();
  },
  methods: {
    goUrl(url) {
      if (this.$route.fullPath !== url) {
        this.$router.push(url);
      }
    },
    getRecommend() {
      getRecommend().then(res => {
        this.masterList = res.data;
      });
    }
  }
};
</script>

<style scoped lang='less'>
.master-card {
  margin-bottom: 10px;
  background: #fff;

  .master-header {
    padding: 16px 20px;
    border-bottom: 1px solid #eaeaea;

    .title {
      font-weight: 600;
      font-size: 14px;
      color: #141b29;
    }

    .reset {
      cursor: pointer;

      > img {
        width: 16px;
        height: 16px;
        margin-right: 2px;
      }

      > span {
        font-size: 12px;
        line-height: 16px;
        color: #8992a3;

      }
    }

  }

  .master-list {
    padding: 20px 20px 8px 20px;

    .item {
      margin-bottom: 20px;
      cursor: pointer;

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 8px;

      }

      .info {
        .name {
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
          color: #141b29;
        }

        .desc {
          width: 210px;
          font-size: 12px;
          line-height: 17px;
          color: #576073;
        }
      }
    }
  }
}
</style>
