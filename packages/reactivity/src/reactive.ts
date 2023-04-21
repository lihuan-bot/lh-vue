/*
 * @Author: lihuan
 * @Date: 2023-04-16 13:38:16
 * @LastEditors: lihuan
 * @LastEditTime: 2023-04-21 14:23:45
 * @Email: 17719495105@163.com
 */
import { isObject, toRawType } from '@lhvue/shared'
import { mutableHandlers, mutableCollectionHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  RAW = '__v_raw'
}
const enum TargetType {
  INVALID = 0,
  COMMON = 1,
  COLLECTION = 2
}
const reactiveMap = new WeakMap()
export function reactive(target) {
  if (target && target[ReactiveFlags.IS_READONLY]) return target
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap)
}

function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) return target

  const existingProxy = proxyMap.get(target)
  // 避免重复代理
  if (existingProxy) {
    return existingProxy
  }
  const targetType = getTargetType(target)
  // 使用 preventExtensions seal freeze 等是不可以扩展
  if (targetType === TargetType.INVALID) return target
  // 集合Map 、Set、WeakMap、WeakSet和 Object、Array 分开处理
  const proxy = new Proxy(target, targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers)

  proxyMap.set(target, proxy)
  return proxy
}

function targetTypeMap(rawType: string) {
  switch (rawType) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}
function getTargetType(value) {
  return value[ReactiveFlags.SKIP] || !Object.isExtensible(value) ? TargetType.INVALID : targetTypeMap(toRawType(value))
}
