// 验证电话号码
/**
 *
 * @param {String} str
 */
export function isPhoneNumber(str) {
  const reg = /^(|086-|86-|\\+86-)1[\d]{10}$/;
  return reg.test(str);
}

// 验证固定电话号码
/**
 *
 * @param {String} str
 */
export function isTelNumber(str) {
  const reg = /^(|086-|86-|\\+86-)[0-9,-]{7,20}$/;
  return reg.test(str);
}
