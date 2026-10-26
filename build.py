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
open("index.html", "w").write(s)
print("index.html updated")
