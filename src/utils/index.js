// 公共
// import jsoncom from 'jsoncom';
// const comJson = jsoncom.company;

// 防抖
export function debounce(func, wait = 300, immediate = true) {
  let timer = null;
  const _debounce = function(...args) {
    const context = this;
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate) {
      if (!timer) {
        // null
        func.apply(this, args);
      }
      timer = setTimeout(() => {
        timer = null;
      }, wait);
    } else {
      timer = setTimeout(() => {
        func.apply(context, args);
        timer = null;
      }, wait);
    }
  };
  _debounce.cancel = function() {
    clearTimeout(timer);
    timer = null;
  };
  return _debounce;
}

// 节流
/**
 *
 * @param {func} Function
 * @param {wait} time
 * @param {*} options
 */
export function throttle(func, wait = 300, options = {}) {
  let timer = null;

  const _throttle = function(...args) {
    const context = this;
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(context, args);
        timer = null;
      }, wait);
    }
  };
  return _throttle;
}

/**
 * 格式化时间
 * @param {new Date()} date
 * @param {String} pattern
 * @returns {boolean}
 */
// dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
export function dateFormat(date, pattern = 'yyyy-MM-dd') {
  const SIGN_REGEXP = /([yMdHsm])(\1*)/g;
  const padding = (s, len) => {
    const myLen = len - (s + '').length;
    for (let i = 0; i < myLen; i++) {
      s = '0' + s;
    }
    return s;
  };
  return pattern.replace(SIGN_REGEXP, function($0) {
    switch ($0.charAt(0)) {
      case 'y':
        return padding(date.getFullYear(), $0.length);
      case 'M':
        return padding(date.getMonth() + 1, $0.length);
      case 'd':
        return padding(date.getDate(), $0.length);
      case 'w':
        return date.getDay() + 1;
      case 'H':
        return padding(date.getHours(), $0.length);
      case 'm':
        return padding(date.getMinutes(), $0.length);
      case 's':
        return padding(date.getSeconds(), $0.length);
    }
  });
}

// // 查询快递公司
// export function mapKuaidiCom(com) {
//   let tempCom = '';
//   comJson.forEach(value => {
//     if (value.number === com) {
//       tempCom = value.name;
//       return false;
//     }
//   });
//   return tempCom;
// }
