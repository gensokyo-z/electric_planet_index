<template>
  <section class="input-item">
    <van-overlay :show="showShare"
      @click="openShowShare"
      z-index="10000">
      <div class="wrapper"
        @click.stop>
        <ShareContent :content="content"
          :showShare="showShare" />
      </div>
    </van-overlay>
  </section>
</template>
<script>
import Vue from 'vue';
import { Overlay } from 'vant';
import ShareContent from './ShareContent';
import util from '@/utils/util';
Vue.use(Overlay);
export default {
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ShareContent
  },
  data() {
    return {
      showShare: false
    };
  },
  methods: {
    async openShowShare() {
      let needAuth = false;
      if (!util.getcookie('TOKEN')) {
        await this.$store
          .dispatch('getInfo')
          .then(res => {})
          .catch(err => {
            needAuth = true;
            return console.log(err);
          });
      }
      if (needAuth) return;
      this.showShare = false;
    }
  }
};
</script>
<style lang="less" scoped>
.van-overlay {
  display: flex;
  align-items: center;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  z-index: 100000;
}
</style>
