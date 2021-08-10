<template>
  <section class='msg-card'>
    <div class='flex'>
      <img :src='content.avatar' alt=''>
      <PostCard :content='content' />
    </div>
  </section>
</template>

<script>
import { getReplys } from '@/api/user';
import PostCard from './PostCard';

export default {
  name: 'MsgCard',
  props: {
    content: {
      type: Object,
      default: () => {
        return {};
      }
    },
    tag: {
      type: String,
      default: ''
    }
  },
  methods: {
    goUrl(url) {
      this.$router.push(url);
    },
    getData() {
      let path = null;
      switch (this.tag) {
        case 'HFWD':
          path = getReplys;
          break;
        default:
          break;
      }
      path().then(
        res => {

        }
      );
    }

  },
  components: {
    PostCard
  }
};
</script>

<style scoped lang='less'>

</style>
