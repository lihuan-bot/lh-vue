/*
 * @Author: lihuan
 * @Date: 2023-05-12 11:19:04
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-12 11:19:19
 * @Email: 17719495105@163.com
 */
function createInvoker(initValue) {
  const invoker = e => invoker.value(e)

  invoker.value = initValue // 更新时只需要更新invoker的value属性
  return invoker
}
export const patchEvent = (el, key, nextValue) => {
  // vue event invoker
  const invokers = el._vei || (el._vei = {})
  const name = key.slice(2).toLowerCase()
  const existingInvoker = invokers[name]
  if (nextValue && existingInvoker) {
    // 更新事件
    existingInvoker.value = nextValue
  } else {
    if (nextValue) {
      // 缓存创建的invoker
      const invoker = (invokers[name] = createInvoker(nextValue))
      el.addEventListener(name, invoker)
    } else if (existingInvoker) {
      el.removeEventListener(name, existingInvoker)
      invokers[name] = null
    }
  }
}
