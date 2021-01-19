<template>
  <section class="tab-bar">
    <div class="tab-box">
      <div :class="['tab',{active:active===1}]"
           @click="bindTab('dynamic')">动态
        <span class="badge"
              v-show="dynamicCount>0">{{dynamicCount}}</span>
      </div>
      <div :class="['tab',{active:active===2}]"
           @click="bindTab('msg')">消息
        <span class="badge"
              v-show="msgCount>0">{{msgCount}}</span>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'TabBar',
  props: {
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
  margin-bottom: 32px;
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
    .badge {
      position: absolute;
      top: -10px;
      left: 60px;
      padding: 2px 8px;
      border-radius: 30px;
      font-size: 18px;
      color: #fff;
      background: #ec1917;
    }
  }
}
</style>
