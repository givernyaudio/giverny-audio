# CLAUDE.md — Giverny Audio Web

ゲームオーディオ／サウンドデザイン専門スタジオ **Giverny Audio** の公式サイト。
詳細仕様は別途 `SPEC.md`（プロジェクト外・ユーザー手元）に記載。本ファイルは編集作業の早見表。

## 技術スタック
- **Hono v4**（TSX）+ **Vite v6**（`@hono/vite-build`）→ **Cloudflare Pages**（Workers Edge）
- データ永続化なし。**全データは `src/index.tsx` 冒頭の定数**で管理（DB・CMS なし）。
- CSS はインライン（`src/index.tsx` 内 `CSS` 定数）。`public/static/style.css` は未使用。
- メール送信は **Web3Forms**（ブラウザから直接 POST）。`/api/contact`（MailChannels）は実装済みだが未使用。

## コマンド
```bash
npm install          # 初回のみ（node_modules は .gitignore 済み）
npm run dev          # Vite 開発サーバー → http://localhost:5173
npm run build        # 本番ビルド → dist/（_worker.js 生成 + 画像 webp 自動生成）
npm run deploy       # build してから wrangler pages deploy（公開。実行はユーザー確認のうえで）
```
※ このシェルに `curl` は無い。HTTP 確認は `node` の `fetch` を使う。

## アーキテクチャ（`src/index.tsx` 一枚にほぼ全部・約2000行）
| 行（目安） | 内容 |
|---|---|
| 〜296 | **編集対象の定数群**（下表） |
| 300–356 | ルート定義（`/`, `/tabs/:tab`, `/store/item/:id`, `POST /api/contact`） |
| 358–1047 | `CSS` 定数（全ページ共通インラインCSS） |
| 1048–1127 | `layout()` … 共通の `<head>`/ヘッダー/モバイルメニュー/フッター/スクロールJS |
| 1132–1603 | `renderHome()`（Hero / About / SNS / Services / Pickup / Contact）+ モーダルJS |
| 1608–1639 | `renderTabPage()`（works/equipment/store を振り分け） |
| 1644–1796 | `renderWorks()` / `renderEquipment()` / `renderStore()` |
| 1797–2055 | `renderItemPage()`（商品詳細。Tailwind + Inter を CDN 読み込み） |

`src/renderer.tsx` は実質未使用（各 render 関数が完結した HTML 文字列を返す）。

## よくある更新 → 編集する定数（すべて `src/index.tsx` 冒頭）
| やりたいこと | 定数 |
|---|---|
| 実績を追加／編集 | `WORKS_LIST`（配列**先頭**が最新＝最上段） |
| 機材を追加／編集 | `EQUIPMENT_LIST` |
| 商品を追加／編集 | `STORE_ITEMS`（先頭3件が自動で Top の `PICKUP_ITEMS` に） |
| YouTube 動画 | `YOUTUBE_VIDEOS`（id = 動画ID） |
| SNS / ショップ URL | `SNS_LINKS` / `STORE_LINKS` |
| About 画像 | `ABOUT_IMAGE` |
| 商品詳細ページの中身 | `renderItemPage()` 内（現状 `sword-swish-generator` のみハードコード） |

## 画像の扱い（重要）
- 元画像（jpg/png）を `public/<hero|about|works|store>/` に置く。
- **ビルド時に `vite.config.ts` の `autoImageOptimize` が同名 `.webp` を `dist/` に自動生成**（カテゴリ別の最大幅・品質で圧縮、差分ビルド対応）。コード側は基本 `.webp` を参照する。
- ⚠️ **dev モードの落とし穴**：webp はビルド時生成のため、`public/` に webp 実体が無い画像は `npm run dev` では 404 になる（例：`hero-02/03` は jpg のみ存在 → dev では 2・3枚目が出ない。本番ビルドでは出る）。dev で確認したい場合は webp を手動生成して `public/` に置く。

## `_routes.json`（`vite.config.ts` の `patchRoutes`）— 落とし穴
- `/store/item/:id` を Worker で処理するため `/store/*` は**一括除外していない**。
- そのため **新しい store 静的画像を追加したら、`vite.config.ts` の `exclude` 配列にそのファイル名を明示追加**しないと静的配信されず Worker に流れて 404 になる。
  例：`'/store/新ファイル.webp'` を追記。

## その他メモ
- `<title>` は全ページ `Giverny Audio` 固定（`layout()` 内）。
- Web3Forms の access_key は `submitContactForm()`（≈1570行）にハードコード。
- favicon は `public/favicon-32/64.png`, `favicon.svg`。`_routes.json` で静的配信に除外済み。
- ローカル本番相当の確認は PM2 + `wrangler pages dev dist`（`ecosystem.config.cjs`、ポート3000）。
- ⚠️ **デプロイは手動のみ**：CF Pages プロジェクト名は **`giverny-audio`**（本番 givernyaudio.com）。
  **GitHub への push では自動デプロイされない**（git連携なし）。反映には `npm run deploy` を実行する。
  事前に一度 `npx wrangler login`（アカウント: k-toon@givernyaudio.com）が必要。
  実プロジェクト名は `npx wrangler pages project list` で確認可。push は通常 GitHub Desktop。
- コミット／プッシュ／デプロイはユーザーの指示があってから行う。
