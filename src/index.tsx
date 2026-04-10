import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Static files
app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.svg', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ root: './' }))

// Main page
app.get('/', (c) => {
  return c.html(renderPage('home'))
})

app.get('/tabs/:tab', (c) => {
  const tab = c.req.param('tab')
  return c.html(renderPage('tabs', tab))
})

function renderPage(page: string, activeTab?: string) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SOUND FORGE | Game Audio Production</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');

    :root {
      --color-bg: #0a0a0f;
      --color-surface: #111118;
      --color-surface2: #16161f;
      --color-accent: #7c3aed;
      --color-accent2: #a855f7;
      --color-cyan: #06b6d4;
      --color-text: #e2e8f0;
      --color-muted: #64748b;
      --color-border: #1e1e2e;
    }

    * { box-sizing: border-box; }

    body {
      background-color: var(--color-bg);
      color: var(--color-text);
      font-family: 'Noto Sans JP', sans-serif;
      overflow-x: hidden;
    }

    /* Noise texture overlay */
    body::before {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
      opacity: 0.4;
    }

    .font-orbitron { font-family: 'Orbitron', sans-serif; }

    /* Header */
    .site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(10, 10, 15, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
    }

    /* Hero section */
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 30% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 60%),
                  radial-gradient(ellipse at 70% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 60%),
                  linear-gradient(180deg, #0a0a0f 0%, #0d0d18 100%);
    }

    /* Waveform animation */
    .waveform {
      display: flex;
      align-items: center;
      gap: 3px;
      height: 60px;
    }

    .waveform-bar {
      width: 4px;
      background: linear-gradient(180deg, var(--color-accent2), var(--color-cyan));
      border-radius: 2px;
      animation: wave 1.2s ease-in-out infinite;
    }

    .waveform-bar:nth-child(1) { animation-delay: 0s; height: 20%; }
    .waveform-bar:nth-child(2) { animation-delay: 0.1s; height: 60%; }
    .waveform-bar:nth-child(3) { animation-delay: 0.2s; height: 40%; }
    .waveform-bar:nth-child(4) { animation-delay: 0.3s; height: 80%; }
    .waveform-bar:nth-child(5) { animation-delay: 0.4s; height: 30%; }
    .waveform-bar:nth-child(6) { animation-delay: 0.5s; height: 90%; }
    .waveform-bar:nth-child(7) { animation-delay: 0.6s; height: 50%; }
    .waveform-bar:nth-child(8) { animation-delay: 0.7s; height: 70%; }
    .waveform-bar:nth-child(9) { animation-delay: 0.8s; height: 35%; }
    .waveform-bar:nth-child(10) { animation-delay: 0.9s; height: 65%; }
    .waveform-bar:nth-child(11) { animation-delay: 1.0s; height: 45%; }
    .waveform-bar:nth-child(12) { animation-delay: 1.1s; height: 85%; }

    @keyframes wave {
      0%, 100% { transform: scaleY(0.5); opacity: 0.7; }
      50% { transform: scaleY(1); opacity: 1; }
    }

    /* Section blocks (studio-arm style) */
    .section-block {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 2px;
      position: relative;
    }

    .section-block::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--color-accent), var(--color-cyan), transparent);
    }

    /* Section label */
    .section-label {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--color-cyan);
      border: 1px solid var(--color-cyan);
      padding: 2px 10px;
      display: inline-block;
    }

    .section-title {
      font-family: 'Orbitron', sans-serif;
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      font-weight: 900;
      letter-spacing: 0.1em;
    }

    /* Grid layout (like studio-arm blocks) */
    .content-grid {
      display: grid;
      gap: 1px;
      background: var(--color-border);
    }

    .grid-cell {
      background: var(--color-surface);
      padding: 2rem;
    }

    /* SNS buttons */
    .sns-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      border: 1px solid var(--color-border);
      background: var(--color-surface2);
      transition: all 0.25s;
      text-decoration: none;
      color: var(--color-text);
    }

    .sns-btn:hover {
      border-color: var(--color-accent2);
      background: rgba(168, 85, 247, 0.1);
      transform: translateY(-2px);
    }

    .sns-btn .icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    /* Service cards */
    .service-card {
      background: var(--color-surface2);
      border: 1px solid var(--color-border);
      padding: 1.5rem;
      position: relative;
      transition: all 0.3s;
      overflow: hidden;
    }

    .service-card::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--color-accent), var(--color-cyan));
      transform: scaleX(0);
      transition: transform 0.3s;
    }

    .service-card:hover::after {
      transform: scaleX(1);
    }

    .service-card:hover {
      border-color: rgba(124, 58, 237, 0.4);
      transform: translateY(-3px);
    }

    .service-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--color-accent), var(--color-cyan));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      color: white;
      margin-bottom: 1rem;
      clip-path: polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%);
    }

    /* Tabs */
    .tab-nav {
      display: flex;
      border-bottom: 1px solid var(--color-border);
      gap: 0;
      overflow-x: auto;
    }

    .tab-btn {
      padding: 14px 28px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--color-muted);
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 0.25s;
      white-space: nowrap;
      text-decoration: none;
      display: block;
    }

    .tab-btn:hover {
      color: var(--color-accent2);
      background: rgba(124, 58, 237, 0.05);
    }

    .tab-btn.active {
      color: var(--color-accent2);
      border-bottom-color: var(--color-accent2);
      background: rgba(124, 58, 237, 0.08);
    }

    /* Equipment table */
    .equip-table {
      width: 100%;
      border-collapse: collapse;
    }

    .equip-table th {
      background: var(--color-surface2);
      padding: 10px 16px;
      text-align: left;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: var(--color-cyan);
      border-bottom: 1px solid var(--color-border);
    }

    .equip-table td {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(30, 30, 46, 0.8);
      font-size: 0.875rem;
    }

    .equip-table tr:hover td {
      background: rgba(124, 58, 237, 0.05);
    }

    .equip-tag {
      display: inline-block;
      padding: 2px 8px;
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      border-radius: 2px;
    }

    /* Works cards */
    .works-card {
      background: var(--color-surface2);
      border: 1px solid var(--color-border);
      overflow: hidden;
      transition: all 0.3s;
    }

    .works-card:hover {
      border-color: rgba(124, 58, 237, 0.5);
      transform: translateY(-4px);
    }

    .works-thumb {
      width: 100%;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      position: relative;
      overflow: hidden;
    }

    .works-type-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.55rem;
      letter-spacing: 0.2em;
      padding: 3px 8px;
      text-transform: uppercase;
    }

    /* Store cards */
    .store-card {
      background: var(--color-surface2);
      border: 1px solid var(--color-border);
      overflow: hidden;
      transition: all 0.3s;
    }

    .store-card:hover {
      border-color: rgba(168, 85, 247, 0.5);
    }

    .store-thumb {
      width: 100%;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      position: relative;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 28px;
      background: linear-gradient(135deg, var(--color-accent), var(--color-accent2));
      color: white;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    }

    .btn-primary:hover {
      opacity: 0.85;
      transform: translateY(-1px);
    }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      background: transparent;
      color: var(--color-accent2);
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      border: 1px solid var(--color-accent2);
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
    }

    .btn-outline:hover {
      background: rgba(168, 85, 247, 0.1);
    }

    /* Divider */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--color-border), transparent);
    }

    /* Gradient text */
    .gradient-text {
      background: linear-gradient(135deg, var(--color-accent2), var(--color-cyan));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Scroll to top */
    #scrollTop {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 44px;
      height: 44px;
      background: var(--color-accent);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      z-index: 200;
    }

    #scrollTop.visible { opacity: 1; }

    /* Animations */
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Nav active */
    .nav-link {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--color-muted);
      text-decoration: none;
      padding: 4px 0;
      border-bottom: 1px solid transparent;
      transition: all 0.2s;
    }

    .nav-link:hover, .nav-link.active {
      color: var(--color-accent2);
      border-bottom-color: var(--color-accent2);
    }

    /* Mobile menu */
    @media (max-width: 768px) {
      .mobile-menu {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(10, 10, 15, 0.98);
        z-index: 99;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
      }
      .mobile-menu.open { display: flex; }
      .mobile-nav-link {
        font-family: 'Orbitron', sans-serif;
        font-size: 1rem;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: var(--color-text);
        text-decoration: none;
      }
    }

    .contact-section {
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.1));
      border: 1px solid var(--color-border);
    }

    /* Hex decoration */
    .hex-deco {
      position: absolute;
      opacity: 0.04;
      font-size: 20rem;
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      pointer-events: none;
      white-space: nowrap;
    }

    .price-badge {
      background: linear-gradient(135deg, var(--color-accent), var(--color-cyan));
      color: white;
      font-family: 'Orbitron', sans-serif;
      font-size: 1.1rem;
      padding: 4px 14px;
      display: inline-block;
    }
  </style>
