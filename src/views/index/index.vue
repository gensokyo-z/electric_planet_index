<template>
  <section class="index">
    <div class="title">
      <div class="flex">
        <div :class="['tab',{active:type === 'new'}]"
          @click="changeTab('new')">最新</div>
        <div :class="['tab',{active:type === 'hot'}]"
          @click="changeTab('hot')">最热</div>
      </div>
      <span>电动星球为你精心准备的实时资讯</span>
    </div>
    <div class="tag-list">
      <div :class="['tag',{'checked':item.checked}]"
        v-for="(item, index) in tagList"
        :key="index"
        @click="checkTags(item)">#{{item.name}}</div>
    </div>
    <div class="community-main"
      v-loading="loadFlag">
      <div class="card-list"
        :class="{isWechat:$state.isWechat}">
        <div class="card"
          v-for="(item, index) in cardList"
          :key="index">
          <NewCard :content="item"
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
import { getNewest, getHotest } from '@/api/index';
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
    this.$bus.$on('indexSearch', kw => {
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
    changeTab(type) {
      this.type = type;
      this.getSerch('');
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
      let path = null;
      if (this.type === 'new') {
        path = getNewest;
      } else {
        path = getHotest;
      }
      path({ page: this.page, per_page: this.per_page, keyword: this.keyWord, type: ['0', '1', '2'] })
        .then(res => {
          if (res.code === 200 && res.data) {
            let arr = [];
            res.data.forEach(e => {
              if (e.type === 0 && !e.thumb_pic) {
                if (e.media && e.media.length > 0 && e.media[0].media_link) e.thumb_pic = e.media[0].media_link;
              }
              // e.content = util.changeHtml2Crad(e.content);
              let planet = this.$state.allPlanet.find(v => v.id === e.planet_id);
              if (planet) {
                e.planet = {
                  planet_id: e.planet_id,
                  name: planet.name
                };
              } else {
                e.planet = {
                  planet_id: 0,
                  name: ''
                };
              }
              if (e.tags.length > 4) {
                e.tags.splice(4, e.tags.length - 4);
              }
              if (e.type === 0 || e.type === 1) {
                e.mediaType = 'pic';
              } else {
                e.mediaType = 'video';
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
          this.loadFlag = false;
        })
        .catch(err => {
          console.log(err);
          this.loadFlag = false;
        });
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
