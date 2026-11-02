#!/usr/bin/env python3
"""
Splits the SVG export of the Figma page "Icons & Illustrations" (79:2) into one SVG per icon / flag.
Usage: python3 -I scripts/extract-figma-svgs.py design/figma/exports/icons-page-79-2.svg design/figma/icons-positions.json .
Positions come from design/figma/icons-positions.json (from get_metadata 79:2): each symbol's x/y on the page.
Each group <g id="Icon/NAME"> is re-based to 0,0 with a translate and given the symbol's own viewBox,
together with any <defs> it references (clipPath, mask, gradients).
"""
import json, re, sys, os

page_path, pos_path, root = sys.argv[1:4]
svg = open(page_path, encoding='utf8').read()
positions = json.load(open(pos_path, encoding='utf8'))

def element(src, start):
    """Return the balanced element starting at index `start` (a '<tag ...>')."""
    tag = re.match(r'<(\w+)', src[start:]).group(1)
    depth, i = 0, start
    pat = re.compile(r'<(/?)%s\b[^>]*?(/?)>' % tag)
    for m in pat.finditer(src, start):
        if m.group(1):
            depth -= 1
        elif not m.group(2):
            depth += 1
        else:
            if depth == 0:
                return src[start:m.end()]
            continue
        if depth == 0:
            return src[start:m.end()]
    raise ValueError('unbalanced ' + tag)

defs_block = re.search(r'<defs>(.*)</defs>', svg, re.S)
defs_src = defs_block.group(1) if defs_block else ''

def defs_for(fragment):
    out, seen = [], set()
    todo = re.findall(r'url\(#([^)]+)\)', fragment)
    while todo:
        ref = todo.pop()
        if ref in seen:
            continue
        seen.add(ref)
        m = re.search(r'<(\w+) id="%s"' % re.escape(ref), defs_src)
        if not m:
            continue
        el = element(defs_src, m.start())
        out.append(el)
        todo += re.findall(r'url\(#([^)]+)\)', el)
    return out

written = []
for figma_name, (kind, name, x, y, w, h) in positions.items():
    m = re.search(r'<g id="%s"' % re.escape(figma_name), svg)
    if not m:
        print('MISSING', figma_name)
        continue
    g = element(svg, m.start())
    g = re.sub(r' id="[^"]*"', '', g, count=1)  # drop the Figma layer name on the wrapper
    defs = defs_for(g)
    body = '<g transform="translate(%g %g)">%s</g>' % (-x, -y, g)
    if defs:
        # defs coordinates are page-absolute too; wrap them in the same translate via userSpaceOnUse
        body = '<defs>%s</defs>' % ''.join(defs) + body
    out = ('<svg width="%s" height="%s" viewBox="0 0 %s %s" fill="none" xmlns="http://www.w3.org/2000/svg">%s</svg>\n'
           % (w, h, w, h, body))
    out = re.sub(r'\s*\n\s*', '', out)
    # Drop Figma layer names; keep ids that are referenced (clipPath / mask / gradients).
    refs = set(re.findall(r'url\(#([^)]+)\)', out))
    out = re.sub(r' id="([^"]*)"', lambda mm: mm.group(0) if mm.group(1) in refs else '', out)

    dest = os.path.join(root, 'assets', kind, name + '.svg')
    open(dest, 'w', encoding='utf8').write(out)
    written.append(dest)
print(len(written), 'files written')
