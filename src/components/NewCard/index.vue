<template>
  <section class="new-card">
    <!-- 作者信息 -->
    <div class="author">
      <div class="user-info flex-1"
           v-if="content.source==='user'"
           @click="goUrl(`/author/${content.user_id}`)">
        <img class="avatar"
             :src="avatar"
             alt="头像">
        <div class="flex-c-b  flex-1">
          <div class="flex-col">
            <span class="name">{{ username }}</span>
            <div class="flex-v">
              <span class="time">{{ content.created_at }}</span>
              &ensp;<span class="time">来自</span>
              <img :src="planetLogo" alt="" class="p-logo">
              <span class="planet">{{ content.planet.name }}</span></div>
          </div>
          <img class="more" src="@/assets/images/more.png" alt="">
        </div>
      </div>
    </div>
    <!-- 文章图片 -->
    <template v-if="content.mediaType === 'pic'">
      <div class="photo-box"
           v-if="content.thumb_pic"
           @click="goUrl(`/docdetail?id=${content.id}`)">
        <div class="photo">
          <img :src="content.thumb_pic">
        </div>
      </div>
    </template>
    <!-- 视频 -->
    <template v-else>
      <div class="video-box"
           v-if="content.media.length>0&&content.media[0].media_type==='video'">
        <video :class="{'hidden':showPreview}"
               :src="content.media[0].media_link"
               controls="controls"
               preload='metadata'
               controlslist="nodownload"
               ref="video"
               x5-playsinline=""
               disablePictureInPicture
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
          <img :src="videoPreviwe">
          <div v-if="videoPlayed"
               class="video-replay"></div>
          <div v-else
               class="video-ready"></div>
        </div>
      </div>
    </template>
    <!-- 标题 -->
    <div class="title"
         @click="goUrl(`/docdetail?id=${content.id}`)">
      <h2 v-if="content.source !== '微博'"> {{ content.title }}</h2>
    </div>

    <!-- 文章预览 -->
    <div class="desc">
      <div class="info"
           v-if="content.desc_content"
           v-html="content.desc_content"
           @click="goUrl(`/docdetail?id=${content.id}`)"></div>
    </div>
    <!-- 标签 -->
    <div class="tag-box" v-if="content.tags.length>0">
      <div v-for="(item, index) in content.tags"
           :key="index"
           class="tag"
           v-show="index<4"
           @click="handlerTag(item)">
        <img src="@/assets/images/tag.png" alt="">
        <span>{{ item.name }}</span>
      </div>
    </div>
    <TalkApprovalShare :content.sync="content"/>
    <!--    <div class="planet-box"-->
    <!--         v-if="($route.path === '/index'||$route.path === '/planet')&&content.planet.name">-->
    <!--      <div class="left"-->
    <!--           @click="$router.push(`/planetdetail?id=${content.planet_id}`);"-->
    <!--           v-if="$route.path !=='/planetdetail'">-->
    <!--        <span>来自</span><span class="planet">{{ content.planet.name }}</span>-->
    <!--      </div>-->
    <!--      <div :class="['right',{'joined':joined}]"-->
    <!--           @click.stop="addPlanet(content)"-->
    <!--           v-if="$route.path !=='/planetdetail'">-->
    <!--        <button class="add"-->
    <!--                v-if="!joined">{{ `加入` }}-->
    <!--        </button>-->
    <!--        <button class="enter"-->
    <!--                v-else>{{ `进入` }}-->
    <!--        </button>-->
    <!--      </div>-->
    <!--    </div>-->
    <!-- <InputItem ref="inputItem" /> -->
  </section>
</template>
<script>
// import Vue from 'vue';
import { joinPlanet } from '@/api/planet';
import util from '@/utils/util';
import TalkApprovalShare from '@/components/TalkApprovalShare';

