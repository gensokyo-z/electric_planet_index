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
                      @click.stop="addPlanet(item)">
                      {{item.joined?'退出':'加入'}}
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
import { joinPlanet, quitPlanet } from '@/api/planet';
import util from '@/utils/util';
export default {
  name: 'planet',
  data() {
    return {
      cardList: []
    };
  },
  mounted() {
    this.getPlanetList();
  },
  methods: {
    getPlanetList() {
      this.cardList = [];
      this.$store.dispatch('getAllPlanetList').then(list => {
        list.forEach(e => {
          e.joined = this.$state.userPlanet.some(v => v.id === e.id);
        });
        this.cardList = list;
      });
    },
    async addPlanet(content) {
      if (!util.getcookie('TOKEN')) {
        this.$store.dispatch('needAuth');
      }
      if (content.joined) {
        this.$confirm('是否退出该星球', '提示')
          .then(() => {
            quitPlanet(content.id).then(async res => {
              if (res.code === 200) {
                this.$message.success('已退出星球');
                this.$store.dispatch('getUserPlanetList').then(() => {
                  this.getPlanetList();
                });
              }
            });
          })
          .catch(() => {});
      } else {
        this.$confirm('是否加入该星球', '提示')
          .then(() => {
            joinPlanet(content.id).then(async res => {
              if (res.code === 200) {
                this.$message.success('已成功加入星球');
                this.$store.dispatch('getUserPlanetList').then(() => {
                  this.$router.push(`/planetdetail?id=${content.id}`);
                });
              }
            });
          })
          .catch(() => {});
      }
    }
  }
};
</script>

<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
