/*
 * @Author: lihuan
 * @Date: 2023-04-21 10:36:21
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-04 09:55:53
 * @Email: 17719495105@163.com
 */
import { hasChanged, hasOwn, isArray, isIntegerKey } from '@lhvue/shared'
import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operations'
import { ReactiveFlags, reactiveMap, toRaw } from './reactive'

const get = createGetter()
const arrayInstrumentations = /*#__PURE__*/ createArrayInstrumentations()
function createArrayInstrumentations() {
  const instrumentations = {}
  ;['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
    instrumentations[key] = function (this, ...args) {
      //转换为普通类型 否则会死循环
      const arr = toRaw(this)
      // 可能不会从数组的第一个元素开始遍历(支持第二个参数)。这导致的问题是当数组的某一项发生变化时不会响应式的重新执行这三个 api
      for (let i = 0; i < this.length; i++) {
        track(arr, TrackOpTypes.GET, i + '')
      }
      const res = arr[key](...args)
      // 如果没有找到 使用原始值
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw))
      }
      return res
    }
  })
  return instrumentations
}
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    // 实现toRaw
    if (key === ReactiveFlags.RAW && receiver === reactiveMap.get(target)) return target
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

    const targetIsArray = isArray(target)

    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver)
    }
    const res = Reflect.get(target, key, receiver)
    // 收集依赖
    track(target, TrackOpTypes.GET, key, res)
    return res
  }
}
const set = createSetter()
function createSetter(isReadonly = false, shallow = false) {
  return function set(target, key, value, receiver) {
    let oldValue = target[key]
    value = toRaw(value)
    oldValue = toRaw(oldValue)
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key)

    const res = Reflect.set(target, key, value, receiver)

    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) {
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }
    return res
  }
}
export const mutableHandlers = {
  get,
  set
}
