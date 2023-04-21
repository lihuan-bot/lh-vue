/*
 * @Author: lihuan
 * @Date: 2023-04-21 10:36:21
 * @LastEditors: lihuan
 * @LastEditTime: 2023-04-21 15:10:21
 * @Email: 17719495105@163.com
 */
import { hasOwn, isArray } from '@lhvue/shared'
import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operations'
import { ReactiveFlags } from './reactive'

const get = createGetter()
const arrayInstrumentations = /*#__PURE__*/ createArrayInstrumentations()
function createArrayInstrumentations() {
  const instrumentations = {}
  ;['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
    instrumentations[key] = function (this, ...args) {
      console.log(this, 'this', args)
    }
  })
  return instrumentations
}
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
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
    const res = Reflect.set(target, key, value, receiver)
    trigger(target, TriggerOpTypes.SET, key, value, res)
    return res
  }
}
export const mutableHandlers = {
  get,
  set
}

export const mutableCollectionHandlers = {
  get,
  set
}
