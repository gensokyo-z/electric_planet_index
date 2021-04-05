<template>
  <section class="index">
    <div class="title">
      <h1>星球资讯</h1>
      <span>电动星球为你精心准备的实时资讯</span>
    </div>
    <div class="tag-list">
      <div :class="['tag',{'checked':item.checked}]"
        v-for="(item, index) in tagList"
        :key="index"
        @click="checkTags(item)">#{{item.name}}</div>
    </div>
    <div class="community-main">
      <div class="card-list">
        <div class="card"
          v-for="(item, index) in cardList"
          :key="index">
          <NewCard :type.sync="type"
            :content="item"
            @handlerTag="handlerTag"
            @getData="getData" />
        </div>
      </div>
      <div class="footer-btn"
        v-if="!loadFlag">
        <el-button @click="loadMore">{{finished?'~~~到底了~~~':'加载更多'}}</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import NewCard from '@/components/NewCard';
import { getNewest } from '@/api/index';
import { getTags } from '@/api/tag';
// import util from '@/utils/util';
export default {
  name: 'index',
  data() {
    return {
      type: 'new',
      page: 1,
      per_page: 12,
      cardList: [],
      tagList: [],
      keyWord: '',
      loadFlag: true,
      finished: false
    };
  },
  created() {
    this.getTags();
  },
  mounted() {
    this.getData();
    this.$bus.$on('videoSearch', kw => {
      this.getSerch(kw);
    });
  },
  methods: {
    getTags() {
      getTags().then(res => {
        if (res.data) {
          if (res.data.length > 8) {
            res.data.splice(8, res.data.length - 8);
          }
          res.data.forEach(e => {
            e.checked = false;
          });
          this.tagList = res.data;
        }
      });
    },
    loadMore() {
      if (this.finished) {
        return;
      }
      this.page++;
      this.getData();
    },
    getSerch(kw) {
      this.page = 1;
      this.finished = false;
      this.cardList = [];
      this.keyWord = kw;
      this.getData();
    },
    getData() {
      this.loadFlag = true;
      const loading = this.$loading({
        lock: true
      });
      getNewest({ page: this.page, per_page: this.per_page, keyword: this.keyWord, type: ['2'] })
        .then(res => {
          if (res.code === 200 && res.data) {
            this.last_page = res.last_page;
            let arr = [];
            res.data.forEach(e => {
              // e.content = util.changeHtml2Crad(e.content);
              e.planet = {
                planet_id: e.planet_id,
                name: this.$state.allPlanet.find(v => v.id === e.planet_id).name
              };
              if (e.tags.length > 4) {
                e.tags.splice(4, e.tags.length - 4);
              }
              e.mediaType = 'video';
              arr.push(e);
            });
            this.cardList = this.cardList.concat(arr);
            if (res.last_page === res.current_page) {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
          this.loadFlag = false;
          loading.close();
        })
        .catch(() => {
          this.loadFlag = false;
          loading.close();
        });
    },
    bindTab(type) {
      this.type = type;
      this.getSerch('');
    },
    gotoDetail(item) {
      this.$router.push(`/docdetail?id=${item.id}`);
    },
    handlerTag(tag) {
      let tagName = '#' + tag.name;
      this.getSerch(tagName);
    },
    checkTags(item) {
      this.tagList.forEach(e => {
        e.checked = e.id === item.id;
      });
      this.handlerTag(item);
    }
  },
  components: {
    NewCard
  }
};
</script>

<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