</head>
<body>

<!-- ===== HEADER ===== -->
<header class="site-header">
  <div style="max-width:1200px;margin:0 auto;padding:0 1.5rem;height:64px;display:flex;align-items:center;justify-content:space-between;">
    <a href="/" style="text-decoration:none;display:flex;align-items:center;gap:10px;">
      <div style="width:36px;height:36px;background:linear-gradient(135deg,#7c3aed,#06b6d4);clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);display:flex;align-items:center;justify-content:center;">
        <i class="fas fa-headphones" style="color:white;font-size:0.9rem;"></i>
      </div>
      <span class="font-orbitron" style="font-size:1.1rem;font-weight:900;letter-spacing:0.15em;color:#e2e8f0;">SOUND<span class="gradient-text">FORGE</span></span>
    </a>

    <nav class="hidden md:flex items-center gap-8">
      <a href="/#about" class="nav-link ${page === 'home' ? 'active' : ''}">About</a>
      <a href="/#services" class="nav-link">Services</a>
      <a href="/tabs/works" class="nav-link ${page === 'tabs' ? 'active' : ''}">Works</a>
      <a href="/tabs/equipment" class="nav-link">Equipment</a>
      <a href="/tabs/store" class="nav-link">Store</a>
    </nav>

    <div class="flex items-center gap-3">
      <a href="/#contact" class="btn-primary hidden md:inline-flex" style="padding:8px 18px;font-size:0.6rem;">
        <i class="fas fa-envelope"></i> Contact
      </a>
      <button id="menuBtn" class="md:hidden text-gray-400 hover:text-white" onclick="document.getElementById('mobileMenu').classList.toggle('open')">
        <i class="fas fa-bars fa-lg"></i>
      </button>
    </div>
  </div>
</header>

<!-- Mobile Menu -->
<div class="mobile-menu" id="mobileMenu">
  <button onclick="document.getElementById('mobileMenu').classList.remove('open')" style="position:absolute;top:20px;right:24px;background:none;border:none;color:#e2e8f0;font-size:1.5rem;cursor:pointer;"><i class="fas fa-times"></i></button>
  <a href="/#about" class="mobile-nav-link" onclick="document.getElementById('mobileMenu').classList.remove('open')">About</a>
  <a href="/#services" class="mobile-nav-link" onclick="document.getElementById('mobileMenu').classList.remove('open')">Services</a>
  <a href="/tabs/works" class="mobile-nav-link">Works</a>
  <a href="/tabs/equipment" class="mobile-nav-link">Equipment</a>
  <a href="/tabs/store" class="mobile-nav-link">Store</a>
  <a href="/#contact" class="mobile-nav-link" onclick="document.getElementById('mobileMenu').classList.remove('open')">Contact</a>
</div>

<!-- ===== MAIN CONTENT ===== -->
<main style="padding-top:64px;position:relative;z-index:1;">

${page === 'home' ? renderHome() : renderTabs(activeTab || 'works')}

</main>

<!-- ===== FOOTER ===== -->
<footer style="background:var(--color-surface);border-top:1px solid var(--color-border);padding:3rem 1.5rem;margin-top:5rem;">
  <div style="max-width:1200px;margin:0 auto;">
    <div class="grid md:grid-cols-3 gap-8 mb-8">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:1rem;">
          <div style="width:30px;height:30px;background:linear-gradient(135deg,#7c3aed,#06b6d4);clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-headphones" style="color:white;font-size:0.75rem;"></i>
          </div>
          <span class="font-orbitron" style="font-size:0.9rem;font-weight:900;color:#e2e8f0;">SOUND<span class="gradient-text">FORGE</span></span>
        </div>
        <p style="font-size:0.8rem;color:var(--color-muted);line-height:1.8;">個人運営のゲームオーディオプロダクション。<br>BGM制作・効果音・サウンドデザインを<br>ワンストップで提供します。</p>
      </div>
      <div>
        <p class="font-orbitron" style="font-size:0.65rem;letter-spacing:0.2em;color:var(--color-cyan);margin-bottom:1rem;">NAVIGATION</p>
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          <a href="/#about" style="color:var(--color-muted);text-decoration:none;font-size:0.8rem;transition:color 0.2s;" onmouseover="this.style.color='#a855f7'" onmouseout="this.style.color='#64748b'">About</a>
          <a href="/#services" style="color:var(--color-muted);text-decoration:none;font-size:0.8rem;transition:color 0.2s;" onmouseover="this.style.color='#a855f7'" onmouseout="this.style.color='#64748b'">Services</a>
          <a href="/tabs/works" style="color:var(--color-muted);text-decoration:none;font-size:0.8rem;transition:color 0.2s;" onmouseover="this.style.color='#a855f7'" onmouseout="this.style.color='#64748b'">Works</a>
          <a href="/tabs/equipment" style="color:var(--color-muted);text-decoration:none;font-size:0.8rem;transition:color 0.2s;" onmouseover="this.style.color='#a855f7'" onmouseout="this.style.color='#64748b'">Equipment</a>
          <a href="/tabs/store" style="color:var(--color-muted);text-decoration:none;font-size:0.8rem;transition:color 0.2s;" onmouseover="this.style.color='#a855f7'" onmouseout="this.style.color='#64748b'">Store</a>
        </div>
      </div>
      <div>
        <p class="font-orbitron" style="font-size:0.65rem;letter-spacing:0.2em;color:var(--color-cyan);margin-bottom:1rem;">CONTACT</p>
        <p style="font-size:0.8rem;color:var(--color-muted);margin-bottom:0.5rem;"><i class="fas fa-envelope" style="margin-right:8px;color:var(--color-accent2);"></i>info@soundforge.jp</p>
        <p style="font-size:0.8rem;color:var(--color-muted);">お仕事のご依頼・お問い合わせは<br>メールまたはSNSのDMにて承ります。</p>
      </div>
    </div>
    <div class="divider mb-6"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
      <p style="font-size:0.75rem;color:var(--color-muted);">© 2024 SOUNDFORGE. All Rights Reserved.</p>
      <p style="font-family:'Orbitron',sans-serif;font-size:0.6rem;letter-spacing:0.2em;color:rgba(100,116,139,0.5);">GAME AUDIO PRODUCTION</p>
    </div>
  </div>
</footer>

<!-- Scroll to top -->
<button id="scrollTop" onclick="window.scrollTo({top:0,behavior:'smooth'})">
  <i class="fas fa-chevron-up"></i>
</button>

<script>
  // Scroll top button
  window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTop');
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });

  // Fade in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Handle hash on page load
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
</script>

</body>
</html>`
}

function renderHome() {
  return `
