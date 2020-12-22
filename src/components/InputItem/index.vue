<template>
  <section class="input-item">
    <van-overlay :show="showInput"
                 @click="showInput = false">
      <div class="wrapper"
           :style="$route.name==='docdetail'?'bottom:0':'bottom:1.28rem'"
           @click.stop>

        <template >
          <button @click="sendMessage">发布</button>
        </template>
      </div>
    </van-overlay>
  </section>
</template>
<script>
import Vue from 'vue';
import { postsComments, comments } from '@/api/post';
export default {
  name: 'inputItem',
  props: {
    content: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      message: '',
      showInput: false
    };
  },
  watch: {
    showInput: {
      handler (val) {
        if (val) {
          setTimeout(() => {
            this.$refs.inputItem.focus();
          }, 100)
        } else {
          this.message = '';
        }
      },
      deep: true
    }
  },
  methods: {
    sendMessage () {
      let content = this.message;
      if (content.length > 140) {
        return this.$toast('请限制评论在140个字以内');
      }
      if (this.content.second_comments) {
        comments({
          content,
          id: this.content.id
        }).then(res => {
          if (res.code === 200) {
            this.message = '';
            this.showInput = false;
            this.$bus.$emit('snedComment');
            this.$toast('评论成功！');
          } else {
            this.$toast(res.msg);
          }
        });
      } else {
        postsComments({
          content,
          id: this.content.id
        }).then(res => {
          if (res.code === 200) {
            this.message = '';
            this.showInput = false;
            this.$bus.$emit('snedComment');
            this.$toast('评论成功！');
          } else {
            this.$toast(res.msg);
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  position: fixed;
  // bottom: 96px;
  width: 100%;
  z-index: 100000;
  /deep/ .van-cell {
    .van-field__body {
      .van-field__control {
        padding: 0.2133333333333333rem 0.32rem;
        font-size: 0.3733333333333333rem;
        background: #f5f5f7;
        border-radius: 0.1066666666666667rem;
      }
      .van-field__button {
        button {
          background-color: #fff;
          font-size: 0.3733333333333333rem;
        }
      }
    }
  }
}
</style>
