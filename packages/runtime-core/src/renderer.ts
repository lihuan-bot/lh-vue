/*
 * @Author: lihuan
 * @Date: 2023-05-06 17:16:28
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-14 12:25:10
 * @Email: 17719495105@163.com
 */
import { ShapeFlags } from '@lhvue/shared'
import { isSameVNode } from './vnodes'

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
  const mountElement = (vnode, container, anchor) => {
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
    hostInsert(el, container, anchor)
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
  const patchKeyedChildren = (c1, c2, el) => {
    // 全量diff(比较耗性能) 对比过程是深度遍历 先父后子 从父到子都要对比一遍
    // 没有优化对比 只关心变化的部分 blockTree  patchFlags
    // 同级对比 父和父 子和子 采用深度遍历

    let i = 0
    let e1 = c1.length - 1
    let e2 = c2.length - 1
    // a b c
    // a b c d
    // i = 0 e1 = 2 e2 =3
    // 从前向后
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, el) // 深度遍历
      } else {
        // a b e
        // a b c d
        break
      }
      i++
    }
    // 从后向前
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      e1--
      e2--
    }
    //同序列挂载
    if (i > e1) {
      // 有新增节点
      if (i <= e2) {
        // 如果e2往前移动了 那么e2的下一个值肯定存在  那就向前插入
        // 如果没动 那么e2下一个是空 那就是向后插入
        const newPos = e2 + 1
        // v2 中 看下一个元素是否存在 v3 看长度是否越界
        const anchor = newPos < c2.length ? c2[newPos].el : null
        patch(null, c2[i], el, anchor)
        i++
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i])
        i++
      }
    }
  }
  const patchChildren = (n1, n2, el) => {
    //  比较Children的差异 更新el中的Children
    const c1 = n1.children
    const c2 = n2.children
    const preShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag
    // 新的儿子是文本  旧的是 文本(更新文本) 数组(删除老儿子，设置文本内容) 空(更新文本即可)
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 数组
      if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1)
      }
      // 文本  空
      if (c1 !== c2) {
        // 文本内容不同
        hostSetElementText(el, c2)
      }
    } else {
      // 老的儿子是数组 新的是数组
      if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 最复杂的diff 新老都是数组
          patchKeyedChildren(c1, c2, el)
        } else {
          // 老的是数组 新的不是数组 删除老的
          unmountChildren(c1)
        }
      } else {
        if (preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, '')
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el)
        }
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
  const processElement = (n1, n2, container, anchor) => {
    if (n1 === null) {
      mountElement(n2, container, anchor)
    } else {
      // diff

      patchElement(n1, n2)
    }
  }
  const patch = (n1, n2, container, anchor = null) => {
    if (n1 === n2) return
    // 类型不一样 n1 div => n2 p 删除n1 挂载n2
    if (n1 && !isSameVNode(n1, n2)) {
      unmount(n1)
      n1 = null
    }
    processElement(n1, n2, container, anchor)
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
