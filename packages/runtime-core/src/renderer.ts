import { ShapeFlags } from '@lhvue/shared'
import { isSameVNode } from './vnodes'

/*
 * @Author: lihuan
 * @Date: 2023-05-06 17:16:28
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-13 11:32:08
 * @Email: 17719495105@163.com
 */
export const createRenderer = options => {
  const {
    insert: hostInsert,
    remove: hostRemove,
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
  const unmountChildren = children => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i])
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
  const patchProps = (oldProps, newProps, el) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const pre = oldProps[key]
        const next = newProps[key]
        // 新的覆盖老的
        if (pre !== next) {
          hostPatchProp(el, key, pre, next)
        }
      }
      for (const key in oldProps) {
        // 老的有 新的没有 删除
        if (!(key in newProps)) {
          const pre = oldProps[key]
          hostPatchProp(el, key, pre, null)
        }
      }
    }
  }
  const patchChildren = (n1, n2, el) => {
    //  比较Children的差异 更新el中的Children
    const c1 = n1.children
    const c2 = n2.children
    const preShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag
    debugger
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1)
      }
      if (c1 !== c2) {
        // 文本内容不同
        hostSetElementText(el, c2)
      }
    }
  }
  const patchElement = (n1, n2) => {
    // 比较 n1 n2 的属性差异
    // 复用老的 el
    const el = (n2.el = n1.el)
    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    patchProps(oldProps, newProps, el)
    patchChildren(n1, n2, el)
  }
  const processElement = (n1, n2, container) => {
    if (n1 === null) {
      mountElement(n2, container)
    } else {
      // diff

      patchElement(n1, n2)
    }
  }
  const patch = (n1, n2, container) => {
    if (n1 === n2) return
    // 类型不一样 n1 div => n2 p 删除n1 挂载n2
    if (n1 && !isSameVNode(n1, n2)) {
      unmount(n1)
      n1 = null
    }
    processElement(n1, n2, container)
  }
  const unmount = vnode => hostRemove(vnode.el)
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      // 卸载节点
      unmount(container._vnode)
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
