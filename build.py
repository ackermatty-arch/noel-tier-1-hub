"""Copy src/vault.js and src/lock.js into index.html (the app stays one file)."""
import re
s = open("index.html").read()
for name in ("native", "vault", "lock", "media", "meals-data"):
    code = open(f"src/{name}.js").read()
    s, n = re.subn(rf'(<script id="noel-{name}">\n).*?(</script>)', lambda m: m.group(1) + code + m.group(2), s, count=1, flags=re.S)
    assert n == 1, name
code = open("src/meals.js").read()
a, b = s.index("  /* @meals-start */"), s.index("  /* @meals-end */\n") + len("  /* @meals-end */\n")
s = s[:a] + "  /* @meals-start */\n" + code + s[b:]
code = open("src/nye.js").read()
a, b = s.index("  /* @nye-start */"), s.index("  /* @nye-end */\n") + len("  /* @nye-end */\n")
s = s[:a] + "  /* @nye-start */\n" + code + s[b:]
code = open("src/gideas.js").read()
a, b = s.index("  /* @gideas-start */"), s.index("  /* @gideas-end */\n") + len("  /* @gideas-end */\n")
s = s[:a] + "  /* @gideas-start */\n" + code + s[b:]
code = open("src/santa.js").read()
a, b = s.index("  /* @santa-start */"), s.index("  /* @santa-end */\n") + len("  /* @santa-end */\n")
s = s[:a] + "  /* @santa-start */\n" + code + s[b:]
code = open("src/placecards-data.js").read()
a, b = s.index("  /* @placecards-start */"), s.index("  /* @placecards-end */\n") + len("  /* @placecards-end */\n")
s = s[:a] + "  /* @placecards-start */\n" + code + s[b:]
code = open("src/host.js").read()
a, b = s.index("  /* @host-start */"), s.index("  /* @host-end */\n") + len("  /* @host-end */\n")
s = s[:a] + "  /* @host-start */\n" + code + s[b:]
code = open("src/org.js").read()
a, b = s.index("  /* @org-start */"), s.index("  /* @org-end */\n") + len("  /* @org-end */\n")
s = s[:a] + "  /* @org-start */\n" + code + s[b:]
code = open("src/print.js").read()
a, b = s.index("  /* @print-start */"), s.index("  /* @print-end */\n") + len("  /* @print-end */\n")
s = s[:a] + "  /* @print-start */\n" + code + s[b:]
code = open("src/themes.js").read()
a, b = s.index("  /* @themes-start */"), s.index("  /* @themes-end */\n") + len("  /* @themes-end */\n")
s = s[:a] + "  /* @themes-start */\n" + code + s[b:]
code = open("src/budget.js").read()
a, b = s.index("  /* @budget-start */"), s.index("  /* @budget-end */\n") + len("  /* @budget-end */\n")
s = s[:a] + "  /* @budget-start */\n" + code + s[b:]
code = open("src/track.js").read()
a, b = s.index("  /* @track-start */"), s.index("  /* @track-end */\n") + len("  /* @track-end */\n")
s = s[:a] + "  /* @track-start */\n" + code + s[b:]
open("index.html", "w").write(s)
print("index.html updated")
code = open("src/office.js").read()
a, b = s.index("  /* @office-start */"), s.index("  /* @office-end */\n") + len("  /* @office-end */\n")
s = s[:a] + "  /* @office-start */\n" + code + s[b:]
open("index.html", "w").write(s)
# 🏢 the Office Edition is the same app with one switch flipped
off = s.replace('window.NOEL_EDITION = "family";', 'window.NOEL_EDITION = "office";', 1)
assert off != s
# ✦ the Office Edition has its own name: Noëma (the Family Edition stays Noël)
import re as _re, base64 as _b64
_pearl = _b64.b64encode(open("office-assets/icon-office-192.png", "rb").read()).decode()
off = _re.sub(r'(<link rel="(?:apple-touch-icon|icon)"[^>]*href=")data:image/png;base64,[^"]*(")', lambda m: m.group(1) + "data:image/png;base64," + _pearl + m.group(2), off)
off = off.replace('content="#1E3A2F"', 'content="#151515"')
# the pearl is the Noëma logo in both Family and Office mode (the dove stays with Noël)
off = off.replace("body.co .brand-logo {", "body .brand-logo {").replace("body.co .welcome-star {", "body .welcome-star {")
off = off.replace("Noël", "Noëma").replace("NOËL", "NOËMA")
off = off.replace('["Noëma Tier 1 Hub", "Noëma Tier 1", "Christmas Holiday Hub"]', '["Noëma Tier 1 Hub", "Noël Tier 1 Hub", "Noël Tier 1", "Christmas Holiday Hub"]')
open("office.html", "w").write(off)
print("office.html updated")

# 👋 new-buyer preview pages: the same app, always starting as a brand-new buyer (nothing saved outside the tab)
flag = '<script>window.NOEL_FORCE_FRESH = true;</script>\n<script id="noel-fresh">'
for src, dst in (("index.html", "newbuyer.html"), ("office.html", "newbuyer-office.html")):
    t = open(src).read().replace('<script id="noel-fresh">', flag, 1)
    open(dst, "w").write(t)
print("new-buyer pages updated")

# 🔎 review pages: a clean copy with no lock screen, for looking through everything (kept in the tab only)
rflag = '<script>window.NOEL_REVIEW = true;</script>\n<script id="noel-fresh">'
for src, dst in (("index.html", "review.html"), ("office.html", "review-office.html")):
    t = open(src).read().replace('<script id="noel-fresh">', rflag, 1)
    open(dst, "w").write(t)
print("review pages updated")
