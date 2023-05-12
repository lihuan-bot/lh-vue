/*
 * @Author: lihuan
 * @Date: 2023-05-06 15:09:06
 * @LastEditors: lihuan
 * @LastEditTime: 2023-05-12 23:24:26
 * @Email: 17719495105@163.com
 */
import { extend } from '@lhvue/shared'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'
import { createRenderer } from '@lhvue/runtime-core'
export type RootRenderFunction = (vnode: any, container: any, isSVG?: boolean) => void

const renderOptions = extend({ patchProp }, nodeOps)

function ensureRenderer() {
  return createRenderer(renderOptions)
}

export const render = ((...args) => {
  ensureRenderer().render(...args)
}) as RootRenderFunction

export * from '@lhvue/runtime-core'
