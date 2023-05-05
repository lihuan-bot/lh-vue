/*
 * @Author: lihuan
 * @Date: 2023-04-16 13:38:20
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-05 10:33:26
 * @Email: 17719495105@163.com
 */
export * from './shapeFlags'

export const isObject = (val: unknown) => val !== null && typeof val === 'object'

export const isArray = (val: unknown) => Array.isArray(val)
export const isString = (val: unknown): val is string => typeof val === 'string'

export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)

export const toRawType = (value: unknown): string => {
  return toTypeString(value).slice(8, -1)
}
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val => hasOwnProperty.call(val, key)

export const isIntegerKey = (key: unknown) =>
  isString(key) && key !== 'NaN' && key[0] !== '-' && parseInt(key, 10) + '' === key
export const hasChanged = (value: any, oldValue: any) => !Object.is(value, oldValue)
