<template>
  <section class="planet">
    <article class="planet-box"
      :style="`background: url(${content.background}) no-repeat  center center/1200px 350px ;`"
      v-show="content.id">
      <div class="info">
        <div class="left">
          <img class="avatar"
            :src="content.avatar">
          <div class="name">{{content.name}}</div>
        </div>
        <div class="mid">
          <div class="desc">{{content.intro}}</div>
        </div>
        <div class="right">
          <div :class="['btn',{'joined':!content.joined}]"
            @click="addPlanet(content)">{{content.joined?'退出':'加入'}}</div>
        </div>
      </div>
    </article>
    <article class="main">
      <div class="planet-card-list"
        v-loading="loading">
        <div class="card-header">
          <h2>星球推荐</h2>
          <div class="tag-list">
            <div class="tag"
              v-for="(item,index) in tagList"
              :key="index">#{{item.name}}</div>
          </div>
        </div>
        <div v-for="(item, index) in cardList"
          :key="index"
          class="card">
          <PlanetCard :content="item" />
        </div>
        <div class="footer-btn"
          v-if="!loading">
          <el-button @click="loadMore">{{finished?'~~~到底了~~~':'加载更多'}}</el-button>
        </div>
      </div>
      <aside class="aside">
        <nav v-if="$state.koken">
          <router-link tag="div"
            to="/post?type=0">发动态</router-link>
          <router-link tag="div"
            to="/post?type=1">
            发文章</router-link>
          <router-link tag="div"
            to="/post?type=2">
            发视频</router-link>
        </nav>
        <div class="Encyclopedias">
          <h2>星球百科</h2>
        </div>
      </aside>
    </article>
  </section>
</template>

<script>
import PlanetCard from '@/components/PlanetCard';
import { joinPlanet, quitPlanet, getPlanetDetail, getPlanetPosts, getPlanetTags } from '@/api/planet';
import util from '@/utils/util';
export default {
  name: 'index',
  data() {
    return {
      ajax: false,
      id: this.$route.query.id || '',
      content: {},
      type: 'new',
      page: 0,
      per_page: 10,
      last_page: 0,
      cardList: [],
      tagList: [],
      keyWord: '',
      loading: false,
      finished: false
    };
  },
  mounted() {
    this.getData();
    this.loadMore();
  },
  methods: {
    loadMore() {
      this.page++;
      this.getList();
    },
    getPlanetTags() {
      getPlanetTags(this.content.id).then(res => {
        if (res.data) {
          this.tagList = res.data;
        }
      });
    },
    getSerch(kw) {
      this.page = 1;
      this.cardList = [];
      this.keyWord = kw;
      this.getList();
    },
    getData() {
      getPlanetDetail(this.id).then(res => {
        if (res.code === 200) {
          let joined = this.$state.userPlanet.some(e => e.id === res.data.id);
          res.data.joined = joined;
          this.content = res.data;
          this.getPlanetTags();
        }
      });
    },
    getList() {
      getPlanetPosts({
        id: this.id,
        page: this.page,
        per_page: this.per_page
      })
        .then(res => {
          if (res.code === 200 && res.data) {
            this.last_page = res.last_page;
            res.data.forEach(e => {
              let year = new Date().getFullYear();
              if (e.created_at.includes(year)) {
                e.created_at = e.created_at.substr(5, e.created_at.length - 1);
              }
              if (e.type === 2) {
                e.mediaType = 'video';
              } else {
                e.mediaType = 'pic';
              }
              if (e.type === 0 && !e.thumb_pic) {
                if (e.media && e.media.length > 0 && e.media[0].media_link) e.thumb_pic = e.media[0].media_link;
              }
              e.planetBg = this.$state.allPlanet.find(v => v.id === e.planet_id).avatar;
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
    },
    getClear() {
      this.page = 1;
      this.cardList = [];
      this.getList(this.type);
    },
    async addPlanet(comtent) {
      if (!util.getcookie('TOKEN')) {
        return this.$store.dispatch('needAuth');
      }
      if (this.content.joined) {
        this.$confirm('是否退出该星球', '提示')
          .then(() => {
            quitPlanet(this.id).then(res => {
              this.$store.dispatch('getUserPlanetList').then(() => {
                this.$message.success('退出星球成功！');
                this.getData();
              });
            });
          })
          .catch(() => {
            // on cancel
          });
      } else {
        // this.$confirm('是否加入该星球', '提示')
        //   .then(() => {
        joinPlanet(this.id).then(res => {
          this.$store.dispatch('getUserPlanetList').then(() => {
            this.$message.success('加入星球成功！');
            this.getData();
          });
        });
        // })
        // .catch(() => {
        //   // on cancel
        // });
      }
    }
  },
  components: {
    PlanetCard
  }
};
</script>

<style scoped src='./detail.less' lang="less" rel="stylesheet/less">
</style>
