<template>
  <section class="tab-bar">
    <div class="tab-box">
      <div :class="['tab',{active:active===1}]"
           @click="bindTab('doc')">帖子</div>
      <!-- <div :class="['tab',{active:active===2}]"
           @click="bindTab('about')">关于</div>
      <div :class="['tab',{active:active===3}]"
           @click="bindTab('meun')">菜单</div> -->
    </div>
  </section>
</template>
<script>
export default {
  name: 'PlanetTabBar',
  data () {
    return {
      active: 1,
    }
  },
  methods: {
    bindTab (type) {
      switch (type) {
        case 'doc':
          this.active = 1
          break;
        case 'about':
          this.active = 2
          break;
        case 'meun':
          this.active = 3
          break;
        default:
          break;
      }
      this.$emit('bindTab', type)
    }
  }
}
</script>
<style lang="less" scoped>
.tab-bar {
  padding-right: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
}
.tab-box {
  padding: 40px 0 5px 30px;
  display: flex;
  .tab {
    position: relative;
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    font-size: 32px;
    color: rgba(0, 0, 0, 0.45);
    &:not(:nth-of-type(1)) {
      margin-left: 57px;
    }
    &.active {
      color: rgba(0, 0, 0, 0.9);
      &::after {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -5px;
        width: 48px;
        height: 5px;
        border-radius: 2px;
        background-color: #f1d305;
        content: '';
      }
    }
  }
}
</style>
