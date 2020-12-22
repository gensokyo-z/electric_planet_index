<template>
  <section class="index">
    <Search @getSerch="getSerch" />
    <TabBar @bindTab="bindTab" />
    <van-pull-refresh v-model="isLoading"
                      @refresh="onRefresh"
                      :disabled="disabledPull">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="到底了"
                offset="500"
                @load="onLoad">
        <van-skeleton title
                      :row="5"
                      :loading="skeletonLoading">
          <NewCard :type.sync="type"
                   v-for="(item, index) in cardList"
                   :key="index"
                   :content="item" />
        </van-skeleton>
      </van-list>
    </van-pull-refresh>
    <div class="footer-pad"></div>
  </section>
</template>

<script>
import Vue from 'vue';
import { PullRefresh, List, Skeleton } from 'vant';
import NewCard from '@/components/NewCard';
import { getNewest, getHotest } from '@/api/index';
import util from '@/utils/util'
Vue.use(PullRefresh);
Vue.use(List);
Vue.use(Skeleton);
export default {
  name: 'index',
  data () {
    return {
      isLoading: false,
      type: 'new',
      page: 1,
      per_page: 10,
      cardList: [],
      keyWord: '',
      loading: false,
      finished: false,
      disabledPull: true,
      skeletonLoading: true
    };
  },
  mounted () {
    // 保证在DOM渲染完毕后初始化, 20秒是经验值
    setTimeout(() => {
      this.listenerAction();
    }, 20);
    // this.$refs.video.content.video = true
    // this.$refs.video.initVideo()
    // this.getData('new');
    // this.getClear()
  },
  methods: {
    onLoad (flag) {
      // setTimeout(async () => {
      if (flag) {
        this.cardList = [];
      }
      this.getData(this.type)
      // }, 100);
    },
    getData (type) {
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
          this.skeletonLoading = false
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
            }
          } else {
            this.finished = true
          }
          this.skeletonLoading = false
        });
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
    async onRefresh () {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.page = 1
      this.loading = true;
      this.isLoading = false;
      await this.onLoad();
      // this.$toast('刷新成功');
    },
    listenerAction () {
      window.addEventListener('scroll', this.scrollhandle);
      document.documentElement.scrollTop = 0;
    },
    scrollhandle (event) {
      let scrolled = document.documentElement.scrollTop || document.body.scrollTop;
      this.disabledPull = scrolled !== 0
    },

  },
  beforeDestroy () {
    // 在组件生命周期结束的时候销毁。
    window.removeEventListener('scroll', this.scrollhandle);
    document.documentElement.scrollTop = 0;
  },
  components: {
    TabBar: () => import('./components/TabBar'),
    Search: () => import('@/components/Search/index.vue'),
    NewCard
  }
};
</script>

<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