<!-- ===== HERO ===== -->
<section class="hero">
  <div class="hero-bg"></div>
  <!-- Grid lines decoration -->
  <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px);background-size:60px 60px;pointer-events:none;"></div>

  <div style="position:relative;z-index:1;text-align:center;padding:2rem 1.5rem;max-width:900px;margin:0 auto;">
    <div style="display:flex;justify-content:center;margin-bottom:2rem;">
      <div class="waveform">
        <div class="waveform-bar"></div>
        <div class="waveform-bar"></div>
        <div class="waveform-bar"></div>
        <div class="waveform-bar"></div>
        <div class="waveform-bar"></div>
        <div class="waveform-bar"></div>
        <div class="waveform-bar"></div>
        <div class="waveform-bar"></div>
        <div class="waveform-bar"></div>
        <div class="waveform-bar"></div>
        <div class="waveform-bar"></div>
        <div class="waveform-bar"></div>
      </div>
    </div>

    <div style="margin-bottom:1rem;">
      <span class="section-label">Game Audio Production</span>
    </div>

    <h1 class="font-orbitron" style="font-size:clamp(2.5rem,8vw,5rem);font-weight:900;line-height:1.1;margin-bottom:1.5rem;letter-spacing:0.05em;">
      SOUND<br><span class="gradient-text">FORGE</span>
    </h1>

    <p style="font-size:clamp(0.9rem,2vw,1.1rem);color:var(--color-muted);max-width:600px;margin:0 auto 2.5rem;line-height:1.8;">
      ゲームの世界に命を吹き込む音楽と効果音。<br>
      BGM・SE・アンビエント・ボイス収録まで、<br>
      ゲームオーディオ制作をワンストップで。
    </p>

    <div style="display:flex;justify-content:center;gap:1rem;flex-wrap:wrap;">
      <a href="/#services" class="btn-primary">
        <i class="fas fa-music"></i> Services
      </a>
      <a href="/tabs/works" class="btn-outline">
        <i class="fas fa-film"></i> View Works
      </a>
    </div>

    <!-- Stats -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--color-border);margin-top:4rem;max-width:500px;margin-left:auto;margin-right:auto;">
      <div style="background:rgba(10,10,15,0.8);padding:1.2rem;text-align:center;">
        <div class="font-orbitron gradient-text" style="font-size:1.6rem;font-weight:900;">50+</div>
        <div style="font-size:0.65rem;color:var(--color-muted);letter-spacing:0.15em;margin-top:4px;">TRACKS</div>
      </div>
      <div style="background:rgba(10,10,15,0.8);padding:1.2rem;text-align:center;">
        <div class="font-orbitron gradient-text" style="font-size:1.6rem;font-weight:900;">15+</div>
        <div style="font-size:0.65rem;color:var(--color-muted);letter-spacing:0.15em;margin-top:4px;">PROJECTS</div>
      </div>
      <div style="background:rgba(10,10,15,0.8);padding:1.2rem;text-align:center;">
        <div class="font-orbitron gradient-text" style="font-size:1.6rem;font-weight:900;">5yr</div>
        <div style="font-size:0.65rem;color:var(--color-muted);letter-spacing:0.15em;margin-top:4px;">EXPERIENCE</div>
      </div>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div style="position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;opacity:0.5;">
    <span style="font-family:'Orbitron',sans-serif;font-size:0.55rem;letter-spacing:0.3em;">SCROLL</span>
    <div style="width:1px;height:40px;background:linear-gradient(180deg,var(--color-accent2),transparent);animation:scrollPulse 1.5s ease-in-out infinite;"></div>
  </div>
</section>

<style>
@keyframes scrollPulse {
  0% { opacity: 0; transform: scaleY(0); transform-origin: top; }
  50% { opacity: 1; }
  100% { opacity: 0; transform: scaleY(1); transform-origin: top; }
}
</style>

<!-- ===== ABOUT ===== -->
<section id="about" style="padding:6rem 1.5rem;">
  <div style="max-width:1200px;margin:0 auto;">
    <div class="fade-in" style="margin-bottom:3rem;">
      <span class="section-label">01</span>
      <h2 class="section-title" style="margin-top:0.75rem;">ABOUT</h2>
    </div>

    <!-- Main about block (studio-arm style grid) -->
    <div class="content-grid fade-in" style="grid-template-columns:1fr 1fr;margin-bottom:2rem;" id="aboutGrid">
      <div class="grid-cell" style="border-right:1px solid var(--color-border);">
        <div style="position:relative;overflow:hidden;height:100%;min-height:300px;display:flex;flex-direction:column;justify-content:center;">
          <div class="hex-deco" style="right:-2rem;top:-3rem;">SF</div>
          <div style="margin-bottom:1.5rem;">
            <span style="font-family:'Orbitron',sans-serif;font-size:0.65rem;letter-spacing:0.3em;color:var(--color-cyan);display:block;margin-bottom:0.5rem;">SOLO GAME AUDIO CREATOR</span>
            <h3 class="font-orbitron" style="font-size:1.8rem;font-weight:900;">Yuki Tanaka</h3>
            <p style="color:var(--color-muted);font-size:0.85rem;margin-top:0.25rem;">Sound Designer & Composer</p>
          </div>
          <p style="color:rgba(226,232,240,0.8);line-height:1.9;font-size:0.9rem;margin-bottom:1rem;">
            ゲームオーディオ専門の個人クリエイター。インディーゲームから商業タイトルまで、<br>
            プレイヤーを没入させるサウンドを制作しています。
          </p>
          <p style="color:rgba(226,232,240,0.7);line-height:1.9;font-size:0.875rem;">
            DAWはAbleton Live / Reaper を使用し、オーケストラ・シンセ・アンビエント・電子音楽など<br>
            幅広いジャンルに対応。効果音は独自に収録したフィールドレコーディング素材を多数活用。<br>
            Wwise / Unity Audio などゲームエンジン連携にも対応しています。
          </p>
          <div style="margin-top:1.5rem;display:flex;gap:0.75rem;flex-wrap:wrap;">
            <span style="font-size:0.7rem;padding:4px 10px;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);color:#a855f7;">Ableton Live</span>
            <span style="font-size:0.7rem;padding:4px 10px;background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.3);color:#06b6d4;">Reaper</span>
            <span style="font-size:0.7rem;padding:4px 10px;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);color:#a855f7;">Wwise</span>
            <span style="font-size:0.7rem;padding:4px 10px;background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.3);color:#06b6d4;">Unity Audio</span>
            <span style="font-size:0.7rem;padding:4px 10px;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);color:#a855f7;">Field Recording</span>
          </div>
        </div>
      </div>

      <div class="grid-cell" style="display:flex;flex-direction:column;gap:1px;padding:0;background:var(--color-border);">
        <div style="background:var(--color-surface);padding:1.5rem;flex:1;">
          <div style="display:flex;align-items:flex-start;gap:1rem;">
            <div style="width:40px;height:40px;background:linear-gradient(135deg,rgba(124,58,237,0.3),rgba(6,182,212,0.3));border:1px solid rgba(124,58,237,0.4);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="fas fa-music" style="color:var(--color-accent2);font-size:0.9rem;"></i>
            </div>
            <div>
              <h4 class="font-orbitron" style="font-size:0.8rem;letter-spacing:0.1em;margin-bottom:0.5rem;">BGM / MUSIC</h4>
              <p style="font-size:0.8rem;color:var(--color-muted);line-height:1.7;">ゲームの世界観に合ったオリジナルBGMを制作。バトル・探索・感動シーンなど、シーンに合わせた楽曲を提供。</p>
            </div>
          </div>
        </div>
        <div style="background:var(--color-surface);padding:1.5rem;flex:1;">
          <div style="display:flex;align-items:flex-start;gap:1rem;">
            <div style="width:40px;height:40px;background:linear-gradient(135deg,rgba(6,182,212,0.3),rgba(124,58,237,0.3));border:1px solid rgba(6,182,212,0.4);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="fas fa-bolt" style="color:var(--color-cyan);font-size:0.9rem;"></i>
            </div>
            <div>
              <h4 class="font-orbitron" style="font-size:0.8rem;letter-spacing:0.1em;margin-bottom:0.5rem;">SOUND EFFECTS</h4>
              <p style="font-size:0.8rem;color:var(--color-muted);line-height:1.7;">UI音・攻撃音・環境音・フォーリーなど、ゲームに必要なあらゆる効果音を制作。</p>
            </div>
          </div>
        </div>
        <div style="background:var(--color-surface);padding:1.5rem;flex:1;">
          <div style="display:flex;align-items:flex-start;gap:1rem;">
            <div style="width:40px;height:40px;background:linear-gradient(135deg,rgba(124,58,237,0.3),rgba(6,182,212,0.3));border:1px solid rgba(124,58,237,0.4);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="fas fa-layer-group" style="color:var(--color-accent2);font-size:0.9rem;"></i>
            </div>
            <div>
              <h4 class="font-orbitron" style="font-size:0.8rem;letter-spacing:0.1em;margin-bottom:0.5rem;">SOUND DESIGN</h4>
              <p style="font-size:0.8rem;color:var(--color-muted);line-height:1.7;">アンビエント・インタラクティブサウンド・アダプティブミュージックなど、没入感を高めるサウンドデザイン。</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      @media (max-width: 768px) {
        #aboutGrid { grid-template-columns: 1fr !important; }
      }
    </style>
  </div>
</section>

