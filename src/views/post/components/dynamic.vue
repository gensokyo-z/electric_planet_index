<template>
  <div class="dynamic">
    <el-input type="textarea"
      class="dynamic-text-area"
      show-word-limit
      placeholder="分享关于你关于电动星球的人/车/生活"
      size="medium"
      :rows="5"
      resize="none"
      v-model='postForm.content'></el-input>
    <div class="upload-box">
      <div class="preview-upload">
        <el-upload action="#"
          class="preview"
          list-type="picture-card"
          multiple
          accept="image/*"
          :limit="9"
          :on-remove="handleRemove"
          :on-exceed="exceed"
          :file-list="previewList"
          :http-request="uploadDynamic">
          <i slot="default"
            class="el-icon-plus">
          </i>
          <div class="el-upload__text">添加图片{{previewList.length}}/9</div>
          <div slot="file"
            slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail"
              :src="file.url">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span class="el-upload-list__item-delete"
                @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%"
        :src="dialogImageUrl"
        alt="">
    </el-dialog>
  </div>
</template>

<script>
const dynamicForm = {
  content: '', // 文章内容
  desc_content: '',
  media: []
};
export default {
  data() {
    return {
      postForm: Object.assign({}, dynamicForm),
      previewList: [],
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  methods: {
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
    uploadDynamic(content) {
      this.uploadOSS(content.file, 'dynamic').then(obj => {
        this.previewList.push({ url: obj.path, uid: obj.uid });
      });
    },
    handleRemove(file) {
      let index = this.previewList.findIndex(e => e.uid === file.uid);
      this.previewList.splice(index, 1);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    exceed() {
      this.$alert('一次最多上传9张图片');
    }
  },
  watch: {
    previewList(val) {
      if (val.length > 0) {
        this.postForm.media = [];
        val.forEach(e => {
          this.postForm.media.push({ media_type: 'pic', media_link: e.url });
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
  }
};
</script>

<style  lang="less" scoped>
.dynamic {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  .preview-upload {
    margin-top: 20px;
    .preview {
      /deep/ .el-upload {
        position: relative;
        .el-upload__text {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 100%;
          padding-top: 28px;
        }
      }
      /deep/ .el-upload-list {
        .el-upload-list__item {
          > div {
            height: 100%;
            img {
              position: relative;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              max-width: 100%;
              max-height: 100%;
              width: unset;
              height: unset;
            }
          }
        }
      }
    }
  }
}
</style>
