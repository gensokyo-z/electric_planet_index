<template>
  <section class='mine'>
    <UserBanner />
    <template v-if="tab==='send'"></template>
    <template v-else></template>
    <div class='tag-wrapper flex-v'>
      <div :class="['item',{active:item.active}]" v-for='(item,index) in tabList' :key='index'
           @click='chnageTab(item)'>
        {{ item.name }}
      </div>
    </div>
    <div class='flex'>
      <div class='mine-left flex-col'>
        <div :class="['item', 'flex-v',{active:item.active}]" v-for='(item,index) in tagList' :key='index'
             @click='changeTag(item)'>
          <span class='name'>{{ item.name }}</span>
          <span class='count'>{{ item.count }}</span>
        </div>
      </div>
      <div class='mine-right' v-loading='loading'>
        <div class='flex-col'>
          <div class='empty'>
            <img src='' alt=''>
            <button></button>
          </div>
          <component class='card'
                     :is='componentName'
                     v-for='(item,index) in cardList'
                     :tag='tag'
                     :key='index'
                     :content='item' />

        </div>
      </div>
    </div>
  </section>
</template>
<script>
import UserBanner from '@/components/UserBanner';
import PostCard from './components/PostCard';
import DraftCard from './components/DraftCard';
import MsgCard from './components/MsgCard';

// import NewCard from '@/components/NewCard';
import { getFollowers, getLiked, getComments, getAts } from '@/api/message';
import { getUserDynamic, getOtheruser, getReplys } from '@/api/user';

// import util from '@/utils/util';
const sendList = [
  { name: '动态', value: 'DT', active: true, count: 0 },
  { name: '文章', value: 'WZ', active: false, count: 0 },
  { name: '视频', value: 'SP', active: false, count: 0 }
  // { name: '草稿箱', value: 'CGX', active: false, count: 0 },
];
const msgList = [
  { name: '回复我的', value: 'HFWD', active: true, count: 0 },
  { name: '@ 我的', value: 'ATWD', active: false, count: 0 },
  { name: '收到的赞', value: 'SDDZ', active: false, count: 0 },
  { name: '系统消息', value: 'XTXX', active: false, count: 0 }
];
export default {
  name: 'mine',
  data() {
    return {
      tabList: [
        { name: '发布消息', value: 'send', active: true },
        { name: '消息通知', value: 'msg', active: false }
      ],
      tab: 'send',
      tagList: sendList,
      tag: 'DT',
      loading: true,
      finished: false,
      cardList: [],
      page: 1,
      per_page: 12,
      isEmpty: false
    };
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    chnageTab(item) {
      this.tabList.forEach(e => {
        e.active = e.value === item.value;
      });
      this.tagList = item.value === 'send' ? sendList : msgList;
      this.tab = item.value;
      this.tag = this.tagList[0].value;
      this.getClear();
    },
    changeTag(item) {
      this.tagList.forEach(e => {
        e.active = e.value === item.value;
      });
      this.tag = item.value;
      this.getClear();
    },
    getOtheruser() {
      return new Promise((resolve, reject) => {
        getOtheruser({ id: this.$route.query.id }).then(res => {
          this.userInfo = res.data;
          resolve();
        });
      });
    },
    loadMore() {
      if (this.finished) {
        return;
      }
      this.page++;
      this.getPosts();
    },
    getClear() {
      this.finished = false;
      this.cardList = [];
      this.page = 1;
      this.getPosts();
    },
    goUrl(path) {
      this.$router.push(path);
    },
    getPosts() {
      this.loading = true;
      let arr = [];
      let path = getUserDynamic;
      const obj = {
        page: this.page,
        per_page: this.per_page
      };
      if (this.componentName === 'PostCard') {
        switch (this.tag) {
          case 'DT':
            obj.type = ['0'];
            break;
          case 'WZ':
            obj.type = ['1'];
            break;
          case 'SP':
            obj.type = ['2'];
            break;
          default:
            break;
        }
        path(obj).then(({ code, data, last_page, current_page }) => {
          if (code === 200 && data.length > 0) {
            data.forEach(e => {
              if (e.type === 0 && !e.thumb_pic) {
                if (e.media && e.media.length > 0 && e.media[0].media_link) e.thumb_pic = e.media[0].media_link;
              }
              e.planet = this.$state.allPlanet.filter(v => v.id === e.planet_id)[0];
              if (e.type === 0 && !e.desc_content) {
                e.desc_content = e.content;
              }
              if (e.type === 0 || e.type === 1) {
                e.mediaType = 'pic';
              } else {
                e.mediaType = 'video';
              }
              e.created_at = e.created_at.slice(0, 10);
              arr.push(e);
            });
            this.cardList = this.cardList.concat(arr);
            if (last_page === current_page) {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
          this.loading = false;
        }).catch(err => {
          console.log(err);
        });
      } else {
        path = getReplys;
        switch (this.tag) {
          case 'ATWD':
            path = getAts;
            break;
          case 'SDDZ':
            path = getLiked;
            break;
          case 'XTXX':
            path = getLiked;
            break;
          default:
            break;
        }
        path(obj).then(res => {
          if (res.code === 200 && res.data.length > 0) {
            res.data.forEach(e => {
              arr.push(e);
            });
            this.cardList = this.cardList.concat(arr);
            if (res.last_page === res.current_page) {
              this.finished = true;
            }
          } else {
            this.finished = true;
          }
          this.loading = false;
        });
      }
    }
  },
  computed: {
    componentName() {
      switch (this.tag) {
        case 'DT':
        case 'WZ':
        case 'SP':
          return 'PostCard';
        case 'CGX':
          return 'DraftCard';
        case 'HFWD':
        case 'ATWD':
        case 'SDDZ':
        case 'XTXX':
          return 'MsgCard';
        default:
          return '';
      }
    }
  },
  components: {
    UserBanner,
    PostCard,
    DraftCard,
    MsgCard
  }
}
;
</script>
<style scoped src='./index.less' lang='less' rel='stylesheet/less'>
</style>
