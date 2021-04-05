<template>
  <div class="comment-card">
    <section class="user flex-v">
      <img :src="avatar"
        class="avatar">
      <div class="name-card flex-col">
        <div class="name">{{username}}</div>
        <div class="time">{{content.created_at}}</div>
      </div>
    </section>
    <section class="content flex-col">
      <div class="comment">{{content.content}}</div>
      <div class="del"
        @click="delComment(content)">删除</div>
      <div class="post"
        @click="$router.push(`/docdetail?id=${content.related.post_id}`)">
        <div class="comment-layout">
          <div class="comment-title text-two">{{content.title}}</div>
          <!-- <div class="flex">
            <div class="user">
              <img src="">
              <span class="name"></span>
            </div>
            <div class="flex">
              <div class="data">
                <label></label><span></span>
              </div>
              <div class="data">
                <label></label><span></span>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { delComment } from '@/api/post';
export default {
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {
    delComment(item) {
      delComment(item.related_id).then(() => {
        this.$message.success('删除评论成功！');
        this.$emit('getData');
      });
    }
  },
  computed: {
    avatar() {
      return this.$state.userInfo.avatar;
    },
    username() {
      return this.$state.userInfo.username;
    }
  }
};
</script>
<style lang="less" scoped>
.comment-card {
  height: 330px;
  padding: 22px 32px;
  background-color: #fff;
  .user {
    margin-bottom: 30px;
    .avatar {
      margin-right: 30px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .name-card {
      height: 40px;
      .name {
        color: #333;
        font-size: 16px;
        margin-bottom: auto;
      }
      .time {
        color: #7f7f7f;
        font-size: 14px;
      }
    }
  }
  .content {
    .comment {
      font-size: 18px;
      color: #333;
    }
    .del {
      margin-left: auto;
      font-size: 16px;
      color: #7f7f7f;
      cursor: pointer;
    }
    .post {
      margin-top: 30px;
      padding: 32px;
      background-color: #f2f2f2;
      .comment-layout {
        background-color: #fff;
        padding: 10px;
        .comment-title {
          width: 100%;
          font-size: 20px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
