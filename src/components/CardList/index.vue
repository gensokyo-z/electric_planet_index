<template>
  <section class='card-list'>
    <div class='tag-list'>
      <div :class="['tag',{'checked':item.checked}]"
           v-for='(item, index) in showTagsList'
           :key='index'
           @click='checkTags(item)'>{{ item.name }}
      </div>
      <div class='por' v-if="path!=='author'">
        <img src='@/assets/images/Category.png' alt='' class='more' @click='toggleTagsMenu'>
        <div class='tag-menu flex-col' v-show='visibleTagMenu'>
          <div class='title'>设置标签（{{ selectedTags.length }}/3）</div>
          <ul class='clearfixed'>
            <li v-for='(item,index) in tagList' :key='index' @click='checkTagsMenu(item)'
                :class='{checked:item.checked}'>
              <img src='@/assets/images/check.png' alt='' v-if='index<2'>
              <img src='@/assets/images/check2.png' alt='' v-if='index>1 && item.checked'>
              <span>{{ item.name }}</span>
            </li>
          </ul>
          <div class='submit'>
            <button @click='setCustomTags'>确认</button>
          </div>
        </div>
      </div>
    </div>
    <div class='card-list' v-loading='loadFlag'>
      <div class='card'
           v-for='(item, index) in cardList'
           :key='index'>
        <NewCard :content='item'
                 @handlerTag='handlerTag'
                 @getData='getData' />
      </div>
    </div>
    <div class='footer-btn'
         v-if='!loadFlag'>
      <el-button @click='loadMore'>{{ finished ? '~~~到底了~~~' : '加载更多' }}</el-button>
    </div>
  </section>
</template>
<script>
import NewCard from '@/components/NewCard';
import { getNewest, getHotest } from '@/api/index';
import { getTags, getCustomTags, setCustomTags } from '@/api/tag';
import { getOthusernews } from '@/api/user';
import { getPlanetPosts, getPlanetHotest, getPlanetTags } from '@/api/planet';

