<template>
  <footer class="toolbar">
    <div :class="['item home', {'active': ['index'].includes($route.name)}]"
      @click="jump('index')">
      <svg class="icon"
        aria-hidden="true">
        <use xlink:href="#icontab-shouye-home"></use>
      </svg>
      <div class="txt">首页</div>
    </div>
    <div :class="['item planet', {'active': ['planet'].includes($route.name)}]"
      @click="jump('planet')">
      <svg class="icon"
        aria-hidden="true">
        <use xlink:href="#icontab-shouye-xingqiu"></use>
      </svg>
      <div class="txt">星球</div>
    </div>
    <div class="item new"
      @click="jump('create')">
      <svg class="icon"
        aria-hidden="true">
        <use xlink:href="#icontab-tianjia"></use>
      </svg>
    </div>
    <div :class="['item msg', {'active': ['message'].includes($route.name)}]"
      @click="jump('message')">
      <svg class="icon"
        aria-hidden="true">
        <use xlink:href="#icontab-shouye-xinxi"></use>
      </svg>
      <div class="txt">消息</div>
      <div v-if="msgCount>0"
        class="badge">{{msgCount}}</div>
    </div>
    <div :class="['item mine', {'active': ['mine'].includes($route.name)}]"
      @click="jump('mine')">
      <svg class="icon"
        aria-hidden="true">
        <use xlink:href="#icontab-shouye-wode"></use>
      </svg>
      <div class="txt">我的</div>
    </div>
  </footer>
</template>
<script>
import util from '@/utils/util';
export default {
  name: 'Layout',
  data() {
    return {
      msgCount: 0
    };
  },
  created() {},
  methods: {
    async jump(name) {
      switch (name) {
        case 'index':
          if (this.$route.path === '/index') {
            return;
          }
          this.$router.push('/index');
          break;
        case 'planet':
          if (this.$route.path === '/planet') {
            return;
          }
          this.$router.push('/planet');
          break;
        case 'create':
          let needAuth = false;
          if (!util.getcookie('TOKEN')) {
            await this.$store
              .dispatch('getInfo')
              .then(res => {})
              .catch(err => {
                needAuth = true;
                return console.log(err);
              });
          }
          if (needAuth) return;
          if (this.$route.path === '/creatdoc') {
            return;
          }
          this.$router.push('/creatdoc');
          break;
        case 'message':
          if (this.$route.path === '/message') {
            return;
          }
          this.$router.push('/message');
          break;
        case 'mine':
          if (this.$route.path === '/mine') return;
          this.$router.push('/mine');
          break;
        default:
          // eslint-disable-next-line
          // location.replace(`https://m.kuaidi100.com/${name}${query ? '?' + query : ''}`);
          break;
      }
    }
  }
};
</script>
<style scoped lang="less" rel="stylesheet/less">
.toolbar {
  position: fixed;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 98px;
  padding-top: 14px;
  border-top: 2px solid rgba(0, 0, 0, 0.15);
  background: #fff;
  z-index: 15;
  .item {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgba(0, 0, 0, 0.15);
    font-size: 20px;
    .icon {
      position: relative;
      width: 48px;
      height: 48px;
      color: rgba(0, 0, 0, 0.15);
    }
    &.new .icon {
      align-items: flex-start;
      width: 64px;
      height: 64px;
    }
    &.msg {
      .badge {
        position: absolute;
        top: -10px;
        left: 85px;
        padding: 2px 8px;
        border-radius: 30px;
        font-size: 18px;
        color: #fff;
        background: #ec1917;
      }
    }
  }
  .active {
    color: rgba(0, 0, 0, 0.9);
    .icon {
      color: rgba(0, 0, 0, 0.9);
    }
  }
}
</style>
