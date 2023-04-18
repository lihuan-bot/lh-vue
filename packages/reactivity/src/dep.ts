/*
 * @Author: lihuan
 * @Date: 2023-04-17 14:34:51
 * @LastEditors: lihuan
 * @LastEditTime: 2023-04-17 14:35:52
 * @Email: 17719495105@163.com
 */
export function createDep(effects?) {
  const dep = new Set(effects)
  return dep
}
