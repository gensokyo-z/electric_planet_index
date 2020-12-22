<template>
  <section class="new-card">
    <div class="header-title"
         v-if="type === 'new'">
      <div class="left">
        <!-- <img class="icon" :src="" alt=""> -->
        <svg class="icon"
             aria-hidden="true">
          <use xlink:href="#icontab-shouye-xingqiu"></use>
        </svg><span>来自</span><span class="planet">{{content.planet.name}}</span>
      </div>
      <div :class="['right',{'joined':joined}]"
           @click.stop="addPlanet(content)">
        <button class="add"
                v-if="!joined">{{`+ 加入`}}</button>
        <button class="enter"
                v-else>{{`进入`}}</button>
      </div>
    </div>
    <div @click="goUrl(`/docdetail?id=${content.id}`)">
      <div class="user-info">
        <img class="avatar"
             v-if="content.source==='user'"
             :src="content.user.avatar"
             alt="头像">
        <span class="name"
              v-if="content.source==='user'">{{content.planet.name}}</span>
        <span class="time">{{content.created_at}}</span>
      </div>
      <!-- 文章内容 -->
      <div class="content">
        <div class="title"
          v-if="content.source !== '微博'">{{content.title}}</div>
        <!-- 文章预览 -->
        <div class="desc"
             v-if="!content.thumb_video">
          <div class="info"
               v-if="content.desc_content"
               v-html="content.desc_content"></div>
          <div class="info"
               v-else
               v-html="content.content"></div>
          <!-- 文章图片 -->
          <div v-if="content.thumb_pic"
               class="photo"
               @click.stop="previewImg(content.thumb_pic)">
            <img :src="content.thumb_pic"
                 v-lazy="content.thumb_pic">
          </div>
        </div>
        <div class="video-box"
             v-else>
          <video :class="{'hidden':showPreview}"
                 :src="content.thumb_video"
                 controls="controls"
                 preload='metadata'
                 controlslist="nodownload"
                 ref="video"
                 x5-playsinline=""
                 playsinline="true"
                 webkit-playsinline="true"
                 x-webkit-airplay="true"
                 x5-video-player-type="h5"
                 x5-video-player-fullscreen=""
                 x5-video-orientation="portraint">
          </video>
          <div class="previwe-img"
               v-show="showPreview"
               ref="previewImg"
               @click.stop="playVideo">
            <img :src="videoPreviwe"
                 v-lazy="videoPreviwe">
            <div v-if="videoPlayed"
                 class="video-replay"></div>
            <div v-else
                 class="video-ready"></div>
          </div>
        </div>
        <div class="tag-box">
          <div v-for="(item, index) in content.tags"
               :key="index"
               class="tag">
            <!-- <svg class="icon huati"
                 aria-hidden="true">
              <use xlink:href="#iconshouye-huati"></use>
            </svg> -->
            <span>#{{item.name}}</span>
            <!-- <svg class="icon jiantou"
                 aria-hidden="true">
              <use xlink:href="#iconshouye-jiantou"></use>
            </svg> -->
          </div>
        </div>
      </div>
    </div>
    <TalkApprovalShare :content.sync="content" />
    <InputItem ref="inputItem" />
  </section>
