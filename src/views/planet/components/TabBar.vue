<template>
  <section class="tab-bar">
    <div class="tab-box">
      <div :class="['tab',{active:active===1}]"
           @click="bindTab('list')">星球列表</div>
      <div :class="['tab',{active:active===2}]"
           @click="bindTab('my')">我加入的</div>
    </div>
    <div class="search-box">
      <svg :class="['icon',{'open':searchFlag}]"
           aria-hidden="true"
           @click="bindSearch">
        <use xlink:href="#iconshouue-sousuo"></use>
      </svg>
      <input type="text"
             :class="{'hidden':!searchFlag}"
             v-model="searchValue"
             @blur="bindBlur"
             @keyup.enter="bindSearch"
             ref="search">
    </div>
  </section>
</template>
<script>
export default {
  name: 'TabBar',
  data () {
    return {
      active: 1,
      searchFlag: false,
      searchValue: ''
    }
  },
  methods: {
    bindTab (type) {
      this.active = type === 'list' ? 1 : 2
      this.$emit('bindTab', type)
    },
    bindSearch () {
      if (this.searchFlag) {
        this.$emit('search', this.searchValue)
      } else {
        this.searchFlag = true
        this.$refs.search.focus()
      }
    },
    bindBlur () {
      this.searchFlag = false
      this.searchValue = ''
    }
  }
}
</script>
<style lang="less" scoped>
.tab-bar {
  padding-right: 40px;
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
    padding-bottom: 20px;
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
.search-box {
  padding-top: 20px;
  position: relative;
  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-30%);
    right: 0;
    width: 35px;
    height: 35px;
    transition: all 0.5s;
    z-index: 1;
  }
  .open {
    right: 300px;
  }
  input {
    text-align: right;
    width: 300px;
    font-size: 28px;
    border-bottom: 1px solid #ccc;
  }
  .hidden {
    opacity: 0;
  }
}
</style>
