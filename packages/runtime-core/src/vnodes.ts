/*
 * @Author: lihuan
 * @Date: 2023-05-04 10:16:30
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-04 15:57:45
 * @Email: 17719495105@163.com
 */

export const createVNode = (
  type,
  props = null,
  children = null,
  patchFlag = 0,
  dynamicProps = null,
  isBlockNode = false
) => {}

export function isVNode(value: any) {
  return value ? value.__v_isVNode === true : false
}
