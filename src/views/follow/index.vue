<template>
  <section class='follow'>
    <div class='title'>
      <div :class="['msg-tab',{active: item.active}]"
           @click='changeTab(item)'
           v-for='(item,index) in msgTypeList'
           :key='index'>{{ item.name }}
      </div>
    </div>
    <div class='msg-list'
         v-loading='loadFlag'>
      <div class='msg'
           v-for='(item,index) in cardList'
           :key='index'>
        <FansCard :type.sync='type'
                  :content='item' />
      </div>
    </div>
    <div class='footer-btn'
         v-if='!loadFlag'>
      <el-button @click='loadMore'>{{ finished ? '~~~到底了~~~' : '加载更多' }}</el-button>
    </div>
  </section>
</template>
<script>
import { getFollowers } from '@/api/message';
import { getFollower, getOtherFollowed, getOtherFollowers } from '@/api/user';
// import util from '@/utils/util';
export default {
  data() {
    return {
      id: '',
      type: 1,
      msgTypeList: [
        { name: '我的关注', value: 1, active: true },
        { name: '我的粉丝', value: 2, active: false }
      ],
      page: 1,
      per_page: 12,
      cardList: [],
      loadFlag: true,
      finished: false
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    if (this.id) {
      this.msgTypeList = [
        { name: '他的关注', value: 1, active: true },
        { name: '他的粉丝', value: 2, active: false }
      ];
    }
    this.getData();
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
      const obj = { page: this.page, per_page: this.per_page };
      if (this.id) {
        path = this.type === 1 ? getOtherFollowed : getOtherFollowers;
        obj.id = this.id;
      } else {
        path = this.type === 1 ? getFollower : getFollowers;
      }
      path(obj).then(res => {
        if (res.code === 200 && res.data.length > 0) {
          res.data.forEach(e => {
            if (this.type !== 1) {
              e.created_at = e.pivot.created_at;
              e.user_id = e.pivot.user_id;
              e.user = {
                avatar: e.avatar,
                username: e.username
              };
            }
          });
          this.cardList = this.cardList.concat(res.data);
          if (res.last_page === res.current_page) {
            this.finished = true;
          }
        } else {
          this.finished = true;
        }
        this.loadFlag = false;
      }).catch(() => {
        this.loadFlag = false;
      });
    },
    getClear() {
      this.cardList = [];
      this.page = 1;
      this.finished = false;
      this.getData();
    },
    changeTab(item) {
      this.msgTypeList.forEach(e => {
        e.active = e.value === item.value;
      });
      this.type = item.value;
      this.getClear();
    }
  },
  components: {
    FansCard: () => import('@/components/FansCard')
  }
};
</script>
<style scoped src='./index.less' lang='less' rel='stylesheet/less'>
</style>
