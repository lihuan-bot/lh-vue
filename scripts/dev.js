/*
 * @Author: lihuan
 * @Date: 2023-04-16 13:57:28
 * @LastEditors: lihuan
 * @LastEditTime: 2023-04-16 15:00:39
 * @Email: 17719495105@163.com
 */
import esbuild from 'esbuild'
import minimist from 'minimist'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// 获取 __dirname 的 ESM 写法
const __dirname = dirname(fileURLToPath(import.meta.url))
const args = minimist(process.argv.slice(2))

const target = args._[0] || 'reactivity'
const format = args.f || 'global'
const pkg = resolve(__dirname, `../packages/${target}/package.json`)
const outputFormat = format.startsWith('global')
  ? 'iife'
  : format === 'cjs'
  ? 'cjs'
  : 'esm'
// 输出文件名 eg: reactivity.esm.js
const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
)

const plugins = [
  {
    name: 'esbuild-watch-log-plugin',
    setup(build) {
      build.onEnd(({ errors }) => {
        if (!errors.length) {
          console.log('waiting for change')
        }
      })
    }
  }
]
const context = await esbuild.context({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true,
  sourcemap: true,
  format: outputFormat,
  globalName: pkg.buildOptions?.name,
  platform: format === 'cjs' ? 'node' : 'browser',
  plugins
})
await context.watch()
