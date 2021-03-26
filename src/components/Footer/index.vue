<template>
  <section class="component-footer">
    <div class="comment-button"
      @click="checkAuth(initInput)">我也说一句...</div>
    <div class="bottom-button"
      @click="checkAuth(goComment)">
      <i class="iconfont iconpinglun"></i>
      <span class="data-number">{{content.comments_count ||0}}</span>
    </div>
    <div class="bottom-button"
      @click="checkAuth(bindApproval)">
      <i class="iconfont iconzan"
        :class="{'has-liked':hasLiked}"></i>
      <span class="data-number">{{userLikedCount|| 0}}</span>
    </div>
    <div class="bottom-right">
      <div class="popover share-popover"
        @mouseenter="showShareCard(true)"
        @mouseleave="showShareCard(false)">
        <div class="popover-eleplanet">
          <div class="share-button">
            <i class="iconfont icondenglu-weixin"></i>
            <span class="data-number"> 分享</span>
          </div>
        </div>
        <Share :content="content"
          ref="share" />
      </div>
    </div>
    <el-dialog title="发表评论"
      top="30vh"
      width="630px"
      :visible.sync="showInput"
      custom-class="input-item"
      append-to-body>
      <div class="comment-editor">
        <div class="editor">
          <el-input type="textarea"
            :rows="4"
            placeholder="请输入评论内容"
            maxlength="140"
            show-word-limit
            v-model="message">
          </el-input>
        </div>
        <div class="editor-function">
          <el-button :class="{'empty':message.length === 0}"
            :disabled="message.length === 0"
            @click="sendMessage">评论</el-button>
        </div>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { postsComments, postLike, postUnlike } from '@/api/post';
export default {
  name: 'Footer',
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    Share: () => import('@/components/ShareImg/index')
  },
  data() {
    return {
      message: '',
      showInput: false,
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
    checkAuth(cb) {
      this.$store.dispatch('needAuth', cb);
    },
    initInput() {
      this.message = '';
      this.showInput = true;
    },
    bindApproval() {
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
    },
    sendMessage() {
      let content = this.message;
      if (content.length > 140) {
        return this.$message('请限制评论在140个字以内');
      }
      postsComments({
        content,
        id: this.content.id
      }).then(res => {
        if (res.code === 200) {
          this.message = '';
          this.showInput = false;
          this.$bus.$emit('sendComment');
          this.$message.success('评论成功！');
        } else {
          this.$message(res.msg);
        }
      });
    },
    goComment() {
      this.$bus.$emit('sendComment');
    },
    showShareCard(flag) {
      this.$refs.share.openShowShare(flag);
    }
  }
};
</script>
<style lang="less" scoped>
.component-footer {
  position: fixed;
  bottom: 0;
  z-index: 500;
  display: flex;
  padding: 12px 0;
  width: 900px;
  height: 50px;
  border-top: 2px solid #ffe000;
  background-color: #fff;
  .comment-button {
    margin-right: 20px;
    color: #7e869d;
    line-height: 24px;
    cursor: pointer;
    padding-left: 10px;
    width: 280px;
    height: 24px;
    background-color: #f1f3f6;
    border-radius: 15px;
  }
  .bottom-button {
    margin-right: 20px;
    color: #7e869d;
    line-height: 24px;
    cursor: pointer;
    .iconfont {
      margin-right: 5px;
      font-size: 18px;
      vertical-align: bottom;
    }
    .data-number {
      display: inline-block;
      width: 28px;
      margin-right: 20px;
      color: #7e869d;
      line-height: 24px;
      cursor: pointer;
    }
    .has-liked {
      color: #ffe100;
    }
  }
  .bottom-right {
    display: flex;
    margin-left: auto;
  }
  .popover {
    position: relative;
    &.share-popover {
      margin-right: 20px;
    }
    .popover-eleplanet {
      cursor: pointer;
    }
    .share-button {
      color: #7e869d;
      line-height: 24px;
      .icondenglu-weixin {
        margin-right: 5px;
        font-size: 24px;
        vertical-align: bottom;
      }
    }
    .more-button {
      color: #7e869d;
      line-height: 24px;
      .iconellipsis {
        font-size: 20px;
      }
    }
  }
}
/deep/ .input-item {
  .el-dialog__header {
    padding: 10px;
    border-bottom: 1px solid #ebecf1;
    .el-dialog__headerbtn {
      top: 15px;
      .el-dialog__close {
        font-size: 20px;
      }
    }
  }
  .comment-editor {
    .editor {
      position: relative;
      padding: 10px;
      margin-bottom: 15px;
      background-color: #fff;
      border: 1px solid #ebecf1;
      border-radius: 6px;
      .el-textarea {
        min-height: 100px;
        max-height: 160px;
        line-height: 20px;
        textarea {
          outline: none;
          overflow-y: auto;
          border: none;
          resize: none;
        }
      }
    }
    .editor-function {
      display: flex;
      justify-content: flex-end;
      .el-button {
        padding: 0;
        width: 100px;
        height: 30px;
        font-size: 14px;
        line-height: 30px;
        border-radius: 4px;
        background-color: #ffe000;
        color: #2c2e3b;
        border: none;
        &.empty {
          opacity: 0.5;
        }
        &:hover:not(.empty) {
          background-color: #f7b705;
        }
      }
    }
  }
}
</style>
