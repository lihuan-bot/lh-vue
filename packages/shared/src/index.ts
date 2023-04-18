/*
 * @Author: lihuan
 * @Date: 2023-04-16 13:38:20
 * @LastEditors: lihuan
 * @LastEditTime: 2023-04-17 11:38:17
 * @Email: 17719495105@163.com
 */
export const isObject = (val: unknown) =>
  val !== null && typeof val === 'object'
