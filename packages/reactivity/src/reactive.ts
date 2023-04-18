/*
 * @Author: lihuan
 * @Date: 2023-04-16 13:38:16
 * @LastEditors: lihuan
 * @LastEditTime: 2023-04-17 14:50:13
 * @Email: 17719495105@163.com
 */
import { isObject } from '@lhvue/shared'
import { track, trigger } from './effect'

export function reactive(target) {
  if (!isObject(target)) return target
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      /**
       * Reflect 解决this的问题
       * const person = {
       *       name: 'lh',
       *       get()newName {
       *          //在获取this.name时也要进行依赖收集
       *          //如果不使用Reflect 只能收集一次 name收集不到
       *          //receiver就是代理后的proxy
       *          return this.name + 'vue'
       *          }
       *      }
       *  console.log(person.newName)
       */
      const res = Reflect.get(target, key, receiver)
      // 收集依赖
      track(target, key, res)
      return res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      // 当修改值的时候触发依赖函数
      trigger(target, key, value, res)
      return res
    }
  })
  return proxy
}
