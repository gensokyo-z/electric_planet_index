<template>
  <div class="createPost-container">
    <Header />
    <el-form ref="postForm"
             :model="postForm"
             :rules="rules"
             class="form-container">
      <div class="createPost-main-container">
        <div class="bg">
          <el-button size="mini">发布文章</el-button>
        </div>
        <div class="layout-content">
          <div class="editer-box">
            <div id="meun"></div>
            <SingleImage class="single-image"
                         :value.sync="postForm.thumb_pic"
                         @input="upLoadThumbPic" />
            <el-row style="width: 750px;margin: 0 100px;">
              <el-col :span="24">
                <el-form-item style="margin-bottom: 20px;"
                              prop="title">
                  <MDinput v-if="postForm.source!=='微博'"
                           v-model="postForm.title"
                           :maxlength="100"
                           name="name"
                           required>
                    请在这里输入标题
                  </MDinput>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item prop="content"
                          style="margin: 0 100px;">

              <div id="editor"></div>
              <input id="uploadFileVideo"
                     ref="uploadFileVideo"
                     type="file"
                     accept="video/*"
                     name="file"
                     style="opacity: 0; width: 0; height: 0;cursor: pointer"
                     @change="changeVideo" />
            </el-form-item>
          </div>
          <div class="planet-tag">
            <el-form-item prop="planet_id"
                          class="bind-planet">
              <p>发布到星球</p>
              <el-radio-group v-model="postForm.planet_id">
                <el-radio v-for="(item, index) in planetList"
                          :key="index"
                          :label="item.id">{{ item.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="tag_id"
                          class="bind-tag">
              <p>添加标签</p>
              <el-checkbox-group v-model="postForm.tag_id">
                <el-checkbox v-for="(item, index) in tagList"
                             v-show="postForm.planet_id === item.planet_id"
                             :key="index"
                             :label="item.id">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>

      </div>
    </el-form>
  </div>
</template>

<script>
import wangeditor from 'wangeditor';
import { getPlanetList } from '@/api/planet';
import { getTagList } from '@/api/tag';
import MDinput from '@/components/MDinput';
import SingleImage from '@/components/Upload/SingleImage2';
import { addPosts, editPosts, getPostsDetail } from '@/api/post';
import util from '@/utils/util';
const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  thumb_pic: '',
  thumb_video: '',
  planet_id: '',
  tag_id: [],
  id: undefined,
  url: '',
  source: 'user',
  create_time: '',
  keywords: '',
  desc_content: '',
  editor: null
};

export default {
  name: 'ArticleDetail',
  components: {
    MDinput,
    SingleImage
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      status: 'draft',
      postForm: Object.assign({}, defaultForm),
      html: '',
      loading: false,
      userListOptions: [],
      rules: {},
      tempRoute: {},
      planetList: [],
      tagList: [],
      editor: null
    };
  },
  computed: {
    contentShortLength () {
      return this.postForm.content_short.length;
    },
    lang () {
      return this.$store.getters.language;
    },
    oss () {
      return this.$store.getters.oss;
    }
  },
  created () {
    // eslint-disable-next-line
    // if ((this.isEdit && this.$route.params && this.$route.params.id) || this.$route.query.spider) {
    //   let id = null;
    //   let type = '';
    //   if (this.$route.params && this.$route.params.id !== '0') {
    //     id = this.$route.params.id;
    //     type = 'params';
    //   } else if (this.$route.query.spider) {
    //     id = this.$route.query.spider;
    //     type = 'spider';
    //   }
    //   this.fetchData(id, type);
    // }
    this.tempRoute = Object.assign({}, this.$route);
    if (JSON.stringify(this.oss) === '{}') {
      this.$store.dispatch('oss/getOssToken');
    }
    this.$nextTick(() => {
      this.createEditor();
    });
  },
  mounted () {
    this.init();
  },
  beforeDestroy () {
    // 销毁编辑器
    this.editor.destroy();
    this.editor = null;
  },
  methods: {
    createEditor () {
      // 创建编辑器
      // eslint-disable-next-line new-cap
      this.editor = new wangeditor('#meun', '#editor');
      this.initEditorConfig(); // 初始化编辑器配置，在create之前
      this.editor.create(); // 生成编辑器
      this.editor.txt.html(''); // 初始化内容
    },
    initEditorConfig () {
      // 初始化编辑器配置
      // this.editor.config.onblur = () => {}
      // this.editor.config.onfocus = () => {}
      this.editor.config.placeholder = '请输入文章内容';
      // 关闭粘贴样式的过滤
      this.editor.config.pasteFilterStyle = false;
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
        this.upload(files[0]);
      };
      this.editor.config.onchange = html => {
        this.postForm.content = html;
      };
      setTimeout(() => {
        this.seteditor();
      }, 100);
    },
    seteditor () {
      // 给菜单栏中的视频icon绑定相应的点击事件
      this.editor.$toolbarElem.elems[0].childNodes[17].onclick = e => {
        e.stopPropagation();
        e.preventDefault();
        // childNodes 跟随着菜单栏变化
        this.$refs.uploadFileVideo.click(); // 触发input的上传
      };
    },
    init () {
      getTagList({ page: 1, per_page: 200 })
        .then(response => {
          if (response.code === 200) {
            this.tagList = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
      getPlanetList()
        .then(response => {
          if (response.code === 200) {
            this.planetList = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    upLoadThumbPic (path) {
      this.postForm.thumb_pic = path;
    },
    async uploadOSS (content) {
      // eslint-disable-next-line
      const params = await this.$store.dispatch('oss/getOssToken').then(res => {
        return res.data;
      });
      params.file = content;
      params.dir = 'posts/';
      // eslint-disable-next-line
      let data = await this.$store.dispatch('oss/setParams', params);
      // eslint-disable-next-line
      let url = this.$store.state.oss.endPoint;
      // eslint-disable-next-line
      let imgPath = url + '/' + data.get('key');
      return this.$store.dispatch('oss/upload', { url, data }).then(res => {
        return imgPath;
      });
    },
    upload (content) {
      this.uploadOSS(content).then(path => {
        this.editor.cmd.do('insertHTML', `<img src="${path}" width="100%"/>`);
      });
    },
    clearImg (str) {
      return str.replace(/<img.+?src=/g, '<img src=');
    },
    fetchData (id, type) {
      if (type === 'params') {
        getPostsDetail(id).then(res => {
          if (res.code === 200) {
            const tag_id = [];
            for (const i of res.data.related_tags) {
              tag_id.push(i.tag_id);
            }
            res.data.tag_id = tag_id;
            res.data.content = this.clearImg(res.data.content);
            this.postForm = res.data;
            // this.postForm.content = ``
            // 编辑器方法
            this.editor.txt.html(this.postForm.content);
          }
        });
      }
    },
    submitForm () {
      if (this.postForm.source !== '微博' && this.postForm.title.length === 0) {
        this.$message({
          message: '请填写标题',
          type: 'warning'
        });
        return;
      }
      if (this.postForm.content.length === 0) {
        this.$message({
          message: '请填写正文内容',
          type: 'warning'
        });
        return;
      }
      if (!this.postForm.planet_id) {
        this.$message({
          message: '请选择星球',
          type: 'warning'
        });
        return;
      }
      // this.$refs.postForm.validate(valid => {

      // if (valid) {
      this.loading = true;
      this.postForm.active = 1;
      if (!this.postForm.thumb_pic) {
        this.postForm.thumb_pic = util.getFirstImg(this.postForm.content);
      }
      if (!this.postForm.thumb_video) {
        this.postForm.thumb_video = util.getFirstVideo(this.postForm.content);
      }
      if (this.postForm.id) {
        const obj = {
          title: this.postForm.title,
          content: this.postForm.content,
          thumb_pic: this.postForm.thumb_pic,
          thumb_video: this.postForm.thumb_video,
          planet_id: this.postForm.planet_id,
          tag_id: this.postForm.tag_id,
          desc_content: this.postForm.desc_content,
          source: this.postForm.source,
          id: this.postForm.id,
          url: this.postForm.url,
          create_time: this.postForm.create_time,
          keywords: this.postForm.keywords
        };
        editPosts(this.postForm.id, obj).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: '修改文章成功',
              type: 'success',
              duration: 2000
            });
            this.$store.dispatch('user/setCacha', []);
            this.loading = false;
            this.$router.push('/docmanage/index');
          } else {
            this.loading = false;
          }
        });
      } else {
        if (!this.postForm.desc_content) {
          this.postForm.desc_content = this.postForm.content;
        }
        this.postForm.content += `<p style="padding:0.4rem;border:1px solid #ccc;line-height:1.2em;color:#999">信息来源于网络，本平台予以链接仅为传递信息之目的，不代表本平台立场。本平台不对文章信息准确性、完整性和及时性做任何保证，亦不对因信赖文章信息引发的任何损失承担任何责任。<p>`;
        if (!this.postForm.thumb_pic) {
          this.postForm.thumb_pic = util.getFirstImg(this.postForm.content);
        }
        if (!this.postForm.thumb_video) {
          this.postForm.thumb_video = util.getFirstVideo(this.postForm.content);
        }
        addPosts(this.postForm).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            });
            this.$store.dispatch('user/setCacha', []);
            this.loading = false;
            this.$router.push('/docmanage/index');
          } else {
            this.loading = false;
          }
        });
      }
      // } else {
      //   console.log('error submit!!');
      //   return false;
      // }
      // });
    },
    async changeVideo () {
      const videoFile = { file: this.$refs.uploadFileVideo.files[0] };
      await this.uploadOSS(videoFile.file).then(path => {
        this.editor.execCommand('insertHTML', `<video src="https:${path}"  controls="controls"></video>`); // 插入视频
      });
    }
  }
};
</script>

