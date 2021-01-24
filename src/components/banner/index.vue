<template>
  <div class="banner-card">
    <el-carousel height="200px">
      <el-carousel-item v-for="(item,index) in imgList"
                        :key="index">
        <img :src="item"
             @click="onPreview(index)">
      </el-carousel-item>
    </el-carousel>
    <el-image-viewer v-if="showViewer"
                     :on-close="closeViewer"
                     :url-list="srcList" />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  data () {
    return {
      imgList: [
        require('../../assets/images/banner-1.png'), require('../../assets/images/banner-2.png')
      ],
      srcList: [],
      showViewer: false,
    }
  },
  components: {
    ElImageViewer
  },
  methods: {
    onPreview (index) {
      this.showViewer = true
      let tempImgList = [...this.imgList];
      let temp = [];
      for (let i = 0; i < index; i++) {
        temp.push(tempImgList.shift());
      }
      this.srcList = tempImgList.concat(temp);
    },
    closeViewer () {
      this.showViewer = false
    },
  }

}
</script>

<style scoped  lang="less" >
.banner-card {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
.el-carousel__item {
  width: 300px;
  height: 200px;
  border-radius: 8px;
}
</style>