<!-- ===== SNS / ACCOUNTS ===== -->
<section id="sns" style="padding:4rem 1.5rem;background:var(--color-surface);">
  <div style="max-width:1200px;margin:0 auto;">
    <div class="fade-in" style="margin-bottom:3rem;">
      <span class="section-label">02</span>
      <h2 class="section-title" style="margin-top:0.75rem;">OFFICIAL ACCOUNTS</h2>
      <p style="color:var(--color-muted);font-size:0.875rem;margin-top:0.75rem;">SNSアカウント・楽曲販売ページ</p>
    </div>

    <!-- SNS Links Grid -->
    <div class="fade-in" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1px;background:var(--color-border);margin-bottom:3rem;">

      <a href="https://twitter.com/" target="_blank" class="sns-btn" style="background:var(--color-surface2);">
        <div class="icon" style="background:rgba(29,161,242,0.15);border:1px solid rgba(29,161,242,0.3);color:#1da1f2;">
          <i class="fab fa-x-twitter"></i>
        </div>
        <div>
          <div style="font-family:'Orbitron',sans-serif;font-size:0.7rem;letter-spacing:0.15em;margin-bottom:3px;">X / TWITTER</div>
          <div style="font-size:0.75rem;color:var(--color-muted);">@soundforge_game</div>
          <div style="font-size:0.7rem;color:rgba(100,116,139,0.6);margin-top:2px;">制作進捗・新作情報など</div>
        </div>
        <i class="fas fa-arrow-right" style="margin-left:auto;color:var(--color-muted);font-size:0.75rem;"></i>
      </a>

      <a href="https://youtube.com/" target="_blank" class="sns-btn" style="background:var(--color-surface2);">
        <div class="icon" style="background:rgba(255,0,0,0.12);border:1px solid rgba(255,0,0,0.3);color:#ff4444;">
          <i class="fab fa-youtube"></i>
        </div>
        <div>
          <div style="font-family:'Orbitron',sans-serif;font-size:0.7rem;letter-spacing:0.15em;margin-bottom:3px;">YOUTUBE</div>
          <div style="font-size:0.75rem;color:var(--color-muted);">SOUNDFORGE Channel</div>
          <div style="font-size:0.7rem;color:rgba(100,116,139,0.6);margin-top:2px;">楽曲試聴・制作動画</div>
        </div>
        <i class="fas fa-arrow-right" style="margin-left:auto;color:var(--color-muted);font-size:0.75rem;"></i>
      </a>

      <a href="https://soundcloud.com/" target="_blank" class="sns-btn" style="background:var(--color-surface2);">
        <div class="icon" style="background:rgba(255,85,0,0.12);border:1px solid rgba(255,85,0,0.3);color:#ff5500;">
          <i class="fab fa-soundcloud"></i>
        </div>
        <div>
          <div style="font-family:'Orbitron',sans-serif;font-size:0.7rem;letter-spacing:0.15em;margin-bottom:3px;">SOUNDCLOUD</div>
          <div style="font-size:0.75rem;color:var(--color-muted);">soundforge-music</div>
          <div style="font-size:0.7rem;color:rgba(100,116,139,0.6);margin-top:2px;">楽曲ポートフォリオ</div>
        </div>
        <i class="fas fa-arrow-right" style="margin-left:auto;color:var(--color-muted);font-size:0.75rem;"></i>
      </a>

      <a href="https://booth.pm/" target="_blank" class="sns-btn" style="background:var(--color-surface2);">
        <div class="icon" style="background:rgba(243,139,168,0.12);border:1px solid rgba(243,139,168,0.3);color:#f38ba8;">
          <i class="fas fa-store"></i>
        </div>
        <div>
          <div style="font-family:'Orbitron',sans-serif;font-size:0.7rem;letter-spacing:0.15em;margin-bottom:3px;">BOOTH</div>
          <div style="font-size:0.75rem;color:var(--color-muted);">soundforge.booth.pm</div>
          <div style="font-size:0.7rem;color:rgba(100,116,139,0.6);margin-top:2px;">素材パック販売</div>
        </div>
        <i class="fas fa-arrow-right" style="margin-left:auto;color:var(--color-muted);font-size:0.75rem;"></i>
      </a>

      <a href="https://itch.io/" target="_blank" class="sns-btn" style="background:var(--color-surface2);">
        <div class="icon" style="background:rgba(250,84,90,0.12);border:1px solid rgba(250,84,90,0.3);color:#fa545a;">
          <i class="fas fa-gamepad"></i>
        </div>
        <div>
          <div style="font-family:'Orbitron',sans-serif;font-size:0.7rem;letter-spacing:0.15em;margin-bottom:3px;">ITCH.IO</div>
          <div style="font-size:0.75rem;color:var(--color-muted);">soundforge.itch.io</div>
          <div style="font-size:0.7rem;color:rgba(100,116,139,0.6);margin-top:2px;">ゲーム向け素材販売</div>
        </div>
        <i class="fas fa-arrow-right" style="margin-left:auto;color:var(--color-muted);font-size:0.75rem;"></i>
      </a>

      <a href="https://www.instagram.com/" target="_blank" class="sns-btn" style="background:var(--color-surface2);">
        <div class="icon" style="background:rgba(225,48,108,0.12);border:1px solid rgba(225,48,108,0.3);color:#e1306c;">
          <i class="fab fa-instagram"></i>
        </div>
        <div>
          <div style="font-family:'Orbitron',sans-serif;font-size:0.7rem;letter-spacing:0.15em;margin-bottom:3px;">INSTAGRAM</div>
          <div style="font-size:0.75rem;color:var(--color-muted);">@soundforge_game</div>
          <div style="font-size:0.7rem;color:rgba(100,116,139,0.6);margin-top:2px;">制作風景・機材紹介</div>
        </div>
        <i class="fas fa-arrow-right" style="margin-left:auto;color:var(--color-muted);font-size:0.75rem;"></i>
      </a>
    </div>

    <!-- Store Preview -->
    <div class="fade-in" style="margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
      <div>
        <span class="section-label" style="font-size:0.6rem;">PICKUP</span>
        <h3 class="font-orbitron" style="font-size:1.1rem;margin-top:0.5rem;letter-spacing:0.1em;">販売コンテンツ ピックアップ</h3>
      </div>
      <a href="/tabs/store" class="btn-outline" style="font-size:0.6rem;padding:8px 18px;">
        全て見る <i class="fas fa-arrow-right"></i>
      </a>
    </div>

    <div class="fade-in" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1px;background:var(--color-border);">
      <div style="background:var(--color-surface);padding:1.5rem;">
        <div style="height:100px;background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(6,182,212,0.2));display:flex;align-items:center;justify-content:center;margin-bottom:1rem;font-size:2.5rem;">🎮</div>
        <span style="font-size:0.6rem;font-family:'Orbitron',sans-serif;letter-spacing:0.15em;color:var(--color-cyan);border:1px solid rgba(6,182,212,0.3);padding:2px 8px;">BGM PACK</span>
        <h4 style="font-size:0.9rem;margin:0.5rem 0 0.25rem;font-weight:600;">Fantasy RPG BGM Pack Vol.1</h4>
        <p style="font-size:0.75rem;color:var(--color-muted);">20曲収録 / 商用利用可</p>
        <p class="font-orbitron gradient-text" style="font-size:1rem;margin-top:0.5rem;">¥2,980</p>
      </div>
      <div style="background:var(--color-surface);padding:1.5rem;">
        <div style="height:100px;background:linear-gradient(135deg,rgba(6,182,212,0.2),rgba(124,58,237,0.2));display:flex;align-items:center;justify-content:center;margin-bottom:1rem;font-size:2.5rem;">⚔️</div>
        <span style="font-size:0.6rem;font-family:'Orbitron',sans-serif;letter-spacing:0.15em;color:var(--color-accent2);border:1px solid rgba(168,85,247,0.3);padding:2px 8px;">SE PACK</span>
        <h4 style="font-size:0.9rem;margin:0.5rem 0 0.25rem;font-weight:600;">Battle Sound Effects Pack</h4>
        <p style="font-size:0.75rem;color:var(--color-muted);">100+音源 / WAV高音質</p>
        <p class="font-orbitron gradient-text" style="font-size:1rem;margin-top:0.5rem;">¥1,480</p>
      </div>
      <div style="background:var(--color-surface);padding:1.5rem;">
        <div style="height:100px;background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(6,182,212,0.2));display:flex;align-items:center;justify-content:center;margin-bottom:1rem;font-size:2.5rem;">🌙</div>
        <span style="font-size:0.6rem;font-family:'Orbitron',sans-serif;letter-spacing:0.15em;color:var(--color-cyan);border:1px solid rgba(6,182,212,0.3);padding:2px 8px;">AMBIENT</span>
        <h4 style="font-size:0.9rem;margin:0.5rem 0 0.25rem;font-weight:600;">Dark Ambient / Horror Pack</h4>
        <p style="font-size:0.75rem;color:var(--color-muted);">15曲 + 環境音50音源</p>
        <p class="font-orbitron gradient-text" style="font-size:1rem;margin-top:0.5rem;">¥3,480</p>
      </div>
    </div>
  </div>
