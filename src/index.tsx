import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

// favicon をインラインで返す
app.get('/favicon.svg', (c) => {
  c.header('Content-Type', 'image/svg+xml')
  return c.body(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#111"/><text x="16" y="22" text-anchor="middle" font-size="13" fill="#c0a060" font-family="serif" font-weight="bold">SF</text></svg>`)
})
app.get('/favicon.ico', (c) => c.redirect('/favicon.svg', 301))

app.get('/', (c) => c.html(renderHome()))
app.get('/tabs/:tab', (c) => c.html(renderTabPage(c.req.param('tab'))))

// ─────────────────────────────────────────
// SHARED LAYOUT
// ─────────────────────────────────────────
function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&family=Noto+Serif+JP:wght@400;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --black:   #0c0c0c;
      --bg:      #111111;
      --surface: #181818;
      --line:    #2a2a2a;
      --line2:   #333333;
      --text:    #d8d8d8;
      --muted:   #707070;
      --white:   #f0f0f0;
      --accent:  #c0a060;   /* ゴールド系 — 落ち着いたワンポイント */
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--black);
      color: var(--text);
      font-family: 'Noto Sans JP', sans-serif;
      font-weight: 300;
      font-size: 14px;
      line-height: 1.9;
      -webkit-font-smoothing: antialiased;
    }

    a { color: inherit; text-decoration: none; }
    img { display: block; max-width: 100%; }

    /* ── HEADER ── */
    #header {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      background: rgba(12,12,12,0.92);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--line);
      height: 60px;
      display: flex;
      align-items: center;
    }
    .header-inner {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      font-family: 'Noto Serif JP', serif;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.18em;
      color: var(--white);
    }
    .logo span {
      color: var(--accent);
    }
    .gnav {
      display: flex;
      gap: 36px;
      list-style: none;
    }
    .gnav a {
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
      transition: color 0.2s;
      padding-bottom: 2px;
      border-bottom: 1px solid transparent;
    }
    .gnav a:hover,
    .gnav a.active {
      color: var(--white);
      border-bottom-color: var(--accent);
    }
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      padding: 4px;
    }
    .hamburger span {
      display: block;
      width: 22px;
      height: 1px;
      background: var(--muted);
      transition: background 0.2s;
    }
    .hamburger:hover span { background: var(--white); }

    /* ── MOBILE MENU ── */
    #mobile-menu {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(12,12,12,0.98);
      z-index: 99;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 40px;
    }
    #mobile-menu.open { display: flex; }
    #mobile-menu a {
      font-size: 13px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--muted);
      transition: color 0.2s;
    }
    #mobile-menu a:hover { color: var(--white); }
    #mobile-close {
      position: absolute;
      top: 20px; right: 28px;
      background: none; border: none;
      color: var(--muted);
      font-size: 22px;
      cursor: pointer;
      line-height: 1;
    }

    /* ── MAIN ── */
    #main { padding-top: 60px; }

    /* ── SECTION COMMONS ── */
    .section {
      padding: 96px 32px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .section-sm {
      padding: 72px 32px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .section-full {
      padding: 96px 32px;
    }

    .section-label {
      display: inline-block;
      font-size: 10px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 12px;
    }
    .section-title {
      font-family: 'Noto Serif JP', serif;
      font-size: clamp(22px, 3vw, 30px);
      font-weight: 600;
      color: var(--white);
      letter-spacing: 0.06em;
      margin-bottom: 48px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--line);
    }

    hr.divider {
      border: none;
      border-top: 1px solid var(--line);
      margin: 0;
    }

    /* ── HERO ── */
    .hero {
      min-height: calc(100vh - 60px);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 0 32px 80px;
      max-width: 1100px;
      margin: 0 auto;
      position: relative;
    }
    .hero-eyecatch {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-60%);
      width: min(48vw, 520px);
      opacity: 0.07;
      pointer-events: none;
      user-select: none;
      font-family: 'Noto Serif JP', serif;
      font-size: min(18vw, 200px);
      font-weight: 600;
      color: var(--white);
      letter-spacing: -0.02em;
      line-height: 1;
      text-align: right;
    }
    .hero-sub {
      font-size: 11px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 20px;
    }
    .hero-title {
      font-family: 'Noto Serif JP', serif;
      font-size: clamp(32px, 5vw, 58px);
      font-weight: 600;
      color: var(--white);
      letter-spacing: 0.08em;
      line-height: 1.25;
      margin-bottom: 32px;
    }
    .hero-desc {
      font-size: 13px;
      color: var(--muted);
      line-height: 2;
      max-width: 480px;
      margin-bottom: 40px;
    }
    .hero-scroll {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 10px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .hero-scroll::before {
      content: '';
      display: block;
      width: 40px;
      height: 1px;
      background: var(--muted);
    }

    /* ── ABOUT ── */
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: start;
    }
    .about-name {
      font-family: 'Noto Serif JP', serif;
      font-size: 22px;
      font-weight: 600;
      color: var(--white);
      letter-spacing: 0.06em;
      margin-bottom: 6px;
    }
    .about-role {
      font-size: 11px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 28px;
    }
    .about-text {
      font-size: 13px;
      color: var(--muted);
      line-height: 2.1;
      margin-bottom: 16px;
    }
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 24px;
    }
    .tag {
      font-size: 10px;
      letter-spacing: 0.12em;
      color: var(--muted);
      border: 1px solid var(--line2);
      padding: 4px 12px;
    }

    .about-points {
      display: flex;
      flex-direction: column;
      gap: 1px;
      background: var(--line);
    }
    .about-point {
      background: var(--surface);
      padding: 28px 28px;
    }
    .about-point-title {
      font-size: 11px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--white);
      margin-bottom: 8px;
    }
    .about-point-text {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.9;
    }

    /* ── SNS ── */
    .sns-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: var(--line);
    }
    .sns-item {
      background: var(--surface);
      padding: 28px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: background 0.2s;
    }
    .sns-item:hover { background: #202020; }
    .sns-icon {
      width: 40px;
      height: 40px;
      border: 1px solid var(--line2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: var(--muted);
      flex-shrink: 0;
    }
    .sns-name {
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--white);
      margin-bottom: 3px;
    }
    .sns-handle {
      font-size: 11px;
      color: var(--muted);
    }
    .sns-desc {
      font-size: 10px;
      color: #555;
      margin-top: 2px;
    }

    /* store pickup */
    .pickup-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: var(--line);
    }
    .pickup-item {
      background: var(--surface);
      padding: 24px;
    }
    .pickup-category {
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 8px;
    }
    .pickup-title {
      font-size: 13px;
      color: var(--white);
      font-weight: 500;
      margin-bottom: 6px;
      line-height: 1.5;
    }
    .pickup-price {
      font-size: 13px;
      color: var(--accent);
      font-family: 'Noto Serif JP', serif;
      margin-top: 10px;
    }
    .pickup-sub {
      font-size: 11px;
      color: var(--muted);
    }

    /* ── SERVICES ── */
    .services-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
      background: var(--line);
    }
    .service-row {
      background: var(--surface);
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 0;
    }
    .service-label {
      padding: 28px 28px;
      border-right: 1px solid var(--line);
    }
    .service-label-en {
      font-size: 11px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--white);
      margin-bottom: 4px;
    }
    .service-label-ja {
      font-size: 11px;
      color: var(--muted);
    }
    .service-body {
      padding: 28px 32px;
      font-size: 13px;
      color: var(--muted);
      line-height: 2;
    }
    .service-body strong {
      color: var(--text);
      font-weight: 400;
    }

    /* ── CONTACT ── */
    .contact-box {
      background: var(--surface);
      border: 1px solid var(--line);
      padding: 56px;
      text-align: center;
    }
    .contact-title {
      font-family: 'Noto Serif JP', serif;
      font-size: 20px;
      font-weight: 600;
      color: var(--white);
      letter-spacing: 0.06em;
      margin-bottom: 16px;
    }
    .contact-text {
      font-size: 13px;
      color: var(--muted);
      line-height: 2;
      margin-bottom: 36px;
    }
    .contact-btns {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 32px;
      font-size: 11px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary {
      background: var(--white);
      color: var(--black);
      border: 1px solid var(--white);
    }
    .btn-primary:hover {
      background: transparent;
      color: var(--white);
    }
    .btn-secondary {
      background: transparent;
      color: var(--muted);
      border: 1px solid var(--line2);
    }
    .btn-secondary:hover {
      color: var(--white);
      border-color: var(--muted);
    }

    /* ── FOOTER ── */
    #footer {
      border-top: 1px solid var(--line);
      padding: 48px 32px;
    }
    .footer-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .footer-copy {
      font-size: 11px;
      color: #444;
      letter-spacing: 0.12em;
    }
    .footer-nav {
      display: flex;
      gap: 24px;
      list-style: none;
    }
    .footer-nav a {
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #444;
      transition: color 0.2s;
    }
    .footer-nav a:hover { color: var(--muted); }

    /* ── TABS PAGE ── */
    .tabs-header {
      background: var(--black);
      border-bottom: 1px solid var(--line);
      position: sticky;
      top: 60px;
      z-index: 50;
    }
    .tabs-header-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 32px;
      display: flex;
      gap: 0;
    }
    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 18px 28px;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      background: none;
      border-left: none;
      border-right: none;
      border-top: none;
      cursor: pointer;
      text-decoration: none;
    }
    .tab-btn:hover { color: var(--white); }
    .tab-btn.active {
      color: var(--white);
      border-bottom-color: var(--accent);
    }

    /* ── WORKS ── */
    .works-filter {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 40px;
    }
    .filter-btn {
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 6px 16px;
      border: 1px solid var(--line2);
      color: var(--muted);
      background: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-btn:hover, .filter-btn.active {
      color: var(--white);
      border-color: var(--muted);
    }

    .works-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
      background: var(--line);
    }
    .works-row {
      background: var(--surface);
      display: grid;
      grid-template-columns: 80px 1fr 180px;
      gap: 0;
      align-items: start;
    }
    .works-year {
      padding: 28px 20px;
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 0.1em;
      border-right: 1px solid var(--line);
    }
    .works-body {
      padding: 28px 32px;
      border-right: 1px solid var(--line);
    }
    .works-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--white);
      margin-bottom: 6px;
      letter-spacing: 0.04em;
    }
    .works-desc {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.9;
      margin-bottom: 10px;
    }
    .works-role {
      font-size: 11px;
      color: #555;
    }
    .works-meta {
      padding: 28px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .works-type {
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--accent);
      border: 1px solid rgba(192,160,96,0.3);
      padding: 3px 10px;
      display: inline-block;
    }
    .works-platform {
      font-size: 11px;
      color: var(--muted);
    }

    /* ── EQUIPMENT ── */
    .equip-section {
      margin-bottom: 56px;
    }
    .equip-category {
      font-size: 10px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--accent);
      padding-bottom: 12px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 1px;
    }
    .equip-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--line);
      gap: 1px;
    }
    .equip-table tr {
      background: var(--surface);
    }
    .equip-table tr + tr {
      border-top: 1px solid var(--line);
    }
    .equip-table td {
      padding: 16px 20px;
      font-size: 13px;
    }
    .equip-table td:first-child {
      color: var(--white);
      font-weight: 400;
      width: 280px;
      border-right: 1px solid var(--line);
    }
    .equip-table td:nth-child(2) {
      color: var(--muted);
      width: 180px;
      border-right: 1px solid var(--line);
      font-size: 12px;
    }
    .equip-table td:last-child {
      color: #555;
      font-size: 11px;
      letter-spacing: 0.08em;
    }

    /* ── STORE ── */
    .store-platforms {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      background: var(--line);
      margin-bottom: 48px;
    }
    .store-platform-item {
      background: var(--surface);
      padding: 24px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background 0.2s;
    }
    .store-platform-item:hover { background: #1e1e1e; }
    .store-platform-name {
      font-size: 12px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--white);
      margin-bottom: 4px;
    }
    .store-platform-url {
      font-size: 11px;
      color: var(--muted);
    }
    .arrow-link {
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: color 0.2s;
    }
    .arrow-link::after {
      content: '→';
    }
    .store-platform-item:hover .arrow-link { color: var(--white); }

    .store-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: var(--line);
      margin-bottom: 40px;
    }
    .store-item {
      background: var(--surface);
      padding: 28px 24px;
    }
    .store-category {
      font-size: 10px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 10px;
    }
    .store-title {
      font-size: 13px;
      color: var(--white);
      font-weight: 500;
      margin-bottom: 10px;
      line-height: 1.6;
    }
    .store-desc {
      font-size: 12px;
      color: var(--muted);
      line-height: 1.9;
      margin-bottom: 16px;
    }
    .store-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    }
    .store-tag {
      font-size: 10px;
      color: #555;
      border: 1px solid var(--line);
      padding: 2px 8px;
      letter-spacing: 0.08em;
    }
    .store-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16px;
      border-top: 1px solid var(--line);
    }
    .store-price {
      font-family: 'Noto Serif JP', serif;
      font-size: 14px;
      color: var(--accent);
    }
    .store-count {
      font-size: 10px;
      color: #555;
      margin-top: 2px;
    }
    .store-buy {
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
      border: 1px solid var(--line2);
      padding: 6px 14px;
      transition: all 0.2s;
    }
    .store-buy:hover {
      color: var(--white);
      border-color: var(--muted);
    }

    .store-note {
      background: var(--surface);
      border: 1px solid var(--line);
      padding: 28px 32px;
    }
    .store-note-title {
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--white);
      margin-bottom: 12px;
    }
    .store-note ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .store-note li {
      font-size: 12px;
      color: var(--muted);
      padding-left: 16px;
      position: relative;
    }
    .store-note li::before {
      content: '—';
      position: absolute;
      left: 0;
      color: #444;
    }

    /* ── BACK LINK ── */
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 40px;
      transition: color 0.2s;
    }
    .back-link::before { content: '←'; }
    .back-link:hover { color: var(--white); }

    /* ── RESPONSIVE ── */
    @media (max-width: 900px) {
      .about-grid { grid-template-columns: 1fr; gap: 40px; }
      .sns-grid { grid-template-columns: 1fr 1fr; }
      .pickup-grid { grid-template-columns: 1fr; }
      .works-row { grid-template-columns: 64px 1fr; }
      .works-meta { display: none; }
      .store-grid { grid-template-columns: 1fr 1fr; }
      .service-row { grid-template-columns: 1fr; }
      .service-label { border-right: none; border-bottom: 1px solid var(--line); }
    }
    @media (max-width: 640px) {
      .section, .section-sm { padding: 64px 20px; }
      .section-full { padding: 64px 20px; }
      .hero { padding: 0 20px 64px; }
      .header-inner { padding: 0 20px; }
      .gnav { display: none; }
      .hamburger { display: flex; }
      .sns-grid { grid-template-columns: 1fr; }
      .store-grid { grid-template-columns: 1fr; }
      .store-platforms { grid-template-columns: 1fr; }
      .contact-box { padding: 40px 24px; }
      .equip-table td:nth-child(2) { display: none; }
      .tabs-header-inner { padding: 0 12px; }
      .tab-btn { padding: 16px 16px; font-size: 10px; }
    }

    /* ── FADE IN ── */
    .fade {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .fade.in { opacity: 1; transform: none; }
  </style>
</head>
<body>

<!-- HEADER -->
<header id="header">
  <div class="header-inner">
    <a href="/" class="logo">Sound<span>Forge</span></a>
    <nav>
      <ul class="gnav">
        <li><a href="/#about">About</a></li>
        <li><a href="/#sns">SNS</a></li>
        <li><a href="/#services">Services</a></li>
        <li><a href="/tabs/works">Works</a></li>
        <li><a href="/tabs/equipment">Equipment</a></li>
        <li><a href="/tabs/store">Store</a></li>
        <li><a href="/#contact">Contact</a></li>
      </ul>
    </nav>
    <div class="hamburger" onclick="document.getElementById('mobile-menu').classList.add('open')" aria-label="メニュー">
      <span></span><span></span><span></span>
    </div>
  </div>
</header>

<!-- MOBILE MENU -->
<div id="mobile-menu">
  <button id="mobile-close" onclick="document.getElementById('mobile-menu').classList.remove('open')" aria-label="閉じる">✕</button>
  <a href="/#about" onclick="document.getElementById('mobile-menu').classList.remove('open')">About</a>
  <a href="/#sns" onclick="document.getElementById('mobile-menu').classList.remove('open')">SNS</a>
  <a href="/#services" onclick="document.getElementById('mobile-menu').classList.remove('open')">Services</a>
  <a href="/tabs/works">Works</a>
  <a href="/tabs/equipment">Equipment</a>
  <a href="/tabs/store">Store</a>
  <a href="/#contact" onclick="document.getElementById('mobile-menu').classList.remove('open')">Contact</a>
</div>

<div id="main">
${body}
</div>

<!-- FOOTER -->
<footer id="footer">
  <div class="footer-inner">
    <p class="footer-copy">© 2024 SoundForge. All Rights Reserved.</p>
    <nav>
      <ul class="footer-nav">
        <li><a href="/#about">About</a></li>
        <li><a href="/#services">Services</a></li>
        <li><a href="/tabs/works">Works</a></li>
        <li><a href="/#contact">Contact</a></li>
      </ul>
    </nav>
  </div>
</footer>

<script>
  // Fade in
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade').forEach(el => io.observe(el));

  // Smooth anchor
  document.querySelectorAll('a[href^="/#"]').forEach(a => {
    a.addEventListener('click', e => {
      if (window.location.pathname !== '/') return;
      e.preventDefault();
      const id = a.getAttribute('href').slice(2);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
</script>
</body>
</html>`
}

// ─────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────
function renderHome() {
  const body = `
<!-- HERO -->
<div style="max-width:1100px; margin:0 auto; position:relative; overflow:hidden;">
  <div class="hero">
    <div class="hero-eyecatch" aria-hidden="true">SOUND</div>
    <p class="hero-sub">Game Audio Production</p>
    <h1 class="hero-title">Sound Design<br>for Games.</h1>
    <p class="hero-desc">ゲームBGM・効果音・サウンドデザインを<br>ワンストップで制作する個人スタジオ。<br>インディーから商業タイトルまで対応。</p>
    <span class="hero-scroll">Scroll</span>
  </div>
</div>
<hr class="divider">

<!-- ABOUT -->
<section id="about">
  <div class="section fade">
    <p class="section-label">About</p>
    <h2 class="section-title">プロフィール</h2>
    <div class="about-grid">
      <div>
        <p class="about-name">田中 悠樹</p>
        <p class="about-role">Sound Designer &amp; Composer</p>
        <p class="about-text">
          ゲームオーディオ専門の個人クリエイター。<br>
          インディーゲームから商業タイトルまで、プレイヤーを没入させる音楽と効果音を制作しています。
        </p>
        <p class="about-text">
          DAWはAbleton LiveおよびReaperを使用。オーケストラ・シンセ・アンビエント・電子音楽など幅広いジャンルに対応しています。効果音はフィールドレコーディングした独自素材を多数活用。Wwise / Unity Audioなど、ゲームエンジンへのオーディオ実装サポートも承ります。
        </p>
        <p class="about-text">
          GAME SOUND TO REALIZE YOUR VISION.<br>
          FULFILLS ALL YOUR AUDIO NEEDS.
        </p>
        <div class="tag-list">
          <span class="tag">Ableton Live</span>
          <span class="tag">Reaper</span>
          <span class="tag">Wwise</span>
          <span class="tag">FMOD Studio</span>
          <span class="tag">Unity Audio</span>
          <span class="tag">Field Recording</span>
          <span class="tag">iZotope RX</span>
        </div>
      </div>
      <div class="about-points">
        <div class="about-point">
          <p class="about-point-title">BGM / Music</p>
          <p class="about-point-text">ゲームの世界観に合わせたオリジナルBGMを制作。バトル・探索・タウン・エンディングなど全シーンに対応。ループ設計、スティンガー制作も可能です。</p>
        </div>
        <div class="about-point">
          <p class="about-point-title">Sound Effects</p>
          <p class="about-point-text">UI音・攻撃音・魔法・環境音・フォーリーなど、ゲームに必要なすべての効果音を制作。フィールドレコーディング素材も豊富に活用します。</p>
        </div>
        <div class="about-point">
          <p class="about-point-title">Sound Design</p>
          <p class="about-point-text">アンビエント・インタラクティブサウンド・アダプティブミュージックなど、ゲーム体験を強化するサウンドデザインを提供します。</p>
        </div>
      </div>
    </div>
  </div>
</section>
<hr class="divider">

<!-- SNS / ACCOUNTS -->
<section id="sns">
  <div class="section fade">
    <p class="section-label">Official Accounts</p>
    <h2 class="section-title">SNS・販売ページ</h2>
    <div class="sns-grid">
      <a href="https://twitter.com/" target="_blank" rel="noopener" class="sns-item">
        <div class="sns-icon">𝕏</div>
        <div>
          <p class="sns-name">X / Twitter</p>
          <p class="sns-handle">@soundforge_game</p>
          <p class="sns-desc">制作進捗・新作情報など</p>
        </div>
      </a>
      <a href="https://youtube.com/" target="_blank" rel="noopener" class="sns-item">
        <div class="sns-icon">▶</div>
        <div>
          <p class="sns-name">YouTube</p>
          <p class="sns-handle">SoundForge Channel</p>
          <p class="sns-desc">楽曲試聴・制作メイキング動画</p>
        </div>
      </a>
      <a href="https://soundcloud.com/" target="_blank" rel="noopener" class="sns-item">
        <div class="sns-icon">◉</div>
        <div>
          <p class="sns-name">SoundCloud</p>
          <p class="sns-handle">soundforge-music</p>
          <p class="sns-desc">楽曲ポートフォリオ</p>
        </div>
      </a>
      <a href="https://booth.pm/" target="_blank" rel="noopener" class="sns-item">
        <div class="sns-icon">⊡</div>
        <div>
          <p class="sns-name">BOOTH</p>
          <p class="sns-handle">soundforge.booth.pm</p>
          <p class="sns-desc">BGM・SE素材パック販売</p>
        </div>
      </a>
      <a href="https://itch.io/" target="_blank" rel="noopener" class="sns-item">
        <div class="sns-icon">⊕</div>
        <div>
          <p class="sns-name">itch.io</p>
          <p class="sns-handle">soundforge.itch.io</p>
          <p class="sns-desc">ゲーム向け素材販売</p>
        </div>
      </a>
      <a href="https://www.instagram.com/" target="_blank" rel="noopener" class="sns-item">
        <div class="sns-icon">◻</div>
        <div>
          <p class="sns-name">Instagram</p>
          <p class="sns-handle">@soundforge_game</p>
          <p class="sns-desc">制作風景・機材紹介</p>
        </div>
      </a>
    </div>

    <!-- Store pickup -->
    <div style="display:flex; align-items:baseline; justify-content:space-between; margin-top:56px; margin-bottom:20px;">
      <p class="section-label" style="margin:0;">販売コンテンツ — Pickup</p>
      <a href="/tabs/store" class="arrow-link" style="font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--muted); display:flex; align-items:center; gap:8px; transition:color 0.2s;" onmouseover="this.style.color='var(--white)'" onmouseout="this.style.color='var(--muted)'">すべて見る →</a>
    </div>
    <div class="pickup-grid">
      <div class="pickup-item">
        <p class="pickup-category">BGM Pack</p>
        <p class="pickup-title">Fantasy RPG BGM Pack Vol.1</p>
        <p class="pickup-sub">20曲収録 / ループ対応 / 商用利用可</p>
        <p class="pickup-price">¥2,980</p>
      </div>
      <div class="pickup-item">
        <p class="pickup-category">SE Pack</p>
        <p class="pickup-title">Battle Sound Effects Pack</p>
        <p class="pickup-sub">100+音源 / WAV 48kHz/24bit</p>
        <p class="pickup-price">¥1,480</p>
      </div>
      <div class="pickup-item">
        <p class="pickup-category">Ambient</p>
        <p class="pickup-title">Dark Ambient &amp; Horror Pack</p>
        <p class="pickup-sub">15曲 + 環境音50音源</p>
        <p class="pickup-price">¥3,480</p>
      </div>
    </div>
  </div>
</section>
<hr class="divider">

<!-- SERVICES -->
<section id="services">
  <div class="section fade">
    <p class="section-label">Services</p>
    <h2 class="section-title">サービス</h2>
    <div class="services-list">
      <div class="service-row">
        <div class="service-label">
          <p class="service-label-en">BGM Composition</p>
          <p class="service-label-ja">BGM・楽曲制作</p>
        </div>
        <div class="service-body">
          ゲームのジャンル・世界観に合わせたオリジナルBGMを制作します。バトル・フィールド・タウン・エンディングなど、シーンに応じた楽曲を提供。<strong>ループ設計済み</strong>で納品。スティンガー・ジングルも対応。Wwise / FMOD との連携も可能です。
        </div>
      </div>
      <div class="service-row">
        <div class="service-label">
          <p class="service-label-en">Sound Effects</p>
          <p class="service-label-ja">効果音制作</p>
        </div>
        <div class="service-body">
          攻撃・魔法・UI・足音・環境音など、ゲームに必要なSEをワンストップで制作。フィールドレコーディング素材も活用した<strong>リアリティのある音</strong>を提供します。WAV / OGG / MP3 各種フォーマット対応。バリエーション・ランダム再生セットにも対応。
        </div>
      </div>
      <div class="service-row">
        <div class="service-label">
          <p class="service-label-en">Sound Design</p>
          <p class="service-label-ja">サウンドデザイン</p>
        </div>
        <div class="service-body">
          アンビエント・インタラクティブサウンド・アダプティブミュージックなど、<strong>ゲーム体験を深める</strong>サウンドデザインを提供。3Dオーディオ設計やミドルウェアを活用したインタラクティブなオーディオ構築も対応します。
        </div>
      </div>
      <div class="service-row">
        <div class="service-label">
          <p class="service-label-en">Voice / Narration</p>
          <p class="service-label-ja">ボイス・ナレーション収録</p>
        </div>
        <div class="service-body">
          ナレーション収録・ボイスディレクション。宅録・スタジオ収録いずれも対応。iZotope RXによるノイズ除去・整音まで一貫して対応します。多言語収録はご相談ください。
        </div>
      </div>
      <div class="service-row">
        <div class="service-label">
          <p class="service-label-en">Audio Implementation</p>
          <p class="service-label-ja">オーディオ実装サポート</p>
        </div>
        <div class="service-body">
          Unity / Unreal Engine へのオーディオ実装をサポート。Wwise・FMOD の設定、インタラクティブオーディオの構築、<strong>パフォーマンス最適化</strong>まで対応します。
        </div>
      </div>
      <div class="service-row">
        <div class="service-label">
          <p class="service-label-en">Asset Sales</p>
          <p class="service-label-ja">素材パック販売</p>
        </div>
        <div class="service-body">
          BOOTH・itch.io にてゲーム向けBGM・SEパックを販売中。個人・インディー開発者向けのリーズナブルな素材も多数取り揃えています。<a href="/tabs/store" style="color:var(--accent); border-bottom:1px solid rgba(192,160,96,0.4);">Store ページ</a>をご覧ください。
        </div>
      </div>
    </div>

    <div style="margin-top:24px; background:var(--surface); border:1px solid var(--line); padding:28px 32px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:20px;">
      <div>
        <p style="font-size:12px; color:var(--white); margin-bottom:4px;">料金について</p>
        <p style="font-size:12px; color:var(--muted);">制作規模・曲数・納期などにより異なります。インディーゲーム・個人開発者向けの柔軟なプランも対応可能です。</p>
      </div>
      <a href="/#contact" class="btn btn-secondary">お問い合わせ</a>
    </div>
  </div>
</section>
<hr class="divider">

<!-- CONTACT -->
<section id="contact">
  <div class="section fade">
    <p class="section-label">Contact</p>
    <h2 class="section-title">お問い合わせ</h2>
    <div class="contact-box">
      <p class="contact-title">お仕事のご依頼・ご相談はこちらから</p>
      <p class="contact-text">
        BGM制作・効果音・サウンドデザインのご依頼、<br>
        素材パックに関するご質問など、お気軽にご連絡ください。<br>
        通常2〜3営業日以内にご返信いたします。
      </p>
      <div class="contact-btns">
        <a href="mailto:info@soundforge.jp" class="btn btn-primary">メールで問い合わせる</a>
        <a href="https://twitter.com/" target="_blank" rel="noopener" class="btn btn-secondary">X / Twitter DM</a>
      </div>
    </div>
  </div>
</section>
`
  return layout('SoundForge | Game Audio Production', body)
}

// ─────────────────────────────────────────
// TAB PAGE
// ─────────────────────────────────────────
function renderTabPage(tab: string) {
  const tabs = [
    { id: 'works', label: 'Works' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'store', label: 'Store' },
  ]
  const titles: Record<string, string> = {
    works: 'Works | SoundForge',
    equipment: 'Equipment | SoundForge',
    store: 'Store | SoundForge',
  }

  let content = ''
  if (tab === 'works') content = renderWorks()
  else if (tab === 'equipment') content = renderEquipment()
  else if (tab === 'store') content = renderStore()
  else content = renderWorks()

  const body = `
<div class="tabs-header">
  <div class="tabs-header-inner">
    ${tabs.map(t => `<a href="/tabs/${t.id}" class="tab-btn${t.id === tab ? ' active' : ''}">${t.label}</a>`).join('')}
  </div>
</div>
<div class="section fade">
  <a href="/" class="back-link">Top</a>
  ${content}
</div>
`
  return layout(titles[tab] || 'SoundForge', body)
}

// ─────────────────────────────────────────
// WORKS
// ─────────────────────────────────────────
function renderWorks() {
  const works = [
    { year: '2024', title: 'Echoes of the Abyss', type: 'RPG', platform: 'PC / Steam', role: 'BGM全曲制作・SE制作', desc: 'ダークファンタジーRPG。オーケストラとシンセを融合させた異世界感のあるサウンドトラック。' },
    { year: '2023', title: 'Stellar Drift', type: 'Action', platform: 'PC / Switch', role: 'BGM・アンビエント制作', desc: 'SF横スクロールアクション。電子音楽とオーケストラを組み合わせた疾走感のあるサウンド。' },
    { year: '2023', title: 'Sengoku Chronicles', type: 'Strategy', platform: 'PC / Mobile', role: 'BGM・SE全収録', desc: '戦国時代ストラテジー。和楽器を中心にオーケストラも取り入れた重厚な楽曲群。' },
    { year: '2022', title: 'Phantom Protocol', type: 'Horror', platform: 'PC', role: 'アンビエント・SE制作', desc: 'サイコロジカルホラー。フィールドレコーディング素材を加工した不安を煽るサウンドデザイン。' },
    { year: '2022', title: 'Pixel Sports Club', type: 'Sports', platform: 'Mobile', role: 'BGM・SE制作', desc: 'カジュアルスポーツゲーム。明るく親しみやすいBGMと爽快感のある効果音。' },
    { year: '2021', title: 'Mindfield', type: 'Puzzle', platform: 'PC / Mobile', role: 'BGM・UI音制作', desc: 'ロジックパズル。集中力を高めるアンビエント系BGMとシンプルなUI音。' },
  ]

  return `
<p class="section-label">Works</p>
<h2 class="section-title">実績</h2>
<div class="works-filter" id="wf">
  <button class="filter-btn active" onclick="filterW('all',this)">All</button>
  <button class="filter-btn" onclick="filterW('RPG',this)">RPG</button>
  <button class="filter-btn" onclick="filterW('Action',this)">Action</button>
  <button class="filter-btn" onclick="filterW('Horror',this)">Horror</button>
  <button class="filter-btn" onclick="filterW('Strategy',this)">Strategy</button>
</div>
<div class="works-list" id="wl">
  ${works.map(w => `
  <div class="works-row" data-type="${w.type}">
    <div class="works-year">${w.year}</div>
    <div class="works-body">
      <p class="works-title">${w.title}</p>
      <p class="works-desc">${w.desc}</p>
      <p class="works-role">${w.role}</p>
    </div>
    <div class="works-meta">
      <span class="works-type">${w.type}</span>
      <p class="works-platform">${w.platform}</p>
    </div>
  </div>`).join('')}
</div>
<script>
function filterW(type, btn) {
  document.querySelectorAll('#wl .works-row').forEach(r => {
    r.style.display = (type === 'all' || r.dataset.type === type) ? '' : 'none';
  });
  document.querySelectorAll('#wf .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
</script>`
}

// ─────────────────────────────────────────
// EQUIPMENT
// ─────────────────────────────────────────
function renderEquipment() {
  return `
<p class="section-label">Equipment</p>
<h2 class="section-title">機材リスト</h2>

<div class="equip-section">
  <p class="equip-category">DAW / Software</p>
  <table class="equip-table">
    <tr><td>Ableton Live 12 Suite</td><td>Ableton</td><td>BGM制作・電子音楽</td></tr>
    <tr><td>Reaper 7</td><td>Cockos</td><td>SE制作・整音</td></tr>
    <tr><td>Wwise 2023</td><td>Audiokinetic</td><td>ゲームエンジン連携</td></tr>
    <tr><td>FMOD Studio</td><td>Firelight Technologies</td><td>インタラクティブオーディオ</td></tr>
    <tr><td>iZotope RX 11</td><td>iZotope</td><td>ノイズ除去・音声修復</td></tr>
  </table>
</div>

<div class="equip-section">
  <p class="equip-category">Plugins / Instruments</p>
  <table class="equip-table">
    <tr><td>Spitfire BBCSO Pro</td><td>Spitfire Audio</td><td>オーケストラ音源</td></tr>
    <tr><td>Kontakt 7</td><td>Native Instruments</td><td>サンプラー</td></tr>
    <tr><td>Serum</td><td>Xfer Records</td><td>シンセサイザー</td></tr>
    <tr><td>Omnisphere 3</td><td>Spectrasonics</td><td>シンセ・テクスチャー</td></tr>
    <tr><td>FabFilter Pro Bundle</td><td>FabFilter</td><td>EQ / コンプ / リミッター</td></tr>
    <tr><td>Waves SSL Bundle</td><td>Waves</td><td>チャンネルストリップ</td></tr>
    <tr><td>Soundtoys 5</td><td>Soundtoys</td><td>エフェクト群</td></tr>
    <tr><td>Hybrid Keys</td><td>Spitfire Audio</td><td>ピアノ・キーボード</td></tr>
  </table>
</div>

<div class="equip-section">
  <p class="equip-category">Hardware</p>
  <table class="equip-table">
    <tr><td>MacBook Pro 16" M3 Max</td><td>Apple</td><td>メインPC</td></tr>
    <tr><td>Apollo Twin X Duo</td><td>Universal Audio</td><td>オーディオインターフェース</td></tr>
    <tr><td>Neumann TLM 103</td><td>Neumann</td><td>コンデンサーマイク</td></tr>
    <tr><td>Genelec 8341A (Pair)</td><td>Genelec</td><td>モニタースピーカー</td></tr>
    <tr><td>Sony MDR-M1ST</td><td>Sony</td><td>モニターヘッドフォン</td></tr>
    <tr><td>Arturia KeyLab 88 MkII</td><td>Arturia</td><td>MIDIキーボード</td></tr>
    <tr><td>Arturia DrumBrute Impact</td><td>Arturia</td><td>ドラムマシン</td></tr>
  </table>
</div>

<div class="equip-section">
  <p class="equip-category">Field Recording</p>
  <table class="equip-table">
    <tr><td>Zoom H6</td><td>Zoom</td><td>6ch フィールドレコーダー</td></tr>
    <tr><td>Sony PCM-D100</td><td>Sony</td><td>ハイレゾフィールドレコーダー</td></tr>
    <tr><td>Sennheiser MKH 416</td><td>Sennheiser</td><td>ショットガンマイク</td></tr>
    <tr><td>DPA 4060 (Pair)</td><td>DPA Microphones</td><td>バイノーラルマイク</td></tr>
  </table>
</div>`
}

// ─────────────────────────────────────────
// STORE
// ─────────────────────────────────────────
function renderStore() {
  const items = [
    { category: 'BGM Pack', title: 'Fantasy RPG BGM Pack Vol.1', desc: 'ファンタジーRPG向け20曲収録。タウン・フィールド・ダンジョン・ボス戦など全シーン対応。ループ設計済み。', tags: ['商用利用可', 'ループ対応', 'WAV + MP3', '20 tracks'], price: '¥2,980', count: '20 tracks' },
    { category: 'SE Pack', title: 'Battle Sound Effects Pack', desc: '剣・魔法・弓・爆発など戦闘系SE100音源以上収録。各カテゴリ複数バリエーションあり。', tags: ['商用利用可', 'バリエーション多数', 'WAV 48kHz/24bit'], price: '¥1,480', count: '100+ SE' },
    { category: 'Ambient', title: 'Dark Ambient & Horror Pack', desc: 'ホラー・ダークファンタジー向けアンビエント15曲＋環境音50音源。フィールドレコーディング素材加工版も収録。', tags: ['商用利用可', 'ループ対応', 'WAV + MP3 + OGG'], price: '¥3,480', count: '15 BGM + 50 SE' },
    { category: 'BGM Pack', title: 'Cyberpunk / Sci-Fi BGM Pack', desc: '近未来・サイバーパンク世界観の電子音楽BGM15曲。アクション〜アンビエントまで幅広くカバー。', tags: ['商用利用可', 'ループ対応', 'WAV + MP3'], price: '¥2,480', count: '15 tracks' },
    { category: 'Field Rec', title: 'Nature & Ambient Field Recordings', desc: '森・川・海・雨など自然環境音のフィールドレコーディング素材集。ゲーム環境音・リラクゼーション用途に。', tags: ['商用利用可', '高音質WAV', 'ループ版付き'], price: '¥1,980', count: '40+ loops' },
    { category: 'UI / SE', title: 'Casual Game UI Sound Pack', desc: 'ボタン音・通知音・成功・失敗・レベルアップなどカジュアルゲーム向けUI音80音源。', tags: ['商用利用可', 'WAV + MP3', 'ロイヤリティフリー'], price: '¥980', count: '80 SE' },
  ]

  return `
<p class="section-label">Store</p>
<h2 class="section-title">販売コンテンツ</h2>

<div class="store-platforms">
  <a href="https://booth.pm/" target="_blank" rel="noopener" class="store-platform-item">
    <div>
      <p class="store-platform-name">BOOTH</p>
      <p class="store-platform-url">soundforge.booth.pm</p>
    </div>
    <span class="arrow-link">Open</span>
  </a>
  <a href="https://itch.io/" target="_blank" rel="noopener" class="store-platform-item">
    <div>
      <p class="store-platform-name">itch.io</p>
      <p class="store-platform-url">soundforge.itch.io</p>
    </div>
    <span class="arrow-link">Open</span>
  </a>
</div>

<div class="store-grid">
  ${items.map(item => `
  <div class="store-item">
    <p class="store-category">${item.category}</p>
    <p class="store-title">${item.title}</p>
    <p class="store-desc">${item.desc}</p>
    <div class="store-tags">
      ${item.tags.map(t => `<span class="store-tag">${t}</span>`).join('')}
    </div>
    <div class="store-footer">
      <div>
        <p class="store-price">${item.price}</p>
        <p class="store-count">${item.count}</p>
      </div>
      <a href="https://booth.pm/" target="_blank" rel="noopener" class="store-buy">購入する</a>
    </div>
  </div>`).join('')}
</div>

<div class="store-note">
  <p class="store-note-title">ご購入前に</p>
  <ul>
    <li>全商品は商用利用可能です（ライセンス詳細は各商品ページをご確認ください）</li>
    <li>再販・再配布・二次配布は禁止です</li>
    <li>ゲーム・映像・配信など幅広い用途に対応しています</li>
    <li>カスタム制作・バルク購入のご相談はお気軽にどうぞ</li>
  </ul>
</div>`
}

export default app
