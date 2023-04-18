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

export function track(target, key, oldVal) {
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
export function trigger(target, key, newVal, oldVal) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  if (dep.size > 0) {
    for (const effect of dep) {
      if (effect.scheduler) {
        effect.scheduler()
      } else effect.run()
    }
  }
}
