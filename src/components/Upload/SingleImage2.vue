<template>
  <div class="singleImageUpload2 upload-container">
    <el-upload :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      class="image-uploader"
      drag
      action=""
      accept="image/*"
      :http-request="upload">
      <div class="iconfont"
        v-loading="imgFlag">
        <i class="el-icon-plus" />
        <div class="el-upload__text">
          拖拽<em>点击上传</em>题图
        </div>
      </div>
    </el-upload>
    <div v-show="imageUrl.length>0"
      class="image-preview">
      <div v-show="imageUrl.length>1"
        class="image-preview-wrapper">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i class="el-icon-zoom-in"
            @click="previewImg" />
          <i class="el-icon-delete"
            @click="rmImage" />
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible"
      top="10vh">
      <img width="100%"
        :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SingleImageUpload2',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempUrl: '',
      imgFlag: false,
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  computed: {
    imageUrl() {
      return this.value;
    }
  },
  methods: {
    rmImage() {
      this.emitInput('');
    },
    emitInput(val) {
      this.$emit('input', val);
    },
    handleImageSuccess() {
      this.emitInput(this.tempUrl);
    },
    async uploadOSS(content) {
      // eslint-disable-next-line
      const params = await this.$store.dispatch('getOssToken').then(res => {
        return res.data;
      });
      params.file = content.file;
      params.dir = 'posts/community/pic';
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
      this.imgFlag = true;
      this.uploadOSS(content).then(path => {
        this.tempUrl = path;
        this.emitInput(path);
        this.handleImageSuccess();
        this.imgFlag = false;
      });
    },
    previewImg() {
      this.dialogImageUrl = this.imageUrl;
      this.dialogVisible = true;
    }
    // beforeUpload () {
    //   const _self = this
    //   return new Promise((resolve, reject) => {
    //     getToken().then(response => {
    //       const key = response.data.qiniu_key
    //       const token = response.data.qiniu_token
    //       _self._data.dataObj.token = token
    //       _self._data.dataObj.key = key
    //       this.tempUrl = response.data.qiniu_url
    //       resolve(true)
    //     }).catch(() => {
    //       reject(false)
    //     })
    //   })
    // }
  }
};
</script>

<style lang="less" scoped>
.upload-container {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 8px;
  .image-uploader {
    height: 100%;
  }
  .image-preview {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    border: 1px dashed #d9d9d9;
    border-radius: 8px;

    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        border-radius: 8px;
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      cursor: pointer;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-icon-delete,
      .el-icon-zoom-in {
        font-size: 36px;
      }
      i {
        margin-right: 10px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
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
