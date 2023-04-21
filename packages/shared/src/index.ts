/*
 * @Author: lihuan
 * @Date: 2023-04-16 13:38:20
 * @LastEditors: lihuan
 * @LastEditTime: 2023-04-21 11:07:02
 * @Email: 17719495105@163.com
 */
export const isObject = (val: unknown) => val !== null && typeof val === 'object'

export const isArray = (val: unknown) => Array.isArray(val)

export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string => objectToString.call(value)

export const toRawType = (value: unknown): string => {
  return toTypeString(value).slice(8, -1)
}
