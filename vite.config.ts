import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig, Plugin } from 'vite'
import { writeFileSync } from 'fs'
import { join } from 'path'

// ビルド後に _routes.json を上書きして静的ファイルを正しく配信するプラグイン
function patchRoutes(): Plugin {
  return {
    name: 'patch-routes',
    closeBundle() {
      const routes = {
        version: 1,
        include: ['/*'],
        exclude: ['/static/*', '/hero/*', '/about/*', '/favicon.svg', '/favicon.ico']
      }
      writeFileSync(
        join(process.cwd(), 'dist/_routes.json'),
        JSON.stringify(routes)
      )
    }
  }
}

export default defineConfig({
  plugins: [
    build(),
    patchRoutes(),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ]
})
