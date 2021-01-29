<template>
  <section class="input-item">
    <div class="wrapper">
      <ShareContent :content="content"
        :showShare="showShare"
        v-show="showShare" />
    </div>
  </section>
</template>
<script>
import ShareContent from './ShareContent';
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
    checkAuth(cb) {
      this.$store.dispatch('needAuth', cb);
    },
    async openShowShare(flag) {
      this.checkAuth(() => {
        this.showShare = flag;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.input-item {
  position: absolute;
  right: 0;
  bottom: 30px;
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
