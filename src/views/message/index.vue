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
                    :infinite-scroll-distance="10">
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
                <p v-show="disabled"
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
      disabled: false,
      isLoading: false,
      page: 1,
      per_page: 10,
      last_page: -1,
      msgCount: 0,
      dynamicCount: 0,
      dynamicList: [],
      msgList: [],
      // fansList: [],
      // awesomeList: [],
      // appointList: [],
      // reviewList: []
    }
  },
  mounted () {
    this.getData()
    if (this.$route.query.type === 'msg') {
      this.type = 'msg'
      this.subType = this.$route.query.subType
      this.$refs.tabBar.active = 2
      this.bindSubType(this.msgTypeList.find(e => e.value === this.subType))
    }
  },
  methods: {
    getData () {
      if (this.type === 'dynamic') {
        getDynamic({ page: this.page, per_page: this.per_page }).then(res => {
          if (res.code === 200 && res.data.length > 0) {
            res.data.forEach(e => {
              e.user.avatar = util.defaultAvatar(e.user.avatar)
              e.thumb_pic = util.getFirstImg(e.content)
              e.thumb_video = util.getFirstVideo(e.content)
              e.planetBg = this.$state.allPlanet.find(v => v.id === e.planet_id).avatar
            })
            this.dynamicList = this.dynamicList.concat(res.data)
            if (res.last_page === res.current_page) {
              this.disabled = true
            } else {
              this.loading = false;
              this.page++
            }
          } else {
            this.disabled = true
          }
        })
      } else {
        switch (this.subType) {
          case 'fans':
            getFollowers({ page: this.page, per_page: this.per_page }).then(res => {
              if (res.code === 200 && res.data.data.length > 0) {
                this.initList(res.data.data)
                if (res.last_page === res.current_page) {
                  this.disabled = true
                } else {
                  this.loading = false;
                  this.page++
                }
              } else {
                this.disabled = true
                // this.$toast(res.msg)
              }
            })
            break;
          case 'awesome':
            getLiked({ page: this.page, per_page: this.per_page }).then(res => {
              if (res.code === 200 && res.data.data.length > 0) {
                this.initList(res.data.data)
                if (res.last_page === res.current_page) {
                  this.disabled = true
                } else {
                  this.loading = false;
                  this.page++
                }
              } else {
                this.disabled = true
                // this.$toast(res.msg)
              }
            })
            break;
          case 'appoint':
            getAts({ page: this.page, per_page: this.per_page }).then(res => {
              if (res.code === 200 && res.data.length > 0) {
                this.initList(res.data.data)
                if (res.last_page === res.current_page) {
                  this.disabled = true
                } else {
                  this.loading = false;
                  this.page++
                }
              } else {
                this.disabled = true
                // this.$toast(res.msg)
              }
            })
            break;
          default:
            getComments({ page: this.page, per_page: this.per_page }).then(res => {
              if (res.code === 200 && res.data.data.length > 0) {
                this.initList(res.data.data)
                if (res.last_page === res.current_page) {
                  this.disabled = true
                } else {
                  this.loading = false;
                  this.page++
                }
              } else {
                this.disabled = true
                // this.$toast(res.msg)
              }
            })
            break;
        }
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
    bindTab (type) {
      this.disabled = false
      this.page = 1
      this.type = type
      this.getData()
    },
    bindSubType (item) {
      this.disabled = false
      this.page = 1
      this.msgTypeList.forEach(e => { e.active = false })
      item.active = true
      this.subType = item.value
      this.msgList = []
      this.getData()
    },
    onLoad (flag) {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.getData()
    },
    async onRefresh () {
      // 清空列表数据
      this.disabled = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.page = 1
      this.loading = true;
      this.isLoading = false;
      await this.onLoad();
    }
  },
  components: {
    TabBar,
    MsgCard: () => import('@/components/MsgCard'),
  }
}
</script>
<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