</template>
<script>
import Vue from 'vue';
import { Lazyload, ImagePreview } from 'vant';
import { joinPlanet } from '@/api/planet';
import util from '@/utils/util';
import TalkApprovalShare from '@/components/TalkApprovalShare';
Vue.use(Lazyload);
export default {
  name: 'NewCard',
  components: {
    InputItem: () => import('@/components/InputItem'),
    TalkApprovalShare
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    content: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      joined: false,
      showPreview: true,
      videoPlayed: false,
      videoPreviwe: '',
    };
  },
  watch: {
    'content.thumb_video': {
      handler (val) {
        if (val) {
          this.$nextTick(this.getVideoposter);
        }
      },
      immediate: true
    },
    '$state.userPlanet': {
      handler (val) {
        if (val.some(e => e.id === this.content.planet_id)) {
          this.joined = true;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    goUrl (url) {
      this.$router.push(url);
    },
    previewImg (img) {
      ImagePreview([img]);
    },
    bindTalk () {
      this.$refs.inputItem.showInput = true;
    },
    async addPlanet (content) {
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
      if (this.joined) {
        this.$router.push(`/planetdetail?id=${content.planet_id}`);
      } else {
        this.$dialog
          .confirm({
            title: '提示',
            message: '是否加入该星球'
          })
          .then(() => {
            joinPlanet(content.planet_id).then(res => {
              if (res.code === 200) {
                this.goUrl(`/planetdetail?id=${content.planet_id}`);
              }
            });
          })
          .catch(() => { });
      }
    },
    getVideoposter () {
      let video = this.$refs.video;
      video.setAttribute('crossOrigin', 'Anonymous');
      video.currentTime = 0.001;
      video.onloadeddata = e => {
        this.videoPreviwe = util.getVideoPre(video);
      };
      video.onended = e => {
        this.videoPreviwe = util.getVideoPre(video);
        this.videoPlayed = true;
        this.showPreview = true;
      };
    },
    playVideo () {
      this.showPreview = false;
      this.$refs.video.play();
    }
  },
};
</script>
<style lang="less" scoped>
.new-card {
  padding: 32px;
  border-bottom: 20px solid rgba(0, 0, 0, 0.04);
  .header-title {
    margin-bottom: 34px;
    padding: 16px 0 16px 16px;
    width: 686px;
    height: 64px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 0%, rgba(255, 255, 255, 0.04) 100%);
    border-radius: 32px 32px 0 0;
    .left {
      display: flex;
      align-items: center;
      .icon {
        margin-right: 16px;
        width: 20px;
        height: 20px;
      }
      span:nth-of-type(1) {
        padding-right: 8px;
        font-size: 28px;
        color: rgba(0, 0, 0, 0.45);
      }
      .planet {
        font-size: 28px;
        color: rgba(0, 0, 0, 0.9);
      }
    }
    .right {
      .add,
      .enter {
        width: 150px;
        height: 56px;
        border-radius: 28px;
        font-size: 28px;
        color: rgba(0, 0, 0, 0.9);
      }
      .add {
        background: #ffdd27;
      }
      .enter {
        position: relative;
        background-color: #fff;
        border: 1px solid rgba(0, 0, 0, 0.08);
        &::after {
          position: absolute;
          top: 50%;
          transform: translateY(-50%) rotateZ(-45deg);
          width: 15px;
          height: 15px;
          content: '';
          border-right: 2px solid #979797;
          border-bottom: 2px solid #979797;
        }
      }
    }
  }
  .user-info {
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 18px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
    }

    .name {
      position: relative;
      padding-right: 26px;
      font-size: 28px;
      color: rgba(0, 0, 0, 0.45);
      &::after {
        position: absolute;
        top: 50%;
        right: 10px;
        width: 4px;
        height: 4px;
        background: rgba(0, 0, 0, 0.15);
        content: '';
      }
    }
    .time {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.25);
    }
  }
  .content {
    margin-top: 24px;
    .title {
      margin-bottom: 16px;
      font-size: 32px;
      color: rgba(0, 0, 0, 0.9);
      line-height: 40px;
    }
    .desc {
      margin-bottom: 14px;
      display: flex;
      // justify-content: space-between;
      .info {
        flex: 1;
        height: 70px;
        font-size: 28px;
        color: rgba(0, 0, 0, 0.45);
        line-height: 36px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
      }
      .photo {
        max-width: 158px;
        height: 108px;
        img {
          width: 158px;
          height: 108px;
        }
      }
    }
    .tag-box {
      display: flex;
      flex-wrap: wrap;
      .tag {
        margin: 0 20px 20px;
        padding: 6px 28px;
        display: flex;
        align-items: center;
        border-radius: 50px;
        // border: 1px solid rgba(0, 0, 0, 0.15);
        color: #fff;
        // color: rgba(0, 0, 0, 0.9);
        background-color: rgb(188, 39, 27);
        span {
          font-size: 24px;
        }
        // .huati {
        //   margin-right: 16px;
        //   width: 28px;
        //   height: 28px;
        //   color: #fff;
        // }
        // .jiantou {
        //   margin-left: 10px;
        //   width: 11px;
        //   height: 11px;
        //   color: #fff;
        // }
      }
    }
    .video-box {
      margin-bottom: 32px;
      width: 686px;
      height: 385px;
      position: relative;
      video {
        width: 100%;
        max-height: 384px;
      }
      .previwe-img {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #000;
        img {
          height: 100%;
        }
      }
      .hidden {
        width: 0;
        height: 0;
      }
    }
  }
}
</style>
