import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig, Plugin } from 'vite'
import { writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'

// ─────────────────────────────────────────────────────────────────────────────
//  画像自動最適化プラグイン
//  public/ 以下の jpg / png を WebP に自動変換して dist/ にコピーします。
//  ・変換済みファイルより元ファイルが新しい場合のみ再変換（差分ビルド）
//  ・元の jpg/png も dist/ に残すのでブラウザ互換性を維持
// ─────────────────────────────────────────────────────────────────────────────
function autoImageOptimize(): Plugin {
  return {
    name: 'auto-image-optimize',
    async closeBundle() {
      // sharp は miniflare の依存として存在するのでそこから resolve
      let sharp: any
      try {
        sharp = (await import('sharp')).default
      } catch {
        console.warn('[image-optimize] sharp not found, skipping.')
        return
      }

      const DIRS = ['hero', 'about', 'works', 'store']
      const EXT  = ['.jpg', '.jpeg', '.png']
      // 変換設定: カテゴリ別の最大幅と WebP 品質
      const CONFIG: Record<string, { width: number; quality: number }> = {
        hero:  { width: 1280, quality: 85 },
        about: { width: 800,  quality: 85 },
        works: { width: 500,  quality: 82 },
        store: { width: 800,  quality: 85 },
      }

      for (const dir of DIRS) {
        const srcDir  = join(process.cwd(), 'public', dir)
        const distDir = join(process.cwd(), 'dist',   dir)
        if (!existsSync(srcDir)) continue
        if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true })

        const cfg = CONFIG[dir] ?? { width: 1280, quality: 85 }

        for (const file of readdirSync(srcDir)) {
          const ext = extname(file).toLowerCase()
          if (!EXT.includes(ext)) continue

          const srcFile  = join(srcDir,  file)
          const webpName = basename(file, ext) + '.webp'
          const dstFile  = join(distDir, webpName)

          // 差分チェック: dist の .webp が src より新しければスキップ
          if (existsSync(dstFile)) {
            const srcMt = statSync(srcFile).mtimeMs
            const dstMt = statSync(dstFile).mtimeMs
            if (dstMt >= srcMt) {
              continue
            }
          }

          try {
            await sharp(srcFile)
              .resize({ width: cfg.width, withoutEnlargement: true })
              .webp({ quality: cfg.quality })
              .toFile(dstFile)
            const srcKb = Math.round(statSync(srcFile).size / 1024)
            const dstKb = Math.round(statSync(dstFile).size / 1024)
            console.log(`[image-optimize] ${dir}/${file} ${srcKb}KB → ${webpName} ${dstKb}KB`)
          } catch (e) {
            console.error(`[image-optimize] failed: ${file}`, e)
          }
        }
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  _routes.json パッチプラグイン
// ─────────────────────────────────────────────────────────────────────────────
function patchRoutes(): Plugin {
  return {
    name: 'patch-routes',
    closeBundle() {
      const routes = {
        version: 1,
        include: ['/*'],
        // /store/* は除外しない（/store/item/:id はWorkerで処理）
        // 静的アセットフォルダのみ除外
        exclude: ['/static/*', '/hero/*', '/about/*', '/works/*', '/store/1350.webp', '/store/sword-swish.webp', '/store/sword-swish-ui.webp', '/favicon.svg', '/favicon.ico', '/favicon.png', '/favicon-32.png', '/favicon-64.png', '/Giverny_Audio_Logo_White.png']
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
    autoImageOptimize(),
    patchRoutes(),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ]
})
