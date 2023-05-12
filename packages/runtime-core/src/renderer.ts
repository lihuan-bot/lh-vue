import { ShapeFlags } from '@lhvue/shared'

/*
 * @Author: lihuan
 * @Date: 2023-05-06 17:16:28
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-12 23:37:14
 * @Email: 17719495105@163.com
 */
export const createRenderer = options => {
  const {
    insert: hostInsert,
    remeve: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling
  } = options
  const mountChildren = (children, el) => {
    for (let i = 0; i < children.length; i++) {
      // 不能使用 mountElement children中包含其他类型
      patch(null, children[i], el)
    }
  }
  const mountElement = (vnode, container) => {
    const { type, props, children, shapeFlag } = vnode
    // 创建真实节点
    const el = (vnode.el = hostCreateElement(type))
    if (props) {
      //  处理属性
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 数组
      mountChildren(children, el)
    } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 文本
      hostSetElementText(el, children)
    }
    hostInsert(el, container)
  }
  const patch = (n1, n2, container) => {
    if (n1 === n2) return
    if (n1 === null) {
      mountElement(n2, container)
    }
  }
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      // 卸载节点
    } else {
      // 初次渲染 更新
      patch(container._vnode || null, vnode, container)
    }
    // 初次渲染保存虚拟节点
    container._vnode = vnode
  }
  return {
    render
  }
}
