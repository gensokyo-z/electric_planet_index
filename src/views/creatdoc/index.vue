<template>
  <section class="new-doc">
    <van-nav-bar title="发布文章"
                 left-arrow
                 fixed
                 placeholder
                 @click-left="goBack">
      <template #right>
        <button :class="['nav-release',{active:readyPost}]"
                @click="savePost">发布</button>
      </template>
    </van-nav-bar>
    <div class="edit-box">
      <div class="title">
        <input type="text"
               placeholder="添加标题"
               v-model="postTitle">
      </div>
      <div class="editor-arae">
        <div id="editor"></div>
        <input type="file"
               accept="image/*"
               name="file"
               multiple="multiple"
               ref="uploadFileImage"
               id="uploadFileImage"
               @change="changeImage"
               style="opacity: 0; width: 0; height: 0;cursor: pointer" />
        <input type="file"
               accept="video/*"
               name="file"
               ref="uploadFileVideo"
               id="uploadFileVideo"
               @change="changeVideo"
               style="opacity: 0; width: 0; height: 0;cursor: pointer" />
      </div>
    </div>
    <div class="footer-box">
      <div class="planet-box">
        <span class="planet"
              @click="openPop('planet')">
          <svg class="icon"
               aria-hidden="true">
            <use xlink:href="#iconfabu-xingqiu"></use>
          </svg>
          <span>{{selPlanet.name}}</span>
          <svg class="icon"
               aria-hidden="true">
            <use xlink:href="#iconfabu-xiala"></use>
          </svg>
        </span>
        <div id="meun"></div>
      </div>
      <div class="tag-list"
           v-show="selTagList.length>0">
        <!-- <p class="title">标签</p> -->
        <div class="tag-box">
          <!-- <p class="tag">标签</p> -->
          <div class="tag"
               v-for="(item, index) in selTagList"
               :key="index">
            <span>
              #&nbsp;{{item.name}}
            </span>
            <svg class="icon"
                 aria-hidden="true"
                 @click="removeTag(index)">
              <use xlink:href="#iconx"></use>
            </svg>
          </div>
        </div>
      </div>
      <!-- <div class="footer-tool">
        <div class="add-tag"
             @click="openPop('tag')">添加标签</div>
        <div id="meun"></div>
      </div> -->
    </div>
    <van-popup v-model="showPop"
               round
               position="bottom"
               :style="{ 'min-height': '30%',height:'auto' }">
      <div class="van-pop">
        <div class="title-box">
          <div class="cancle"
               @click="handleConfirm(false)">取消</div>
          <div class="title">添加{{popTitle}}</div>
          <div class="confirm"
               @click="handleConfirm(true)">确认</div>
        </div>
        <div class="tag-box">
          <span :class="['tag',{active:item.checked}]"
                @click="selectPlanet(item)"
                v-for="(item, index) in planetList"
                :key="index">{{item.name}}</span>
        </div>
        <div class="tag-box"
             v-show="tagList.length>0">
          <span :class="['tag',{active:item.checked}]"
                @click="selectTag(item)"
                v-for="(item, index) in tagList"
                :key="index"
                v-show="item.planet_id === selPlanet.id">#&nbsp;{{item.name}}</span>
        </div>

      </div>
    </van-popup>
    <van-dialog v-model="showLinkDialog"
                title="添加链接"
                :showConfirmButton="false"
                className="link-dialog">
      <div class="edit-box">
        <!-- <div class="item">
          <input type="text"
                 placeholder="请输入文字"
                 v-model="linkName">
        </div> -->
        <div class="item">
          <input type="text"
                 placeholder="请输入链接地址"
                 v-model="link">
        </div>
      </div>
      <div class="btn-box">
        <button class="cancel"
                @click="cancelLinl">取消</button>
        <button class="confirm"
                @click="changeLink">确认</button>
      </div>
    </van-dialog>
  </section>
</template>
<script>

