<template>
  <section class="message">
    <div class="layout">
      <Header />
      <div class="layout-main">
        <div class="community-container">
          <div class="community-main">
            <div class="card-list">
              <TabBar @bindTab="bindTab"
                      ref="tabBar"
                      :dynamicCount="dynamicCount"
                      :msgCount="msgCount" />
              <div class="infinite-scroll"
                   style="overflow-y: auto">
                <ul class="infinite-list"
                    v-infinite-scroll="onLoad"
                    :infinite-scroll-disabled="disabled"
                    :infinite-scroll-distance="300">
                  <template v-if="type === 'dynamic'">
                    <li v-for="(item, index1) in dynamicList"
                        :key="index1">
                      <MsgCard :type.sync="type"
                               :subType.sync="subType"
                               :content="item" />
                    </li>
                  </template>
                  <template v-if="type === 'msg'">
                    <li v-for="(item, index2) in msgList"
                        :key="index2">
                      <MsgCard :type.sync="type"
                               :subType.sync="subType"
                               :content="item" />
                    </li>
                  </template>
                </ul>
                <p v-show="loading">加载中...</p>
                <p v-show="finished"
                   id="footer">{{page===last_page?'没有更多了':''}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="msg-sub"
         v-show="type ==='msg'">
      <div class="item"
           v-for="(item, index0) in msgTypeList"
           :key="index0"
           @click="bindSubType(item)">
        <div :class="['img',{active:item.active}]">
          <svg class="icon"
               aria-hidden="true">
            <use :xlink:href="item.className"></use>
          </svg>
        </div>
        <div class="msg-name">{{item.name}}</div>
      </div>
    </div>
    <div class="list"> -->
    <!-- <van-pull-refresh v-model="isLoading"
                        @refresh="onRefresh">
        <van-list v-model="loading"
                  :disabled="disabled"
                  disabled-text="没有更多了"
                  offset="300"
                  @load="onLoad"> -->

    <!-- </van-list>
      </van-pull-refresh> -->
    <!-- </div>
    <div class="footer-pad"></div> -->
  </section>
</template>
<script>
import { getFollowers, getLiked, getComments, getAts, getDynamic } from '@/api/message'
import util from '@/utils/util'
import TabBar from './components/TabBar'
export default {
  data () {
    return {
      type: 'dynamic',
      msgTypeList: [
        { className: '#iconxinxi-fensi', name: '粉丝', value: 'fans', active: true },
        { className: '#iconxinxi-zan', name: '点赞', value: 'awesome', active: false },
        { className: '#iconxinxi-quan', name: '@我的', value: 'appoint', active: false },
        { className: '#iconxinxi-pinglun', name: '评论', value: 'review', active: false }
      ],
      subType: 'fans',
      loading: false,
      finished: false,
      isLoading: false,
      page: 1,
      per_page: 10,
      current_page: 1,
      last_page: -1,
      msgCount: 0,
      dynamicCount: 0,
      dynamicList: [],
      msgList: [],
      ajax: false,
      // fansList: [],
      // awesomeList: [],
      // appointList: [],
      // reviewList: []
    }
  },
  mounted () {
    setTimeout(() => {
      this.listenerAction();
    }, 20);
    // this.getData()
    if (this.$route.query.type === 'msg') {
      this.type = 'msg'
      this.subType = this.$route.query.subType
      this.$refs.tabBar.active = 2
      // this.bindSubType(this.msgTypeList.find(e => e.value === this.subType))
    }
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollhandle, false)
  },
  computed: {
    disabled () {
      // eslint-disable-next-line
      return this.finished
    }
  },
  methods: {
    getData () {
      if (this.ajax) {
        return
      }
      this.ajax = true
      this.finished = true
      if (this.type === 'dynamic') {
        getDynamic({ page: this.page, per_page: this.per_page }).then(res => {
          if (res.code === 200 && res.data.length > 0) {
            this.current_page = res.current_page
            this.last_page = res.last_page
            res.data.forEach(e => {
              e.user.avatar = util.defaultAvatar(e.user.avatar)
              e.thumb_pic = util.getFirstImg(e.content)
              e.thumb_video = util.getFirstVideo(e.content)
              e.planetBg = this.$state.allPlanet.find(v => v.id === e.planet_id).avatar
            })
            this.dynamicList = this.dynamicList.concat(res.data)
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
        let path = null
        switch (this.subType) {
          case 'fans':
            path = getFollowers
            break;
          case 'awesome':
            path = getLiked
            break;
          case 'appoint':
            path = getAts
            break;
          default:
            path = getComments
            break;
        }
        path({ page: this.page, per_page: this.per_page }).then(res => {
          if (res.code === 200 && res.data.data.length > 0) {
            this.initList(res.data.data)
            this.current_page = res.current_page
            this.last_page = res.last_page
            if (res.last_page === res.current_page) {
              this.finished = true
            } else {
              this.page++
              this.loading = false;
            }
          } else {
            this.finished = true
          }
          this.ajax = false
        }).catch(() => {
          this.ajax = false
        });
      }
    },
    initList (data) {
      if (data && data.length > 0) {
        data.forEach(e => {
          // 点赞
          if (e.likable) {
            e.title = e.likable.title
            e.related_id = e.likable_id
          }
          // 评论
          if (e.post) {
            e.title = e.post.title
            e.related_id = e.post_id
          }
          e.user.name = e.user.username
          e.user.avatar = util.defaultAvatar(e.user.avatar)
          if (!e.thumb_pic) {
            e.thumb_pic = util.getFirstImg(e.content)
          }
          if (!e.thumb_video) {
            e.thumb_video = util.getFirstVideo(e.content)
          }
        })
      }
      this.msgList = this.msgList.concat(data)
    },
    bindTab (type, subType) {
      this.finished = false
      this.page = 1
      this.last_page = -1
      this.type = type
      this.subType = subType
      this.msgList = []
      this.dynamicList = []
      this.getData()
    },
    onLoad (flag) {
      this.getData()
    },
    scrollhandle (event) {
      if (this.current_page === this.last_page) {
        return
      }
      const elOffsetTop = document.getElementById('footer').offsetTop
      const docScrollTop = document.documentElement.scrollTop
      if (elOffsetTop >= docScrollTop && elOffsetTop < (docScrollTop + window.innerHeight) && !this.loading) {
        this.finished = false
        this.getData()
      }
    },
    listenerAction () {
      window.addEventListener('scroll', this.scrollhandle);
      document.documentElement.scrollTop = 0;
    },
  },
  components: {
    TabBar,
    MsgCard: () => import('@/components/MsgCard'),
  }
}
</script>
<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
