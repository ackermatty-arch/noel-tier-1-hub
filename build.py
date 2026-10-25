"""Copy src/vault.js and src/lock.js into index.html (the app stays one file)."""
import re
s = open("index.html").read()
for name in ("vault", "lock", "media"):
    code = open(f"src/{name}.js").read()
    s, n = re.subn(rf'(<script id="noel-{name}">\n).*?(</script>)', lambda m: m.group(1) + code + m.group(2), s, count=1, flags=re.S)
    assert n == 1, name
open("index.html", "w").write(s)
print("index.html updated")
