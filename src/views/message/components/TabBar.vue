<template>
  <section class="tab-bar">
    <div class="layout">
      <div class="menu-box">
        <el-menu default-active="1"
                 active-text-color="#333"
                 text-color="#c5c5c5"
                 ref="menu">
          <el-menu-item index="1"
                        @click="bindTab('dynamic','')">
            <i class="iconfont iconxingqiu"></i>
            <span slot="title"
                  class="title">动态</span>
          </el-menu-item>
          <el-submenu index="2"
                      @click="bindTab('msg')">
            <template slot="title">
              <i class="el-icon-message"></i>
              <span slot="title"
                    class="title">消息</span>
            </template>
            <span slot="title"></span>
            <el-menu-item index="2-1"
                          @click="bindTab('msg','fans')">粉丝</el-menu-item>
            <el-menu-item index="2-2"
                          @click="bindTab('msg','awesome')">点赞</el-menu-item>
            <el-menu-item index="2-3"
                          @click="bindTab('msg','appoint')">@我的</el-menu-item>
            <el-menu-item index="2-4"
                          @click="bindTab('msg','review')">评论</el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- <div :class="['tab',{active:active===1}]"
           @click="bindTab('dynamic')">动态
        <span class="badge"
              v-show="dynamicCount>0">{{dynamicCount}}</span>
      </div>
      <div :class="['tab',{active:active===2}]"
           @click="bindTab('msg')">消息
        <span class="badge"
              v-show="msgCount>0">{{msgCount}}</span>
      </div> -->
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
    }
  },
  methods: {
    bindTab (type, subType) {
      this.$emit('bindTab', type, subType)
    },
  },
  mounted () {
    if (this.$refs.menu) {
      this.$refs.menu.open('2')
    }
  }
}
</script>
<style lang="less" scoped>
.tab-bar {
  width: 100%;
  margin: 0 auto;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
}
.layout {
  width: 1500px;
  margin: 0 auto;
  .menu-box {
    width: 120px;
    padding: 40px 0 5px 30px;
    display: flex;
    flex-direction: column;
    .iconxingqiu {
      vertical-align: middle;
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
    }
    .el-submenu .el-menu-item {
      min-width: unset;
    }
    /deep/ .el-submenu {
      .el-submenu__title {
        .el-submenu__icon-arrow {
          display: none;
        }
      }
    }

    // .tab {
    //   width: 5em;
    //   padding: 10px 20px;
    //   display: flex;
    //   align-items: center;
    //   font-size: 18px;
    //   color: rgba(0, 0, 0, 0.45);
    //   // border: 1px solid #ccc;
    //   &.active {
    //     color: rgba(0, 0, 0, 0.9);
    //   }
    //   .badge {
    //     position: absolute;
    //     top: -10px;
    //     left: 60px;
    //     padding: 2px 8px;
    //     border-radius: 30px;
    //     font-size: 18px;
    //     color: #fff;
    //     background: #ec1917;
    //   }
    // }
  }
}
</style>
