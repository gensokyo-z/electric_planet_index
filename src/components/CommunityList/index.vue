<template>
  <section class='community-list flex-v'>
    <a class='item' v-for='(item,index) in $state.allPlanet' :key='index'
       @click='goUrl(`/planetdetail/${item.id}`)'>
      <img class='logo' :src='item.avatar'
           alt=''>
    </a>
  </section>
</template>

<script>
export default {
  name: 'CommunityList',
  methods: {
    goUrl(url) {
      this.$router.push(url);
    }
  }
};
</script>

<style scoped lang='less'>
.community-list {
  padding: 10px 20px;

  .item {
    cursor: pointer;

    img {
      margin-right: 64px;
      width: 32px;
      height: 32px;
    }
  }

}
</style>
