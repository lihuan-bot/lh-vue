/*
 * @Author: lihuan
 * @Date: 2023-05-06 15:21:08
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-12 11:25:23
 * @Email: 17719495105@163.com
 */

import { patchAttr } from './models/attr'
import { patchClass } from './models/class'
import { patchEvent } from './models/event'
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
    patchEvent(el, key, nextValue)
  } else {
    // attr
    patchAttr(el, key, nextValue)
  }
}