</section>

<!-- ===== SERVICES ===== -->
<section id="services" style="padding:6rem 1.5rem;">
  <div style="max-width:1200px;margin:0 auto;">
    <div class="fade-in" style="margin-bottom:3rem;">
      <span class="section-label">03</span>
      <h2 class="section-title" style="margin-top:0.75rem;">SERVICES</h2>
      <p style="color:var(--color-muted);font-size:0.875rem;margin-top:0.75rem;">提供サービス一覧</p>
    </div>

    <div class="fade-in" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1px;background:var(--color-border);margin-bottom:3rem;">

      <div class="service-card" style="background:var(--color-surface);">
        <div class="service-icon"><i class="fas fa-music"></i></div>
        <h3 class="font-orbitron" style="font-size:0.85rem;letter-spacing:0.15em;margin-bottom:0.75rem;">BGM COMPOSITION</h3>
        <p style="font-size:0.8rem;color:var(--color-muted);line-height:1.8;margin-bottom:1rem;">
          ゲームのジャンル・世界観に合わせたオリジナルBGMを制作します。<br>
          バトル・フィールド・タウン・エンディングなど、シーンに応じた楽曲を提供。
        </p>
        <div style="font-size:0.75rem;color:var(--color-muted);">
          <i class="fas fa-check" style="color:var(--color-accent2);margin-right:6px;"></i>ループ対応<br>
          <i class="fas fa-check" style="color:var(--color-accent2);margin-right:6px;"></i>スティンガー・ジングル制作<br>
          <i class="fas fa-check" style="color:var(--color-accent2);margin-right:6px;"></i>Wwise / FMOD連携対応
        </div>
      </div>

      <div class="service-card" style="background:var(--color-surface);">
        <div class="service-icon"><i class="fas fa-bolt"></i></div>
        <h3 class="font-orbitron" style="font-size:0.85rem;letter-spacing:0.15em;margin-bottom:0.75rem;">SOUND EFFECTS</h3>
        <p style="font-size:0.8rem;color:var(--color-muted);line-height:1.8;margin-bottom:1rem;">
          攻撃・魔法・UI・足音・環境音など、ゲームに必要なSEをワンストップで制作。フィールドレコーディング素材も活用。
        </p>
        <div style="font-size:0.75rem;color:var(--color-muted);">
          <i class="fas fa-check" style="color:var(--color-cyan);margin-right:6px;"></i>WAV / OGG / MP3 納品<br>
          <i class="fas fa-check" style="color:var(--color-cyan);margin-right:6px;"></i>バリエーション対応<br>
          <i class="fas fa-check" style="color:var(--color-cyan);margin-right:6px;"></i>ランダム再生セット
        </div>
      </div>

      <div class="service-card" style="background:var(--color-surface);">
        <div class="service-icon"><i class="fas fa-layer-group"></i></div>
        <h3 class="font-orbitron" style="font-size:0.85rem;letter-spacing:0.15em;margin-bottom:0.75rem;">SOUND DESIGN</h3>
        <p style="font-size:0.8rem;color:var(--color-muted);line-height:1.8;margin-bottom:1rem;">
          アンビエント・インタラクティブサウンド・アダプティブミュージックなど、ゲーム体験を強化するサウンドデザインを提供。
        </p>
        <div style="font-size:0.75rem;color:var(--color-muted);">
          <i class="fas fa-check" style="color:var(--color-accent2);margin-right:6px;"></i>アダプティブBGM設計<br>
          <i class="fas fa-check" style="color:var(--color-accent2);margin-right:6px;"></i>3Dオーディオ設計<br>
          <i class="fas fa-check" style="color:var(--color-accent2);margin-right:6px;"></i>ミドルウェア実装サポート
        </div>
      </div>

      <div class="service-card" style="background:var(--color-surface);">
        <div class="service-icon"><i class="fas fa-microphone"></i></div>
        <h3 class="font-orbitron" style="font-size:0.85rem;letter-spacing:0.15em;margin-bottom:0.75rem;">VOICE / NARRATION</h3>
        <p style="font-size:0.8rem;color:var(--color-muted);line-height:1.8;margin-bottom:1rem;">
          ナレーション収録・ボイスディレクション。収録スタジオとの連携にも対応。
        </p>
        <div style="font-size:0.75rem;color:var(--color-muted);">
          <i class="fas fa-check" style="color:var(--color-cyan);margin-right:6px;"></i>宅録・スタジオ収録<br>
          <i class="fas fa-check" style="color:var(--color-cyan);margin-right:6px;"></i>ノイズ除去・整音<br>
          <i class="fas fa-check" style="color:var(--color-cyan);margin-right:6px;"></i>多言語対応（要相談）
        </div>
      </div>

      <div class="service-card" style="background:var(--color-surface);">
        <div class="service-icon"><i class="fas fa-code"></i></div>
        <h3 class="font-orbitron" style="font-size:0.85rem;letter-spacing:0.15em;margin-bottom:0.75rem;">AUDIO IMPLEMENTATION</h3>
        <p style="font-size:0.8rem;color:var(--color-muted);line-height:1.8;margin-bottom:1rem;">
          Unity / Unreal Engineへのオーディオ実装をサポート。Wwise・FMODの設定・インタラクティブオーディオ構築まで対応。
        </p>
        <div style="font-size:0.75rem;color:var(--color-muted);">
          <i class="fas fa-check" style="color:var(--color-accent2);margin-right:6px;"></i>Unity Audio Mixer<br>
          <i class="fas fa-check" style="color:var(--color-accent2);margin-right:6px;"></i>Wwise / FMOD 実装<br>
          <i class="fas fa-check" style="color:var(--color-accent2);margin-right:6px;"></i>パフォーマンス最適化
        </div>
      </div>

      <div class="service-card" style="background:var(--color-surface);">
        <div class="service-icon"><i class="fas fa-tag"></i></div>
        <h3 class="font-orbitron" style="font-size:0.85rem;letter-spacing:0.15em;margin-bottom:0.75rem;">素材パック販売</h3>
        <p style="font-size:0.8rem;color:var(--color-muted);line-height:1.8;margin-bottom:1rem;">
          BOOTHやitch.ioにてゲーム向けBGM・SEパックを販売中。個人・インディー開発者向けのリーズナブルな素材も多数。
        </p>
        <a href="/tabs/store" style="font-size:0.7rem;font-family:'Orbitron',sans-serif;letter-spacing:0.15em;color:var(--color-accent2);text-decoration:none;">
          STORE PAGE <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>

    <!-- Pricing hint -->
    <div class="fade-in section-block" style="padding:2rem;">
      <div style="display:grid;grid-template-columns:1fr auto;align-items:center;gap:2rem;flex-wrap:wrap;">
        <div>
          <h3 class="font-orbitron" style="font-size:0.9rem;letter-spacing:0.15em;margin-bottom:0.5rem;">料金について</h3>
          <p style="font-size:0.85rem;color:var(--color-muted);line-height:1.8;">
            制作規模・曲数・納期などにより異なります。まずはお気軽にご相談ください。インディーゲーム・個人開発者向けのリーズナブルなプランも対応可能です。
          </p>
        </div>
        <a href="/#contact" class="btn-primary" style="white-space:nowrap;">
          <i class="fas fa-envelope"></i> お問い合わせ
        </a>
      </div>
    </div>
  </div>
</section>

