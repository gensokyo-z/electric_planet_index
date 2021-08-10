<template>
  <section class='index flex'>
    <div class='left'>
      <Banner />
      <CommunityList />
      <CardList />
    </div>
    <div class='right'>
      <UserCard />
<!--      <BoutiqueCard />-->
      <MasterCard />
      <Footer />
    </div>
  </section>
</template>

<script>
import Banner from '@/components/Banner';
import UserCard from '@/components/UserCard';
// import BoutiqueCard from '@/components/BoutiqueCard';
import CardList from '@/components/CardList';
import CommunityList from '@/components/CommunityList';
import MasterCard from '@/components/MasterCard';

export default {
  name: 'index',
  components: {
    Banner,
    UserCard,
    // BoutiqueCard,
    CardList,
    CommunityList,
    MasterCard,
  }
};
</script>

<style scoped lang='less'>
.index {
  padding-top: 20px;
}
</style>
