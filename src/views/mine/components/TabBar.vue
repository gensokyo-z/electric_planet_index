<template>
  <section class="tab-bar">
    <div class="tab-box">
      <div :class="['tab',{active:active===1}]"
           @click="bindTab('dynamic')">动态
        <span class="data">{{dynamicCount}}</span>
      </div>
      <div :class="['tab',{active:active===2}]"
           @click="bindTab('participate')">参于
        <span class="data">{{msgCount}}</span>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'TabBar',
  props: {
    type: {
      type: String,
      default: 'dynamic'
    },
    dynamicCount: {
      type: Number,
      default: () => 0
    },
    msgCount: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      active: 1,
    }
  },
  methods: {
    bindTab (type) {
      this.active = type === 'dynamic' ? 1 : 2
      this.$emit('bindTab', type)
    }
  }
}
</script>
<style lang="less" scoped>
.tab-bar {
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
    padding: 0 20px 20px 0;
    display: flex;
    align-items: center;
    font-size: 32px;
    color: rgba(0, 0, 0, 0.45);
    &:nth-of-type(2) {
      margin-left: 57px;
    }
    &.active {
      color: rgba(0, 0, 0, 0.9);
      &::after {
        position: absolute;
        left: 40%;
        transform: translateX(-50%);
        bottom: -5px;
        width: 48px;
        height: 5px;
        border-radius: 2px;
        background-color: #f1d305;
        content: '';
      }
    }
    .data {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      text-align: left;
      left: 80px;
      padding-bottom: 10px;
      font-size: 29px;
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
