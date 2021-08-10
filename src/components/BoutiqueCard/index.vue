<template>
  <section class='boutique'>
    <div class='title'>精品专题</div>
    <div class='news flex-col-ac'>
      <div v-for='(item,index) in boutique' :key='index' class='item worldhidden'>{{ item }}</div>
    </div>
    <button class='more'>更多专题</button>
  </section>
</template>
<script>

export default {
  name: 'Boutique',
  data() {
    return {
      boutique: [
        '天生猎性 静态体验极氪001',
        '老司机般的操作 体验小鹏停车场...',
        '全景体验蔚来杭州之行回忆录全景体验蔚来杭州之行回忆录',
        '2021 款理想 ONE 的所有信息都...', '试驾上汽大众 ID.6 X'
      ]
    };
  },
  mounted() {
  },
  methods: {
    goUrl(url) {
      this.$router.push(url);
    }
  }
};
</script>
<style scoped lang='less'>
.boutique {
  background: #fff;
  margin-bottom: 10px;
  .title {
    padding: 16px 20px;
    font-size: 14px;
    border-bottom: 1px solid #eaeaea;
  }

  .news {
    padding: 10px 20px;

    .item {
      width: 250px;
      font-size: 14px;
      line-height: 30px;
      cursor: pointer;
    }

  }

  .more {
    background: #fff;
    font-size: 13px;
    padding: 8px 103px;
    margin: 16px 20px;
    border: 1px solid #39393b;
    border-radius: 17px;
    cursor: pointer;
  }
}
</style>
