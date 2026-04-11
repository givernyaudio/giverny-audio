import { Hono } from 'hono'

const app = new Hono()

// ═══════════════════════════════════════════════════════════════════════
//  ★ SNS / 販売サイト URL 設定
//  ★ ここのURLを書き換えるだけで全ページに反映されます
// ═══════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════
//  ★ About セクション 画像設定
//  ★ 画像を差し替える場合:
//     1. public/about/ フォルダに新しい画像ファイルを置く
//     2. 下記パスを書き換えるだけで反映されます
// ═══════════════════════════════════════════════════════════════════════
const ABOUT_IMAGE = '/about/about-photo.jpg'  // About セクションの画像パス

const SNS_LINKS = {
  facebook:  'https://www.facebook.com/',     // Facebook ページURL
  youtube:   'https://youtube.com/',          // YouTube チャンネルURL
  instagram: 'https://www.instagram.com/',    // Instagram プロフィールURL
}

// ═══════════════════════════════════════════════════════════════════════
//  ★ YouTube 動画リスト設定
//  ★ 動画を追加・編集・削除する場合はここを編集してください
//  ★ 各フィールド:
//     id    = YouTube 動画ID（URLの末尾部分 例: 'Z-5vfMtC5mY'）
//     title = 動画のタイトル（サムネイル下に表示）
// ═══════════════════════════════════════════════════════════════════════
const YOUTUBE_VIDEOS = [
  {
    id:    'Z-5vfMtC5mY',
    title: '',
  },
  {
    id:    'TsNkvgTvLzI',
    title: '',
  },
  {
    id:    'gei4wcR1t7M',
    title: '',
  },
  {
    id:    'H3uwIpRXfXE',
    title: '',
  },
]
const STORE_LINKS = {
  base:    'https://givernyaudio.base.shop',    // BASE ショップURL（Store ページ購入ボタン）
  gumroad: 'https://givernyaudio.gumroad.com/', // Gumroad ショップURL
}

// ═══════════════════════════════════════════════════════════════════════
//  ★ 商品一覧設定（Store ページ・トップ Pickup 共通）
//  ★ 商品を追加・編集・削除する場合はここを編集してください
//  ★ 各フィールド:
//     title  = 商品名（カード上部に大きく表示）
//     count  = 収録数など (例: '20 tracks', '100+ SE') → タイトル右横に表示
//     price  = 価格 (例: '¥2,980') → タイトル下に表示
//     image  = 商品画像ファイル名 (public/store/ 以下に置く。例: '1350.jpg')
//             ※ 画像なしの場合は '' (空文字)
//     url    = 購入ページのURL (例: STORE_LINKS.base または直接URL)
//
//  ★ 新商品追加テンプレート（コピーして使ってください）:
//  {
//    title: '商品名',
//    count: '収録数など',  // 例: '20 tracks', '100+ SE', '' (非表示)
//    price: '¥0,000',
//    image: 'store-02.jpg',   // public/store/ に画像を置く
//    url:   STORE_LINKS.base, // または STORE_LINKS.gumroad / 直接URL
//  },
// ═══════════════════════════════════════════════════════════════════════
const STORE_ITEMS = [
  {
    title: '霊松禅寺 インパルスレスポンス & アンビエンス素材集',
    count: '収録数未定',
    price: '¥未定',
    image: '1350.jpg',
    url:   STORE_LINKS.base,
  },
  // ← 新商品をここに追加してください（上のテンプレートをコピー）
]

// トップページ Pickup 用（STORE_ITEMS の先頭3件を使用）
const PICKUP_ITEMS = STORE_ITEMS.slice(0, 3)

