<template>
  <section class='attention flex'>
    <div class='left'>
      <FansList @getUserId='getUserId' />
      <CardList :userId.sync='userId' ref='cardList' />
    </div>
    <div class='right'>
      <UserCard />
      <MasterCard />
      <Footer />
    </div>
  </section>
</template>

<script>
import FansList from '@/components/FansList';
import UserCard from '@/components/UserCard';
import CardList from '@/components/CardList';
import MasterCard from '@/components/MasterCard';

export default {
  name: 'attention',
  data() {
    return {
      userId: 0
    };
  },
  methods: {
    getUserId(user_id) {
      if (user_id !== 0) {
        this.$refs.cardList.cardList = [];
      }
      this.userId = user_id;
    }
  },
  components: {
    FansList,
    UserCard,
    CardList,
    MasterCard
  }
};
</script>

<style scoped lang='less'>
.attention {
  padding-top: 20px;
}
</style>
