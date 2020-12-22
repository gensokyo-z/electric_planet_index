<template>
  <section class="tab-bar">
    <div class="tab-box">
      <div :class="['tab',{active:active===1}]"
           @click="bindTab('new')">最新</div>
      <div :class="['tab',{active:active===2}]"
           @click="bindTab('hot')"><svg class="icon"
             aria-hidden="true">
          <use xlink:href="#iconshouye-remen"></use>
        </svg>热门</div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'TabBar',
  data () {
    return {
      active: 1
    }
  },
  methods: {
    bindTab (type) {
      this.active = type === 'new' ? 1 : 2
      this.$emit('bindTab', type)
    }
  }
}
</script>
<style lang="less" scoped>
.tab-box {
  margin: 40px 0 0 32px;
  display: flex;
  .tab {
    position: relative;
    padding-bottom: 8px;
    display: flex;
    align-items: center;
    font-size: 28px;
    color: rgba(0, 0, 0, 0.45);
    &:nth-of-type(2) {
      margin-left: 80px;
    }
    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -30px;
      width: 24px;
      height: 28px;
    }
    &.active {
      font-size: 32px;
      color: rgba(0, 0, 0, 0.9);
      .icon {
        width: 28px;
        height: 32px;
        color: #f1d305;
      }
      &::after {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -5px;
        width: 48px;
        height: 4px;
        border-radius: 2px;
        background-color: #f1d305;
        content: '';
      }
    }
  }
}
</style>
