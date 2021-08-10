<template>
  <div class='createPost-container'>
    <div class='tab-bar'>
      <div class='title'>发布{{ typeName }}</div>
      <div class='select-planet' @click='togglePlanet'>
        <label>选择社区</label>
        <img class='stroke' src='@/assets/images/stroke.png' alt=''>
      </div>
      <div class='type-box' v-show='visiblePlanet'>
        <div :class="['item',{'active':item.checked}]"
             v-for='(item,index) in planetList'
             :key='index'
             @click='selectPlant(item)'>
          <img :src='item.avatar' alt=''>
          <span>{{ item.name }}</span>
        </div>
      </div>
      <el-button class='cache' size='mini'>保存到草稿箱</el-button>
      <el-button class='submit' size='mini' @click='submitForm(false)'>发布</el-button>
    </div>
    <component :is='type'
               :key='type'
               :ref='type' class='component'></component>
    <div class='tag'>
      <div class='tag-left flex-v'>
        <label>标签</label>&emsp;
        <span>{{ tagId.length }}／6 </span>
        <a>添加标签</a>
        <div class='more flex-v' @click='toggleMore'>
          <span>更多</span>
          <img src='@/assets/images/stroke.png' alt='' :class='{more:toggleMoreFlag}'></div>
      </div>
      <div :class="['tag-box',{show:toggleMoreFlag}]">
        <div :class="['item',{'active':item.checked}]"
             v-for='(item,index) in tagList'
             :key='index'
             @click='selectTag(item)'>
          <img src='@/assets/images/tag2.png' alt=''>
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <el-dialog :visible='submitVisible'
               top='40vh'
               width='422px'
               append-to-body
               :show-close='false'
               class='submitDialog'>
      <div class='title'>
        <span>确认发布</span>
        <img src='@/assets/images/Close_Square.png' alt='' @click='closeDialog'>
      </div>
      <div class='desc'>
        <p>您未选择发布的社区</p>
        <p>继续发布将发布到综合社区，也可返回选择发布社区</p>
      </div>
      <div class='flex-cc btn-box'>
        <el-button @click='closeDialog'>选择发布社区</el-button>
        <el-button @click='submitForm(true)'>继续发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPlanetTags } from '@/api/planet';
