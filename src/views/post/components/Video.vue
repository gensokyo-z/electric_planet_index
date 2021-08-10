<template>
  <div class='video'>
    <div class='upload-video'>
      <SingleVideo class='single-video'
                   :value.sync='postForm.media[0].media_link'
                   @input='upLoadThumbVideo'
                   ref='uploadVideo'
                   v-show='postForm.media[0].media_link' />
      <img class='icon-video' src='@/assets/images/icon_v.png' alt='' v-show='!postForm.media[0].media_link'>
      <div class='upload-btn'>
        <el-button @click="uploadFile('video')">{{ postForm.media[0].media_link ? '更换' : '上传' }}视频</el-button>
      </div>
      <div class='desc'>支持MP4、AVI、MOV等常规格式，</div>
      <div class='desc'>文件大小需要小于3GB不得上传未经授权的他人作品，以及色情、反动等违法视频</div>
    </div>
    <div class='upload-image'>
      <SingleImage class='single-image'
                   :value.sync='postForm.thumb_pic'
                   @input='upLoadThumbPic'
                   ref='uploadImg' />
      <div class='header-tips'>
        <div>
          <p class='title'>设置视频封面（必填）</p>
          <p class='desc'>建议尺寸：</p>
          <p class='desc'> 图片要求：格式为JPG、PNG</p>
        </div>
      </div>
      <div class='upload-btn'>
        <el-button @click="uploadFile('img')">{{ postForm.thumb_pic ? '更换' : '上传' }}封面</el-button>
      </div>
    </div>
    <el-input type='text'
              class='video-decs'
              show-word-limit
              placeholder='请输入视频标题'
              size='medium'
              v-model='postForm.title'></el-input>
    <el-input type='textarea'
              class='video-text-area'
              show-word-limit
              placeholder='请输入视频简介'
              size='medium'
              :rows='3'
              resize='none'
              v-model='postForm.content'></el-input>
    <el-dialog :visible.sync='dialogVisible'>
      <img width='100%'
           :src='dialogImageUrl'
           alt=''>
    </el-dialog>
  </div>
</template>

<script>
import SingleVideo from '@/components/Upload/SingleVideo';
import SingleImage from '@/components/Upload/SingleImage2';

const videoForm = {
  title: '',
  content: '', // 视频简介
  desc_content: '',
  thumb_pic: '',
  media: [{ media_type: 'video', media_link: '' }]
};
export default {
  components: {
    SingleImage,
    SingleVideo
  },
  data() {
    return {
      postForm: Object.assign({}, videoForm),
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  methods: {
    upLoadThumbVideo(path) {
      setTimeout(() => {
        this.postForm.thumb_pic = this.$refs.uploadVideo.videoPreviwe;
      }, 500);
      this.postForm.media[0].media_link = path;
    },
    upLoadThumbPic(path) {
      this.postForm.thumb_pic = path;
    },
    async uploadOSS(content, type) {
      // eslint-disable-next-line
      const params = await this.$store.dispatch('getOssToken').then(res => {
        return res.data;
      });
      params.file = content;
      params.dir = 'posts/community/' + type;
      // eslint-disable-next-line
      let data = await this.$store.dispatch('setParams', params);
      // eslint-disable-next-line
      let url = this.$store.state.endPoint;
      // eslint-disable-next-line
      let imgPath = url + '/' + data.get('key');
      return this.$store.dispatch('upload', { url, data }).then(res => {
        return { path: imgPath, uid: content.uid };
      });
    },
    uploadFile(type) {
      if (type === 'video') {
        if (this.$refs.uploadVideo) {
          this.$refs.uploadVideo.rmImage();
          this.$refs.uploadVideo.$children[0].$refs['upload-inner'].$refs.input.click();
        }
      } else {
        if (this.$refs.uploadImg) {
          this.$refs.uploadImg.rmImage();
          this.$refs.uploadImg.$children[0].$refs['upload-inner'].$refs.input.click();
        }
      }
    },
    upload(content) {
      this.uploadOSS(content).then(obj => {
        this.editor.cmd.do('insertHTML', `<img src='${obj.path}' width='100%'/>`);
      });
    }
  },
  watch: {
    'postForm.content'(val) {
      if (val) {
        this.postForm.desc_content = this.editor.txt.text().substring(0, 30);
      }
    }
  }
};
</script>

<style lang='less' scoped>
.video {
  .upload-video {
    margin: 20px 0;
    width: 100%;
    padding: 20px;
    border: 1px solid #e4e4e4;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .single-video {
      width: 320px;
      height: 180px;

      /deep/ .video-uploader {
        width: 100%;
        height: 100%;

        .el-upload {
          width: 100%;
          height: 100%;

          .el-upload-dragger {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .icon-video {
      width: 56px;
      height: 56px;
      color: #fff;
    }

    .upload-btn {
      margin-top: 10px;

      .el-button {
        background: #39393b;
        color: #fff;
      }
    }

    .desc {
      margin-top: 10px;
      line-height: 17px;
      color: #929da5;
    }
  }

  .upload-image {
    margin: 20px 0;
    width: 100%;
    border: 1px solid #e4e4e4;
    display: flex;

    .single-image {
      width: 244px;
      height: 126px;

      /deep/ .image-uploader {
        width: 100%;
        height: 100%;

        .el-upload {
          width: 100%;
          height: 100%;

          .el-upload-dragger {
            width: 100%;
            height: 100%;
            background: #eaeaea;
            border-radius: 0;
          }
        }
      }
    }

    .header-tips {
      margin-left: 40px;
      display: flex;
      align-items: center;

      .title {
        margin-bottom: 10px;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
      }

      .desc {
        color: #aaa;
      }
    }

    .upload-btn {
      margin-right: 20px;
      margin-left: auto;
    }
  }

  .upload-btn {
    display: flex;
    align-items: center;

    .el-button {
      border-radius: 17px;
      font-size: 13px;
      padding: 10px 30px;
      border-color: #39393b ;
      //border-radius: 30px;
      //background-color: #ffe000;
      //border-color: #ffe000;
      //color: #333;
    }
  }

  .video-decs {
    margin-bottom: 20px;
  }
}
</style>