<!-- ===== CONTACT ===== -->
<section id="contact" style="padding:6rem 1.5rem;background:var(--color-surface);">
  <div style="max-width:800px;margin:0 auto;text-align:center;">
    <div class="fade-in" style="margin-bottom:3rem;">
      <span class="section-label">CONTACT</span>
      <h2 class="section-title" style="margin-top:0.75rem;">GET IN TOUCH</h2>
      <p style="color:var(--color-muted);font-size:0.875rem;margin-top:0.75rem;">お仕事のご依頼・ご質問はお気軽にどうぞ</p>
    </div>

    <div class="fade-in contact-section" style="padding:2.5rem;margin-bottom:2rem;">
      <p style="color:rgba(226,232,240,0.8);line-height:1.9;margin-bottom:2rem;font-size:0.9rem;">
        BGM制作・効果音・サウンドデザインのご依頼、<br>
        素材パックに関するご質問など、お気軽にご連絡ください。<br>
        通常2〜3営業日以内にご返信いたします。
      </p>

      <div style="display:flex;justify-content:center;gap:1rem;flex-wrap:wrap;">
        <a href="mailto:info@soundforge.jp" class="btn-primary">
          <i class="fas fa-envelope"></i> メールで問い合わせ
        </a>
        <a href="https://twitter.com/" target="_blank" class="btn-outline">
          <i class="fab fa-x-twitter"></i> X (Twitter) DM
        </a>
      </div>
    </div>

    <p class="fade-in" style="font-size:0.75rem;color:var(--color-muted);">
      <i class="fas fa-clock" style="margin-right:6px;color:var(--color-accent2);"></i>
      対応時間：平日 10:00〜18:00（土日祝はご返信が遅れる場合があります）
    </p>
  </div>
</section>
`
}

function renderTabs(activeTab: string) {
  const tabs = [
    { id: 'works', label: 'Works', icon: 'fa-film' },
    { id: 'equipment', label: 'Equipment', icon: 'fa-sliders' },
    { id: 'store', label: 'Store', icon: 'fa-store' },
  ]

  return `
<div style="max-width:1200px;margin:0 auto;padding:3rem 1.5rem;">
  <!-- Page header -->
  <div style="margin-bottom:2rem;">
    <a href="/" style="font-family:'Orbitron',sans-serif;font-size:0.65rem;letter-spacing:0.2em;color:var(--color-muted);text-decoration:none;display:inline-flex;align-items:center;gap:6px;margin-bottom:1.5rem;transition:color 0.2s;" onmouseover="this.style.color='#a855f7'" onmouseout="this.style.color='#64748b'">
      <i class="fas fa-arrow-left"></i> BACK TO TOP
    </a>
  </div>

  <!-- Tab navigation -->
  <div class="section-block" style="margin-bottom:0;">
    <div class="tab-nav">
      ${tabs.map(t => `<a href="/tabs/${t.id}" class="tab-btn ${t.id === activeTab ? 'active' : ''}"><i class="fas ${t.icon}" style="margin-right:6px;"></i>${t.label}</a>`).join('')}
    </div>

    <div style="padding:2.5rem;">
      ${activeTab === 'works' ? renderWorksTab() : ''}
      ${activeTab === 'equipment' ? renderEquipmentTab() : ''}
      ${activeTab === 'store' ? renderStoreTab() : ''}
    </div>
  </div>
</div>
`
}

function renderWorksTab() {
  const works = [
    { emoji: '🗡️', title: 'Echoes of the Abyss', type: 'RPG', role: 'BGM全曲制作・SE制作', platform: 'PC / Steam', year: '2024', color: '#7c3aed', desc: 'ダークファンタジーRPG。オーケストラ+シンセの融合サウンドで異世界の雰囲気を演出。' },
    { emoji: '🚀', title: 'Stellar Drift', type: 'ACTION', role: 'BGM・アンビエント制作', platform: 'PC / Switch', year: '2023', color: '#06b6d4', desc: 'SF横スクロールアクション。電子音楽とオーケストラを組み合わせた疾走感のあるサウンド。' },
    { emoji: '🏯', title: 'Sengoku Chronicles', type: 'STRATEGY', role: 'BGM・SE全収録', platform: 'PC / Mobile', year: '2023', color: '#a855f7', desc: '戦国時代ストラテジー。和楽器を中心にオーケストラも取り入れた重厚な楽曲群。' },
    { emoji: '👻', title: 'Phantom Protocol', type: 'HORROR', role: 'アンビエント・SE制作', platform: 'PC', year: '2022', color: '#7c3aed', desc: 'サイコロジカルホラー。フィールドレコーディング素材を加工した不安を煽るサウンドデザイン。' },
    { emoji: '⚽', title: 'Pixel Sports Club', type: 'SPORTS', role: 'BGM・SE制作', platform: 'Mobile', year: '2022', color: '#06b6d4', desc: 'カジュアルスポーツゲーム。明るく親しみやすいBGMと爽快感のある効果音。' },
    { emoji: '🧩', title: 'Mindfield', type: 'PUZZLE', role: 'BGM・UI音制作', platform: 'PC / Mobile', year: '2021', color: '#a855f7', desc: 'ロジックパズル。集中力を高めるアンビエント系BGMとシンプルなUI音。' },
  ]

  return `
<div style="margin-bottom:2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
  <div>
    <span class="section-label">WORKS</span>
    <h2 class="font-orbitron" style="font-size:1.5rem;font-weight:900;margin-top:0.5rem;">実績一覧</h2>
  </div>
  <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
    <button onclick="filterWorks('all')" id="filter-all" style="font-family:'Orbitron',sans-serif;font-size:0.6rem;letter-spacing:0.15em;padding:6px 14px;background:rgba(124,58,237,0.2);border:1px solid rgba(124,58,237,0.5);color:#a855f7;cursor:pointer;">ALL</button>
    <button onclick="filterWorks('RPG')" id="filter-RPG" style="font-family:'Orbitron',sans-serif;font-size:0.6rem;letter-spacing:0.15em;padding:6px 14px;background:transparent;border:1px solid var(--color-border);color:var(--color-muted);cursor:pointer;">RPG</button>
    <button onclick="filterWorks('ACTION')" id="filter-ACTION" style="font-family:'Orbitron',sans-serif;font-size:0.6rem;letter-spacing:0.15em;padding:6px 14px;background:transparent;border:1px solid var(--color-border);color:var(--color-muted);cursor:pointer;">ACTION</button>
    <button onclick="filterWorks('HORROR')" id="filter-HORROR" style="font-family:'Orbitron',sans-serif;font-size:0.6rem;letter-spacing:0.15em;padding:6px 14px;background:transparent;border:1px solid var(--color-border);color:var(--color-muted);cursor:pointer;">HORROR</button>
  </div>
</div>

<div id="worksGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1px;background:var(--color-border);">
  ${works.map(w => `
  <div class="works-card" data-type="${w.type}" style="background:var(--color-surface2);">
    <div class="works-thumb" style="background:linear-gradient(135deg,rgba(${w.color === '#7c3aed' ? '124,58,237' : w.color === '#06b6d4' ? '6,182,212' : '168,85,247'},0.15),rgba(10,10,15,0.5));">
      <span style="font-size:3.5rem;">${w.emoji}</span>
      <span class="works-type-badge" style="background:rgba(${w.color === '#7c3aed' ? '124,58,237' : w.color === '#06b6d4' ? '6,182,212' : '168,85,247'},0.2);border:1px solid ${w.color};color:${w.color};">${w.type}</span>
    </div>
    <div style="padding:1.25rem;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;margin-bottom:0.5rem;">
        <h3 style="font-size:0.95rem;font-weight:700;">${w.title}</h3>
        <span class="font-orbitron" style="font-size:0.65rem;color:var(--color-muted);flex-shrink:0;">${w.year}</span>
      </div>
      <p style="font-size:0.75rem;color:var(--color-muted);margin-bottom:0.5rem;">${w.desc}</p>
      <div style="border-top:1px solid var(--color-border);padding-top:0.75rem;margin-top:0.75rem;display:flex;flex-direction:column;gap:3px;">
        <div style="display:flex;gap:8px;font-size:0.7rem;">
          <span style="color:var(--color-accent2);font-family:'Orbitron',sans-serif;font-size:0.6rem;">ROLE</span>
          <span style="color:var(--color-muted);">${w.role}</span>
        </div>
        <div style="display:flex;gap:8px;font-size:0.7rem;">
          <span style="color:var(--color-cyan);font-family:'Orbitron',sans-serif;font-size:0.6rem;">PLATFORM</span>
          <span style="color:var(--color-muted);">${w.platform}</span>
        </div>
      </div>
    </div>
  </div>
  `).join('')}
