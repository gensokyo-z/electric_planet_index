<template>
  <section class="msg-card"
           @click="goUrl(`/docdetail?id=${content.related_id}`)">
    <div class="header">
      <!-- 头像名字一直显示 -->
      <div class="left">
        <img v-if="content.user"
             v-bind:src="content.user.avatar"
             alt="avatar">
        <span class="name"
              v-if="content.user">{{content.user.name||''}}</span>
      </div>
      <!-- <div class="right">
        <button :class="btnClassName"
                @click="bindEvent">{{buttonName}}</button>
      </div> -->
    </div>
    <div class="content-box">
      <div class="awesome"
           v-show="subType === 'awesome'">赞了这条动态<span>{{content.created_at}}</span></div>
      <div class="appoint"
           v-show="subType === 'appoint'">@用户<span class="comment">
          <img :src="content.thumb_pic"
               v-show="content.thumb_pic">
          <div class="title">{{content.title}}</div>
        </span><span>{{content.created_at}}</span></div>
      <div class="review"
           v-show="subType === 'review'">
        <img :src="content.thumb_pic"
             v-show="content.thumb_pic">
        <div class="title">{{content.content}}</div>
        <span>{{content.created_at}}</span>
      </div>
      <div class="follow"
           v-if="subType === 'fans'">关注了你<span>{{content.created_at}}</span></div>
      <!-- 粉丝tab不显示 -->
      <div class="doc"
           v-else>
        <div class="content">
          <img :src="content.thumb_pic"
               v-show="content.thumb_pic">
          <div class="title">{{content.title||content.likable.content}}</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <!-- <TalkApprovalShare :content="content"
                         :showShare="false"
                         v-show="showTool" /> -->
    </div>
    <!-- <InputItem ref="inputItem" /> -->
  </section>
</template>
<script>
// import TalkApprovalShare from '@/components/TalkApprovalShare'
export default {
  name: 'MsgCard',
  components: {
    // InputItem: () => import('@/components/InputItem'),
    // TalkApprovalShare
  },
  props: {
    subType: {
      type: String,
      default: ''
    },
    content: {
      type: Object,
      default: () => { }
    },
  },
  data () {
    return {
      // fans: { name: '粉丝' },
      // fromPlanet: 'Tesla星球'
    }
  },
  methods: {
    bindEvent () {
      if (this.subType === 'fans') {
        this.content.follow = !this.content.follow
      } else {
        this.$refs.inputItem.showInput = true
      }
    },
    goUrl (url) {
      this.$router.push(url)
    }
  },
  computed: {
    buttonName () {
      if (this.subType === 'fans') {
        return this.content.follow ? '互相关注' : '关注'
      } else {
        return '回复'
      }
    },
    btnClassName () {
      if (this.subType === 'fans') {
        return this.content.follow ? 're-follow' : 'follow'
      } else {
        return 'follow'
      }
    },
    showTool () {
      if (this.subType === 'appoint' || this.subType === 'review') {
        return true
      } else {
        return false
      }
    }
  },
}
</script>
<style scoped src='../index.less' lang="less" rel="stylesheet/less">
</style>
