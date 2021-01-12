<template>
  <section class="index">
    <div class="layout">
      <Header />
      <div class="layout-main">
        <div class="community-container">
          <div class="community-main">
            <div class="card-list">
              <div class="planet-card"
                   v-for="(item,index) in cardList"
                   :key="index">
                <div class="top">
                  <div class="left">
                    <img :src="item.avatar">
                  </div>
                  <div class="rigth">
                    <div class="info">
                      <div class="name">{{item.name}}</div>
                      <div class="desc">已有{{item.users_count}}人加入</div>
                    </div>
                    <div class="btn"
                         @click="$router.push('/planetdetail?id='+item.id)">
                      进入
                    </div>
                  </div>
                </div>
                <div class="buttom">
                  {{item.intro}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'planet',
  data () {
    return {
      cardList: [],
    };
  },
  mounted () {
    this.getPlanetList()
  },
  methods: {
    getPlanetList (flag) {
      this.$store.dispatch('getAllPlanetList').then(list => {
        console.log(list);
        this.cardList = list
      })
    },
  }
};
</script>

<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