import Dynamic from './Dynamic';
import Article from './Article';
import Video from './Video';
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
      ],
      toggleMoreFlag: false,
      visiblePlanet: false,
      submitVisible: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch('getUserPlanetList').then(res => {

        if (res.length > 0) {
          let fristPlant = res.findIndex(e => e.name === '星球总部');
          if (fristPlant !== -1) {
            let tempItem = [];
            tempItem.push(res[fristPlant]);
            res.splice(fristPlant, 1);
            res = [...tempItem, ...res];
          }
          res.forEach((e, i) => {
            e.checked = i === 0;
          });
          this.planetList = res;
          this.planetId = res[0].id;
          getPlanetTags({ id: res[0].id }).then(({ code, data }) => {
            if (code === 200) {
              data.forEach(e => {
                e.checked = false;
              });
              this.tagList = data;
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
    selectType(value) {
      this.typeList.forEach(e => {
        e.checked = e.value === value;
      });
      this.$router.replace(`/post?type=${value}`);
      this.type = value;
    },
    selectPlant(item) {
      this.togglePlanet();
      this.planetId = item.id;
      this.tagList = [];
      this.planetList.forEach(e => {
        e.checked = e.id === item.id;
      });
      getPlanetTags({ id: item.id }).then(({ code, data }) => {
        if (code === 200) {
          this.tagId = [];
          this.tagList = data;
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
        const index = this.tagId.indexOf(item.id);
        if (index !== -1) {
          item.checked = !item.checked;
          this.tagId.splice(1, index);
        } else {
          this.$alert('一次最多选择6个标签');
        }
      }
    },
    toggleMore() {
      this.toggleMoreFlag = !this.toggleMoreFlag;
    },
    togglePlanet() {
      this.visiblePlanet = !this.visiblePlanet;
    },
    closeDialog() {
      this.submitVisible = false;
    },
    submitForm(flag) {
      if (!flag && this.planetList.length === 0) {
        this.submitVisible = true;
        // this.$message.warning('未加入任何星球社区，请先关注星球社区');
        return;
      }
      const { postForm } = this.$refs[this.type];
      this.postForm = postForm;
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
      addPosts(obj).then(({ code }) => {
        if (code === 200) {
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
        let arr = dataurl.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
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
      return this.$store.dispatch('upload', { url, data }).then(() => {
        return imgPath;
      });
    }
  },
  computed: {
    typeName() {
      return this.typeList.filter(e => e.checked)[0].name;
    }
  },
  watch: {
    $route: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.selectType(val.query.type);
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang='less' scoped>
.createPost-container {
  margin-top: 20px;
  padding: 40px 80px;
  width: 1120px;
  background: #fff;
  min-height: calc(100vh - 144px);

  .tab-bar {
    position: relative;
    display: flex;
    align-items: center;
    padding-bottom: 30px;
    border-bottom: 4px solid #39393b;;

    .title {
      margin-right: 20px;
      color: #191919;
      font-size: 24px;
      line-height: 34px;
    }

    .select-planet {
      display: flex;
      align-items: center;
      cursor: pointer;

      > label {
        font-size: 16px;
        line-height: 22px;
        color: #929da5;
        cursor: pointer;
      }

      .stroke {
        margin-left: 4px;
        height: 16px;
        width: 16px;
        cursor: pointer;
      }
    }

    .type-box {
      width: 200px;
      position: absolute;
      left: 114px;
      top: 48px;
      display: flex;
      flex-direction: column;
      padding: 20px 10px;
      background: #fff;
      filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25));
      z-index: 1;

      :before {
        position: absolute;
        top: -8px;
        left: 25px;
        content: '';
        width: 0;
        height: 0;
        transform: rotateZ(45deg);
        border-top: 8px solid #fff;
        border-left: 8px solid #fff;
        border-right: 8px solid transparent;
        border-bottom: 8px solid transparent;
      }

      .item {
        display: flex;
        align-items: center;
        cursor: pointer;

        > img {
          margin-right: 4px;
          width: 32px;
          height: 32px;
        }

        &:not(:nth-last-child(1)) {
          margin-bottom: 20px;
        }

        &:hover {
          background: #eee;
        }
      }

    }
  }

  .tag {
    margin-top: 15px;
    font-size: 16px;
    color: #333;
    display: flex;
    flex-direction: column;

    .tag-left {
      > label {
        font-size: 16px;
        line-height: 22px;
        color: #191919;
      }

      > span {
        font-size: 16px;
        line-height: 22px;
        color: #929da5;
      }

      > a {
        font-size: 16px;
        margin-left: 10px;
        line-height: 22px;
        color: #ed7656;
        cursor: pointer;
      }

      .more {
        margin-left: auto;
        color: #8992a3;
        font-size: 12px;
        cursor: pointer;

        > img {
          width: 16px;
          height: 16px;
          transition: transform 250ms;
          transform: rotateZ(90deg);
        }

        .more {
          transform: rotateZ(-90deg);
        }
      }
    }

    .tag-box {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      overflow: hidden;
      height: 48px;

      &.show {
        height: unset
      }

      .item {
        padding: 6px 12px;
        margin-bottom: 20px;
        color: #5c6573;
        font-size: 12px;
        background: #f5f5f5;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;

        > img {
          margin-right: 2px;
          width: 16px;
          height: 16px;
        }

        &:not(:nth-last-child(1)) {
          margin-right: 10px;
        }

        &.active {
          color: #fff;
          background: #ed7656;
        }
      }
    }
  }

  .cache, .submit {
    padding: 10px 42px;
    font-size: 13px;
    border-radius: 17px;

  }

  .cache {
    margin-left: auto;
    color: #39393b;
    border: 1px solid #39393b
  }

  .submit {
    margin-left: 20px;
    background: #39393b;
    color: #fff;

    &:hover {
      background: #848484;
    }
  }
}

.submitDialog {
  /deep/ .el-dialog {
    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      padding: 40px 36px;

      .title {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        > span {
          font-weight: 600;
          font-size: 26px;
          line-height: 36px;
          color: #191919;
        }

        > img {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }

      .desc {
        margin-bottom: 40px;
        font-size: 14px;
        line-height: 180%;
        color: #5c6573;
      }

      .btn-box {
        > :first-child {
          background: #39393b;
          color: #fff;
        }

        .el-button {
          width: 169px;
          padding: 14px 36px;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
