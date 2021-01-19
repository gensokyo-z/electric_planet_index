<template>
  <section class="msg-card">
    <Dynamic v-if="type === 'dynamic'"
             :content="content" />
    <Message :subType="subType"
             :content="content"
             v-else />
  </section>
</template>
<script>
export default {
  name: 'MsgCard',
  props: {
    type: {
      type: String,
      default: ''
    },
    subType: {
      type: String,
      default: ''
    },
    content: {
      type: Object,
      default: () => { }
    },
  },
  data () {
    return {
    }
  },
  methods: {

  },
  computed: {
  },
  components: {
    Dynamic: () => import('./components/Dynamic'),
    Message: () => import('./components/Message')
  }
}
</script>
<style scoped src='./index.less' lang="less" rel="stylesheet/less">
</style>
