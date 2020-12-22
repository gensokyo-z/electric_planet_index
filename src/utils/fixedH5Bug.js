function device() {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  if (isAndroid) return 'android';
  if (isiOS) return 'ios';
}
// body fixe定位，把当前的滚动位置赋值给css的top属性
export function fixedBody() {
  let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px;';
}
// 清除fixed固定定位和top值；并恢复打开弹窗前滚动位置
export function looseBody() {
  let body = document.body;
  body.style.position = 'static';
  let top = body.style.top;
  document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
  body.style.top = '';
}

// 解决H5页面 ios键盘收起后弹出层焦点错位问题
export function fixedFocus() {
  const os = device();
  let timer = null;
  let isReset = true; // 是否归为
  if (os === 'ios') {
    document.body.addEventListener('focusin', () => {
      // 软键盘弹出的事件处理
      isReset = false;
    });
    document.body.addEventListener('focusout', () => {
      timer && clearTimeout(timer);
      // 软键盘收起的事件处理
      isReset = true;
      timer = setTimeout(() => {
        // 当焦点在弹出层的输入框之间切换时先不归位
        if (isReset) {
          window.scroll(0, 0); // 失焦后强制让页面归位
        }
      }, 300);
    });
  } else if (os === 'android') {
    let h = document.documentElement.clientHeight || document.body.clientHeight;
    window.onresize = function() {
      // 键盘弹起与隐藏都会引起窗口的高度发生变化
      let resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (resizeHeight < h) {
        // 当软键盘弹起，在此处操作
        isReset = false;
      } else {
        timer && clearTimeout(timer);
        // 当软键盘收起，在此处操作
        isReset = true;
        timer = setTimeout(() => {
          if (isReset) {
            window.scroll(0, 0); // 失焦后强制让页面归位
          }
        }, 300);
      }
    };
  }
}
