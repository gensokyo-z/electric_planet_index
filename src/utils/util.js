/* eslint-disable */
const ua = navigator.userAgent.toLowerCase();
let util = {
  getcookie(name) {
    let arr;
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if ((arr = document.cookie.match(reg))) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  },
  // 设置生命周期COOKIE
  setcookie(cookieName, cookieValue, cookieExpire = 2592000, domain = '.ddxq.tech') {
    // cookieExpire的单位为秒
    let expires = new Date();
    let now = parseInt(expires.getTime());
    now += cookieExpire * 1000;
    expires.setTime(now);
    let str = escape(cookieName) + '=' + escape(cookieValue) + ';expires=' + expires.toGMTString() + '; path=/';
    if (domain) {
      str += ';domain=' + domain;
    }
    document.cookie = str;
  },
  delcookie(name) {
    this.setcookie(name, '', -1);
  },
  resetcookie(name) {
    this.setcookie(name, '');
  },
  getStorage(name) {
    let value = null;
    try {
      value = JSON.parse(localStorage.getItem(name));
    } catch (e) {}
    return value;
  },
  setStorage(name, value) {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch (e) {}
  },
  getSession(name) {
    let value = null;
    try {
      value = JSON.parse(sessionStorage.getItem(name));
    } catch (e) {}
    return value;
  },
  setSession(name, value) {
    try {
      sessionStorage.setItem(name, JSON.stringify(value));
    } catch (e) {}
  },
  query(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return undefined;
  },
  isFunc(obj) {
    return typeof obj === 'function';
  },
  loadScript(src, callback) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.head.appendChild(script);
    script.onload = function() {
      this.isFunc(callback) && callback();
    };
  },
  getLastPage() {
    let history = this.getSession('$localHistory') || [];
    return history.length > 1 ? history[history.length - 2] : null;
  },
  singleClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  defaultAvatar(str) {
    if (str) {
      return str;
    } else {
      return require(`@/assets/images/def_avatar.png`);
    }
  },
  getFirstImg(str) {
    let Reg = /<img/; // 第一张图片
    return Reg.test(str) ? str.match(/<img[^>]+src="([^"]*)/)[1] : '';
  },
  getFirstVideo(str) {
    let Reg = /<video/; // 第一张图片
    return Reg.test(str) ? str.match(/<video[^>]+src="([^"]*)/)[1] : '';
  },
  changeHtml2Crad(html) {
    return html ? html.replace(/<img[^>]*\/>/, '') : '';
  },
  showHtmlDetail(html) {},
  getVideoPre(video) {
    const canvas = document.createElement('canvas');
    const imgHeight = video.videoHeight;
    const imgWidth = video.videoWidth;
    const scale = 1;
    canvas.width = imgWidth * scale;
    canvas.height = imgHeight * scale;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, imgWidth * scale, imgHeight * scale);
    let imgSrc = canvas.toDataURL('image/png');
    return imgSrc;
  },
  dataURLtoBlob(dataURI, type) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: type });
  },
  random_string(len) {
    len = len || 32;
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let maxPos = chars.length;
    let pwd = '';
    // eslint-disable-next-line
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
  // 格式化星期时间
  formatTimeDay(date) {
    const dayArray = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return dayArray[date.getDay()];
  },

  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  },

  // 格式化日历时间
  formatDate(date, type) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // const hour = date.getHours()
    // const minute = date.getMinutes()
    // const second = date.getSeconds()
    if (type === 'y-m-d') {
      return [year, month, day].map(this.formatNumber).join('-');
    } else {
      return [month, day].map(this.formatNumber).join('-');
    }
  },
  ua: ua,
  isIOS: ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1,
  isAndroid: ua.indexOf('android') !== -1
};

export default util;
