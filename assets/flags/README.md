SVGs exported from Figma "Icons & Illustrations" (node 79:2). Names and node IDs: design/figma/icons-manifest.json.

How they were made (read-only, no Figma edits):
1. `download_assets` on page 79:2 as SVG → saved as design/figma/exports/icons-page-79-2.svg.
2. Positions from `get_metadata` 79:2 → design/figma/icons-page-metadata.xml / icons-positions.json.
3. `python3 -I scripts/extract-figma-svgs.py design/figma/exports/icons-page-79-2.svg <positions.json> .`
   cuts each `Icon/*` and `Flag/*` group into its own 24×24 SVG.
4. `npm run svg` regenerates src/assets/*.generated.ts.
