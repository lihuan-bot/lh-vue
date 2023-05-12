/*
 * @Author: lihuan
 * @Date: 2023-05-06 15:09:16
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-12 22:44:23
 * @Email: 17719495105@163.com
 */
export const nodeOps = {
  insert: (child, parent, anchor) => {
    // 当 anchor 为null时 相当是appendChild
    parent.insertBefore(child, anchor || null)
  },
  remove: child => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },
  createElement: tag => document.createElement(tag),

  createText: text => document.createTextNode(text),

  createComment: text => document.createComment(text),

  setText: (node, text) => (node.nodeValue = text),

  setElementText: (el, text) => (el.textContent = text),

  parentNode: node => node.parentNode,

  nextSibling: node => node.nextSibling
}
