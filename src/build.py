"""Rebuild ../index.html from the source files in this folder. Run: python3 src/build.py
   Uses the page preamble (meta tags) from the current index.html, all CSS + scripts from shell.html."""
import os
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(here)
r = lambda f: open(os.path.join(here, f), encoding='utf-8').read()
FILES = ['content-1-4.js', 'content-5-8.js', 'content-9-12.js', 'content-more-1-6.js', 'content-more-7-12.js', 'content-ai.js', 'content-fin.js', 'content-spell.js', 'content-books.js', 'content-spanish.js', 'content-conundrums.js', 'content-quests.js', 'content-g2.js', 'content-g8.js', 'generators.js', 'generators-fin.js', 'generators-2-8.js', 'visuals.js']
shell = r('shell.html')
content = '\n'.join(r(f) for f in FILES)
app = r('app.js')
assert '</script' not in (content + app).lower()
old = open(os.path.join(root, 'index.html'), encoding='utf-8').read()
pre = old[:old.index('<title>')]
head, body = shell.split('<div id="app"></div>')
fb = ''.join('<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-%s-compat.js"></script>\n' % m for m in ['app', 'auth', 'firestore']) + '<script src="firebase-config.js"></script>\n'
body = body.replace('/*CONTENT*/', content).replace('/*APP*/', app)
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(pre + head.rstrip('\n') + '\n</head>\n<body>\n<div id="app"></div>\n' + fb + body.lstrip('\n') + '\n</body>\n</html>\n')
print('Built index.html')
