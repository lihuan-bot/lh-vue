/*
 * @Author: lihuan
 * @Date: 2023-05-12 11:25:05
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-12 11:25:16
 * @Email: 17719495105@163.com
 */
export const patchAttr = (el, key, value) => {
  if (value === null) {
    el.removeAttribute(key)
  } else {
    el.setAttribute(key, value)
  }
}