export default {
  props: {
    userId: {
      type: Number,
      default: 0
    }
  },
  name: 'CardList',
  data() {
    return {
      path: '',
      type: 'new',
      page: 1,
      per_page: 12,
      cardList: [],
      customTagList: [],
      tagList: [],
      showTagsList: [
        { id: -1, name: '最新', value: 'new', checked: true },
        { id: -2, name: '最热', value: 'hot', checked: false }
      ],
      keyWord: '',
      loadFlag: true,
      finished: false,
      visibleTagMenu: false
    };
  },
  created() {
    this.path = this.$route.name;
  },
  mounted() {
    this.getTags();
    this.getData();
    this.$bus.$on('indexSearch', kw => {
      this.getSearch(kw);
    });
  },
  methods: {
    getTags() {
      let path = null;
      const obj = {};
      switch (this.path) {
        case 'index':
          path = getCustomTags;
          break;
        case 'planetdetail':
          path = getPlanetTags;
          obj.id = this.$route.params.planetId || 0;
          break;
        case 'author':
          return;
        default:
          return;
      }
      path(obj).then(res => {
        if (res.data) {
          res.data.forEach(e => {
            e.checked = false;
          });
          this.tagList = [
            { id: -1, name: '最新', value: 'new' },
            { id: -2, name: '最热', value: 'hot' }
          ].concat(res.data);
          const arr = JSON.parse(JSON.stringify(res.data));
          if (arr.length > 3) {
            arr.splice(3, arr.length - 3);
          }
          this.showTagsList = this.showTagsList.concat(arr);
        }
      });
    },
    setCustomTags() {
      if (this.selectedTags > 0) {
        const ids = this.selectedTags;
        setCustomTags({ ids }).then(res => {
          this.tagList.forEach(e => {
            e.checked = false;
          });
          this.toggleTagsMenu();
        });
      }

    },
    loadMore() {
      if (this.finished) {
        return;
      }
      this.page++;
      this.getData();
    },
    changeTab(type) {
      this.type = type;
      this.getSearch('');
    },
    toggleTagsMenu() {
      this.visibleTagMenu = !this.visibleTagMenu;
      // if (this.visibleTagMenu) {
      //
      // } else {
      //
      // }
    },
    checkTagsMenu(item) {
      const checkedCount = this.tagList.filter(e => e.checked).length;
      this.tagList.forEach((e, i) => {
        if (i > 1 && e.id === item.id) {
          if (item.checked) {
            e.checked = !e.checked;
          } else {
            if (checkedCount < 3) {
              e.checked = !e.checked;
            }
          }
        }
      });
    },
    getSearch(kw) {
      this.page = 1;
      this.finished = false;
      this.cardList = [];
      this.keyWord = kw;
      this.getData();
    },
    getData() {
      this.loadFlag = true;
      let path = null;
      const obj = {
        page: this.page,
        per_page: this.per_page
      };
      switch (this.path) {
        case 'index':
          if (this.type === 'new') {
            path = getNewest;
          } else {
            path = getHotest;
          }
          obj.keyword = this.keyword;
          obj.type = ['0', '1', '2'];
          break;
        case 'planetdetail':
          if (this.type === 'new') {
            path = getPlanetPosts;
          } else {
            path = getPlanetHotest;
          }
          obj.id = this.$route.params.planetId || 0;
          break;
        case 'attention':
          path = getOthusernews;
          obj.id = this.userId;
          break;
        case 'author':
          path = getOthusernews;
          obj.id = this.$route.params.userId;
          break;
        default:
          this.finished = true;
          return;
      }
      path(obj).then(res => {
        if (res.code === 200 && res.data) {
          let arr = [];
          res.data.forEach(e => {
            if (e.type === 0 && !e.thumb_pic) {
              if (e.media && e.media.length > 0 && e.media[0].media_link) {
                e.thumb_pic = e.media[0].media_link;
              }
            }
            // e.content = util.changeHtml2Crad(e.content);
            let planet = this.$state.allPlanet.find(v => v.id === e.planet_id);
            if (planet) {
              e.planet = {
                planet_id: e.planet_id,
                name: planet.name
              };
            } else {
              e.planet = {
                planet_id: 0,
                name: ''
              };
            }
            if (e.tags.length > 4) {
              e.tags.splice(4, e.tags.length - 4);
            }
            if (e.type === 0 && !e.desc_content) {
              e.desc_content = e.content;
            }
            if (e.type === 0 || e.type === 1) {
              e.mediaType = 'pic';
            } else {
              e.mediaType = 'video';
            }
            arr.push(e);
          });
          this.cardList = this.cardList.concat(arr);
          if (res.last_page === res.current_page) {
            this.finished = true;
          }
        } else {
          this.finished = true;
        }
        this.loadFlag = false;
      }).catch(err => {
        console.log(err);
        this.loadFlag = false;
      });
    },
    gotoDetail(item) {
      this.$router.push(`/docdetail?id=${item.id}`);
    },
    handlerTag(tag) {
      let tagName = '#' + tag.name;
      this.getSearch(tagName);
    },
    checkTags(item) {
      this.cardList = [];
      this.showTagsList.forEach(e => {
        e.checked = e.id === item.id;
      });
      if (item.id < 0) {
        this.keyWord = '';
        this.type = this.showTagsList.filter(e => e.id === item.id)[0].value;
        this.getData();
      } else {
        this.type = 'new';
        this.handlerTag(item);
      }
    }
  },
  computed: {
    selectedTags() {
      return this.tagList.filter(e => e.checked).map(v => {
        return v.id;
      });
    }
  },
  watch: {
    userId(val, old) {
      if (val !== old && val !== 0) {
        this.getData();
      }
    }
  },
  components: {
    NewCard
  }
};
</script>
<style scoped lang='less'>
.tag-list {
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: inset 0px -1px 0px #eaeaea;

  .tag {
    padding: 15px 32px;
    font-size: 16px;
    line-height: 22px;
    color: #5c6573;
    cursor: pointer;

    &.checked {
      color: #ed7656;
    }
  }

  .por {
    margin-left: auto;
  }

  .more {
    margin-right: 32px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .tag-menu {
    width: 365px;
    position: absolute;
    top: 30px;
    right: 10px;
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25));
    background: #fff;

    .title {
      padding: 16px 20px;
      font-size: 14px;
      color: #141b29;
      border-bottom: 1px solid #eaeaea;
    }

    > ul {
      margin: 20px;
      position: relative;

      &:before {
        position: absolute;
        top: 0;
        left: 50%;
        content: "";
        height: 100%;
        width: 0;
        border: 1px solid #eaeaea;
        z-index: 1;
      }

      li {
        padding: 10px 0;
        width: 148px;
        float: left;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #39393b;
        font-size: 13px;
        border: 1px solid #eaeaea;
        box-sizing: border-box;
        border-radius: 17px;
        cursor: pointer;

        > img {
          width: 16px;
          height: 16px;
          margin-right: 10px;
        }

        > span {
          font-size: 13px;
          color: #39393b;
        }

        &:hover {

        }

        &:nth-child(odd) {
          margin-right: 28px;
        }

        &:nth-child(n+3) {
          margin-top: 10px;
        }


        &.checked {
          color: #ed7656;
          border-color: #ed7656;
          background: #fff0e6;
        }

        &:nth-child(-n+2) {
          border-color: #eaeaea;
          background: #f5f5f5;
          color: #929da5;
          cursor: not-allowed;
        }
      }
    }

    .submit {
      margin: 0 20px;
      padding: 16px 0 20px;
      border-top: 1px solid #eaeaea;


      > button {
        padding: 10px 149px;
        background: #ed7656;
        border-radius: 17px;
        color: #fff;
        font-size: 13px;
        cursor: pointer;
      }
    }


    &::before {
      content: '';
      position: absolute;
      top: -10px;
      right: 20px;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #fff;
    }
  }
}

.card-list {
  min-height: 800px;
}
</style>
