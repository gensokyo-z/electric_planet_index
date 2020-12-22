import Vue from 'vue'
import Confirm from './Confirm.vue'

/**
 *  1. <confirm :show="true" content="内容" :cancel="" />
 *  let a = this.$confirm({...}); a.hide()
 */

Confirm.API = function(options = {}, confirm, cancel) {
  if (typeof options === 'string') {
    options = {
      content: options
    }
  }
  const confirmInstance = new Vue({
    render: h => {
      return h(Confirm, {
        props: options,
        on: {
          confirm() {
            typeof confirm === 'function' && confirm()
          },
          cancel() {
            typeof cancel === 'function' && cancel()
          },
          hide() {
            hide()
          }
        }
      })
    }
  })
  confirmInstance.$mount()
  document.body.appendChild(confirmInstance.$el)
  function hide() {
    confirmInstance.$destroy()
    document.body.removeChild(confirmInstance.$el)
  }
  let com = confirmInstance.$children[0]
  com.showOuter = true
  return com.hide // 按钮可自定义，暴露一个隐藏的api
}

export default Confirm
