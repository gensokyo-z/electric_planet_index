<template>
  <section class="login">
    <el-dialog class="login-dialog"
               :visible.sync="visible"
               append-to-body
               width="390px">
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      visible: false
    }
  },
  mounted () {
    this.$bus.$on('login', (flag) => {
      this.visible = flag
    })
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>
