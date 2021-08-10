<template>
  <section class='author flex-col'>
    <UserBanner ref='UserBanner' />
    <div class='flex'>
      <div class='left'>
        <CardList />
      </div>
      <div class='right'>
        <MasterCard />
        <Footer />
      </div>
    </div>
  </section>
</template>

<script>
import UserBanner from '@/components/UserBanner';
import CardList from '@/components/CardList';
import MasterCard from '@/components/MasterCard';

export default {
  name: 'author',
  created() {
    const userId = this.$route.params.userId;
    if (Number(userId) === this.$state.userInfo.id) {
      this.$router.push('/mine');
    }
  },
  watch: {
    '$route.path': {
      handler(val, old) {
        if (val !== old) {
          console.log(val, old);
          this.$refs.UserBanner.getOtheruser();
        }
      },
      deep: true
    }
  },
  components: {
    UserBanner,
    CardList,
    MasterCard
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
