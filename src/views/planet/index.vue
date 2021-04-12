<template>
  <section class="index">
    <div class="title">
      <div :class="['planet-tab',{active:type==='planet'}]"
        @click="changeTab('planet')">星球社区</div>
      <div :class="['planet-tab',{active:type==='my'}]"
        @click="changeTab('my')">我加入的</div>
    </div>
    <div class="planet-list">
      <div class="planet"
        v-for="(item,index) in planetList"
        :key="index"
        :class="[{all:item.name === '全部'},{active:item.checked}]"
        @click="changePlanet(item)">
        <div v-show="item.name === '全部'">全部</div>
        <img :src="item.avatar"
          v-show="item.name !== '全部'">
      </div>
    </div>
    <div class="card-list"
    :class="{isWechat:$state.isWechat}"
      v-loading="loading">
      <div class="card"
        v-for="(item, index) in cardList"
        :key="index">
        <NewCard :content="item" />
      </div>
    </div>
    <div class="footer-btn"
      v-if="!loading">
      <el-button @click="loadMore">{{finished?'~~~到底了~~~':'加载更多'}}</el-button>
    </div>
  </section>
</template>
<script>
import { getPlanetPosts } from '@/api/planet';
import { getNewest } from '@/api/index';
// import util from '@/utils/util';
import NewCard from '@/components/NewCard';
export default {
  name: 'planet',
  components: {
    NewCard
  },
  data() {
    return {
      type: 'planet',
      planetList: [],
      id: 0,
      page: 1,
      per_page: 12,
      cardList: [],
      loading: true,
      finished: false
    };
  },
  created() {
    this.getPlanetList();
  },
  methods: {
    changeTab(type) {
      this.type = type;
      if (this.type === 'planet') {
        this.getPlanetList();
      } else {
        this.getMyPlanetList();
      }
    },
    getClear() {
      this.finished = false;
      this.cardList = [];
      this.page = 1;
      this.getData();
    },
    changePlanet(item) {
      this.planetList.forEach(e => {
        e.checked = e.id === item.id;
      });
      this.id = item ? item.id : 0;
      this.getClear();
    },
    loadMore() {
      if (this.finished) {
        return;
      }
      this.page++;
      this.getData();
    },
    getPlanetList() {
      this.planetList = [];
      this.$store.dispatch('getAllPlanetList').then(list => {
        list.forEach(e => {
          e.joined = this.$state.userPlanet.some(v => v.id === e.id);
          e.checked = false;
        });
        list = [{ name: '全部', id: 0, checked: true }, ...list];
        this.planetList = list;
        this.id = 0;
        this.getClear();
      });
    },
    getMyPlanetList() {
      this.planetList = [];
      this.$store.dispatch('getUserPlanetList').then(list => {
        list.forEach((e, i) => {
          e.joined = true;
          e.checked = i === 0;
        });
        this.planetList = list;
        this.id = list[0].id;
        this.getClear();
      });
    },
    getData() {
      this.loading = true;
      let path = null;
      let obj = {};
      if (!this.id) {
        path = getNewest;
        obj = { page: this.page, per_page: this.per_page };
      } else {
        path = getPlanetPosts;
        obj = {
          id: this.id,
          page: this.page,
          per_page: this.per_page
        };
      }
      path(obj)
        .then(res => {
          if (res.code === 200 && res.data) {
            let arr = [];
            res.data.forEach(e => {
              if (e.type === 0 && !e.thumb_pic) {
                if (e.media && e.media.length > 0 && e.media[0].media_link) e.thumb_pic = e.media[0].media_link;
              }
              e.planet = {
                planet_id: e.planet_id,
                name: this.$state.allPlanet.find(v => v.id === e.planet_id).name
              };
              if (e.tags.length > 4) {
                e.tags.splice(4, e.tags.length - 4);
              }
              if (e.type === 2) {
                e.mediaType = 'video';
              } else {
                e.mediaType = 'pic';
              }
              arr.push(e);
            });
            this.cardList = this.cardList.concat(arr);
            if (res.last_page === res.current_page) {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
