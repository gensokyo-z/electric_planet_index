<template>
  <div class="createPost-container">
    <Header />
    <el-form ref="postForm"
             :model="postForm"
             :rules="rules"
             class="form-container">
      <div class="createPost-main-container">
        <div class="layout-content">
          <div class="tab-bar">
            <div class="title">发布</div>
            <div class="layout">
              <div class="left">
                <label>选择发布类型：</label>
                <div class="type-box">
                  <div :class="['item',{'active':item.checked}]"
                       v-for="(item,index) in typeList"
                       :key="index">{{item.name}}</div>
                </div>
              </div>
              <div class="right">
                <label>选择星球社区：</label>
                <div class="type-box">
                  <div :class="['item',{'active':item.checked}]"
                       v-for="(item,index) in planetList"
                       :key="index">{{item.name}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="dt"
               v-show="type === 'dt'">
            <el-input type="textarea"
                      show-word-limit
                      placeholder="分享关于你关于电动星球的人/车/生活"
                      size="medium"
                      :rows="5"
                      resize="none"
                      v-model="dt"></el-input>
          </div>
          <div v-show="type === 'wz'">
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
          </div>
          <div v-show="type==='sp'">
          </div>
          <div class="tag">
            <label>关联的标签({{postForm.tag_id.length}}/6)：</label>
            <div class="tag-box">
              <div :class="['item',{'active':item.checked}]"
                   v-for="(item,index) in tagList"
                   :key="index">#{{item.name}}</div>
            </div>
          </div>
          <el-button class="submit"
                     size="mini"
                     @click="submitForm">发布</el-button>
        </div>
      </div>
    </el-form>
    <!-- <div class="planet-tag">
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
          </div> -->
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
  desc_content: ''
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
      postForm: Object.assign({}, defaultForm),
      html: '',
      loading: false,
      rules: {},
      planetList: [],
      tagList: [],
      editor: null,
      dt: '',
      type: 'dt',
      typeList: [
        { name: '动态', value: 'dt', checked: true },
        { name: '文章', value: 'wz', checked: false },
        { name: '视频', value: 'sp', checked: false },
      ]
    };
  },
  created () {
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
    seteditor () {
      // 给菜单栏中的视频icon绑定相应的点击事件
      this.editor.$toolbarElem.elems[0].childNodes[18].onclick = e => {
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
            response.data.forEach(e => {
              e.checked = false
            })
            this.tagList = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
      getPlanetList()
        .then(response => {
          if (response.code === 200) {
            response.data.forEach(e => {
              e.checked = false
            })
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
      const params = await this.$store.dispatch('getOssToken').then(res => {
        return res.data;
      });
      params.file = content;
      params.dir = 'posts/community';
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
      // this.postForm.active = 1;
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
          create_time: this.postForm.create_time
          // keywords: this.postForm.keywords
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
        this.postForm.create_time = this.initDate();
        this.postForm.create_at = this.initDate();
        if (!this.postForm.desc_content) {
          this.postForm.desc_content = this.editor.txt.text(); // 获取  获取纯文本
          this.postForm.desc_content = this.postForm.desc_content.substr(0, 140);
        }
        this.postForm.content += `<p style="padding:0.4rem;border:1px solid #ccc;line-height:1.2em;color:#999">信息来源于网络，本平台予以链接仅为传递信息之目的，不代表本平台立场。本平台不对文章信息准确性、完整性和及时性做任何保证，亦不对因信赖文章信息引发的任何损失承担任何责任。<p>`;
        if (!this.postForm.thumb_pic) {
          this.postForm.thumb_pic = util.getFirstImg(this.postForm.content);
        }
        if (!this.postForm.thumb_video) {
          this.postForm.thumb_video = util.getFirstVideo(this.postForm.content);
        }
        const obj = {
          title: this.postForm.title,
          content: this.postForm.content,
          thumb_pic: this.postForm.thumb_pic,
          thumb_video: this.postForm.thumb_video,
          planet_id: this.postForm.planet_id,
          desc_content: this.postForm.desc_content,
          source: 'user'
          // create_time: this.postForm.create_time,
          // create_at: this.postForm.create_at
        };
        if (this.postForm.tag_id) {
          obj.tag_id = this.postForm.tag_id;
        }
        addPosts(obj).then(res => {
          if (res.code === 200) {
            this.$message.success('发布文章成功');
            // this.$store.dispatch('user/setCacha', []);
            this.loading = false;
            this.$router.push('/');
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
    },
    initDate () {
      let now = new Date()
      return util.formatDate(now, 'y-m-d');
    }
  }
};
</script>

<style lang="less" scoped>
.createPost-container {
  margin-top: 50px;
  position: relative;
  .createPost-main-container {
    position: relative;
    margin: 0 auto;
    width: 1200px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .layout-content {
      margin: 20px 0;
      position: relative;
    }
    .tab-bar {
      display: flex;
      flex-direction: column;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
      .title {
        margin-bottom: 20px;
        font-size: 26px;
        color: #333;
      }
      .layout {
        display: flex;
        justify-content: space-between;
        font-size: 20px;
        color: #333;
        .left,
        .right {
          display: flex;
          align-items: center;
        }
        .type-box {
          display: flex;
          align-items: center;
          .item {
            padding: 3px 20px;
            font-size: 15px;
            line-height: 20px;
            border-radius: 45px;
            background-color: #f2f2f2;
            color: #333;
            cursor: pointer;
            &:not(:nth-last-child(1)) {
              margin-right: 20px;
            }
            &.active {
              background-color: #ffe000;
              border-color: #ffe000;
            }
            &:hover {
              background: #ffec5d;
              border-color: #ffec5d;
            }
          }
        }
      }
    }
    .tag {
      margin-top: 20px;
      width: 80%;
      font-size: 16px;
      color: #333;
      display: flex;
      flex-direction: column;
      .tag-box {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        .item {
          margin-bottom: 10px;
          color: #333;
          cursor: pointer;
          &:not(:nth-last-child(1)) {
            margin-right: 20px;
          }
          &.active {
            color: royalblue;
          }
        }
      }
    }
  }
}
.dt{
  margin-top: 20px;
}
.submit {
  position: absolute;
  right: 0;
  margin-top: 20px;
  padding: 10px 30px;
  font-weight: 700;
  font-size: 20px;
  border-radius: 45px;
  background-color: #ffe000;
  border-color: #ffe000;
  color: #333;
  &:hover {
    background: #ffec5d;
    border-color: #ffec5d;
  }
}
.single-image {
  width: 750px;
  height: 350px;
  margin: 0 auto;
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
#editor {
  min-height: 500px;
  max-width: 750px;
  border: 1px solid #ccc;
}
.w-e-toolbar {
  // position: fixed;
  // top: 50px;
  // left: 9%;
  background-color: #d0d0d0;
}
</style>
