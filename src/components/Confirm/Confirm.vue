<!--支持内容和底部自定义-->
<template>
  <transition name="fade" @enter="enter" @after-leave="onHide">
    <div class="view-mask view-mask-flex" v-show="showOuter" style="transition-delay: .1s">
      <transition name="scale" @before-leave="onLeave">
        <div class="view-confirm" v-show="showInner">
          <div class="view-confirm-title" v-if="title">{{title}}</div>
          <slot :hide="hide">
            <div class="view-confirm-content" v-html="content"></div>
          </slot>
          <slot name="footer" v-if="!hideFooter">
            <div class="view-confirm-footer">
              <button class="view-confirm-btn cancel" @click="onCancel" v-if="type !== 'alert'">{{cancelText}}</button>
              <button class="view-confirm-btn confirm" @click="onConfirm">{{confirmText}}</button>
            </div>
          </slot>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'confirm',
  model: {
    prop: 'show',
    event: 'hide'
  },
  props: {
    content: String,
    type: {
      type: String,
      default: 'confirm',
      validator: function(value) {
        return ['confirm', 'alert'].indexOf(value) !== -1
      }
    },
    title: String,
    show: Boolean,
    hideFooter: Boolean,
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancel: Function,
    confirm: Function,
    confirmHide: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showInner: false,
      showOuter: false
    }
  },
  methods: {
    enter() {
      this.showInner = true
    },
    onLeave() {
      this.showOuter = false
    },
    onCancel() {
      this.$emit('cancel')
      this.hide()
    },
    onConfirm() {
      this.$emit('confirm', this)
      this.confirmHide && this.hide()
    },
    onHide() {
      this.$emit('hide', false)
    },
    hide() {
      this.showInner = false
    }
  },
  watch: {
    show: function(val) {
      this.showOuter = val
    },
  },
  created() {
    this.showOuter = this.show
  }
}
</script>

<style scoped  lang="less" rel="stylesheet/less">
/* mask */
.view-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.5);
  z-index: 10;
}

.view-mask-flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
/* confirm */
.view-confirm {
  width: 80%;
  background: #FFF;
  border-radius: 4px;
}
.view-confirm-title {
  font-size: 17px;
  color: #333;
  text-align: center;
  line-height: 3;
}
.view-confirm-content {
  padding: 32px 16px;
  font-size: 32px;
}
.view-confirm-footer {
  display: flex;
  justify-content: space-around;
  padding: 10px 20px 20px;
}
.view-confirm-btn {
  width: 0;
  flex: 1;
  border-radius: 8px;
  text-align: center;
  line-height: 60px;
  font-size: 32px;
  color: #FFF;
}
.view-confirm-btn + .view-confirm-btn {
  margin-left: 20px;
}
.view-confirm-btn.cancel {
  background: #FFF;
  border: 1px solid;
  color: #ff7f02;
}
.view-confirm-btn.confirm {
  background: #ff7f02;
}
</style>
