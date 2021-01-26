<template>
  <section class="new-card">
    <div class="header-title"
      v-if="type === 'new'">
      <div class="left"
        @click="$router.push(`/planetdetail?id=${content.planet.id}`);"
        v-if="$route.path !=='/planetdetail'">
        <img class="icon"
          :src="content.planetBg"
          alt="">
        <span>来自</span><span class="planet">{{content.planet.name}}</span><span class="time">{{content.created_at}}</span>
      </div>
      <div :class="['right',{'joined':joined}]"
        @click.stop="addPlanet(content)"
        v-if="$route.path !=='/planetdetail'">
        <button class="add"
          v-if="!joined">{{`+ 加入`}}</button>
        <button class="enter"
          v-else>{{`进入`}}</button>
      </div>
    </div>
    <div>
      <div class="user-info"
        @click="goUrl(`/postdetail?id=${content.id}`)">
        <img class="avatar"
          v-if="content.source==='user'"
          :src="content.user.avatar"
          alt="头像">
        <span class="name"
          v-if="content.source==='user'">{{content.user.username}}</span>
      </div>
      <!-- 文章内容 -->
      <div class="content">
        <div class="title"
          v-if="content.source !== '微博'"
          @click="goUrl(`/postdetail?id=${content.id}`)">{{content.title}}</div>
        <!-- 文章预览 -->
        <div class="desc"
          v-if="!content.thumb_video">
          <div class="info"
            v-if="content.desc_content"
            v-html="content.desc_content"></div>
          <div class="info"
            v-else
            v-html="content.content"></div>

        </div>
        <!-- 文章图片 -->
        <div class="photo-box"
          v-if="content.thumb_pic">
          <div class="photo">
            <!-- <img :src="content.thumb_pic"> -->
            <el-image :src="content.thumb_pic"
              :preview-src-list="srcList">
            </el-image>
          </div>
        </div>
        <div class="video-box"
          v-if="content.thumb_video">
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
            <img :src="videoPreviwe">
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
            <span @click="handlerTag(item)">#{{item.name}}</span>
            <!-- <svg class="icon jiantou"
                 aria-hidden="true">
              <use xlink:href="#iconshouye-jiantou"></use>
            </svg> -->
          </div>
        </div>
      </div>
    </div>
    <TalkApprovalShare :content.sync="content" />
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
    type: {
      type: String,
      default: ''
    },
    content: {
      type: Object,
      default: () => {}
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
  watch: {
    'content.thumb_pic': {
      handler(val) {
        if (val) {
          this.srcList.push(val);
        }
      },
      immediate: true
    },
    'content.thumb_video': {
      handler(val) {
        if (val) {
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
        this.$store.dispatch('needAuth');
      }
      if (this.joined) {
        this.goUrl(`/planetdetail?id=${content.planet_id}`);
      } else {
        this.$confirm('是否加入该星球', '提示')
          .then(() => {
            joinPlanet(content.planet_id).then(res => {
              if (res.code === 200) {
                this.goUrl(`/planetdetail?id=${content.planet_id}`);
              }
            });
          })
          .catch(() => {});
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
  // padding: 32px;
  // border-bottom: 20px solid rgba(0, 0, 0, 0.04);
  margin-bottom: 10px;
  padding-bottom: 30px;
  border-bottom: 1px solid #ebecf1;
  .header-title {
    // margin-bottom: 34px;
    // width: 686px;
    height: 64px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 32px 32px 0 0;
    .left {
      display: flex;
      align-items: center;
      cursor: pointer;
      .icon {
        margin-right: 16px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      span:nth-of-type(1) {
        padding-right: 8px;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.45);
      }
      .planet {
        position: relative;
        padding-right: 26px;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.9);
        &::after {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 10px;
          width: 4px;
          height: 4px;
          background: rgba(0, 0, 0, 0.15);
          content: '';
        }
      }
      .time {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.25);
      }
    }
    .right {
      .add,
      .enter {
        padding: 5px 30px;
        border-radius: 28px;
        font-size: 18px;
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
          transform: translateY(-50%) rotateZ(-45deg);
          width: 15px;
          height: 15px;
          content: '';
          border-right: 1px solid #979797;
          border-bottom: 1px solid #979797;
          z-index: 1;
        }
      }
    }
  }
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    .avatar {
      margin-right: 18px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }

    .name {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .content {
    margin-top: 10px;
    .title {
      margin-bottom: 10px;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.9);
      line-height: 25px;
      cursor: pointer;
    }
    .desc {
      display: flex;
      margin-bottom: 10px;
      // justify-content: space-between;
      .info {
        flex: 1;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        line-height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
      }
    }

    .tag-box {
      display: flex;
      flex-wrap: wrap;
      // margin-bottom: 10px;
      .tag {
        margin: 0 20px 10px 0;
        padding: 0 15px;
        display: flex;
        align-items: center;
        border-radius: 50px;
        // border: 1px solid rgba(0, 0, 0, 0.15);
        color: #fff;
        // color: rgba(0, 0, 0, 0.9);
        background-color: rgb(188, 39, 27);
        display: inline-block;
        line-height: 30px;
        cursor: pointer;
        span {
          font-size: 12px;
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
    .photo-box {
      // width: 158px;
      // height: 108px;
      min-height: 200px;
      margin-bottom: 20px;
      .photo {
        width: 300px;
        height: 200px;
        /deep/ .el-image {
          img {
            // width: unset;
          }
        }
      }
    }
    .video-box {
      margin-bottom: 32px;
      // width: 686px;
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
