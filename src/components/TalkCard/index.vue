<template>
  <section class="talk-card">
    <div class="header">
      <div class="left">
        <img :src="content.user.avatar"
             alt="avatar">
        <div class="flex-col">
          <span class="name">{{content.user.username}}</span>
          <span class="time">{{content.created_at}}</span>
        </div>
      </div>
      <div class="right">
        <TalkApprovalShare :content="content"
                           :showShare="false"
                           type="comment" />
      </div>
    </div>
    <div class="content-box">
      <div class="review">{{content.content}}</div>
    </div>
    <div class="second-comment"
         v-show="content.second_comments.length>0"
         v-for="(item, index) in content.second_comments"
         :key="index">
      <div class="header">
        <div class="left">
          <div class="flex">
            <span class="name">{{item.user.username}}</span>
          </div>
        </div>
      </div>
      <div class="content-box">
        <div class="review2">{{item.content}}</div>
      </div>
    </div>
    <div class="footer"></div>
  </section>
</template>
<script>
import TalkApprovalShare from '@/components/TalkApprovalShare'
export default {
  name: 'TalkCard',
  components: {
    TalkApprovalShare
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
    return {}
  },
  methods: {
    bindEvent () {
      if (this.subType === 'fans') {
        this.content.follow = !this.content.follow
      } else {
        this.$refs.inputItem.showInput = true
      }
    },
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
<style scoped  lang="less" >
.talk-card {
  &:not(:nth-last-of-type(1)) .footer {
    border-bottom: 3px solid rgba(0, 0, 0, 0.05);
  }
  .header {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      img {
        margin-right: 16px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
      }
      .name {
        margin-right: 12px;
        font-size: 24px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
      }
      .time {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.25);
      }
    }
  }
  .content-box {
    .review {
      margin-left: 60px;
      margin-bottom: 16px;
      font-size: 28px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.9);
      span {
        margin-left: 20px;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.25);
      }
      .comment {
        margin-left: 16px;
        font-size: 28px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 40px;
      }
    }
  }
  .second-comment {
    margin-left: 60px;
    background-color: rgb(230, 230, 230);
    .content-box {
      .review2 {
        margin-bottom: 16px;
        font-size: 28px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }
  .footer {
    padding-bottom: 22px;
    margin-bottom: 32px;
    margin-left: 60px;
  }
}
</style>
