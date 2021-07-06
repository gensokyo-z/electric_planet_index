<template>
  <div class='article'>
    <div class='upload-header'>
      <SingleImage class='single-image'
                   :value.sync='postForm.thumb_pic'
                   @input='upLoadThumbPic'
                   ref='upload' />
      <div class='
        header-tips'>
        <div>
          <p class='title'>设置文章封面（选填）</p>
          <p class='desc'>封面上传规格要求：</p>
          <p class='desc'>格式为JPG , JPEG , GIF 或者png. 大小 10MB以内.</p>
        </div>
      </div>
      <div class='upload-btn'>
        <el-button @click='uploadFile'>{{ postForm.thumb_pic ? '更换' : '上传' }}封面</el-button>
      </div>
    </div>
    <div class='editer-box'>
      <div class='title' ref='affixRef'>
        <MDinput v-if="postForm.source!=='微博'"
                 v-model='postForm.title'
                 :maxlength='100'
                 name='name'
                 required>
          请在这里输入标题
        </MDinput>
      </div>
      <div id='meun' ref='wrapperRef'></div>
      <div id='editor'></div>
      <input id='uploadFileVideo'
             ref='uploadFileVideo'
             type='file'
             accept='video/*'
             name='file'
             style='opacity: 0; width: 0; height: 0;cursor: pointer'
             @change='changeVideo' />
    </div>
  </div>
</template>

<script>
import wangeditor from 'wangeditor';
import MDinput from '@/components/MDinput';
import SingleImage from '@/components/Upload/SingleImage2';

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  thumb_pic: '',
  desc_content: ''
};
export default {
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      editor: null,
      top: 50
    };
  },
  components: {
    MDinput,
    SingleImage
  },
  created() {
    this.$nextTick(() => {
      this.createEditor();
    });
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.setTop();
  },
  watch: {
    'postForm.content'(val) {
      if (val) {
        this.postForm.desc_content = this.editor.txt.text().substring(0, 30);
      }
    }
  },
  methods: {
    createEditor() {
      // 创建编辑器
      // eslint-disable-next-line new-cap
      this.editor = new wangeditor('#meun', '#editor');
      this.initEditorConfig(); // 初始化编辑器配置，在create之前
      this.editor.create(); // 生成编辑器
      this.editor.txt.html(''); // 初始化内容
    },
    initEditorConfig() {
      // 初始化编辑器配置
      // this.editor.config.onblur = () => {}
      // this.editor.config.onfocus = () => {}
      this.editor.config.placeholder = '请输入文章内容';
      // 关闭粘贴样式的过滤
      this.editor.config.pasteFilterStyle = true;
      // 忽略粘贴内容中的图片
      this.editor.config.pasteIgnoreImg = false;
      // 使用 base64 保存图片
      this.editor.config.uploadImgShowBase64 = false;
      // 隐藏“网络图片”tab
      this.editor.config.showLinkImg = false;
      // 改变z-index
      this.editor.config.zIndex = 1;
      // 最大300M
      this.editor.config.uploadImgMaxSize = 300 * 1024 * 1024;
      this.editor.config.customUploadImg = (files, insert) => {
        for (let i of files) {
          this.upload(i);
        }
      };
      this.editor.config.onchange = html => {
        this.postForm.content = html;
      };
      setTimeout(() => {
        this.seteditor();
      }, 100);
    },
    seteditor() {
      // 给菜单栏中的视频icon绑定相应的点击事件
      this.editor.$toolbarElem.elems[0].childNodes[18].onclick = e => {
        e.stopPropagation();
        e.preventDefault();
        // childNodes 跟随着菜单栏变化
        this.$refs.uploadFileVideo.click(); // 触发input的上传
      };
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
    uploadFile() {
      if (this.$refs.upload) {
        this.$refs.upload.rmImage();
        this.$refs.upload.$children[0].$refs['upload-inner'].$refs.input.click();
      }
    },
    upload(content) {
      this.uploadOSS(content).then(obj => {
        this.editor.cmd.do('insertHTML', `<img src='${obj.path}' width='100%'/>`);
      });
    },

    async changeVideo() {
      const videoFile = { file: this.$refs.uploadFileVideo.files[0] };
      await this.uploadOSS(videoFile.file).then(obj => {
        this.editor.cmd.do('insertHTML', `<video src='https:${obj.path}'  controls='controls'></video>`); // 插入视频
      });
    },
    handleScroll() {
      if (window.scrollY > this.top - 50) {
        const {
          top,
          bottom,
          left,
          right
        } = this.$refs.wrapperRef.getBoundingClientRect();
        this.$refs.wrapperRef.style.width = right - left + 'px';
        this.$refs.wrapperRef.style.height = bottom - top + 'px';
        this.$refs.wrapperRef.style.left = left + 'px';
        this.$refs.wrapperRef.style.top = 50 + 'px';
        this.$refs.wrapperRef.style.position = 'fixed';
      } else {
        this.$refs.wrapperRef.style.position = 'static';
      }
    },
    setTop() {
      if (window.scrollY === 0) {
        this.top = this.$refs.affixRef.getBoundingClientRect().top;
        // 挂载时若窗口滚动不为 0，先滚动至 0
      } else {
        const { scrollX, scrollY } = window;
        window.scrollTo(scrollX, 0);
        this.top = this.$refs.affixRef.getBoundingClientRect().top;
        window.scrollTo(scrollX, scrollY);
      }
    }
  },
  beforeDestroy() {
    // 销毁编辑器
    this.editor.destroy();
    this.editor = null;
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style lang='less' scoped>
.article {
  .upload-header {
    margin: 20px 0;
    width: 100%;
    height: 150px;
    padding: 10px 20px;
    border: 1px solid #e4e4e4;
    display: flex;

    .single-image {
      width: 230px;
      height: 130px;

      /deep/ .image-uploader {
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

    .header-tips {
      margin-left: 50px;
      display: flex;
      align-items: center;

      .title {
        margin-bottom: 10px;
        font-size: 16px;
      }

      .desc {
        color: #aaa;
      }
    }

    .upload-btn {
      margin-left: 400px;
      display: flex;
      align-items: center;

      .el-button {
        border-radius: 30px;
        background-color: #ffe000;
        border-color: #ffe000;
        color: #333;

        &:hover {
          background: #ffec5d;
          border-color: #ffec5d;
        }
      }
    }
  }

  .editer-box {
    .title {
      margin-bottom: 20px;
    }

    #meun {
      position: static;
      top: 20px;
      margin: 0 auto 10px auto;
      // margin-bottom: 10px;

    }

    #editor {
      height: 500px;
      width: 750px;
      margin: 0 auto;
      border: 1px solid #ccc;
    }

    .w-e-toolbar {
      // position: fixed;
      // top: 50px;
      // left: 9%;
      background-color: #d0d0d0;
    }
  }
}
</style>
