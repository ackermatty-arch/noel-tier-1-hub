"""Build the www/ folder that goes inside the iPhone app.
- index.html (the whole app) + the Capacitor runtime so native features work
- invite.html is NOT included: invites are shared as videos/pictures now
Run from the repo root:  python3 scripts/build_www.py
"""
import os, shutil
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
www = os.path.join(root, "www")
shutil.rmtree(www, ignore_errors=True); os.makedirs(www)
html = open(os.path.join(root, "index.html"), encoding="utf-8").read()
tag = '<script src="capacitor.js"></script>\n'
assert "<head>" in html
html = html.replace("<head>", "<head>\n" + tag, 1)
open(os.path.join(www, "index.html"), "w", encoding="utf-8").write(html)
shutil.copy(os.path.join(root, "node_modules/@capacitor/core/dist/capacitor.js"), www)
for f in ("icon-192.png", "icon-512.png", "manifest.webmanifest"):
    shutil.copy(os.path.join(root, f), www)
print("www/ ready:", sorted(os.listdir(www)))
