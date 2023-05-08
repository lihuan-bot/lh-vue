/*
 * @Author: lihuan
 * @Date: 2023-05-06 15:21:08
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-08 16:05:57
 * @Email: 17719495105@163.com
 */

import { patchClass } from './models/class'
import { patchStyle } from './models/style'
export const patchProp = (el, key, preValue, nextValue) => {
  if (key === 'class') {
    // 处理类名 "a b c"  => "a b" 直接更新
    patchClass(el, nextValue)
  } else if (key === 'style') {
    //  处理样式 {color:'red', background: 'red'} =>  {color:'red'}
    patchStyle(el, preValue, nextValue)
  } else if (/^on[^a-z]/.test(key)) {
    // 处理事件
  } else {
    // attr
  }
}
