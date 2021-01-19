<template>
  <section class="msg-card"
           @click="goUrl(`/docdetail?id=${content.id}`)">
    <div class="header">
      <!-- 头像名字一直显示 -->
      <div class="left">
        <img :src="content.user.avatar"
             alt="avatar">
        <span class="name">{{content.user.name}}</span>
        <span class="new"
              v-show="$route.path === '/message'">发布了新动态</span>
        <span class="new"
              v-show="$route.path === '/mine'">发布到<span class="from">{{content.planet.name}}</span></span>
      </div>
      <div class="right"></div>
    </div>
    <div class="content-box">
      <div class="doc">
        <div class="content">
          <img :src="content.thumb_pic"
               v-lazy="content.thumb_pic"
               v-show="content.thumb_pic">
          <div class="title">{{content.title}}</div>
        </div>
        <!-- 只在消息动态tab显示 -->
        <div class="planet"
             v-show="$route.path === '/message'">
          <svg class="icon"
               aria-hidden="true">
            <use xlink:href="#iconfabu-xingqiu"></use>
          </svg>
          <span>来自{{content.planet.name}}</span>
        </div>
      </div>

    </div>
    <div class="footer">
      <div class="time">{{content.created_at}}</div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'MsgCard',
  props: {
    content: {
      type: Object,
      default: () => { }
    },
  },
  data () {
    return {
    }
  },
  methods: {
    goUrl (url) {
      this.$router.push(url)
    },
  },
  computed: {
    buttonName () {
      return '回复'
    },
    btnClassName () {
      return 're-follow'
    },
    showTool () {
      return false
    }
  },
}
</script>
<style scoped src='../index.less' lang="less" rel="stylesheet/less">
</style>
