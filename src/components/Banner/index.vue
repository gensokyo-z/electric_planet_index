<template>
  <div class='banner-card'>
    <el-carousel height='200px' arrow='never'>
      <el-carousel-item v-for='(item,index) in imgList'
                        :key='index'>
        <img :src='item.image'
             @click='onPreview(index)'>
      </el-carousel-item>
    </el-carousel>
    <el-image-viewer v-if='showViewer'
                     :on-close='closeViewer'
                     :url-list='srcList' />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import { getBanners } from '@/api/index';

export default {
  data() {
    return {
      imgList: [
        // require('@/assets/images/banner.png'),
        // require('@/assets/images/banner.png'),
        // require('@/assets/images/banner.png')
      ],
      srcList: [],
      showViewer: false
    };
  },
  mounted() {
    this.getBanners();
  },
  components: {
    ElImageViewer
  },
  methods: {
    getBanners() {
      getBanners().then(res => {
        res.data[0].image = require('@/assets/images/banner.png');
        this.imgList = res.data;
        // console.log(res);
      });
    },
    onPreview(index) {
      this.showViewer = true;
      let tempImgList = [...this.imgList];
      let temp = [];
      for (let i = 0; i < index; i++) {
        temp.push(tempImgList.shift());
      }
      this.srcList = tempImgList.concat(temp);
    },
    closeViewer() {
      this.showViewer = false;
    }
  }

};
</script>

<style scoped lang='less'>
.banner-card {
  margin-bottom: 12px;
}

.el-carousel__item {
  width: 808px;
  height: 200px;

  img {
    object-fit: cover;
    height: 200px;
  }
}

/deep/ .el-carousel__indicator {
  &.el-carousel__indicator--horizontal {
    .el-carousel__button {
      width: 5px;
      height: 5px;
      border-radius: 50%;
    }
  }

  &.is-active {
    .el-carousel__button {
      background-color: #ed7656;
    }
  }
}

</style>
