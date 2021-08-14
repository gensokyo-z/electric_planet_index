<template>
  <section class='msg-card'>
    <div class='flex'>
      <img :src='content.avatar' alt=''>
      <PostCard :content='content' />
    </div>
  </section>
</template>

<script>
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
    }
  },
  components: {
    PostCard
  }
};
</script>

<style scoped lang='less'>

</style>