<style lang="less" scoped>
.createPost-container {
  margin-top: 100px;
  position: relative;
  .createPost-main-container {
    position: relative;
    margin: 0 auto;
    width: 1200px;
    display: flex;
    justify-content: space-around;
    .bg {
      width: 100%;
      height: 40px;
      top: 0;
      position: absolute;
      background-color: #d0d0d0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-button {
        margin-right: 20px;
        padding: 10px 10px;
        height: 30px;

        background-color: #13ce66;
        border-color: #13ce66;
        color: #fff;
        font-size: 14px;
        line-height: 10px;
        border-radius: 4px;
        &:hover {
          background: #42d885;
          border-color: #42d885;
        }
      }
    }
  }
}
.layout-content {
  margin-top: 100px;
  position: relative;
  .planet-tag {
    position: absolute;
    top: 100px;
    right: -200px;
    width: 280px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    border-top: 1px solid #e0e0e0;
    .el-radio {
      margin-bottom: 20px;
    }
    .bind-planet {
      padding: 0 20px 20px 20px;
      border-bottom: 1px solid #e0e0e0;
    }
    .bind-tag {
      padding: 0 20px 20px 20px;
      display: flex;
      height: 270px;
      overflow: auto;
    }
  }
}

.app-wrapper {
  overflow: hidden !important;
}
.single-image {
  width: 750px;
  margin: 0 auto;
  /deep/ .image-uploader {
    width: 100%;
    .el-upload {
      width: 100%;
      .el-upload-dragger {
        width: 100%;
      }
    }
  }
}
#editor {
  min-height: 500px;
  max-width: 750px;
  border: 1px solid #ccc;
}
.w-e-toolbar {
  position: fixed;
  top: 100px;
  // left: 9%;
  background-color: #d0d0d0;
}
</style>
