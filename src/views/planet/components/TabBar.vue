<template>
  <section class="tab-bar">
    <div class="tab-box">
      <div :class="['tab',{active:active===1}]"
           @click="bindTab('new')">最新</div>
      <!-- <div :class="['tab',{active:active===2}]"
           @click="bindTab('hot')">热门<svg class="icon"
             aria-hidden="true">
          <use xlink:href="#iconshouye-remen"></use>
        </svg></div> -->
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
  display: flex;
  margin-bottom: 20px;
  .tab {
    position: relative;
    margin-right: 30px;
    font-size: 20px;
    line-height: 40px;
    background-color: transparent;
    text-align: center;
    z-index: 1;
    cursor: pointer;
    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -22px;
      width: 20px;
      height: 20px;
    }
    &.active {
      // font-size: 20px;
      color: rgba(0, 0, 0, 0.9);
      font-weight: 700;
      .icon {
        width: 20px;
        height: 20px;
        color: #f1d305;
      }
      &::before {
        content: '';
        position: absolute;
        bottom: 10px;
        z-index: -1;
        width: 100%;
        display: block;
        height: 5px;
        background-color: #ffe000;
        border-radius: 5px;
      }
    }
  }
}
</style>
