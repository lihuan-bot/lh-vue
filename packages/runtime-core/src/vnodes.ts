/*
 * @Author: lihuan
 * @Date: 2023-05-04 10:16:30
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-05 10:53:27
 * @Email: 17719495105@163.com
 */

import { isArray, isString, ShapeFlags } from '@lhvue/shared'

export const createVNode = (
  type,
  props = null,
  children = null,
  patchFlag = 0,
  dynamicProps = null,
  isBlockNode = false
) => {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0
  // 虚拟节点
  const vnode = {
    __v_isVnode: true,
    type,
    props,
    children,
    shapeFlag,
    key: props.key,
    el: null // 对应的真实节点
  }
  if (children) {
    let type = 0
    if (isArray(children)) {
      // [vnode,'文本']
      type = ShapeFlags.ARRAY_CHILDREN
    } else {
      // 文本
      type = ShapeFlags.TEXT_CHILDREN
    }
    vnode.shapeFlag |= type // 判断自己和孩子的类型
  }
  return vnode
}

export function isVNode(value: any) {
  return value ? value.__v_isVNode === true : false
}
