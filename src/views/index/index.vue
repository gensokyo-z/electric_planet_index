<template>
  <section class="index">
    <div class="layout">
      <Header />
      <div class="layout-main">
        <div class="community-container">
          <div class="community-main">
            <div class="card-list">
              <TabBar @bindTab="bindTab" />
              <div class="infinite-scroll"
                   style="overflow-y: auto">
                <ul class="infinite-list"
                    v-infinite-scroll="onLoad"
                    :infinite-scroll-disabled="disabled"
                    :infinite-scroll-distance="10">
                  <li v-for="(item, index) in cardList"
                      :key="index">
                    <NewCard :type.sync="type"
                             :content="item" />
                  </li>
                </ul>
                <p v-if="loading">加载中...</p>
                <p v-if="finished">没有更多了</p>
              </div>
            </div>
          </div>
          <div class="community-aside"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue';
import NewCard from '@/components/NewCard';
import { getNewest, getHotest } from '@/api/index';
import util from '@/utils/util'
import { InfiniteScroll } from 'element-ui';
Vue.use(InfiniteScroll);
export default {
  name: 'index',
  data () {
    return {
      ajax: false,
      type: 'new',
      page: 1,
      per_page: 10,
      cardList: [],
      keyWord: '',
      loading: false,
      finished: false,
    };
  },
  mounted () {
    // this.$refs.video.content.video = true
    // this.$refs.video.initVideo()
    // this.getData('new');
    // this.getClear()
  },
  methods: {
    onLoad (flag) {
      if (flag) {
        this.cardList = [];
      }
      this.loading = true;
      setTimeout(() => {
        this.getData(this.type)
      }, 300);

    },
    getData (type) {
      if (this.ajax) {
        return
      }
      this.ajax = true
      // this.finished = true
      if (type === 'new') {
        getNewest({ page: this.page, per_page: this.per_page, keyword: this.keyWord }).then(res => {
          if (res.code === 200 && res.data) {
            res.data.forEach(e => {
              e.user.avatar = util.defaultAvatar(e.user.avatar);
              if (!e.thumb_pic) { e.thumb_pic = util.getFirstImg(e.content) }
              e.content = util.changeHtml2Crad(e.content)
            })
            this.cardList = this.cardList.concat(res.data);
            if (res.last_page === res.current_page) {
              this.finished = true
            } else {
              this.loading = false;
              this.page++
            }
          } else {
            this.finished = true
          }
          this.ajax = false
        }).catch(() => {
          this.ajax = false
        });
      } else {
        getHotest({ page: this.page, per_page: this.per_page, keyword: this.keyWord }).then(res => {
          if (res.code === 200 && res.data) {
            res.data.forEach(e => {
              e.user.avatar = util.defaultAvatar(e.user.avatar);
              if (!e.thumb_pic) {
                e.thumb_pic = util.getFirstImg(e.content)
              }
              e.content = util.changeHtml2Crad(e.content)
            })
            this.cardList = this.cardList.concat(res.data);
            if (res.last_page === res.current_page) {
              this.finished = true
            } else {
              this.loading = false;
              this.page++
            }
          } else {
            this.finished = true
          }
          this.ajax = false
        }).catch(() => {
          this.ajax = false
        });;
      }
    },
    getClear () {
      this.page = 1
      this.cardList = [];
      this.getData(this.type)
    },
    getSerch (keyWord) {
      this.keyWord = keyWord
      this.getClear()
    },
    bindTab (type) {
      this.finished = false
      this.type = type;
      this.getClear()
    }
  },
  computed: {
    disabled () {
      this.loading = false
      return this.finished
    }
  },
  beforeDestroy () {
  },
  components: {
    TabBar: () => import('./components/TabBar'),
    // Search: () => import('@/components/Search/index.vue'),
    NewCard
  }
};
</script>

<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
