/*
 * @Author: lihuan
 * @Date: 2023-04-17 14:48:07
 * @LastEditors: lihuan
 * @LastEditTime: 2023-04-28 14:21:09
 * @Email: 17719495105@163.com
 */
import { isArray } from '@lhvue/shared'
import { createDep } from './dep'

let activeEffect = null
const targetMap = new WeakMap()
export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
class ReactiveEffect {
  dep = []
  constructor(public fn, public scheduler?) {}
  run() {
    try {
      activeEffect = this
      return this.fn()
    } finally {
      activeEffect = null
    }
  }
}

export function track(target, type, key, oldVal?) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }
  trackEffects(dep)
}
export function trackEffects(dep) {
  //因为设置的对象是响应式的所以只要响应式对象改变都会收集,但是只有
  //在effect执行的时候activeEffect才有值才能收集到依赖并且dep采用了集合防止重复收集同一个依赖
  if (activeEffect) {
    dep.add(activeEffect)
  }
}
export function trigger(target, type, key, newVal, oldVal?) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const dep = depsMap.get(key)
  triggerEffects(dep)
}

export function triggerEffects(dep) {
  // dep 是数组或者是Set
  for (const effect of isArray(dep) ? dep : [...(dep || [])]) {
    if (effect !== activeEffect) {
      if (effect.scheduler) {
        effect.scheduler()
      } else {
        effect.run()
      }
    }
  }
}
