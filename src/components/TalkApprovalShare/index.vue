<template>
  <div class="tool">
    <div class="tool-bar">
      <div class="talk"
        @click="bindTalk">
        <!-- <i class="iconfont iconpinglun"></i> -->
        <span class="iconfont">评论</span>
        <span>{{content.comments_count}}</span>
      </div>
      <div class="talk"
        @click="bindApproval">
        <!-- <i class="iconfont iconzan"
          :class="{active:hasLiked}"></i> -->
        <!-- <img v-else
             class="icon"
             src="@/assets/images/zan.png"> -->
        <span class="iconfont">点赞</span>
        <span>{{userLikedCount}}</span>
      </div>
      <div class="talk">
        <!-- <i class="iconfont iconpinglun"></i> -->
        <span class="iconfont">阅读数</span>
        <span>{{content.reads}}</span>
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
      default: () => {}
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
  data() {
    return {
      hasLiked: false,
      userLikedCount: 0
    };
  },
  watch: {
    content: {
      handler(val) {
        this.hasLiked = val.has_liked;
        this.userLikedCount = val.user_liked_count;
      },
      immediate: true
    }
  },
  methods: {
    bindTalk() {
      if (this.$route.path.includes('postdetail')) {
        this.$refs.inputItem.showInput = true;
      } else {
        this.$router.push(`/docdetail?id=${this.content.id}&sendComment=1`);
      }
    },
    bindApproval() {
      if (!util.getcookie('TOKEN')) {
        return this.$store.dispatch('needAuth');
      }
      if (this.type === 'post') {
        if (this.hasLiked) {
          postUnlike(this.content.id).then(res => {
            if (res.code === 200) {
              this.hasLiked = !this.hasLiked;
              this.userLikedCount--;
              this.$message('取消点赞文章成功！');
            }
          });
        } else {
          postLike(this.content.id).then(res => {
            if (res.code === 200) {
              this.hasLiked = !this.hasLiked;
              this.$message.success('点赞文章成功！');
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
              this.$message('取消评论点赞成功！');
            }
          });
        } else {
          commentsLikes(this.content.id).then(res => {
            if (res.code === 200) {
              this.hasLiked = !this.hasLiked;
              this.$message('点赞评论成功！');
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
  justify-content: flex-start;
  margin-bottom: 10px;
  .talk,
  .approval {
    display: flex;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
  }
  .talk {
    margin-right: 10px;
  }
  .iconfont {
    color: #c9cacf;
    margin-right: 8px;
  }
  .active {
    color: #ffdd27;
  }
}
</style>
