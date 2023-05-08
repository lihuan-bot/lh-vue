/*
 * @Author: lihuan
 * @Date: 2023-05-08 16:04:12
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-08 16:04:21
 * @Email: 17719495105@163.com
 */
export const patchClass = (el, value) => {
  if (value === null) {
    el.removeAttribute('class')
  } else {
    el.className = value
  }
}
