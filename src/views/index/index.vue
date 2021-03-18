<template>
  <section class="index">
    <div class="layout">
      <Header @getSerch="getSerch"
        ref="header" />
      <div class="layout-main">
        <div class="community-container">
          <div class="title">
            <h1>星球资讯</h1>
            <p>电动星球为你精心准备的实时资讯</p>
          </div>
          <div class="tag-list">
            <div class="tag"></div>
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
            <!-- <div class="card-list">
              <TabBar @bindTab="bindTab" />
              <div class="infinite-scroll"
                style="overflow-y: auto">
                <ul class="infinite-list"
                  v-infinite-scroll="onLoad"
                  :infinite-scroll-disabled="disabled"
                  :infinite-scroll-distance="300">
                  <li v-for="(item, index) in cardList"
                    :key="index">
                    <NewCard :type.sync="type"
                      :content="item"
                      @handlerTag="handlerTag"
                      @getData="getData" />
                  </li>
                </ul>
                <p v-show="loading">加载中...</p>
                <p v-show="finished"
                  id="footer">{{page===last_page?'没有更多了':''}}</p>
              </div>
            </div> -->
          </div>
          <!-- <div class="community-aside">
            <BannerCard />
          </div> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import NewCard from '@/components/NewCard';
import { getNewest, getHotest } from '@/api/index';
import util from '@/utils/util';
export default {
  name: 'index',
  data() {
    return {
      type: 'new',
      page: 1,
      per_page: 12,
      last_page: 0,
      cardList: [],
      keyWord: '',
      loading: false,
      finished: false
    };
  },
  mounted() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.loading = true;
      this.getData(this.type);
    },
    getSerch(kw) {
      this.page = 1;
      this.cardList = [];
      this.keyWord = kw;
      this.getData(this.type);
    },
    getData(type) {
      if (this.ajax) {
        return;
      }
      if (type === 'new') {
        getNewest({ page: this.page, per_page: this.per_page, keyword: this.keyWord })
          .then(res => {
            if (res.code === 200 && res.data) {
              this.last_page = res.last_page;
              res.data.forEach(e => {
                // if (!e.thumb_pic) {
                //   e.thumb_pic = util.getFirstImg(e.content);
                // }
                e.content = util.changeHtml2Crad(e.content);
                // e.planetBg = this.$state.allPlanet.find(v => v.id === e.planet_id).avatar;
              });
              let arr = [];
              res.data.forEach(e => {
                if (e.type === 0 || e.type === 1) {
                  arr.push(e);
                }
              });
              this.cardList = this.cardList.concat(arr);
              if (res.last_page === res.current_page) {
                this.finished = true;
              } else {
                this.loading = false;
                this.page++;
              }
            } else {
              this.finished = true;
            }
          })
          .catch(() => {});
      } else {
        getHotest({ page: this.page, per_page: this.per_page, keyword: this.keyWord })
          .then(res => {
            if (res.code === 200 && res.data) {
              this.last_page = res.last_page;
              res.data.forEach(e => {
                e.user.avatar = util.defaultAvatar(e.user.avatar);
                if (!e.thumb_pic) {
                  e.thumb_pic = util.getFirstImg(e.content);
                }
                e.content = util.changeHtml2Crad(e.content);
              });
              this.cardList = this.cardList.concat(res.data);
              if (res.last_page === res.current_page) {
                this.finished = true;
              } else {
                this.loading = false;
                this.page++;
              }
            } else {
              this.finished = true;
            }
            this.ajax = false;
          })
          .catch(() => {
            this.ajax = false;
          });
      }
    },
    getClear() {
      this.page = 1;
      this.cardList = [];
      this.getData(this.type);
    },
    bindTab(type) {
      this.finished = false;
      this.type = type;
      this.getClear();
    },
    gotoDetail(item) {
      this.$router.push(`/docdetail?id=${item.id}`);
    },
    scrollhandle(event) {
      if (this.page === this.last_page) {
        return;
      }
      const elOffsetTop = document.getElementById('footer').offsetTop;
      const docScrollTop = document.documentElement.scrollTop;
      if (elOffsetTop >= docScrollTop && elOffsetTop < docScrollTop + window.innerHeight && !this.loading) {
        this.finished = false;
        this.getData(this.type);
      }
    },
    handlerTag(tag) {
      let tagName = '#' + tag.name;
      this.$refs.header.setSearch(tagName);
      this.getSerch(tagName);
    }
  },
  computed: {
    disabled() {
      // eslint-disable-next-line
      this.loading = false;
      return this.finished;
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollhandle, false);
  },
  components: {
    // TabBar: () => import('./components/TabBar'),
    // Search: () => import('@/components/Search/index.vue'),
    NewCard
    // BannerCard: () => import('@/components/banner')
  }
};
</script>

<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
