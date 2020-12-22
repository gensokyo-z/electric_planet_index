<template>
  <section class="search">
    <svg :class="['icon',{hidden:keyWord}]"
         aria-hidden="true">
      <use xlink:href="#iconshouue-sousuo"></use>
    </svg>
    <input type="text"
           placeholder="请输入关键字搜索"
           v-model="keyWord"
           @keyup.enter="getSerch">
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
  margin: 20px 32px;
  width: 686px;
  height: 80px;
  .icon {
    position: absolute;
    top: 50%;
    margin-top: -23px;
    left: 25%;
    width: 36px;
    height: 36px;
  }
  .hidden {
    display: none;
  }
  input {
    width: 100%;
    height: 80px;
    background: #f5f5f7;
    font-size: 28px;
    border-radius: 8px;
    text-align: center;
  }
  ::-moz-placeholder {
    font-size: 28px;
    color: rgba(0, 0, 0, 0.25);
  }
  ::-webkit-input-placeholder {
    font-size: 28px;
    color: rgba(0, 0, 0, 0.25);
  }
  :-moz-placeholder {
    /* Firefox 18- */
    font-size: 28px;
    color: rgba(0, 0, 0, 0.25);
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    font-size: 28px;
    color: rgba(0, 0, 0, 0.25);
  }
  :-ms-input-placeholder {
    font-size: 28px;
    color: rgba(0, 0, 0, 0.25);
  }
}
</style>
