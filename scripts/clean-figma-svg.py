#!/usr/bin/env python3
"""
Cleans a Figma `download_assets` SVG export of one frame:
keeps only the <g id="<prefix>..."> element (dropping the parent page/section/frame backgrounds Figma
paints behind it), the <defs> it references, and strips Figma layer ids and web-only attributes.
Usage: python3 -I scripts/clean-figma-svg.py <file.svg> "<group id prefix>"   (edits the file in place)
"""
import re, sys
path, prefix = sys.argv[1], sys.argv[2]
s = open(path, encoding='utf8').read()

def element(src, start):
    tag = re.match(r'<(\w+)', src[start:]).group(1)
    depth = 0
    for m in re.finditer(r'<(/?)%s\b[^>]*?(/?)>' % tag, src[start:]):
        if m.group(1): depth -= 1
        elif not m.group(2): depth += 1
        elif depth == 0: return src[start:start + m.end()]
        if depth == 0: return src[start:start + m.end()]
    raise ValueError('unbalanced')

root = re.match(r'\s*(<svg[^>]*>)', s).group(1)
root = re.sub(r' (preserveAspectRatio|overflow|style)="[^"]*"', '', root)
m = re.search(r'<g id="%s' % re.escape(prefix), s)
body = element(s, m.start()) if m else s[s.index('>', s.index('<svg')) + 1:s.rindex('</svg>')]
defs = re.search(r'<defs>.*?</defs>', s, re.S)
out = root + (defs.group(0) if defs and 'url(#' in body else '') + body + '</svg>'
refs = set(re.findall(r'url\(#([^)]+)\)', out))
out = re.sub(r' id="([^"]*)"', lambda mm: mm.group(0) if mm.group(1) in refs else '', out)
out = re.sub(r'\s*\n\s*', '', out) + '\n'
open(path, 'w', encoding='utf8').write(out)
print(path, len(out), 'bytes')