export default {
  name: 'NewCard',
  components: {
    // InputItem: () => import('@/components/InputItem'),
    TalkApprovalShare
  },
  props: {
    content: {
      type: Object,
      default: () => {
        return {
          user: {}
        };
      }
    }
  },
  data() {
    return {
      joined: false,
      showPreview: true,
      videoPlayed: false,
      videoPreviwe: '',
      srcList: []
    };
  },
  computed: {
    avatar() {
      if (this.content.user && this.content.user.avatar) {
        return this.content.user.avatar;
      } else {
        return util.defaultAvatar('');
      }
    },
    username() {
      if (this.content.user && this.content.user.username) {
        return this.content.user.username;
      } else {
        return '';
      }
    },
    planetLogo() {
      return this.$state.allPlanet.find(e => e.id === this.content.planet_id).avatar
    },
  },
  watch: {
    'content.thumb_pic': {
      handler(val) {
        if (val) {
          this.srcList.push(val);
        }
      },
      immediate: true
    },
    'content.media': {
      handler(val) {
        if (val.length > 0 && val[0].media_type === 'video') {
          this.$nextTick(this.getVideoposter);
        }
      },
      immediate: true
    },
    '$state.userPlanet': {
      handler(val) {
        if (val.some(e => e.id === this.content.planet_id)) {
          this.joined = true;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    goUrl(url) {
      this.$router.push(url);
    },
    // previewImg (img) {
    //   ImagePreview([img]);
    // },
    bindTalk() {
      this.$refs.inputItem.showInput = true;
    },
    async addPlanet(content) {
      if (!util.getcookie('TOKEN')) {
        return this.$store.dispatch('needAuth');
      }
      if (this.joined) {
        this.goUrl(`/planetdetail/${content.planet_id}`);
      } else {
        // this.$confirm('是否加入该星球', '提示')
        //   .then(() => {
        joinPlanet(content.planet_id).then(res => {
          if (res.code === 200) {
            this.$store.dispatch('getUserPlanetList').then(() => {
              this.$message.success('已成功加入星球');
              this.$emit('getData');
            });
          }
        });
        // })
        // .catch(() => {});
      }
    },
    getVideoposter() {
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
    playVideo() {
      this.showPreview = false;
      this.$refs.video.play();
    },
    handlerTag(tag) {
      this.$emit('handlerTag', tag);
    }
  }
};
</script>
<style lang="less" scoped>
.new-card {
  padding: 28px 32px;
  box-sizing: border-box;
  background: #fff;
  width: 808px;
  box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.1);

  .author {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;

      .avatar {
        margin-right: 16px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }

      .name {
        font-size: 14px;
        color: #141b29;
      }

      .time {
        color: #929da5;
      }

      .p-logo {
        margin: 0 4px;
        width: 16px;
        height: 16px;
      }

      .planet {
        color: #39393b;
      }
      .more{
        width: 16px;
        height: 16px;
      }
    }
  }

  .photo-box {
    overflow: hidden;
    width: 150px;
    height: 90px;
    margin-bottom: 30px;
    cursor: pointer;

    .photo {
      width: 150px;
      height: 90px;

      img {
        object-fit: cover;
        border-radius: 5px;
      }
    }
  }

  .video-box {
    margin-bottom: 32px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 220px;
    height: 125px;
    background-color: #000;

    video {
      width: 220px;
      height: 125px;
      object-fit: contain;
    }

    .previwe-img {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #000;

      img {
        width: 220px;
        height: 125px;
        object-fit: contain;
      }
    }

    .hidden {
      width: 0;
      height: 0;
    }
  }

  .title {
    h2 {
      font-weight: 700;
      font-size: 18px;
      line-height: 26px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      cursor: pointer;
    }
  }

  .tag-box {
    margin: 10px 0;
    display: flex;
    justify-content: flex-start;

    .tag {
      margin-right: 10px;
      padding: 4px 12px;
      border-radius: 12px;
      background: #f5f5f5;
      cursor: pointer;
      display: flex;
      align-items: center;
      img{
        margin-right: 4px;
        width: 12px;
        height: 13px;
      }
      span {
        color: #5c6573;
        font-size: 14px;
      }
    }
  }

  .desc {
    margin-bottom: 10px;

    .info {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      cursor: pointer;
    }
  }


  .planet-box {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding-right: 8px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);

      .planet {
        position: relative;
        padding-right: 26px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.9);
      }
    }

    .right {
      .add,
      .enter {
        padding: 5px 20px;
        border-radius: 28px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.9);
        cursor: pointer;
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
          right: 15px;
          transform: translateY(-50%) rotateZ(-45deg);
          width: 8px;
          height: 8px;
          content: '';
          border-right: 1px solid #979797;
          border-bottom: 1px solid #979797;
          z-index: 1;
        }
      }
    }
  }
}
</style>