// ═══════════════════════════════════════════════════════════════════════
//  ★ Equipment（機材）一覧 設定
//  ★ カテゴリを追加・削除・並び替えする場合はここを編集してください
//  ★ 各フィールド:
//     cat   = カテゴリ名（セクション見出し）
//     items = 機材の配列。各機材は以下のフィールドを持つ:
//       name   = 機材名
//       maker  = メーカー名（右列に小さく表示）
//       note   = 用途メモ（任意。空文字 '' にすると非表示）
// ═══════════════════════════════════════════════════════════════════════
const EQUIPMENT_LIST = [
  {
    cat: 'DAW / Software',
    items: [
      { name: 'Reaper',         maker: 'Cockos' },
      { name: 'Nunedo 12',      maker: 'Steinberg' },
      { name: 'WaveLab Pro 12', maker: 'Steinberg' },
      { name: 'FMOD Studio',    maker: 'iZotope RX 11' },
    ],
  },
  {
    cat: 'Plugins / Instruments',
    items: [
      { name: 'Ultimate',                                                        maker: 'Waves' },
      { name: 'Q4, C3, R2',                                                     maker: 'Fabfilter' },
      { name: 'Room, Delay, Vintageverb',                                        maker: 'Valhalla' },
      { name: 'Production Suite',                                                maker: 'iZotope' },
      { name: 'Altiverb 8 XL, Speakerphone, 360pan Suite',                      maker: 'AudioEase' },
      { name: 'Halo Upmix, Downmix',                                             maker: 'Nugen Audio' },
      { name: 'SPAT REVOLUTION',                                                 maker: 'FLUX-IRCAM' },
      { name: 'Kontakt',                                                         maker: 'Native Instruments' },
      { name: '3DX, HPL Processor',                                              maker: 'NovoNotes' },
      { name: 'Schoeps Double MS',                                               maker: 'PLUGIN ALLIANCE' },
      { name: 'Soundfield By RODE',                                              maker: 'RODE' },
      { name: 'WORKSTATION, Falcon',                                             maker: 'UVI' },
      { name: 'AMBI BUNDLE HD',                                                  maker: 'NOISE MAKER' },
      { name: 'Auto Dehiss',                                                     maker: 'CEDAR Audio' },
      { name: 'DEBIRD, RECENTER, STEREOLAB, UBERLOUD',                           maker: 'Boom Library' },
      { name: 'ab EQ, ab Encoders, ab Decoders, ab Transcoder, ab Imager',      maker: 'Audio Brewers' },
      { name: 'Auto Align 2',                                                    maker: 'Sound Radix' },
      { name: 'Omnisphere 3',                                                    maker: 'Spectrasonics' },
      { name: 'Dehumaniser 2, Reformar Pro',                                     maker: 'Krotos' },
      { name: 'Lowender',                                                        maker: 'ReFuse' },
    ],
  },
  {
    cat: 'PC',
    items: [
      { name: 'BTO Windows Desktop PC', maker: 'Windows' },
      { name: 'ROG Strix G16',          maker: 'ROG' },
      { name: 'Mac Mini',               maker: 'Apple' },
    ],
  },
  {
    cat: 'Speaker',
    items: [
      { name: '8040B', maker: 'Genelec' },
      { name: 'HS 5',  maker: 'YAMAHA' },
    ],
  },
  {
    cat: 'Audio IO / Hardware',
    items: [
      { name: 'MT48 Dante Ready', maker: 'Neumann' },
      { name: 'U5',               maker: 'AVALON DESIGN' },
      { name: 'ISA Two',          maker: 'Focusrite' },
    ],
  },
  {
    cat: 'Field Recorder',
    items: [
      { name: 'MixPre 10 II',    maker: 'Sound Devices' },
      { name: 'F8n Pro, F8n, F3', maker: 'ZOOM' },
    ],
  },
  {
    cat: 'Microphone',
    items: [
      { name: 'MKH8040, MKH8050, MKH8030, MKH8018', maker: 'SENNHEISER' },
      { name: 'NTG3, NTG8',                          maker: 'RODE' },
      { name: '4011A, Core 4060',                    maker: 'DPA' },
      { name: 'Genfon',                              maker: 'LOM Audio' },
      { name: 'UCX-100K',                            maker: 'Sanken' },
      { name: 'M30',                                 maker: 'Earthworks' },
    ],
  },
  {
    cat: 'Surround / Immersive',
    items: [
      { name: '5100 (5.1ch Surround Microphone)',         maker: 'DPA' },
      { name: 'NT-SF1 (1st Order Ambisonics Microphone)', maker: 'RODE' },
      { name: 'OctoMic (2nd Order Ambisonics Microphone)',maker: 'Core Sound' },
      { name: 'ZM-1 (3rd Order Ambisonics Microphone)',   maker: 'Zylia' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════
//  ★ Works（実績）一覧 設定
//  ★ 新しい実績を追加する場合: 配列の先頭に追加してください（新しいものが上に表示されます）
//  ★ 各フィールド:
//     year     = 制作年 (例: '2024')
//     title    = タイトル名
//     desc     = 説明文
//     role     = 担当内容 (例: 'BGM全曲制作・SE制作')
//     type     = ジャンル — フィルターに使用 (例: 'RPG', 'Action', 'Horror', 'Strategy')
//     platform = プラットフォーム (例: 'PC / Steam')
//     image    = サムネイル画像ファイル名。ファイルを public/works/ に置き、
//               ファイル名のみを指定 (例: 'works-01.jpg')。
//               パスは自動で /works/ が付与されます。
//               画像なしの場合は '' (空文字) にしてください
//     url      = タイトルクリック時のリンク先URL (例: 'https://example.com')
//               不要な場合は '' (空文字) にしてください
// ═══════════════════════════════════════════════════════════════════════
const WORKS_LIST = [
  // ↓ 新しい実績をここに追加（先頭が最新として一番上に表示されます）
  {
    year:     '2025',
    title:    '動き出す妖怪展 NAGOYA / TOKYO',
    desc:     '日本が誇る妖怪美術に最先端の映像技術と立体造形で没入できる世界初のイマーシブ体感型デジタルアートミュージアム',
    role:     'SE制作、サラウンドミックス',
    type:     'Immersive',
    platform: 'Event',
    image:    'works-03.jpg',
    url:      'https://www.yokaiimmersive.com/',
  },
  {
    year:     '2025',
    title:    'Imy feat. Kotoha “追憶のファインダー”',
    desc:     '作曲家『みゅー』×イラストレーター『おにねこ』による音楽プロジェクト',
    role:     'フィールドレコーディング、ボイス整音',
    type:     'Music',
    platform: 'CD :Track 03',
    image:    'works-07.jpg',
    url:      'https://www.diverse.direct/imy/imym-1003/',
  },
  {
    year:     '2024',
    title:    'キャプテン翼〜たたかえドリームチーム〜',
    desc:     '『キャプテン翼』の世界中で愛される対戦型サッカーシミュレーションゲーム',
    role:     'サウンドディレクション、SE制作、サウンド実装（Wwise/Unity）、ボイスディレクション',
    type:     'Simulation',
    platform: 'Mobile',
    image:    'works-01.jpg',
    url:      'https://www.tsubasa-dreamteam.com/',
  },
  {
    year:     '2024',
    title:    'ゴーヘルゴー つきおとしてこ',
    desc:     '地獄の沙汰もカネしかない。地獄送りが収入源！儲けて戦う“つきおとしてく”RPG',
    role:     'サウンドディレクション、SE制作、サウンド実装（ADX2 / Unreal）、ボイス整音',
    type:     'RPG',
    platform: 'PS4 / Switch / Windows',
    image:    'works-04.jpg',
    url:      'https://www.entergram.co.jp/gohellgo/',
  },
  {
    year:     '2024',
    title:    'GRAND SUMMONERS',
    desc:     '最大4人で遊べるリアルタイムバトルが熱い、ドット絵アクションRPG',
    role:     'サウンドディレクション、SE制作、BGM制作、サウンド実装（ADX2）、ボイス整音',
    type:     'RPG',
    platform: 'Mobile',
    image:    'works-05.png',
    url:      'https://grandsummoners.com/',
  },
  {
    year:     '2024',
    title:    '結城友奈は勇者である 花結いのきらめき',
    desc:     'タカヒロ企画・原案による『勇者であるシリーズ』を題材としたスマートフォンおよびPCブラウザ用ゲーム',
    role:     'SE制作',
    type:     'RPG',
    platform: 'PS4 / Switch',
    image:    'works-06.jpg',
    url:      'https://www.entergram.co.jp/yuyuyui/',
  },
  {
    year:     '2024',
    title:    'すだまリレイシヨン',
    desc:     '鬼の伏（ふ）す地で結ばれる奇妙な縁。人と魑魅（すだま）の織りなす物語……',
    role:     'サウンドディレクション、SE制作、BGM制作',
    type:     'RPG',
    platform: 'PS4 / Switch / Windows',
    image:    'works-08.jpg',
    url:      'https://www.entergram.co.jp/sudama/',
  },
  {
    year:     '2024',
    title:    'TIMEGAL Re:birth',
    desc:     '「タイムギャル」を原作とするNintendo Switch⽤の新作アドベンチャーゲーム',
    role:     'BGM制作',
    type:     'Adventure',
    platform: 'Switch',
    image:    'works-09.jpg',
    url:      'https://www.taito.co.jp/taitoldgamecollection/re_birth',
  },
]

app.get('/favicon.svg', (c) => {
  c.header('Content-Type', 'image/svg+xml')
  return c.body(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#2d2d2d"/><text x="16" y="22" text-anchor="middle" font-size="10" fill="#ffffff" font-family="sans-serif" font-weight="bold">GA</text></svg>`)
})
app.get('/favicon.ico', (c) => c.redirect('/favicon.svg', 301))

app.get('/', (c) => c.html(renderHome()))
app.get('/tabs/:tab', (c) => c.html(renderTabPage(c.req.param('tab'))))

// ─────────────────────────────
//  SHARED CSS & LAYOUT
// ─────────────────────────────
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;height:100%;}
body{
  background:#f0eeeb;
  color:#333;
  font-family:'Noto Sans JP','Hiragino Kaku Gothic ProN','Meiryo',sans-serif;
  font-size:15px;
  font-weight:400;
  line-height:1.9;
  -webkit-font-smoothing:antialiased;
  min-height:100vh;
  display:flex;
  flex-direction:column;
}
#ft{margin-top:auto;}
a{color:inherit;text-decoration:none;}
img{display:block;max-width:100%;}

/* ── HEADER ── */
#hd{
  position:fixed;top:0;left:0;right:0;z-index:200;
  background:#2d2d2d;
  height:64px;
  display:flex;align-items:center;
}
.hd-in{
  width:100%;max-width:1100px;margin:0 auto;
  padding:0 clamp(16px,8vw,120px);
  display:flex;align-items:center;justify-content:space-between;
  gap:24px;
}
.logo{
  font-size:clamp(13px,1.8vw,17px);font-weight:700;color:#fff;
  letter-spacing:0.18em;text-transform:uppercase;
  white-space:nowrap;
  flex-shrink:0;
}
.gnav{display:flex;gap:0;list-style:none;}
.gnav a{
  display:block;padding:0 clamp(8px,1.2vw,18px);
  font-size:clamp(9px,1vw,11px);letter-spacing:0.12em;text-transform:uppercase;
  color:#bbb;font-weight:400;
  line-height:64px;
  transition:color .18s,background .18s;
  white-space:nowrap;
}
.gnav a:hover,.gnav a.cur{color:#fff;background:rgba(255,255,255,.06);}
.ham{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px;}
.ham span{display:block;width:22px;height:1px;background:#bbb;}

/* mobile menu */
#mmenu{
  display:none;position:fixed;inset:0;background:#2d2d2d;z-index:199;
  flex-direction:column;align-items:center;justify-content:center;gap:36px;
}
#mmenu.open{display:flex;}
#mmenu a{font-size:14px;letter-spacing:.2em;text-transform:uppercase;color:#bbb;transition:color .2s;}
#mmenu a:hover{color:#fff;}
#mc{position:absolute;top:18px;right:24px;background:none;border:none;color:#888;font-size:20px;cursor:pointer;}

/* ── HERO ── */
.hero{
  position:relative;
  width:100%;
  padding-top:64px; /* header offset */
  overflow:hidden;
}
.hero-img{
  width:100%;height:520px;
  object-fit:cover;object-position:center 40%;
  display:block;
}
/* フォールバック：画像がない場合のグラデーション背景 */
.hero-bg{
  width:100%;height:520px;
  background:linear-gradient(160deg,#1a1a2e 0%,#2d2d3d 40%,#3d3530 100%);
  display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
}
.hero-bg::after{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(ellipse 60% 50% at 50% 50%,rgba(255,255,255,.04) 0%,transparent 70%),
    repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(255,255,255,.015) 60px),
    repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(255,255,255,.015) 60px);
}
.hero-overlay{
  position:absolute;inset:0;
  background:rgba(0,0,0,.42);
}
.hero-text{
  position:absolute;inset:0;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;color:#fff;
  padding:20px;gap:4px;
}
.hero-text p{
  font-size:clamp(16px,3.2vw,30px);
  font-weight:300;letter-spacing:0.08em;
  line-height:1.7;
  text-shadow:0 1px 6px rgba(0,0,0,.5);
}

/* fallback hero copy */
.hero-copy{
  position:relative;z-index:1;text-align:center;color:#fff;padding:20px;
}
.hero-copy p{
  font-size:clamp(16px,3vw,28px);font-weight:300;letter-spacing:.08em;
  line-height:1.8;text-shadow:0 1px 8px rgba(0,0,0,.6);
}

/* ── BODY WRAPPER ── */
.page{max-width:1100px;margin:0 auto;padding:0 clamp(24px,8vw,120px);}

/* ── SECTION ── */
.sec{padding:88px 0;}
.sec-label{
  font-size:18px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:#1a1a1a;
  border-bottom:2px solid #999;
  padding-bottom:16px;
  margin-bottom:52px;
}
.sec-title{
  font-size:clamp(18px,2.5vw,24px);font-weight:400;
  color:#222;letter-spacing:.06em;
  margin-bottom:28px;line-height:1.4;
}

/* ── ABOUT ── */
.about-2col{
  display:grid;
  grid-template-columns:260px 1fr;
  gap:72px;
  align-items:start;
  max-width:960px;
  margin:0 auto;
}
.about-img-wrap{
  position:static;
}
.about-img-wrap img{
  width:100%;height:360px;
  object-fit:cover;object-position:center;
  display:block;
}
.about-body p{
  font-size:14px;font-weight:400;color:#333;line-height:2.3;margin-bottom:0;
}
.about-body p + p{
  margin-top:20px;
}
.about-body .en-catch{
  font-size:13px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;
  color:#444;margin-top:52px;margin-bottom:10px;line-height:2.0;
}
.about-body .en-sub{
  font-size:13px;font-weight:400;color:#888;line-height:2.0;
  margin-top:4px;
}
.skill-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:32px;}
.skill-tag{
  font-size:12px;letter-spacing:.08em;
  border:1px solid #bbb;padding:5px 16px;color:#555;font-weight:400;
  background:transparent;
}

/* ── SNS ── */
.sns-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  border:1px solid #ccc;
  border-right:none;border-bottom:none;
}
.sns-item{
  border-right:1px solid #ccc;border-bottom:1px solid #ccc;
  padding:22px 20px;
  display:flex;align-items:center;gap:14px;
  background:#fff;
  transition:background .18s;
  text-decoration:none;
}
.sns-item:hover{background:#f7f5f0;}
.sns-icon{
  width:38px;height:38px;flex-shrink:0;
  border:1px solid #ccc;background:#f0eeeb;
  display:flex;align-items:center;justify-content:center;
  font-size:15px;color:#666;
}
.sns-name{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#333;margin-bottom:2px;}
.sns-handle{font-size:11px;color:#888;}
.sns-note{font-size:10px;color:#aaa;margin-top:1px;}

/* ── YouTube 動画グリッド ── */
.yt-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:16px;
  margin-top:32px;
}
.yt-card{
  display:block;
  text-decoration:none;
  color:inherit;
}
.yt-card:hover .yt-thumb img{opacity:.85;}
.yt-card:hover .yt-play{opacity:1;}
.yt-thumb{
  position:relative;
  width:100%;
  aspect-ratio:16/9;
  overflow:hidden;
  background:#222;
}
.yt-thumb img{
  width:100%;height:100%;
  object-fit:cover;
  display:block;
  transition:opacity .2s;
}
.yt-play{
  position:absolute;
  inset:0;
  display:flex;align-items:center;justify-content:center;
  opacity:.75;
  transition:opacity .2s;
  pointer-events:none;
}
.yt-play svg{width:48px;height:48px;}
.yt-title{
  font-size:11px;
  color:#555;
  margin-top:6px;
  line-height:1.5;
}

/* store pickup */
.pickup-head{
  display:flex;align-items:baseline;justify-content:space-between;
  margin-top:48px;margin-bottom:16px;
}
.pickup-more{font-size:11px;letter-spacing:.12em;color:#888;text-transform:uppercase;transition:color .18s;}
.pickup-more:hover{color:#333;}
.pickup-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  border:1px solid #ccc;border-right:none;border-bottom:none;
}
.pickup-item{
  border-right:1px solid #ccc;border-bottom:1px solid #ccc;
  padding:22px 20px;background:#fff;
}
.pickup-cat{font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#888;margin-bottom:6px;}
.pickup-title{font-size:13px;color:#222;font-weight:500;line-height:1.5;margin-bottom:6px;}
.pickup-sub{font-size:11px;color:#aaa;}
.pickup-price{font-size:14px;color:#555;margin-top:8px;font-weight:500;}

/* ── SERVICES ── */
.svc-table{
  border:1px solid #ccc;border-bottom:none;width:100%;
}
.svc-row{
  display:grid;grid-template-columns:200px 1fr;
  border-bottom:1px solid #ccc;
  background:#fff;
}
.svc-row:hover{background:#faf9f6;}
.svc-left{
  padding:22px 24px;border-right:1px solid #ccc;
}
.svc-en{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#333;margin-bottom:3px;}
.svc-ja{font-size:11px;color:#999;}
.svc-right{
  padding:22px 28px;font-size:13px;color:#555;line-height:1.95;
}
.svc-right strong{color:#333;font-weight:500;}

.price-note{
  margin-top:2px;padding:20px 24px;
  background:#fff;border:1px solid #ccc;
  display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;
}
.price-note p{font-size:12px;color:#777;}
.btn-contact{
  display:inline-block;padding:10px 26px;
  border:1px solid #999;font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:#555;background:#fff;transition:all .2s;cursor:pointer;white-space:nowrap;
}
.btn-contact:hover{background:#333;color:#fff;border-color:#333;}

/* ── CONTACT ── */
.contact-box{
  background:#fff;border:1px solid #ccc;
  padding:52px 48px;text-align:center;
}
.contact-title{font-size:18px;color:#222;font-weight:400;letter-spacing:.06em;margin-bottom:14px;}
.contact-body{font-size:13px;color:#777;line-height:2;margin-bottom:32px;}
.contact-btns{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;}
.btn-main{
  display:inline-block;padding:12px 32px;
  background:#2d2d2d;color:#fff;
  font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  transition:background .2s;
}
.btn-main:hover{background:#444;}
.btn-sub{
  display:inline-block;padding:12px 32px;
  border:1px solid #bbb;color:#777;
  font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  transition:all .2s;background:#fff;
}
.btn-sub:hover{border-color:#555;color:#333;}

/* ── FOOTER ── */
#ft{
  background:#2d2d2d;
  padding:32px clamp(16px,8vw,120px);margin-top:0;
}
.ft-in{
  max-width:1100px;margin:0 auto;
  display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;
}
.ft-copy{font-size:11px;color:#666;letter-spacing:.1em;}
.ft-nav{display:flex;gap:20px;list-style:none;}
.ft-nav a{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#666;transition:color .18s;}
.ft-nav a:hover{color:#aaa;}

/* ── TABS ── */
.tab-bar{
  background:#2d2d2d;
  position:sticky;top:64px;z-index:100;
  border-bottom:1px solid #444;
}
.tab-bar-in{max-width:1100px;margin:0 auto;padding:0 clamp(16px,8vw,120px);display:flex;}
.tab-btn{
  padding:0 24px;line-height:48px;
  font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:#888;background:none;border:none;cursor:pointer;
  border-bottom:2px solid transparent;
  transition:color .18s;
  text-decoration:none;display:block;
}
.tab-btn:hover{color:#ddd;}
.tab-btn.on{color:#fff;border-bottom-color:#fff;}

.back-link{
  display:inline-flex;align-items:center;gap:8px;
  font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:#888;margin-bottom:32px;transition:color .2s;
}
.back-link:hover{color:#333;}
.back-link::before{content:'← ';}

/* ── WORKS ── */
.wf{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:28px;}
.fb{
  font-size:10px;letter-spacing:.14em;text-transform:uppercase;
  padding:5px 14px;border:1px solid #ccc;color:#888;background:#fff;cursor:pointer;transition:all .18s;
}
.fb:hover,.fb.on{color:#333;border-color:#888;background:#f7f5f0;}

.works-tbl{border:1px solid #ccc;border-bottom:none;width:100%;}
.wrow{
  display:grid;
  grid-template-columns:72px 160px 1fr 160px;
  border-bottom:1px solid #ccc;background:#fff;
  align-items:stretch;
}
/* 列順: 年 | サムネ | テキスト | ジャンル — DOM順で制御 */
.wrow:hover{background:#faf9f6;}
.wy{
  padding:22px 16px;font-size:11px;color:#aaa;letter-spacing:.06em;
  border-right:1px solid #e8e6e1;
  display:flex;align-items:center;justify-content:center;
}
.wb{padding:22px 24px;border-right:1px solid #e8e6e1;}
.wt{font-size:14px;font-weight:500;color:#222;margin-bottom:6px;}
.wt a{color:inherit;text-decoration:none;border-bottom:1px solid transparent;transition:border-color .2s;}
.wt a:hover{border-bottom-color:#aaa;}
.wd{font-size:12px;color:#888;line-height:1.85;margin-bottom:6px;}
.wr{font-size:11px;color:#aaa;}
.wm{padding:22px 16px;display:flex;flex-direction:column;gap:6px;justify-content:center;}
.wtype{
  display:inline-block;font-size:9px;letter-spacing:.16em;text-transform:uppercase;
  border:1px solid #ccc;padding:2px 8px;color:#888;
}
.wplat{font-size:11px;color:#aaa;}
/* サムネイル列 */
.wthumb{
  /* サムネイルは常に 160×90px に固定（画像比率に関わらず統一） */
  width:160px;height:90px;
  min-width:160px;max-width:160px;
  min-height:90px;max-height:90px;
  overflow:hidden;
  display:flex;align-items:center;justify-content:center;
  background:#e8e6e1;
  position:relative;flex-shrink:0;
  align-self:center;
  margin:10px 0;
}
.wthumb img{
  width:100%;height:100%;
  object-fit:cover;object-position:center top;
  display:block;
  flex-shrink:0;
}
.wthumb-none{
  width:160px;height:90px;
  min-width:160px;max-width:160px;
  min-height:90px;max-height:90px;
  background:#e8e6e1;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
}

/* ── EQUIPMENT ── */
.eq-grid{
  display:block;
}
.eq-sec{margin-bottom:8px;}
.eq-toggle{
  width:100%;
  display:flex;align-items:center;justify-content:space-between;
  background:#fff;
  border:none;
  border-bottom:1px solid #ccc;
  padding:14px 18px;
  cursor:pointer;
  text-align:left;
  transition:background .15s;
}
.eq-toggle:hover{background:#f7f5f0;}
.eq-cat{
  font-size:10px;letter-spacing:.24em;text-transform:uppercase;
  color:#888;
  margin:0;
}
.eq-arrow{
  font-size:11px;color:#bbb;
  transition:transform .22s;
  flex-shrink:0;
  margin-left:12px;
}
.eq-sec.open .eq-arrow{transform:rotate(180deg);}
.eq-body{
  overflow:hidden;
  max-height:0;
  transition:max-height .28s ease;
}
.eq-sec.open .eq-body{max-height:2000px;}
.eq-tbl{width:100%;border-collapse:collapse;}
.eq-tbl tr{background:#fff;border-bottom:1px solid #e8e6e1;}
.eq-tbl tr:hover{background:#faf9f6;}
.eq-tbl td{padding:11px 16px;font-size:13px;vertical-align:middle;}
.eq-maker{color:#aaa;font-size:11px;width:38%;letter-spacing:.04em;}
.eq-name{color:#333;font-weight:400;width:62%;}

/* ── STORE ── */
.store-plats{
  display:grid;grid-template-columns:1fr 1fr;
  border:1px solid #ccc;border-right:none;border-bottom:none;
  margin-bottom:36px;
}
.sp-item{
  border-right:1px solid #ccc;border-bottom:1px solid #ccc;
  padding:20px 24px;background:#fff;
  display:flex;align-items:center;justify-content:space-between;
  transition:background .18s;
}
.sp-item:hover{background:#faf9f6;}
.sp-name{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#333;margin-bottom:3px;}
.sp-url{font-size:11px;color:#aaa;}
.sp-arrow{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#aaa;transition:color .18s;}
.sp-item:hover .sp-arrow{color:#555;}

/* 商品グリッド */
.store-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:20px;
  margin-bottom:28px;
}
.si{
  background:#fff;
  border:1px solid #ccc;
  display:flex;flex-direction:column;
  transition:box-shadow .2s;
}
.si:hover{box-shadow:0 4px 16px rgba(0,0,0,.08);}
/* 商品画像（縦長で大きめ） */
.si-img{
  width:100%;
  aspect-ratio:3/4;
  overflow:hidden;
  background:#e8e6e1;
  flex-shrink:0;
}
.si-img img{
  width:100%;height:100%;
  object-fit:cover;
  display:block;
  transition:transform .3s;
}
.si:hover .si-img img{transform:scale(1.03);}
.si-img-none{
  width:100%;aspect-ratio:3/4;
  background:#e8e6e1;
  display:flex;align-items:center;justify-content:center;
}
.si-img-none span{font-size:10px;color:#bbb;letter-spacing:.1em;}
/* 商品情報エリア */
.si-body{
  padding:14px 16px 16px;
  display:flex;flex-direction:column;
  flex:1;
}
.si-head{
  display:flex;align-items:baseline;justify-content:space-between;
  gap:8px;margin-bottom:5px;
}
.si-title{font-size:13px;color:#222;font-weight:500;line-height:1.5;flex:1;}
.si-count{font-size:10px;color:#bbb;letter-spacing:.04em;white-space:nowrap;flex-shrink:0;}
.si-price{font-size:16px;color:#333;font-weight:600;margin-bottom:14px;letter-spacing:.02em;}
.si-buy{
  display:block;text-align:center;
  margin-top:auto;
  font-size:10px;letter-spacing:.14em;text-transform:uppercase;
  padding:9px 14px;border:1px solid #ccc;color:#888;
  background:#fff;transition:all .18s;
}
.si-buy:hover{border-color:#888;color:#333;background:#f7f5f0;}

/* トップPickup */
.pickup-head{
  display:flex;align-items:baseline;justify-content:space-between;
  margin-top:48px;margin-bottom:16px;
}
.pickup-more{font-size:11px;letter-spacing:.12em;color:#888;text-transform:uppercase;transition:color .18s;}
.pickup-more:hover{color:#333;}
.pickup-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:16px;
}
.pickup-item{
  background:#fff;border:1px solid #ccc;
  display:flex;flex-direction:column;
}
.pickup-img{
  width:100%;aspect-ratio:3/4;overflow:hidden;background:#e8e6e1;flex-shrink:0;
}
.pickup-img img{width:100%;height:100%;object-fit:cover;display:block;}
.pickup-img-none{
  width:100%;aspect-ratio:3/4;background:#e8e6e1;
  display:flex;align-items:center;justify-content:center;
}
.pickup-body{padding:14px 16px 16px;flex:1;display:flex;flex-direction:column;}
.pickup-title-row{display:flex;align-items:baseline;justify-content:space-between;gap:6px;margin-bottom:3px;}
.pickup-title{font-size:12px;color:#222;font-weight:500;line-height:1.5;flex:1;}
.pickup-count{font-size:10px;color:#bbb;white-space:nowrap;flex-shrink:0;}
.pickup-price{font-size:13px;color:#555;font-weight:500;}

.store-note{
  background:#fff;border:1px solid #ccc;padding:24px 28px;
}
.sn-title{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#555;margin-bottom:12px;}
.store-note ul{list-style:none;}
.store-note li{font-size:12px;color:#888;padding:3px 0 3px 14px;position:relative;}
.store-note li::before{content:'—';position:absolute;left:0;color:#ccc;}

/* ── DIVIDER ── */
hr.div{border:none;border-top:1px solid #ccc;margin:0;}

/* ── FADE ── */
.fade{opacity:0;transform:translateY(14px);transition:opacity .65s ease,transform .65s ease;}
.fade.in{opacity:1;transform:none;}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .about-2col{grid-template-columns:200px 1fr;gap:36px;max-width:100%;}
  .about-img-wrap img{height:260px;}
  .sns-grid{grid-template-columns:repeat(3,1fr);border-bottom:none;}
  .sns-item{border-bottom:1px solid #ccc;}
  .yt-grid{grid-template-columns:repeat(2,1fr);gap:12px;}
  .pickup-grid{grid-template-columns:1fr 1fr;}
  .svc-row{grid-template-columns:1fr;}
  .svc-left{border-right:none;border-bottom:1px solid #ccc;padding-bottom:14px;}
  .store-grid{grid-template-columns:1fr 1fr;}
  .wrow{grid-template-columns:56px 120px 1fr 0;}
  .wthumb{width:120px;height:68px;min-width:120px;max-width:120px;min-height:68px;max-height:68px;}
  .wthumb img{width:100%;height:100%;}
  .wm{display:none;overflow:hidden;width:0;padding:0;}
}
@media(max-width:640px){
  .sec{padding:56px 0;}
  .about-2col{grid-template-columns:1fr;gap:28px;max-width:100%;}
  .about-img-wrap{position:static;}
  .about-img-wrap img{height:220px;}
  .hd-in{padding:0 16px;}
  .gnav{display:none;}
  .ham{display:flex;}
  .wrow{grid-template-columns:48px 80px 1fr !important;}
  .wm{display:none !important;}
  .wthumb{display:none !important;}
  #hero-slides{height:380px !important;}
  .hero-text p{font-size:14px;}
  .sns-grid{grid-template-columns:1fr 1fr;}
  .yt-grid{grid-template-columns:repeat(2,1fr);gap:10px;}
  .pickup-grid{grid-template-columns:1fr;}
  .store-grid{grid-template-columns:1fr;}
  .store-plats{grid-template-columns:1fr;}
  .contact-box{padding:32px 20px;}
  .tab-bar-in{padding:0 16px;}
  .tab-btn{padding:0 14px;font-size:10px;}


}
`

function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>

<header id="hd">
  <div class="hd-in">
    <a href="/" class="logo">Giverny Audio</a>
    <nav><ul class="gnav">
      <li><a href="/#about">About</a></li>
      <li><a href="/#sns">SNS</a></li>
      <li><a href="/#services">Services</a></li>
      <li><a href="/tabs/works">Works</a></li>
      <li><a href="/tabs/equipment">Equipment</a></li>
      <li><a href="/tabs/store">Store</a></li>
      <li><a href="/#contact">Contact</a></li>
    </ul></nav>
    <div class="ham" onclick="document.getElementById('mmenu').classList.add('open')">
      <span></span><span></span><span></span>
    </div>
  </div>
</header>

<div id="mmenu">
  <button id="mc" onclick="document.getElementById('mmenu').classList.remove('open')">✕</button>
  <a href="/#about" onclick="document.getElementById('mmenu').classList.remove('open')">About</a>
  <a href="/#sns" onclick="document.getElementById('mmenu').classList.remove('open')">SNS</a>
  <a href="/#services" onclick="document.getElementById('mmenu').classList.remove('open')">Services</a>
  <a href="/tabs/works">Works</a>
  <a href="/tabs/equipment">Equipment</a>
  <a href="/tabs/store">Store</a>
  <a href="/#contact" onclick="document.getElementById('mmenu').classList.remove('open')">Contact</a>
</div>

${body}

<footer id="ft">
  <div class="ft-in">
    <p class="ft-copy">© 2024 Giverny Audio. All Rights Reserved.</p>
    <nav><ul class="ft-nav">
      <li><a href="/#about">About</a></li>
      <li><a href="/#services">Services</a></li>
      <li><a href="/tabs/works">Works</a></li>
      <li><a href="/#contact">Contact</a></li>
    </ul></nav>
  </div>
</footer>

<script>
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.07});
document.querySelectorAll('.fade').forEach(el=>io.observe(el));

document.querySelectorAll('a[href^="/#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    if(window.location.pathname!=='/') return;
    e.preventDefault();
    const id=a.getAttribute('href').slice(2);
    const el=document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
  });
});
</script>
</body>
</html>`
}

// ─────────────────────────────
//  HOME
// ─────────────────────────────
function renderHome() {
  const body = `
<!-- HERO SLIDESHOW
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  画像の追加・差し替え方法：
    1. 画像ファイルを public/hero/ フォルダに置く（例: hero-02.jpg）
    2. 下記 JS の HERO_IMAGES 配列にパスを追加するだけ
       例: const HERO_IMAGES = ['/hero/hero-01.jpg', '/hero/hero-02.jpg'];
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<div class="hero" style="padding-top:56px;">
  <div id="hero-slides" style="position:relative;width:100%;height:520px;overflow:hidden;background:#1a1a1a;">
    <!-- スライド（JSで生成） -->
    <!-- テキストオーバーレイ -->
    <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.28) 0%,rgba(0,0,0,.52) 100%);z-index:2;"></div>
    <div style="position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px;gap:0;">
      <p style="font-size:clamp(18px,3.5vw,38px);font-weight:300;color:#fff;letter-spacing:.05em;line-height:1.5;text-shadow:0 2px 12px rgba(0,0,0,.6);">光と色のように、音をつくる。</p>
      <p style="font-size:clamp(11px,1.6vw,16px);font-weight:300;color:rgba(255,255,255,.72);letter-spacing:.18em;margin-top:18px;text-shadow:0 1px 6px rgba(0,0,0,.5);">Giverny Audio &mdash; Game Audio / Sound Design</p>
    </div>
    <!-- スライドインジケーター -->
    <div id="hero-dots" style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);z-index:4;display:flex;gap:8px;"></div>
  </div>
</div>

<script>
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HERO_IMAGES：差し替え・追加はここだけ編集
   public/hero/ に画像を置いてパスを追加するだけでOK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const HERO_IMAGES = [
  '/hero/hero-01.jpg',
  // '/hero/hero-02.jpg',   ← 追加例
  // '/hero/hero-03.jpg',
];
const HERO_INTERVAL = 5000; // 切り替え間隔（ミリ秒）

(function(){
  const wrap = document.getElementById('hero-slides');
  const dots = document.getElementById('hero-dots');
  if(!wrap || HERO_IMAGES.length === 0) return;

  // スライド要素を生成
  HERO_IMAGES.forEach((src, i) => {
    const el = document.createElement('div');
    el.style.cssText = [
      'position:absolute','inset:0',
      'background-size:cover','background-position:center',
      'background-repeat:no-repeat',
      'transition:opacity 1.4s ease',
      'opacity:' + (i === 0 ? '1' : '0'),
      'z-index:1'
    ].join(';');
    el.style.backgroundImage = 'url(' + src + ')';
    el.dataset.idx = String(i);
    wrap.prepend(el);

    // ドット
    if(HERO_IMAGES.length > 1){
      const d = document.createElement('div');
      d.style.cssText = 'width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,' + (i===0?'0.9':'0.35') + ');cursor:pointer;transition:background .3s;';
      d.addEventListener('click', () => goTo(i));
      dots.appendChild(d);
    }
  });

  let cur = 0;
  function goTo(next){
    const slides = wrap.querySelectorAll('[data-idx]');
    const dotEls = dots.querySelectorAll('div');
    slides[cur].style.opacity = '0';
    if(dotEls[cur]) dotEls[cur].style.background = 'rgba(255,255,255,0.35)';
    cur = next;
    slides[cur].style.opacity = '1';
    if(dotEls[cur]) dotEls[cur].style.background = 'rgba(255,255,255,0.9)';
  }

  if(HERO_IMAGES.length > 1){
    setInterval(() => goTo((cur + 1) % HERO_IMAGES.length), HERO_INTERVAL);
  }
})();
</script>

<!-- ABOUT -->
<section id="about" style="background:#f0eeeb;">
  <div class="page sec fade">
    <p class="sec-label">About</p>
    <div class="about-2col">

      <!-- 左列: 写真
           ★ 画像差し替えは src/index.tsx の ABOUT_IMAGE 定数を変更
           ★ 画像ファイルは public/about/ フォルダに置く -->
      <div class="about-img-wrap">
        <img src="${ABOUT_IMAGE}" alt="Giverny Audio - Studio Photo">
      </div>

      <!-- 右列: テキスト -->
      <div class="about-body">
        <p>Giverny Audio はゲームオーディオ / サウンドデザインを専門とする制作スタジオです。<br>
        サウンドの提案から制作、実装などオーディオに関わる部分をワンストップでお任せいただけます。</p>
        <p>専門的な知識と積み重ねてきた技術を活かし、<br>
        クライアントのビジョンに寄り添った質の高いオーディオを提供することを大切にしています。<br>
        ゲームからイマーシブコンテンツまで、幅広い分野において没入できるサウンドをお届けします。</p>
        <p class="en-catch">Giverny Audio <br>is a studio specializing in game audio and sound design.</p>
        <p class="en-sub">From initial concept and creative direction through to production and implementation, we handle the entire audio process under one roof. Grounded in deep expertise and years of experience, we work closely with each client to understand their vision and deliver audio of the highest quality.<br>
        With a track record spanning games and immersive content, we craft sound that draws players and audiences naturally into the worlds they experience.</p>
        <div class="skill-tags">
          <span class="skill-tag">Reaper</span>
          <span class="skill-tag">Wwise</span>
          <span class="skill-tag">ADX2</span>
          <span class="skill-tag">Unity</span>
          <span class="skill-tag">Unreal</span>
          <span class="skill-tag">Field Recording / Foley</span>
        </div>
      </div>

    </div>
  </div>
</section>

<hr class="div">

<!-- SNS / OFFICIAL ACCOUNTS -->
<section id="sns" style="background:#f0eeeb;">
  <div class="page sec fade">
    <p class="sec-label">Official Account</p>
    <div class="sns-grid">

      <!-- Facebook -->
      <a href="${SNS_LINKS.facebook}" target="_blank" rel="noopener" class="sns-item">
        <div class="sns-icon-wrap">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#333" stroke-width="1.8" fill="none"/>
            <path d="M13.5 8H15V5.5H13C11.067 5.5 10 6.567 10 8.5V10H8.5V12.5H10V19H12.5V12.5H14.5L15 10H12.5V8.5C12.5 8.224 12.724 8 13 8H13.5Z" fill="#333"/>
          </svg>
        </div>
        <p class="sns-name">Facebook</p>
      </a>

      <!-- YouTube -->
      <a href="${SNS_LINKS.youtube}" target="_blank" rel="noopener" class="sns-item">
        <div class="sns-icon-wrap">
          <svg width="44" height="30" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="44" height="30" rx="6" fill="#333"/>
            <path d="M18 9.5v11l11-5.5-11-5.5Z" fill="#fff"/>
          </svg>
        </div>
        <p class="sns-name">YouTube</p>
      </a>

      <!-- Instagram -->
      <a href="${SNS_LINKS.instagram}" target="_blank" rel="noopener" class="sns-item">
        <div class="sns-icon-wrap">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="#333" stroke-width="1.8" fill="none"/>
            <circle cx="12" cy="12" r="4.5" stroke="#333" stroke-width="1.8" fill="none"/>
            <circle cx="17.5" cy="6.5" r="1.2" fill="#333"/>
          </svg>
        </div>
        <p class="sns-name">Instagram</p>
      </a>

    </div>

    <!-- YouTube 動画グリッド -->
    <div class="yt-grid">
      ${YOUTUBE_VIDEOS.map(v => `
      <a class="yt-card" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
        <div class="yt-thumb">
          <img src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="${v.title}" loading="lazy">
          <div class="yt-play">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="4" fill="rgba(0,0,0,0.65)"/>
              <path d="M9 7.5v9l8-4.5-8-4.5Z" fill="#fff"/>
            </svg>
          </div>
        </div>
        ${v.title ? `<p class="yt-title">${v.title}</p>` : ''}
      </a>`).join('')}
    </div>

  </div>
</section>

<hr class="div">

<!-- SERVICES -->
<section id="services" style="background:#f0eeeb;">
  <div class="page sec fade">
    <p class="sec-label">Services</p>
    <div class="svc-table">
      <div class="svc-row">
        <div class="svc-left">
          <p class="svc-en">Sound Design</p>
          <p class="svc-ja">サウンドデザイン</p>
        </div>
        <div class="svc-right">
          ゲーム、映像、PVなどの効果音を制作。<br>
          ハイエンドのマイクを駆使した繊細な音素材/屋外収録、効果音ライブラリーも活用してプロフェッショナルなオリジナルサウンド制作を提供。<br>
          Unity/Unreal, Wwise/ADX2の実装実績があり、ゲームエンジンやミドルウェア組み込みも幅広く対応可能。
        </div>
      </div>
      <div class="svc-row">
        <div class="svc-left">
          <p class="svc-en">Audio Recording</p>
          <p class="svc-ja">音声収録</p>
        </div>
        <div class="svc-right">
          iZotope RXによるノイズ除去・整音からゲームエンジン・ミドルウェアへの実装まで一貫して対応いたします。<br>
          また、キャストやスタジオのブッキング、ボイスディレクションも対応が可能ですので、音声収録の全てをお任せいただく事が可能。
        </div>
      </div>
      <div class="svc-row">
        <div class="svc-left">
          <p class="svc-en">Asset Sales</p>
          <p class="svc-ja">素材販売</p>
        </div>
        <div class="svc-right">
          BOOTH / itch.io / Gumroad にて効果音素材や環境音、IRデータを販売中。<br>
          ハイエンドマイク/レコーダーで録音した高品質な効果音素材。<br>
          サラウンド・Ambisonicsで録音された環境音、イマーシブ対応のIRデータも取り揃えています。<br>
          詳しくは、<a href="/tabs/store" style="color:#555;border-bottom:1px solid #bbb;">Store ページ</a> をご覧ください。
        </div>
      </div>
    </div>
    <div class="price-note">
      <p>料金は制作規模・納期などにより異なります。インディーゲーム・個人開発者向けの柔軟なプランも対応可能です。まずはお気軽にご相談ください。</p>
      <a href="/#contact" class="btn-contact">お問い合わせ</a>
    </div>
  </div>
</section>

<hr class="div">

<!-- 販売コンテンツ PICKUP
     ★ 商品の追加・編集は src/index.tsx の STORE_ITEMS 配列を編集してください -->
<section id="pickup" style="background:#f0eeeb;">
  <div class="page sec fade">
    <div class="pickup-head">
      <p class="sec-label" style="margin-bottom:0;">販売コンテンツ — Pickup</p>
      <a href="/tabs/store" class="pickup-more">View All Store →</a>
    </div>
    <div class="pickup-grid">
      ${PICKUP_ITEMS.map(item => `
      <a href="${item.url}" target="_blank" rel="noopener" class="pickup-item">
        <div class="pickup-img">
          ${item.image
            ? `<img src="/store/${item.image}" alt="${item.title}" loading="lazy">`
            : `<div class="pickup-img-none"></div>`}
        </div>
        <div class="pickup-body">
          <div class="pickup-title-row">
            <p class="pickup-title">${item.title}</p>
            ${item.count ? `<span class="pickup-count">${item.count}</span>` : ''}
          </div>
          <p class="pickup-price">${item.price}</p>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>

<hr class="div">

<!-- CONTACT -->
<section id="contact" style="background:#f0eeeb;">
  <div class="page sec fade">
    <p class="sec-label">Contact</p>
    <div class="contact-box">
      <p class="contact-title">お仕事のご依頼・ご相談はこちらから</p>
      <p class="contact-body">
        BGM制作・効果音・サウンドデザインのご依頼、<br>
        素材パックに関するご質問など、お気軽にご連絡ください。<br>
        通常2〜3営業日以内にご返信いたします。
      </p>
      <div class="contact-btns">
        <a href="mailto:info@givernyaudio.jp" class="btn-main">メールで問い合わせる</a>
        <a href="${SNS_LINKS.x}" target="_blank" rel="noopener" class="btn-sub">X / Twitter DM</a>
      </div>
    </div>
  </div>
</section>
`
  return layout('Giverny Audio | Game Audio / Sound Design', body)
}

// ─────────────────────────────
//  TAB PAGE
// ─────────────────────────────
function renderTabPage(tab: string) {
  const tabs = [
    { id: 'works', label: 'Works' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'store', label: 'Store' },
  ]
  const titleMap: Record<string, string> = {
    works: 'Works | Giverny Audio',
    equipment: 'Equipment | Giverny Audio',
    store: 'Store | Giverny Audio',
  }
  let content = ''
  if (tab === 'works') content = renderWorks()
  else if (tab === 'equipment') content = renderEquipment()
  else if (tab === 'store') content = renderStore()
  else content = renderWorks()

  const body = `
<div class="tab-bar">
  <div class="tab-bar-in">
    ${tabs.map(t => `<a href="/tabs/${t.id}" class="tab-btn${t.id === tab ? ' on' : ''}">${t.label}</a>`).join('')}
  </div>
</div>
<div style="background:#f0eeeb;flex:1;">
  <div class="page sec fade">
    <a href="/" class="back-link">Top</a>
    ${content}
  </div>
</div>
`
  return layout(titleMap[tab] || 'Giverny Audio', body)
}

// ─────────────────────────────
//  WORKS
// ─────────────────────────────
function renderWorks() {
  // フィルターボタン用: WORKS_LIST に含まれる year を自動収集（重複除去・降順ソート）
  const years = ['All', ...Array.from(new Set(WORKS_LIST.map(w => w.year))).sort((a, b) => b.localeCompare(a))]
  return `
<p class="sec-label">Works</p>
<div class="wf" id="wf">
  ${years.map((y, i) => `<button class="fb${i === 0 ? ' on' : ''}" onclick="fw('${y === 'All' ? 'all' : y}',this)">${y}</button>`).join('')}
</div>
<div class="works-tbl" id="wl">
${WORKS_LIST.map(w => `
  <div class="wrow" data-y="${w.year}">
    <div class="wy">${w.year}</div>
    <div class="wthumb">
      ${w.image
        ? `<img src="/works/${w.image}" alt="${w.title}" loading="lazy">`
        : `<div class="wthumb-none"></div>`
      }
    </div>
    <div class="wb">
      <p class="wt">${w.url ? `<a href="${w.url}" target="_blank" rel="noopener">${w.title}</a>` : w.title}</p>
      <p class="wd">${w.desc}</p>
      <p class="wr">${w.role}</p>
    </div>
    <div class="wm">
      <span class="wtype">${w.type}</span>
      <p class="wplat">${w.platform}</p>
    </div>
  </div>`).join('')}
</div>
<script>
function fw(y,b){
  document.querySelectorAll('#wl .wrow').forEach(r=>{
    r.style.display=(y==='all'||r.dataset.y===y)?'grid':'none';
  });
  document.querySelectorAll('#wf .fb').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
}
</script>`
}

// ─────────────────────────────
//  EQUIPMENT
// ─────────────────────────────
function renderEquipment() {
  return `
<p class="sec-label">Equipment</p>
<div class="eq-grid">
${EQUIPMENT_LIST.map((sec, i) => `
  <div class="eq-sec${i === 0 ? ' open' : ''}" id="eq-${i}">
    <button class="eq-toggle" onclick="eqToggle(${i})" aria-expanded="${i === 0}">
      <span class="eq-cat">${sec.cat}</span>
      <span class="eq-arrow">▼</span>
    </button>
    <div class="eq-body">
      <table class="eq-tbl">
        ${sec.items.map(item => `
        <tr>
          <td class="eq-maker">${item.maker}</td>
          <td class="eq-name">${item.name}</td>
        </tr>`).join('')}
      </table>
    </div>
  </div>`).join('')}
</div>
<script>
function eqToggle(i){
  const sec = document.getElementById('eq-'+i);
  const isOpen = sec.classList.contains('open');
  sec.classList.toggle('open', !isOpen);
  sec.querySelector('.eq-toggle').setAttribute('aria-expanded', String(!isOpen));
}
</script>`
}

// ─────────────────────────────
//  STORE
// ─────────────────────────────
function renderStore() {
  return `
<p class="sec-label">Store</p>
<div class="store-plats">
  <a href="${STORE_LINKS.base}" target="_blank" rel="noopener" class="sp-item">
    <div><p class="sp-name">BASE</p><p class="sp-url">givernyaudio.base.shop</p></div>
    <span class="sp-arrow">Open →</span>
  </a>
  <a href="${STORE_LINKS.gumroad}" target="_blank" rel="noopener" class="sp-item">
    <div><p class="sp-name">Gumroad</p><p class="sp-url">givernyaudio.gumroad.com</p></div>
    <span class="sp-arrow">Open →</span>
  </a>
</div>
<div class="store-grid">
${STORE_ITEMS.map(item => `
  <div class="si">
    <div class="si-img">
      ${item.image
        ? `<img src="/store/${item.image}" alt="${item.title}" loading="lazy">`
        : `<div class="si-img-none"><span>NO IMAGE</span></div>`}
    </div>
    <div class="si-body">
      <div class="si-head">
        <p class="si-title">${item.title}</p>
        ${item.count ? `<span class="si-count">${item.count}</span>` : ''}
      </div>
      <p class="si-price">${item.price}</p>
      <a href="${item.url}" target="_blank" rel="noopener" class="si-buy">購入する</a>
    </div>
  </div>`).join('')}
</div>
<div class="store-note">
  <p class="sn-title">ご購入前に</p>
  <ul>
    <li>全商品は商用利用可能です（ライセンス詳細は各商品ページをご確認ください）</li>
    <li>再販・再配布・二次配布は禁止です</li>
    <li>ゲーム・映像・配信など幅広い用途に対応しています</li>
    <li>カスタム制作・バルク購入のご相談はお気軽にどうぞ</li>
  </ul>
</div>`
}

export default app
