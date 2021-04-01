<template>
  <section class="index">
    <div class="title">
      <div :class="['planet-tab',{active:type==='planet'}]"
        @click="changeTab('planet')">星球社区</div>
      <div :class="['planet-tab',{active:type==='my'}]"
        @click="changeTab('my')">我加入的</div>
    </div>
    <div class="card-list">
      <div class="planet-card"
        v-for="(item,index) in cardList"
        :key="index"
        :class="[{all:item.name === '全部'},{active:item.checked}]"
        @click="changePlanet(item)">
        <div v-show="item.name === '全部'">全部</div>
        <img :src="item.avatar"
          v-show="item.name !== '全部'">
      </div>
    </div>
    <div class="new-list"
      v-loading="loadFlag">
      <div class="new"
        v-for="(item, index) in newList"
        :key="index">
        <NewCard :content="item" />
      </div>
    </div>
    <div class="footer-btn"
      v-if="!loadFlag">
      <el-button @click="loadMore">{{finished?'~~~到底了~~~':'加载更多'}}</el-button>
    </div>
  </section>
</template>
<script>
import { joinPlanet, quitPlanet, getPlanetPosts } from '@/api/planet';
import { getNewest } from '@/api/index';
import util from '@/utils/util';
import NewCard from '@/components/NewCard';
export default {
  name: 'planet',
  components: {
    NewCard
  },
  data() {
    return {
      type: 'planet',
      cardList: [],
      id: 0,
      page: 0,
      per_page: 12,
      last_page: 0,
      newList: [],
      keyWord: '',
      loadFlag: true,
      finished: false
    };
  },
  mounted() {
    this.getPlanetList();
    this.loadMore();
  },
  methods: {
    changeTab(type) {
      this.finished = false;
      this.newList = [];
      this.type = type;
      if (type === 'planet') {
        this.getPlanetList();
      } else {
        this.getMyPlanetList();
      }
    },
    changePlanet(item) {
      this.cardList.forEach(e => {
        e.checked = e.id === item.id;
      });
      this.finished = false;
      this.newList = [];
      this.id = item ? item.id : 0;
      this.page = 0;
      this.loadMore();
    },
    loadMore() {
      if (this.finished) {
        return;
      }
      this.page++;
      this.getData();
    },
    getPlanetList() {
      this.cardList = [];
      this.$store.dispatch('getAllPlanetList').then(list => {
        list.forEach(e => {
          e.joined = this.$state.userPlanet.some(v => v.id === e.id);
          e.checked = false;
        });
        list = [{ name: '全部', id: 0, checked: true }, ...list];
        this.cardList = list;
        this.id = 0;
        this.page = 0;
        this.loadMore();
      });
    },
    getMyPlanetList() {
      this.cardList = [];
      this.$store.dispatch('getUserPlanetList').then(list => {
        list.forEach(e => {
          e.joined = true;
        });
        this.cardList = list;
        this.id = list[0].id;
        this.page = 0;
        this.loadMore();
      });
    },
    getData() {
      this.loadFlag = true;
      let path = null;
      let obj = {};
      if (!this.id) {
        path = getNewest;
        obj = { page: this.page, per_page: this.per_page, keyword: this.keyWord };
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
            this.last_page = res.last_page;
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
            this.newList = this.newList.concat(arr);
            if (res.last_page === res.current_page) {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
          this.loadFlag = false;
        })
        .catch(() => {
          this.loadFlag = false;
        });
    },
    async addPlanet(content) {
      if (!util.getcookie('TOKEN')) {
        return this.$store.dispatch('needAuth');
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
        // this.$confirm('是否加入该星球', '提示')
        //   .then(() => {
        joinPlanet(content.id).then(async res => {
          if (res.code === 200) {
            this.$message.success('已成功加入星球');
            this.$store.dispatch('getUserPlanetList').then(() => {
              this.$router.push(`/planetdetail?id=${content.id}`);
            });
          }
        });
        // })
        // .catch(() => {});
      }
    }
  }
};
</script>

<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
