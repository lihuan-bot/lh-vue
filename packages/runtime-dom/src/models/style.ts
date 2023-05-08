/*
 * @Author: lihuan
 * @Date: 2023-05-08 16:04:12
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-08 16:04:21
 * @Email: 17719495105@163.com
 */
export const patchStyle = (el, preValue, nextValue) => {
  const style = el.style
  for (const key in nextValue) {
    style[key] = nextValue[key]
  }
  // 老的有新的没有要删除
  for (const key in preValue) {
    if (nextValue[key] === null) {
      // 老的有新的没有
      style[key] = null
    }
  }
}
