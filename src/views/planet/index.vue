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
                   :key="index"
                   @click="$router.push('/planetdetail?id='+item.id)">
                <div class="top">
                  <div class="left">
                    <img :src="item.avatar">
                  </div>
                  <div class="rigth">
                    <div class="info">
                      <div class="name">{{item.name}}</div>
                      <div class="desc">已有{{item.users_count}}人加入</div>
                    </div>
                    <div :class="['btn',{'joined':!item.joined}]"
                         @click.stop="addPlanet(content)">
                      {{item.joined?'已加入':'加入'}}
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
import { joinPlanet } from '@/api/planet';
import util from '@/utils/util';
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
        list.forEach(e => {
          e.joined = this.$state.userPlanet.some(v => v.id === e.id)
        })
        this.cardList = list
      })
    },
    async addPlanet (content) {
      if (!util.getcookie('TOKEN')) {
        this.$store.dispatch('needAuth')
      }
      this.$confirm('是否加入该星球', '提示')
        .then(() => {
          joinPlanet(content.id).then(async res => {
            if (res.code === 200) {
              await this.$store.dispatch('getUserPlanetList');
              this.$router.push(`/planetdetail?id=${content.id}`);
            }
          });
        })
        .catch(() => { });
    },
  }
};
</script>

<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