</div>

<script>
function filterWorks(type) {
  const cards = document.querySelectorAll('#worksGrid .works-card');
  cards.forEach(c => {
    c.style.display = (type === 'all' || c.dataset.type === type) ? '' : 'none';
  });
  document.querySelectorAll('[id^="filter-"]').forEach(b => {
    b.style.background = 'transparent';
    b.style.borderColor = 'var(--color-border)';
    b.style.color = 'var(--color-muted)';
  });
  const active = document.getElementById('filter-' + type);
  if (active) {
    active.style.background = 'rgba(124,58,237,0.2)';
    active.style.borderColor = 'rgba(124,58,237,0.5)';
    active.style.color = '#a855f7';
  }
}
</script>
`
}

function renderEquipmentTab() {
  return `
<div style="margin-bottom:2rem;">
  <span class="section-label">EQUIPMENT</span>
  <h2 class="font-orbitron" style="font-size:1.5rem;font-weight:900;margin-top:0.5rem;">機材リスト</h2>
  <p style="color:var(--color-muted);font-size:0.8rem;margin-top:0.5rem;">制作環境・使用機材一覧</p>
</div>

<!-- DAW / Software -->
<div style="margin-bottom:2rem;">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:1rem;">
    <span class="equip-tag" style="background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.4);color:#a855f7;">SOFTWARE</span>
    <h3 class="font-orbitron" style="font-size:0.75rem;letter-spacing:0.2em;color:var(--color-muted);">DAW / ソフトウェア</h3>
  </div>
  <table class="equip-table">
    <thead>
      <tr><th>名称</th><th>メーカー</th><th>用途</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Ableton Live 12 Suite</strong></td><td style="color:var(--color-muted);">Ableton</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">BGM制作 / 電子音楽</span></td></tr>
      <tr><td><strong>Reaper 7</strong></td><td style="color:var(--color-muted);">Cockos</td><td><span class="equip-tag" style="background:rgba(6,182,212,0.1);color:#06b6d4;">SE制作 / 整音</span></td></tr>
      <tr><td><strong>Wwise 2023</strong></td><td style="color:var(--color-muted);">Audiokinetic</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">ゲームエンジン連携</span></td></tr>
      <tr><td><strong>FMOD Studio</strong></td><td style="color:var(--color-muted);">Firelight</td><td><span class="equip-tag" style="background:rgba(6,182,212,0.1);color:#06b6d4;">インタラクティブオーディオ</span></td></tr>
      <tr><td><strong>iZotope RX 11</strong></td><td style="color:var(--color-muted);">iZotope</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">ノイズ除去・修正</span></td></tr>
    </tbody>
  </table>
</div>

<!-- Plugins / Instruments -->
<div style="margin-bottom:2rem;">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:1rem;">
    <span class="equip-tag" style="background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.4);color:#06b6d4;">PLUGINS</span>
    <h3 class="font-orbitron" style="font-size:0.75rem;letter-spacing:0.2em;color:var(--color-muted);">プラグイン / 音源</h3>
  </div>
  <table class="equip-table">
    <thead>
      <tr><th>名称</th><th>メーカー</th><th>カテゴリ</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Spitfire BBCSO Pro</strong></td><td style="color:var(--color-muted);">Spitfire Audio</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">オーケストラ音源</span></td></tr>
      <tr><td><strong>Kontakt 7</strong></td><td style="color:var(--color-muted);">Native Instruments</td><td><span class="equip-tag" style="background:rgba(6,182,212,0.1);color:#06b6d4;">サンプラー</span></td></tr>
      <tr><td><strong>Serum</strong></td><td style="color:var(--color-muted);">Xfer Records</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">シンセサイザー</span></td></tr>
      <tr><td><strong>Omnisphere 3</strong></td><td style="color:var(--color-muted);">Spectrasonics</td><td><span class="equip-tag" style="background:rgba(6,182,212,0.1);color:#06b6d4;">シンセ / テクスチャー</span></td></tr>
      <tr><td><strong>Fabfilter Pro Bundle</strong></td><td style="color:var(--color-muted);">FabFilter</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">EQ / コンプ / リミッター</span></td></tr>
      <tr><td><strong>Waves SSL Bundle</strong></td><td style="color:var(--color-muted);">Waves</td><td><span class="equip-tag" style="background:rgba(6,182,212,0.1);color:#06b6d4;">チャンネルストリップ</span></td></tr>
      <tr><td><strong>Soundtoys 5</strong></td><td style="color:var(--color-muted);">Soundtoys</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">エフェクト群</span></td></tr>
      <tr><td><strong>Hybrid Keys (Spitfire)</strong></td><td style="color:var(--color-muted);">Spitfire Audio</td><td><span class="equip-tag" style="background:rgba(6,182,212,0.1);color:#06b6d4;">ピアノ / キーボード</span></td></tr>
    </tbody>
  </table>
</div>

<!-- Hardware -->
<div style="margin-bottom:2rem;">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:1rem;">
    <span class="equip-tag" style="background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.4);color:#a855f7;">HARDWARE</span>
    <h3 class="font-orbitron" style="font-size:0.75rem;letter-spacing:0.2em;color:var(--color-muted);">ハードウェア</h3>
  </div>
  <table class="equip-table">
    <thead>
      <tr><th>名称</th><th>メーカー</th><th>カテゴリ</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>MacBook Pro 16" M3 Max</strong></td><td style="color:var(--color-muted);">Apple</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">メインPC</span></td></tr>
      <tr><td><strong>Apollo Twin X Duo</strong></td><td style="color:var(--color-muted);">Universal Audio</td><td><span class="equip-tag" style="background:rgba(6,182,212,0.1);color:#06b6d4;">オーディオインターフェース</span></td></tr>
      <tr><td><strong>Neumann TLM 103</strong></td><td style="color:var(--color-muted);">Neumann</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">コンデンサーマイク</span></td></tr>
      <tr><td><strong>Sony PCM-D100</strong></td><td style="color:var(--color-muted);">Sony</td><td><span class="equip-tag" style="background:rgba(6,182,212,0.1);color:#06b6d4;">フィールドレコーダー</span></td></tr>
      <tr><td><strong>Genelec 8341A (Pair)</strong></td><td style="color:var(--color-muted);">Genelec</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">モニタースピーカー</span></td></tr>
      <tr><td><strong>Sony MDR-M1ST</strong></td><td style="color:var(--color-muted);">Sony</td><td><span class="equip-tag" style="background:rgba(6,182,212,0.1);color:#06b6d4;">モニターヘッドフォン</span></td></tr>
      <tr><td><strong>Arturia KeyLab 88 MkII</strong></td><td style="color:var(--color-muted);">Arturia</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">MIDIキーボード</span></td></tr>
      <tr><td><strong>Arturia DrumBrute Impact</strong></td><td style="color:var(--color-muted);">Arturia</td><td><span class="equip-tag" style="background:rgba(6,182,212,0.1);color:#06b6d4;">ドラムマシン</span></td></tr>
    </tbody>
  </table>
</div>

<!-- Ambient mics -->
<div>
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:1rem;">
    <span class="equip-tag" style="background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.4);color:#06b6d4;">FIELD REC</span>
    <h3 class="font-orbitron" style="font-size:0.75rem;letter-spacing:0.2em;color:var(--color-muted);">フィールドレコーディング機材</h3>
  </div>
  <table class="equip-table">
    <thead>
      <tr><th>名称</th><th>メーカー</th><th>特徴</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Zoom H6</strong></td><td style="color:var(--color-muted);">Zoom</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">6ch フィールドレコーダー</span></td></tr>
      <tr><td><strong>Sennheiser MKH 416</strong></td><td style="color:var(--color-muted);">Sennheiser</td><td><span class="equip-tag" style="background:rgba(6,182,212,0.1);color:#06b6d4;">ショットガンマイク</span></td></tr>
      <tr><td><strong>DPA 4060 (Pair)</strong></td><td style="color:var(--color-muted);">DPA</td><td><span class="equip-tag" style="background:rgba(124,58,237,0.1);color:#a855f7;">バイノーラルマイク</span></td></tr>
    </tbody>
  </table>
