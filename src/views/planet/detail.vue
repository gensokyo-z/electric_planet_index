<template>
  <section class="planet">
    <div class="layout">
      <Header @getSerch="getSerch" />
      <div class="layout-main">
        <div class="community-container">
          <div class="community-main">
            <div class="planet-box"
                 :style="`background: url(${content.background}) no-repeat center; background-size: 750px 350px;`"
                 v-show="content.id">
              <div class="top">
                <div class="name">{{content.name}}</div>
                <div :class="['btn',{'joined':!content.joined}]"
                     @click="addPlanet(content)">{{content.joined?'已加入':'加入'}}</div>
              </div>
              <div class="buttom">
                <div class="desc">{{content.intro}}</div>
              </div>
            </div>
            <div class="card-list">
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
          <div class="community-aside">
            <BannerCard />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import NewCard from '@/components/NewCard';
import { joinPlanet, getPlanetDetail, getPlanetPosts } from '@/api/planet';
import util from '@/utils/util'
export default {
  name: 'index',
  data () {
    return {
      ajax: false,
      id: this.$route.query.id || '',
      content: {},
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
    this.getData();
    this.getList()
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
        this.getList()
      }, 300);
    },
    getSerch (kw) {
      this.page = 1
      this.cardList = []
      this.keyWord = kw
      this.getList()
    },
    getData (type) {
      getPlanetDetail(this.id).then(res => {
        if (res.code === 200) {
          let joined = this.$state.userPlanet.some(e => e.id === res.data.id)
          res.data.joined = joined
          this.content = res.data;
        }
      });
    },
    getList () {
      getPlanetPosts({
        id: this.id,
        page: this.page,
        per_page: this.per_page
      }).then(res => {
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
    },
    getClear () {
      this.page = 1
      this.cardList = [];
      this.getList(this.type)
    },
    async addPlanet (comtent) {
      if (!util.getcookie('TOKEN')) {
        this.$store.dispatch('needAuth')
      }
      if (this.content.joined) return;
      this.$confirm('是否加入该星球', '提示')
        .then(() => {
          joinPlanet(this.id).then(res => {
            this.$store.dispatch('getUserPlanetList');
            this.$message.success('加入星球成功！');
            location.reload();
          });
        })
        .catch(() => {
          // on cancel
        });
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
    NewCard,
    BannerCard: () => import('@/components/banner')
  }
};
</script>

<style scoped src='./detail.less' lang="less" rel="stylesheet/less">
</style>
