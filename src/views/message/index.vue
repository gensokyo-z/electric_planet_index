<template>
  <section class="message">
    <div class="card-list">
      <div class="title">
        <div :class="['msg-tab',{active: item.active}]"
          @click="changeTab(item)"
          v-for="(item,index) in msgTypeList"
          :key="index">{{item.name}}</div>
      </div>
      <div class="card-list" v-loading="loadFlag">
        <div class="card"
          v-for="(item,index) in cardList"
          :key="index">
          <MsgCard :type.sync="type"
            :content="item" />
        </div>
      </div>
      <div class="footer-btn"
        v-if="!loadFlag">
        <el-button @click="loadMore">{{finished?'~~~到底了~~~':'加载更多'}}</el-button>
      </div>
    </div>
  </section>
</template>
<script>
import { getFollowers, getLiked, getComments, getAts } from '@/api/message';
// import util from '@/utils/util';
export default {
  data() {
    return {
      type: 1,
      msgTypeList: [
        { name: '评论消息', value: 1, active: true },
        { name: '点赞消息', value: 2, active: false },
        { name: '@我的消息', value: 3, active: false },
        { name: '系统消息', value: 4, active: false }
      ],
      page: 0,
      per_page: 12,
      last_page: 0,
      cardList: [],
      tagList: [],
      keyWord: '',
      loadFlag: true,
      finished: false
    };
  },
  mounted() {
    this.loadMore();
  },
  methods: {
    loadMore() {
      if (this.finished) {
        return;
      }
      this.page++;
      this.getData();
    },
    getData() {
      this.loadFlag = true;
      let path = null;
      switch (this.type) {
        case 1:
          path = getComments;
          break;
        case 2:
          path = getLiked;
          break;
        case 3:
          path = getAts;
          break;
        default:
          path = getFollowers;
          break;
      }
      path({ page: this.page, per_page: this.per_page })
        .then(res => {
          if (res.code === 200 && res.data.data.length > 0) {
            this.current_page = res.current_page;
            this.last_page = res.last_page;
            if (res.last_page === res.current_page) {
              this.finished = true;
            }
            res.data.data.forEach(e => {
              switch (this.type) {
                case 1:
                  e.title = e.post.title;
                  break;
                case 2:
                  e.title = e.likable.content;
                  break;
                case 3:
                  break;
                default:
                  e.created_at = e.pivot.created_at;
                  e.user_id = e.pivot.user_id
                  e.user = {
                    avatar: e.avatar,
                    username: e.username
                  };
                  break;
              }
            });

            this.cardList = this.cardList.concat(res.data.data);
          } else {
            this.finished = true;
          }
          this.loadFlag = false;
        })
        .catch(() => {
          this.loadFlag = false;
        });
    },

    bindTab(item) {
      this.finished = false;
      this.page = 0;
      this.last_page = -1;
      this.type = item.value;
      this.msgList = [];
      this.dynamicList = [];
      this.getData();
    },
    changeTab(item) {
      this.msgTypeList.forEach(e => {
        e.active = e.value === item.value;
      });
      this.type = item.value;
      this.finished = false;
      this.cardList = [];
      this.page = 0;
      this.loadMore();
    }
  },
  components: {
    MsgCard: () => import('@/components/MsgCard')
  }
};
</script>
<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
