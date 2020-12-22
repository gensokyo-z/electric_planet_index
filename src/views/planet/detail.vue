<template>
  <section class="planet-detail">
    <van-nav-bar left-arrow
                 fixed
                 placeholder
                 @click-left="goBack"
                 class="planet-nav">
      <template #right>
        <svg class="icon jiantou"
             aria-hidden="true"
             @click="openShare">
          <use xlink:href="#iconwenzhang-zhuanfa"></use>
        </svg>
      </template>
    </van-nav-bar>
    <div class="header-bg van-h"
         :style="`background-image: url(${content.background})`">
      <div class="header-name flex-c-b">
        <span class="planet-name">{{content.name}}</span><button :class="['header-btn',{'joined':joined}]"
                @click="addPlanet(content)">{{joined?'已加入':'加入'}}</button>
      </div>
      <div class="desc">
        {{content.intro}}
      </div>
    </div>
    <PlanetTabBar @bindTab="bindTab" />
    <div class="doc"
         v-show="type === 'doc'">
      <van-pull-refresh v-model="isLoading"
                        @refresh="onRefresh">
        <van-list v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  offset="100"
                  @load="onLoad">
          <NewCard v-for="(item,index) in postsList"
                   :key="index"
                   :content="item" />
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="about"
         v-show="type !== 'doc'">
      <div class="
         title">{{type === 'about'?'星球规则':'知识库'}}</div>
      <div class="role-box flex-col">
        <div class="role arrow-right">1、qweqweqweqwe</div>
        <div class="role arrow-right">1、qweqweqweqwe</div>
        <div class="role arrow-right">1、qweqweqweqwe</div>
      </div>
      <div class="wx flex-col"
           v-show="type === 'about'">
        <p class="
         title">微信群</p>
        <p class="wx-master">特斯拉主微信：2495950</p>
        <p class="wx-master">特斯拉星球副星主微信：2495950</p>
        <div class="qr-code  flex-col-cc">
          <img src="../../assets/images/logo.png"
               class="code">
          <p>特斯拉主星球，期待你的加入</p>
        </div>
      </div>
    </div>

    <!-- <ShareImg ref='shareImg'
              :content="content" /> -->
  </section>
</template>
<script>
import Vue from 'vue';
import { PullRefresh, List, Lazyload, NavBar } from 'vant';
import { mapState } from 'vuex';
import util from '@/utils/util';
// import ShareImg from '@/components/ShareImg'
import { joinPlanet, getPlanetDetail, getPlanetPosts } from '@/api/planet';
Vue.use(NavBar);
Vue.use(PullRefresh);
Vue.use(List);
Vue.use(Lazyload);
Vue.use(Lazyload, {
  lazyComponent: true
});
export default {
  components: {
    PlanetTabBar: () => import('./components/PlanetTabBar'),
    NewCard: () => import('@/components/NewCard')
    // ShareImg
  },
  data () {
    return {
      type: 'doc',
      id: this.$route.query.id || '',
      content: {},
      postsList: [],
      isLoading: false,
      page: 1,
      per_page: 10,
      loading: false,
      finished: false
    };
  },
  mounted () {
    this.getData();
    // this.getList()
  },
  computed: {
    ...mapState(['userPlanet']),
    joined () {
      return this.userPlanet.some(e => e.id === this.content.id);
    }
  },
  methods: {
    onLoad () {
      if (this.refreshing) {
        this.postsList = [];
        this.refreshing = false;
      }
      this.getList();
    },
    getData () {
      getPlanetDetail(this.id).then(res => {
        if (res.code === 200) {
          this.content = res.data;
        }
      });
    },
    getList () {
      getPlanetPosts({
        id: this.id,
        page: this.page,
        per_page: this.per_page
      }).then(r => {
        if (r.code === 200) {
          r.data.forEach(e => {
            if (this.userPlanet.length > 0) {
              e.joined = this.userPlanet.some(v => v.id === e.id);
            } else {
              e.joined = false;
            }
            e.user.avatar = util.defaultAvatar(e.user.avatar);
            if (!e.thumb_pic) {
              e.thumb_pic = util.getFirstImg(e.content);
            }
            e.content = util.changeHtml2Crad(e.content);
          });
          this.postsList = this.postsList.concat(r.data);
          if (r.last_page === r.current_page) {
            this.finished = true
          } else {
            this.loading = false;
            this.page++
          }
        }
      });
    },
    onRefresh () {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.page = 1;
      this.loading = true;
      this.isLoading = false;
      this.onLoad();
      this.$toast('刷新成功');
    },
    goBack () {
      this.$router.back();
    },
    openShare () {
      this.$refs.shareImg.showShare = true;
    },
    bindTab (type) {
      this.type = type;
    },
    async addPlanet (comtent) {
      let needAuth = false;
      if (!util.getcookie('TOKEN')) {
        await this.$store
          .dispatch('getInfo')
          .then(res => { })
          .catch(err => {
            needAuth = true;
            return console.log(err);
          });
      }
      if (needAuth) return;
      if (this.joined) return;
      this.$dialog
        .confirm({
          title: '提示',
          message: '是否加入该星球'
        })
        .then(() => {
          joinPlanet(this.id).then(res => {
            this.$toast('加入星球成功！');
            location.reload();
          });
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>
<style scoped src='./detail.less' lang="less" rel="stylesheet/less">
</style>