import Vue from 'vue';
import { creatPost } from '@/api/post'
import { getJoinedPlanetList } from '@/api/planet'
import { getTags } from '@/api/tag'
import { fixedBody, looseBody } from '@/utils/fixedH5Bug';
import { NavBar, Popup, Dialog, Divider } from 'vant';
import util from '@/utils/util'
import WangEditor from 'wangeditor';
Vue.use(NavBar);
Vue.use(Popup);
Vue.use(Divider);
export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  data () {
    return {
      showPlaceholder: true,
      showPop: false,
      popType: 'planet',
      postTitle: '',
      editorContent: '', //  存放实例化的wangEditor对象，在多个方法中使用
      planetList: [],
      tagList: [],
      selTagList: [],
      popTitle: '星球',
      selPlanet: { name: '请选择星球' },
      showLinkDialog: false,
      // linkName: '',
      link: '',
      dec_content: ''
    }
  },
  created () {
    this.$nextTick(() => {
      this.createEditor();
      this.initPage()
    })
  },
  computed: {
    readyPost () {
      return this.postTitle && this.editorContent && this.selPlanet.id && this.selTagList.length > 0
    }
  },
  watch: {
    popupVisible (val) {
      if (val) {
        fixedBody();
      } else {
        looseBody();
      }
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    initPage () {
      getJoinedPlanetList().then(res => {
        if (res.code === 200) {
          res.data.forEach(e => { e.checked = false })
          this.planetList = res.data
        }
      })
      getTags().then(res => {
        if (res.code === 200) {
          res.data.forEach(e => { e.checked = false })
          this.tagList = res.data
        }
      })
    },
    createEditor () { // 创建编辑器
      this.editor = new WangEditor('#meun', '#editor');
      this.initEditorConfig(); // 初始化编辑器配置，在create之前
      this.editor.create(); // 生成编辑器
      this.editor.txt.html(''); // 初始化内容
      // $('#account--editor').css('height', 'auto'); // 使编辑器内容区自动撑开，在css中定义min-height
    },
    initEditorConfig () { // 初始化编辑器配置
      // this.editor.customConfig.onblur = () => { }
      // this.editor.customConfig.onfocus = () => {      }
      this.editor.customConfig.menus = [
        'image', 'video', 'link',
      ]
      // console.log(this.editor.customConfig);
      // 关闭粘贴样式的过滤
      this.editor.customConfig.pasteFilterStyle = false;
      // 忽略粘贴内容中的图片
      this.editor.customConfig.pasteIgnoreImg = true;
      // 使用 base64 保存图片
      this.editor.customConfig.uploadImgShowBase64 = true;
      // 隐藏“网络图片”tab
      this.editor.customConfig.showLinkImg = true;
      // 改变z-index
      this.editor.customConfig.zIndex = 0;
      // 最大300M
      this.editor.customConfig.uploadImgMaxSize = 300 * 1024 * 1024
      this.editor.customConfig.customUploadImg = function (files, insert) {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        // 上传代码返回结果之后，将图片插入到编辑器中
        // insert(imgUrl)
      }
      this.editor.customConfig.onchange = (html) => { this.editorContent = html };
      // this.editor.customConfig.uploadImgServer = this.dataInterface.editorUpImgUrl; // 图片上传地址
      // this.editor.customConfig.uploadFileName = 'yourFileName'
      // this.editor.customConfig.uploadImgParams = {
      //   token: 'abcdef12345'
      // }
      setTimeout(() => {
        this.seteditor()
      }, 100);
    },
    getEditorContent () { // 获取编辑器 内容区内容
      this.editorContent = this.editor.txt.html(); // 获取 html 格式
      this.dec_content = this.editor.txt.text()// 获取  获取纯文本
      // this.editor.$txt.text();  // 获取纯文本
      // this.editor.$txt.formatText();  // 获取格式化后的纯文本
    },
    seteditor () {
      /**
        基本的参数配置
      **/

      // 给菜单栏中的视频icon绑定相应的点击事件
      this.editor.$toolbarElem[0].childNodes[0].onclick = () => {
        // childNodes 跟随着菜单栏变化
        this.$refs.uploadFileImage.click() // 触发input的上传
      }
      this.editor.$toolbarElem[0].childNodes[1].onclick = () => {
        // childNodes 跟随着菜单栏变化
        this.$refs.uploadFileVideo.click() // 触发input的上传
      }
      this.editor.$toolbarElem[0].childNodes[2].onclick = (e) => {
        // childNodes 跟随着菜单栏变化
        // this.$refs.uploadFileVideo.click() // 触发input的上传
        this.showLinkDialog = true
      }
    },
    async uploadOSS (content) {
      // eslint-disable-next-line
      let params = await this.$store.dispatch('getOssToken').then(res => {
        return res.data;
      });
      params.file = content.file;
      params.dir = 'post_h5/';
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
    async changeVideo () {
      // 上传视频方法
      // 拿到后端返回的视频地址
      let videoFile = { file: this.$refs.uploadFileVideo.files[0] }
      await this.uploadOSS(videoFile).then(path => {
        // 将上传成功的视频地址插入富文本
        this.editor.cmd.do('insertHTML', `<video src="${path}"  width="100%" controls="controls"></video>`) // 插入视频
      });
    },
    async changeImage () {
      let imgFileList = this.$refs.uploadFileImage.files
      for (let i of imgFileList) {
        let imgFile = { file: i }
        await this.uploadOSS(imgFile).then(path => {
          this.editor.cmd.do('insertHTML', `<img src="${path}" width="100%"/>`) // 插入视频
        });
      }
      // await this.uploadOSS(imgFile).then(path => {
      //   this.editor.cmd.do('insertHTML', `<img src="${path}" width="100%"/>`) // 插入视频
      // });
    },
    selectTag (item) {
      if (this.selTagList.length > 3) {
        return this.$toast('标签最多选择3个')
      }
      item.checked = !item.checked
    },
    selectPlanet (item) {
      this.planetList.forEach(e => {
        if (e.checked) {
          e.checked = false
        }
      })
      this.tagList.forEach(e => {
        if (e.checked) {
          e.checked = false
        }
      })
      this.selTagList = []
      this.selPlanet = item
      item.checked = true
    },
    handleConfirm (flag) {
      if (flag) {
        this.selTagList = []
        this.tagList.forEach(e => {
          if (e.checked) {
            this.selTagList.push(e)
          }
        })
      }
      this.showPop = false
    },
    removeTag (index) {
      this.selTagList.splice(index, 1)
    },
    cancelLinl () {
      this.link = ''
      // this.linkName = ''
      this.showLinkDialog = false
    },
    changeLink () {
      // if (!this.linkName) {
      //   return this.$toast('请输入链接文字')
      // }
      // eslint-disable-next-line
      let reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/
      if (!reg.test(this.link)) {
        return this.$toast('请输入正确的链接地址')
      }
      this.editor.cmd.do('insertHTML', `<a href="${this.link}" target="_blank">${this.link}</a>`) // 插入视频
      this.showLinkDialog = false
    },
    openPop (type) {
      this.popType = type
      if (type === 'planet') {
        this.popTitle = '星球'
        if (this.planetList.length === 0) {
          this.$toast('请加入星球后再发表文章！')
          this.$router.push('/planet')
        }
      } else {
        if (this.planetList.length === 0) {
          this.$toast('请加入星球后再发表文章！')
          this.$router.push('/planet')
        } else if (!this.selPlanet.id) {
          return this.$toast('请先选择星球')
        }
        this.popTitle = '标签'
      }
      this.showPop = true
    },
    savePost () {
      if (!this.readyPost) {
        if (!this.postTitle) {
          return this.$toast('请填写标题')
        } else if (!this.editorContent) {
          return this.$toast('请填写正文内容')
        } else if (!this.selPlanet.id) {
          return this.$toast('请选择星球')
        } else if (this.selTagList.length === 0) {
          return this.$toast('请选择标签')
        }
      }
      let tag_id = []
      this.selTagList.forEach(e => {
        tag_id.push(e.id)
      })
      this.editorContent += `<p style="padding:0.4rem;border:1px solid #ccc;line-height:1.2em;color:#999">信息来源于网络，本平台予以链接仅为传递信息之目的，不代表本平台立场。本平台不对文章信息准确性、完整性和及时性做任何保证，亦不对因信赖文章信息引发的任何损失承担任何责任。<p>`
      const obj = {
        source: 'user',
        title: this.postTitle,
        content: this.editorContent,
        thumb_pic: util.getFirstImg(this.editorContent),
        thumb_video: util.getFirstVideo(this.editorContent),
        planet_id: this.selPlanet.id,
        tag_id: tag_id,
        dec_content: this.dec_content
      }
      creatPost(obj).then(res => {
        if (res.code === 200) {
          this.$toast('新建文章成功')
          this.$router.push(`//planetdetail?id=${this.selPlanet.id}`)
          this.editorContent = ''
          this.editor.txt.html('')
          this.postTitle = ''
        }
      })
    }
  },

}
</script>
<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
