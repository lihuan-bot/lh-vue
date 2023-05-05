/*
 * @Author: lihuan
 * @Date: 2023-05-05 10:27:36
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-05 10:31:58
 * @Email: 17719495105@163.com
 */
export const enum ShapeFlags {
  ELEMENT = 1, //虚拟节点是一个元素
  FUNCTIONAL_COMPONENT = 1 << 1, //函数式组件
  STATEFUL_COMPONENT = 1 << 2, // 普通组件
  TEXT_CHILDREN = 1 << 3, // 儿子是文本
  ARRAY_CHILDREN = 1 << 4, // 儿子是数组
  SLOTS_CHILDREN = 1 << 5, // 插槽
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}
