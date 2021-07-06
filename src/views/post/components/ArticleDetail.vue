<template>
  <div class='createPost-container'>
    <div class='tab-bar'>
      <div class='title'>发布</div>
      <div class='post-layout'>
        <div class='left'>
          <label>选择发布类型：</label>
          <div class='type-box'>
            <div :class="['item',{'active':item.checked}]"
                 v-for='(item,index) in typeList'
                 :key='index'
                 @click='selectType(item)'>{{ item.name }}
            </div>
          </div>
        </div>
        <div class='right'>
          <label>选择星球社区：</label>
          <div class='type-box'
               v-if='planetList.length>0'>
            <div :class="['item',{'active':item.checked}]"
                 v-for='(item,index) in planetList'
                 :key='index'
                 @click='selectPlant(item)'>{{ item.name }}
            </div>
          </div>
          <p class='tips'
             v-else>未加入任何星球，先去<span @click="$router.push('/planet')">星球社区逛逛&gt;&gt;&gt;</span></p>
        </div>
      </div>
    </div>
    <component :is='type'
               :key='type'
               :ref='type'></component>
    <div class='tag'>
      <label>关联的标签({{ tagId.length }}/6)：</label>
      <div class='tag-box'>
        <div :class="['item',{'active':item.checked}]"
             v-for='(item,index) in tagList'
             :key='index'
             @click='selectTag(item)'>#{{ item.name }}
        </div>
      </div>
    </div>
    <el-button class='submit'
               size='mini'
               @click='submitForm'>发布
    </el-button>
  </div>
</template>

<script>
import { getPlanetTags } from '@/api/planet';
import Dynamic from './dynamic';
import Article from './article';
import Video from './video';
import { addPosts } from '@/api/post';
// import util from '@/utils/util';
export default {
  name: 'ArticleDetail',
  components: {
    Dynamic,
    Article,
    Video
  },
  data() {
    return {
      postForm: {},
      planetList: [],
      planetId: '',
      tagList: [],
      tagId: [],
      type: 'Dynamic',
      typeList: [
        { name: '动态', value: 'Dynamic', type: 0, checked: true },
        { name: '文章', value: 'Article', type: 1, checked: false },
        { name: '视频', value: 'Video', type: 2, checked: false }
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch('getUserPlanetList').then(response => {
        if (response.length > 0) {
          let fristPlant = response.findIndex(e => e.name === '星球总部');
          if (fristPlant !== -1) {
            let tempItem = [];
            tempItem.push(response[fristPlant]);
            response.splice(fristPlant, 1);
            response = [...tempItem, ...response];
          }
          response.forEach((e, i) => {
            e.checked = i === 0;
          });
          this.planetList = response;
          this.planetId = response[0].id;
          getPlanetTags(response[0].id).then(response => {
            if (response.code === 200) {
              response.data.forEach(e => {
                e.checked = false;
              });
              this.tagList = response.data;
            }
          }).catch(error => {
            console.log(error);
          });
        }
      }).catch(error => {
        console.log(error);
      });
    },
    // initDate() {
    //   let now = new Date();
    //   return util.formatDate(now, 'y-m-d');
    // },
    selectType(item) {
      this.typeList.forEach(e => {
        e.checked = e.value === item.value;
      });
      this.type = item.value;
    },
    selectPlant(item) {
      this.planetId = item.id;
      this.tagList = [];
      this.planetList.forEach(e => {
        e.checked = e.id === item.id;
      });

      getPlanetTags(item.id).then(res => {
        if (res.code === 200) {
          this.tagId = [];
          this.tagList = res.data;
        }
      });
    },
    selectTag(item) {
      if (this.tagId.length < 6) {
        this.tagId = [];
        item.checked = !item.checked;
        this.tagList.forEach(e => {
          if (e.checked) {
            this.tagId.push(e.id);
          }
        });
      } else {
        this.$alert('一次最多选择6个标签');
      }
    },
    submitForm() {
      if (this.planetList.length === 0) {
        this.$message.warning('未加入任何星球社区，请先关注星球社区');
        return;
      }
      this.postForm = this.$refs[this.type].postForm;
      switch (this.type) {
        case 'Dynamic':
          if (!this.postForm.content) {
            this.$message.warning('请输入动态');
            return;
          }
          break;
        case 'Article':
          if (!this.postForm.title) {
            this.$message.warning('请文章标题');
            return;
          } else if (!this.postForm.content) {
            this.$message.warning('请输入文章正文');
            return;
          }
          break;
        case 'Video':
          if (!this.postForm.media[0].media_link) {
            this.$message.warning('请上传视频');
            return;
          } else if (!this.postForm.thumb_pic) {
            this.$message.warning('请上传视频封面');
            return;
          } else if (!this.postForm.title) {
            this.$message.warning('请输入视频标题');
            return;
          } else if (!this.postForm.content) {
            this.$message.warning('请输入视频简介');
            return;
          }
          break;
        default:
          break;
      }
      if (!this.planetId) {
        this.$message.warning('请选择星球');
        return;
      }
      this.loading = true;
      const obj = {
        type: this.typeList.find(e => e.value === this.type).type,
        content: this.postForm.content,
        planet_id: this.planetId,
        tag_id: this.tagId,
        desc_content: this.postForm.desc_content,
        source: 'user'
      };
      switch (this.type) {
        case 'Dynamic':
          obj.media = this.postForm.media;
          break;
        case 'Article':
          obj.title = this.postForm.title;
          obj.thumb_pic = this.postForm.thumb_pic;
          break;
        case 'Video':
          obj.media = this.postForm.media;
          if (!/planetoss.oss/.test(this.postForm.thumb_pic)) {
            let baseUrl = this.postForm.thumb_pic;
            let fileObj = this.base64ToFile(baseUrl);
            this.uploadOSS(fileObj, 'pic').then(path => {
              obj.thumb_pic = path;
            });
          } else {
            obj.thumb_pic = this.postForm.thumb_pic;
          }
          obj.title = this.postForm.title;
          break;
        default:
          break;
      }
      addPosts(obj).then(res => {
        if (res.code === 200) {
          let str = this.typeList.find(e => e.value === this.type).name;
          this.$message.success(`发布${str}成功`);
          this.loading = false;
          this.$router.push('/index');
        } else {
          this.loading = false;
        }
      });
    },
    base64ToFile(dataurl) {
      function dataURLtoFile(dataurl) {
        // 将base64转换为文件
        var arr = dataurl.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], 'name', {
          type: mime
        });
      }

      return dataURLtoFile(dataurl);
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
        return imgPath;
      });
    }
  }
};
</script>

<style lang='less' scoped>
.createPost-container {
  position: relative;
  // position: relative;
  // margin: 0 auto;
  // width: 1200px;
  // display: flex;
  // flex-direction: column;
  // justify-content: space-around;
  // .layout-content {
  //   margin: 20px 0;
  //   position: relative;
  //   min-height: 500px;
  // }
  padding-top: 20px;

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

    .post-layout {
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

      .tips {
        font-size: 16px;

        span {
          cursor: pointer;
          color: rgb(75, 120, 255);
        }
      }
    }
  }

  .tag {
    margin-top: 15px;
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
        line-height: 16px;
        color: #333;
        cursor: pointer;

        &:not(:nth-last-child(1)) {
          margin-right: 20px;
        }

        &.active {
          color: rgb(136, 165, 255);
        }
      }
    }
  }

  .submit {
    position: absolute;
    right: 0;
    bottom: 0;
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
}
</style>
