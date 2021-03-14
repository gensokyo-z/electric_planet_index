<template>
  <div class="singleImageUpload2 upload-container">
    <el-upload :multiple="false"
      :show-file-list="false"
      class="video-uploader"
      drag
      action=""
      :before-upload="beforeUploadVideo"
      accept="video/*"
      :disabled="videoFlag"
      :http-request="upload">
      <div class="iconfont"
        v-loading="videoFlag"
        element-loading-text="视频文件上传中">
        <i class="el-icon-plus" />
        <div class="el-upload__text">
          添加视频
        </div>
      </div>
      <!-- <el-progress v-else
        type="circle"
        :percentage="videoUploadPercent"></el-progress> -->
    </el-upload>
    <div v-show="videoUrl.length>0"
      class="video-preview">
      <div v-show="videoUrl.length>1"
        class="video-preview-wrapper">
        <video :class="{'hidden':showPreview}"
          :src="videoUrl"
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
          x5-video-orientation="portraint"></video>
        <div class="previwe-img"
          v-show="showPreview"
          @click.stop="playVideo">
          <img :src="videoPreviwe">
          <div v-if="videoPlayed"
            class="video-replay"></div>
          <div v-else
            class="video-ready"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '@/utils/util';
export default {
  name: 'SingleVideoUpload',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempUrl: '',
      videoFlag: false,
      showPreview: true,
      videoPreviwe: '',
      videoPlayed: false
    };
  },
  computed: {
    videoUrl() {
      return this.value;
    }
  },
  methods: {
    rmImage() {
      this.videoPreviwe = '';
      this.emitInput('');
    },
    emitInput(val) {
      this.$emit('input', val);
    },
    beforeUploadVideo(file) {
      const isLt3G = file.size / 1024 / 1024 < 3072;
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
        this.$message.error('');
        return false;
      }
      if (!isLt3G) {
        this.$message.error('文件大小需要小于3GB!');
        return false;
      }
    },
    async uploadOSS(content) {
      // eslint-disable-next-line
      const params = await this.$store.dispatch('getOssToken').then(res => {
        return res.data;
      });
      params.file = content.file;
      params.dir = 'posts/community/video';
      // eslint-disable-next-line
      let data = await this.$store.dispatch('setParams', params);
      // eslint-disable-next-line
      let url = this.$store.state.endPoint;
      // eslint-disable-next-line
      let imgPath = url + '/' + data.get('key');
      return this.$store.dispatch('upload', { url, data }).then(res => {
        return imgPath;
      });
    },
    upload(content) {
      this.videoFlag = true;
      this.uploadOSS(content).then(path => {
        this.tempUrl = path;
        this.getVideoposter().then(() => {
          this.emitInput(path);
          this.videoFlag = false;
        });
      });
    },
    playVideo() {
      this.showPreview = false;
      this.$refs.video.play();
    },
    getVideoposter() {
      return new Promise((resolve, reject) => {
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
        resolve();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.upload-container {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 8px;
  .video-uploader {
    height: 100%;
  }
  .video-preview {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    border: 1px dashed #d9d9d9;
    border-radius: 8px;

    .video-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      video {
        border-radius: 8px;
        width: 100%;
        height: 100%;
      }
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
.el-upload-dragger {
  border-color: #000;
  .iconfont {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .el-icon-plus {
    font-size: 28px;
    color: #8c939d;
  }
}
</style>
