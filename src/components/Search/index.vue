<template>
  <section class="search">
    <input type="text"
           placeholder="搜索关键字"
           v-model="keyWord"
           @keyup.enter="getSerch">
    <i class="iconfont iconshouue-sousuo"
       @click="getSerch"></i>
  </section>
</template>
<script>
export default {
  data () {
    return {
      keyWord: ''
    }
  },
  methods: {
    getSerch () {
      this.$emit('getSerch', this.keyWord)
    }
  },
  watch: {
    keyWord: {
      handler (val, old) {
        if (!!old && val === '') {
          this.getSerch()
        }
      },
      deep: true
    }
  },
}
</script>
<style lang="less" scoped >
.search {
  position: relative;
  margin-right: 32px;
  padding: 7px 12px;
  background: #EFF3F7;
  border-radius: 18px;
  // width: 686px;
  // height: 30px;
  .iconfont {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 12px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .hidden {
    display: none;
  }
  input {
    width: 210px;
    font-size: 14px;
    line-height: 18px;
    color: #a6a9b6;
    background-color: #f7f7fa;
    border: none;
    outline: none;
    box-sizing: border-box;
  }
  ::-moz-placeholder {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.25);
  }
  ::-webkit-input-placeholder {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.25);
  }
  :-moz-placeholder {
    /* Firefox 18- */
    font-size: 14px;
    color: rgba(0, 0, 0, 0.25);
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    font-size: 14px;
    color: rgba(0, 0, 0, 0.25);
  }
  :-ms-input-placeholder {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.25);
  }
}
</style>