</div>
`
}

function renderStoreTab() {
  const items = [
    {
      emoji: '🎮', title: 'Fantasy RPG BGM Pack Vol.1',
      category: 'BGM PACK', price: '¥2,980',
      desc: 'ファンタジーRPG向け20曲収録。タウン・フィールド・ダンジョン・ボス戦など全シーン対応。ループ設計済み。',
      tags: ['商用利用可', 'ループ対応', 'WAV + MP3'],
      platform: 'BOOTH / itch.io',
      tracks: '20 tracks', color: '#7c3aed'
    },
    {
      emoji: '⚔️', title: 'Battle Sound Effects Pack Vol.1',
      category: 'SE PACK', price: '¥1,480',
      desc: '剣・魔法・弓・爆発など戦闘系SE100音源以上収録。各カテゴリ複数バリエーションあり。',
      tags: ['商用利用可', 'バリエーション多数', 'WAV 48kHz/24bit'],
      platform: 'BOOTH / itch.io',
      tracks: '100+ SE', color: '#06b6d4'
    },
    {
      emoji: '🌙', title: 'Dark Ambient & Horror Pack',
      category: 'AMBIENT', price: '¥3,480',
      desc: 'ホラー・ダークファンタジー向けアンビエント15曲＋環境音50音源。フィールドレコーディング素材加工版も収録。',
      tags: ['商用利用可', 'ループ対応', 'WAV + MP3 + OGG'],
      platform: 'BOOTH / itch.io',
      tracks: '15 BGM + 50 SE', color: '#a855f7'
    },
    {
      emoji: '🏙️', title: 'Cyberpunk / Sci-Fi BGM Pack',
      category: 'BGM PACK', price: '¥2,480',
      desc: '近未来・サイバーパンク世界観の電子音楽BGM15曲。アクション〜アンビエントまで幅広くカバー。',
      tags: ['商用利用可', 'ループ対応', 'WAV + MP3'],
      platform: 'BOOTH / itch.io',
      tracks: '15 tracks', color: '#06b6d4'
    },
    {
      emoji: '🌿', title: 'Nature & Ambient Field Recordings',
      category: 'FIELD REC', price: '¥1,980',
      desc: '森・川・海・雨など自然環境音のフィールドレコーディング素材集。ゲーム環境音やリラクゼーション用途に。',
      tags: ['商用利用可', '高音質WAV', 'ループ版付き'],
      platform: 'BOOTH',
      tracks: '40+ loops', color: '#7c3aed'
    },
    {
      emoji: '🎲', title: 'Casual Game UI Sound Pack',
      category: 'UI / SE', price: '¥980',
      desc: 'ボタン音・通知音・成功・失敗・レベルアップなどカジュアルゲーム向けUI音80音源。明るいポップ系。',
      tags: ['商用利用可', 'WAV + MP3', 'ロイヤリティフリー'],
      platform: 'BOOTH / itch.io',
      tracks: '80 SE', color: '#a855f7'
    },
  ]

  return `
<div style="margin-bottom:2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
  <div>
    <span class="section-label">STORE</span>
    <h2 class="font-orbitron" style="font-size:1.5rem;font-weight:900;margin-top:0.5rem;">販売コンテンツ</h2>
    <p style="color:var(--color-muted);font-size:0.8rem;margin-top:0.25rem;">BOOTH・itch.io にて販売中の素材パック</p>
  </div>
</div>

<!-- Platform links -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--color-border);margin-bottom:2rem;">
  <a href="https://booth.pm/" target="_blank" style="background:var(--color-surface2);padding:1.25rem;display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--color-text);transition:background 0.2s;" onmouseover="this.style.background='rgba(124,58,237,0.1)'" onmouseout="this.style.background='var(--color-surface2)'">
    <div style="width:42px;height:42px;background:rgba(243,139,168,0.15);border:1px solid rgba(243,139,168,0.4);display:flex;align-items:center;justify-content:center;color:#f38ba8;font-size:1.2rem;flex-shrink:0;">
      <i class="fas fa-store"></i>
    </div>
    <div>
      <div style="font-family:'Orbitron',sans-serif;font-size:0.7rem;letter-spacing:0.15em;margin-bottom:2px;">BOOTH</div>
      <div style="font-size:0.75rem;color:var(--color-muted);">soundforge.booth.pm</div>
    </div>
    <i class="fas fa-arrow-right" style="margin-left:auto;color:var(--color-muted);"></i>
  </a>
  <a href="https://itch.io/" target="_blank" style="background:var(--color-surface2);padding:1.25rem;display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--color-text);transition:background 0.2s;" onmouseover="this.style.background='rgba(124,58,237,0.1)'" onmouseout="this.style.background='var(--color-surface2)'">
    <div style="width:42px;height:42px;background:rgba(250,84,90,0.15);border:1px solid rgba(250,84,90,0.4);display:flex;align-items:center;justify-content:center;color:#fa545a;font-size:1.2rem;flex-shrink:0;">
      <i class="fas fa-gamepad"></i>
    </div>
    <div>
      <div style="font-family:'Orbitron',sans-serif;font-size:0.7rem;letter-spacing:0.15em;margin-bottom:2px;">ITCH.IO</div>
      <div style="font-size:0.75rem;color:var(--color-muted);">soundforge.itch.io</div>
    </div>
    <i class="fas fa-arrow-right" style="margin-left:auto;color:var(--color-muted);"></i>
  </a>
</div>

<!-- Products grid -->
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:1px;background:var(--color-border);">
  ${items.map(item => `
  <div class="store-card" style="background:var(--color-surface2);">
    <div class="store-thumb" style="background:linear-gradient(135deg,rgba(${item.color === '#7c3aed' ? '124,58,237' : item.color === '#06b6d4' ? '6,182,212' : '168,85,247'},0.15),rgba(10,10,15,0.6));">
      <span>${item.emoji}</span>
      <span style="position:absolute;top:12px;left:12px;font-family:'Orbitron',sans-serif;font-size:0.55rem;letter-spacing:0.2em;padding:3px 8px;background:rgba(${item.color === '#7c3aed' ? '124,58,237' : item.color === '#06b6d4' ? '6,182,212' : '168,85,247'},0.2);border:1px solid ${item.color};color:${item.color};">${item.category}</span>
    </div>
    <div style="padding:1.25rem;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;margin-bottom:0.5rem;">
        <h3 style="font-size:0.9rem;font-weight:700;line-height:1.4;">${item.title}</h3>
      </div>
      <p style="font-size:0.75rem;color:var(--color-muted);line-height:1.7;margin-bottom:0.75rem;">${item.desc}</p>
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:0.75rem;">
        ${item.tags.map(t => `<span style="font-size:0.65rem;padding:2px 8px;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.25);color:var(--color-muted);">${t}</span>`).join('')}
      </div>
      <div style="border-top:1px solid var(--color-border);padding-top:0.75rem;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <span class="price-badge" style="font-size:0.9rem;">${item.price}</span>
          <div style="font-size:0.65rem;color:var(--color-muted);margin-top:4px;">${item.tracks}</div>
        </div>
        <a href="https://booth.pm/" target="_blank" class="btn-primary" style="padding:8px 16px;font-size:0.6rem;">
          <i class="fas fa-shopping-cart"></i> 購入
        </a>
      </div>
    </div>
  </div>
  `).join('')}
</div>

<!-- Note -->
<div style="margin-top:2rem;padding:1.5rem;background:rgba(124,58,237,0.05);border:1px solid rgba(124,58,237,0.2);">
  <h4 class="font-orbitron" style="font-size:0.75rem;letter-spacing:0.15em;color:var(--color-accent2);margin-bottom:0.75rem;"><i class="fas fa-info-circle" style="margin-right:6px;"></i>ご購入前にお読みください</h4>
  <ul style="font-size:0.8rem;color:var(--color-muted);line-height:2;list-style:none;padding:0;">
    <li><i class="fas fa-check" style="color:var(--color-accent2);margin-right:8px;"></i>全商品は商用利用可能です（ライセンス詳細は各商品ページをご確認ください）</li>
    <li><i class="fas fa-check" style="color:var(--color-accent2);margin-right:8px;"></i>再販・再配布は禁止です</li>
    <li><i class="fas fa-check" style="color:var(--color-accent2);margin-right:8px;"></i>ゲーム・映像・配信など幅広い用途に対応</li>
    <li><i class="fas fa-check" style="color:var(--color-accent2);margin-right:8px;"></i>カスタム制作・バルク購入はお気軽にご相談ください</li>
  </ul>
</div>
`
}

export default app
