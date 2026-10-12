"""Rebuild ../index.html from the source files in this folder. Run: python3 src/build.py"""
import os
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(here)
r = lambda f: open(os.path.join(here, f), encoding='utf-8').read()
shell = r('shell.html')
content = '\n'.join(r(f) for f in ['content-1-4.js', 'content-5-8.js', 'content-9-12.js', 'generators.js'])
app = r('app.js')
assert '</script' not in (content + app).lower()
old = open(os.path.join(root, 'index.html'), encoding='utf-8').read()
head = old[:old.index('<script>\n', old.index('firebase-config.js'))]
tail = shell.split('<div id="app"></div>')[1].replace('/*CONTENT*/', content).replace('/*APP*/', app)
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(head + tail.lstrip('\n') + '\n</body>\n</html>\n')
print('Built index.html')
