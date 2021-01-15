<template>
  <section class="index">
    <div class="layout">
      <Header @getSerch="getSerch" />
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
                <p v-show="loading">加载中...</p>
                <p v-show="finished"
                   id="footer">{{page===last_page?'没有更多了':''}}</p>
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
import NewCard from '@/components/NewCard';
import { getNewest, getHotest } from '@/api/index';
import util from '@/utils/util'
export default {
  name: 'index',
  data () {
    return {
      ajax: false,
      type: 'new',
      page: 1,
      per_page: 10,
      last_page: 0,
      cardList: [],
      keyWord: '',
      loading: false,
      finished: false
    };
  },
  mounted () {
    // 保证在DOM渲染完毕后初始化, 20秒是经验值
    setTimeout(() => {
      this.listenerAction();
    }, 20);
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
    getSerch (kw) {
      this.page = 1
      this.cardList = []
      this.keyWord = kw
      this.getData(this.type)
    },
    getData (type) {
      if (this.ajax) {
        return
      }
      this.ajax = true
      this.finished = true
      if (type === 'new') {
        getNewest({ page: this.page, per_page: this.per_page, keyword: this.keyWord }).then(res => {
          if (res.code === 200 && res.data) {
            this.last_page = res.last_page
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
            this.last_page = res.last_page
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
        })
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
    },
    gotoDetail (item) {
      this.$router.push(`/postdetail?id=${item.id}`)
    },
    listenerAction () {
      window.addEventListener('scroll', this.scrollhandle);
      document.documentElement.scrollTop = 0;
    },
    scrollhandle (event) {
      if (this.page === this.last_page) {
        return
      }
      const elOffsetTop = document.getElementById('footer').offsetTop
      const docScrollTop = document.documentElement.scrollTop
      if (elOffsetTop >= docScrollTop && elOffsetTop < (docScrollTop + window.innerHeight) && !this.loading) {
        this.finished = false
        this.getData(this.type)
      }
    },
  },
  computed: {
    disabled () {
      // eslint-disable-next-line
      this.loading = false;
      return this.finished
    }
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollhandle, false)
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
