/*
 * @Author: lihuan
 * @Date: 2023-05-06 15:09:06
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-08 10:24:23
 * @Email: 17719495105@163.com
 */
import { extend } from '@lhvue/shared'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'
import { createRenderer } from '@lhvue/runtime-core'
export type RootRenderFunction = (vnode: any, container: any, isSVG?: boolean) => void

const rendererOptions = extend({ patchProp }, nodeOps)

function ensureRenderer() {
  return createRenderer(rendererOptions)
}

export const render = ((...args) => {
  ensureRenderer().render(...args)
}) as RootRenderFunction
