<template>
  <transition name="fade" @enter="enter">
    <div class="view-mask" v-if="show" @click="maskClick" :style="{zIndex: zindex}">
      <transition name="slide" @before-leave="beforeLeave">
        <div class="view-actionsheet" :style="{height: height || 'auto'}" v-show="innerShow" @click.stop>
          <slot name="head" v-if="showHeader">
            <div class="view-actionsheet-head">
              <div class="view-actionsheet-btn left" :style="{color: leftBtn.color}" v-if="leftBtn.show !== false" @click="cancel">{{leftBtn.text || '取消'}}</div>
              <div class="view-actionsheet-title">{{title}}</div>
              <div class="view-actionsheet-btn right" :style="{color: rightBtn.color}" v-if="rightBtn.show !== false" @click="confirm">{{rightBtn.text || '确定'}}</div>
            </div>
          </slot>
          <div class="view-actionsheet-body">
            <slot :hide="hide"></slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'action-sheet',
  model: {
    prop: 'value',
    event: 'close'
  },
  props: {
    value: Boolean,
    title: String,
    height: String,
    zindex: {
      type: Number,
      default: 10
    },
    maskClosable: Boolean,
    autoHide: Boolean, // 确定后自动关闭
    showHeader: {
      type: Boolean,
      default: true
    },
    leftBtn: {
      type: Object,
      default: function() {
        return {}
      }
    },
    rightBtn: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      show: false,
      innerShow: false
    }
  },
  methods: {
    maskClick() {
      this.maskClosable && this.cancel()
    },
    cancel() {
      this.$emit('cancel', this)
      this.hide()
    },
    confirm() {
      this.$emit('confirm', this)
      this.autoHide && this.hide() // 回调函数return false不会自动关闭
    },
    hide() {
      this.innerShow = false
      this.$emit('close', false)
    },
    enter() {
      this.innerShow = true
    },
    beforeLeave() {
      this.show = false
    }
  },
  watch: {
    value: function(value) {
      if (value) {
        this.show = true
      } else {
        this.hide()
      }
    }
  },
  mounted() {
    this.show = this.value
  }
}
</script>
