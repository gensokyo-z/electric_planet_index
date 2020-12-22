<template>
  <section class="index">
    <TabBar :type.sync="type"
            @bindTab="bindTab"
            @search="search" />
    <van-pull-refresh v-model="isLoading"
                      @refresh="onRefresh">
      <van-list v-model="loading"
                :finished="finished"
                offset="300"
                @load="onLoad">
        <PlanetCard :type.sync="type"
                    v-for="(item, index) in planetList"
                    :key="index"
                    :content="item" />
        <div class="footer-tips"
             v-show="type !=='my'">
          更多星球正在创建中，敬请期待…
        </div>
      </van-list>
    </van-pull-refresh>
    <div class="footer-pad"></div>
  </section>
</template>

<script>
import Vue from 'vue';
import { mapState, mapActions } from 'vuex'
import { PullRefresh, List } from 'vant';
import { getPlanetList } from '@/api/planet';
Vue.use(PullRefresh);
Vue.use(List);
export default {
  name: 'index',
  data () {
    return {
      planetList: [],
      loading: false,
      finished: false,
      isLoading: false,
      type: 'list',
      searchValue: ''
    };
  },
  computed: {
    ...mapState(['userPlanet'])
  },
  mounted () {
    // this.getData()
  },
  methods: {
    ...mapActions(['getUserPlanetList']),
    onLoad (flag) {
      setTimeout(async () => {
        if (flag) {
          this.planetList = [];
        }
        await this.getData(this.type)
        // this.page++
      }, 100);
    },
    async getData (type) {
      if (this.type === 'list') {
        getPlanetList().then(res => {
          if (res.code === 200 && res.data && res.data.length > 0) {
            res.data.forEach(e => {
              if (this.userPlanet.length > 0) {
                e.joined = this.userPlanet.some(v => v.id === e.id)
              } else {
                e.joined = false
              }
              e.avatar = e.avatar.includes('//') ? e.avatar : require('@/assets/images/timg.jpg')
            })
            this.planetList = res.data
            // if (res.last_page === res.current_page) {
            this.finished = true
            // }
          } else {
            this.finished = true
          }
        });
      } else {
        await this.getUserPlanetList()
        this.planetList = this.userPlanet
        this.finished = true
      }
    },

    bindTab (type) {
      this.planetList = []
      this.type = type;
      this.finished = false
      this.getData(type)
    },
    search (value) {
      this.searchValue = value
      this.getData()
    },
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 1000);
    }
  },
  components: {
    TabBar: () => import('./components/TabBar'),
    PlanetCard: () => import('./components/PlanetCard.vue')
  }
};
</script>

<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
