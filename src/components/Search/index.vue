<template>
  <section class="search">
    <!-- <svg class="icon keyWord"
         aria-hidden="true">
      <use xlink:href="#iconshouue-sousuo"></use>
    </svg> -->
    <input type="text"
           placeholder="Tesal"
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
  margin: 12px 30px 12px 0;
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
    padding: 0 35px 0 20px;
    width: 320px;
    height: 100%;
    font-size: 14px;
    line-height: 26px;
    color: #a6a9b6;
    background-color: #f7f7fa;
    border: none;
    border-radius: 15px;
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
