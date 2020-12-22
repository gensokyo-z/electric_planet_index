<template>
  <div class="tool">
    <div class="tool-bar">
      <div class="talk"
           @click="bindTalk">
        <svg class="icon jiantou"
             aria-hidden="true">
          <use xlink:href="#iconxinxi-pinglun"></use>
        </svg><span>{{content.comments_count===0?'回复':content.comments_count}}</span>
      </div>
      <div class="approval"
           @click="bindApproval">
        <svg class="icon jiantou"
             aria-hidden="true"
             v-if="!hasLiked">
          <use xlink:href="#iconzan"></use>
        </svg>
        <img v-else
             class="icon"
             src="@/assets/images/zan.png">
        <span>{{userLikedCount}}</span>
      </div>
      <!-- <div class="share"
        v-if="showShare"
        @click="$refs.shareImg.showShare = true">
        <svg class="icon jiantou"
          aria-hidden="true">
          <use xlink:href="#iconwenzhang-zhuanfa"></use>-->
      <!-- <use xlink:href="#iconfenxiang-fenxiang"></use> -->
      <!-- </svg>
      <span>分享</span>
    </div> -->
    </div>
    <!-- <ShareImg ref='shareImg'
      :content="content" /> -->
  </div>
</template>
<script>
import { postLike, postUnlike, commentsLikes, commentsUnlikes } from '@/api/post';
// import ShareImg from '@/components/ShareImg';
import util from '@/utils/util';
export default {
  props: {
    content: {
      type: Object,
      default: () => { }
    },
    type: {
      type: String,
      default: 'post'
    },
    showShare: {
      type: Boolean,
      default: true
    }
  },
  components: {
    // ShareImg
  },
  data () {
    return {
      hasLiked: false,
      userLikedCount: 0
    };
  },
  watch: {
    content: {
      handler (val) {
        this.hasLiked = val.has_liked;
        this.userLikedCount = val.user_liked_count;
      },
      immediate: true
    }
  },
  methods: {
    bindTalk () {
      if (this.$route.path.includes('docdetail')) {
        this.$refs.inputItem.showInput = true;
      } else {
        this.$router.push(`/docdetail?id=${this.content.id}`);
      }
    },
    async bindApproval () {
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
      if (this.type === 'post') {
        if (this.hasLiked) {
          postUnlike(this.content.id).then(res => {
            if (res.code === 200) {
              this.hasLiked = !this.hasLiked;
              this.userLikedCount--;
              this.$toast('取消点赞文章成功！');
            }
          });
        } else {
          postLike(this.content.id).then(res => {
            if (res.code === 200) {
              this.hasLiked = !this.hasLiked;
              this.$toast('点赞文章成功！');
              this.userLikedCount++;
            }
          });
        }
      } else {
        if (this.hasLiked) {
          commentsUnlikes(this.content.id).then(res => {
            if (res.code === 200) {
              this.hasLiked = !this.hasLiked;
              this.userLikedCount--;
              this.$toast('取消评论点赞成功！');
            }
          });
        } else {
          commentsLikes(this.content.id).then(res => {
            if (res.code === 200) {
              this.hasLiked = !this.hasLiked;
              this.$toast('点赞评论成功！');
              this.userLikedCount++;
            }
          });
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.tool-bar {
  display: flex;
  align-items: center;
  .talk,
  .approval,
  .share {
    margin-right: 30px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .share {
    margin-right: 0;
  }
  .icon {
    color: #c9cacf;
    margin-right: 12px;
    width: 16px;
    height: 16px;
  }
  .active {
    color: #ffdd27;
  }
}
</style>
