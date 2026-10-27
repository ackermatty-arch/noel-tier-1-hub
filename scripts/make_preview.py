"""Builds preview.html: index.html + the silver/gold/white design-system preview layer."""
css = r'''
/* ===== DESIGN PREVIEW: silver / champagne gold / white. No red, no green, no black bars ===== */
:root {
  --red:#8E95A0; --red-dark:#6F7782; --pine:#3A3D42; --pine-dark:#2F3236; --pine-deep:#2A2C30;
  --gold:#B9A27A; --gold-light:#D8C9A8; --cream:#FFFFFF; --ink:#2F3236; --muted:#7C828B; --line:#E4E6EA; --success:#8E95A0;
  --c-ivory:#fff; --c-pine:#3A3D42; --c-gold:#B9A27A; --c-gold2:#D8C9A8; --c-line:#E4E6EA;
}
body { background:#fff !important; }
body::after { border-color:#C9CDD3 !important; }
.app-header { background:#fff !important; color:#2F3236 !important; border-bottom:1px solid #D5D8DD !important; box-shadow:0 1px 0 #D8C9A8 !important; }
.app-header * { color:inherit; }
.app-header .brand-title, .app-header h1 { color:#2F3236 !important; }
.app-header small, .app-header .brand-sub { color:#B9A27A !important; }
.app-header .music-btn, .app-header .days-pill, .app-header .brand-logo, .app-header .tray-btn { background-color:#fff !important; border:1px solid #D5D8DD !important; box-shadow:none !important; }
.app-header .days-pill b, .app-header .days-pill strong, .app-header .days-pill span:first-child { color:#B9A27A !important; }
.bottom-nav { background:#fff !important; border-top:1px solid #D5D8DD !important; box-shadow:0 -1px 0 #D8C9A8 !important; }
.nav-btn { color:#8C9199 !important; }
.nav-btn.active { color:#2F3236 !important; }
.nav-btn.active::before { background:#B9A27A !important; }
.btn-red, .btn-gold, .btn-primary { background:#fff !important; color:#2F3236 !important; border:1px solid #B9A27A !important; box-shadow:none !important; letter-spacing:.04em; }
.btn-ghost { background:#fff !important; color:#5E646C !important; border:1px solid #D5D8DD !important; }
.print-thumb::after { background:#8E95A0 !important; }
.section-label, .view-title { color:#2F3236 !important; }
.section-label { color:#B9A27A !important; }
.card, .game-card, .advent-banner, .print-card { border-color:#D8C9A8 !important; background:#fff !important; }
.print-card.featured { background:#fff !important; }
.bundle-tag { background:#fff !important; border:1px solid #B9A27A; color:#8A7650 !important; }
.chip { background:#fff !important; border:1px solid #D5D8DD !important; color:#5E646C !important; }
.chip.on { border-color:#B9A27A !important; color:#2F3236 !important; }
#musicBtn { background-image:var(--ic-note-gold) !important; }
.mic-fab { background-color:#fff !important; border:1px solid #B9A27A !important; }
.pill { background:#fff !important; border:1px solid #D5D8DD !important; color:#5E646C !important; }
'''
import re
note = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#B9A27A" stroke-width="3.2" stroke-linejoin="round"><path d="M38 22l40-9v46"/><path d="M38 22v50"/><path d="M38 22l40-9v9l-40 9z"/><ellipse cx="29" cy="73" rx="11" ry="8" transform="rotate(-20 29 73)"/><ellipse cx="69" cy="60" rx="11" ry="8" transform="rotate(-20 69 60)"/></g></svg>'
import base64
css = ':root{--ic-note-gold:url("data:image/svg+xml;base64,%s")}' % base64.b64encode(note.encode()).decode() + css
s = open('index.html', encoding='utf8').read()
i = s.index('</style>', s.index('--soldier'))
open('preview.html', 'w', encoding='utf8').write(s[:i] + css + s[i:])
print('preview.html written')
