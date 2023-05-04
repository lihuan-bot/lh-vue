/*
 * @Author: lihuan
 * @Date: 2023-05-04 15:57:09
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-04 16:01:04
 * @Email: 17719495105@163.com
 */
import { isArray, isObject } from '@lhvue/shared'
import { createVNode, isVNode } from './vnodes'

export function h(type: any, propsOrChildren?: any, children?: any) {
  const l = arguments.length
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // 单个vnode  没有属性
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      // 没有children
      return createVNode(type, propsOrChildren)
    } else {
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l === 3 && isVNode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
