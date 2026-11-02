Onboarding scenes (342×360), exported with `download_assets` (SVG) from the EN section 202:6388:
sendMoney = 202:6435, rates = 202:6516, receiving = 202:6592, secure = 202:6671.
Cleaned with `python3 -I scripts/clean-figma-svg.py <file> "Scene"` (drops the Figma frame backgrounds).
In the AR section 202:6715 only scene 1 (202:6762) is mirrored; code mirrors sendMoney in RTL to match
(docs/figma-issues.md #19). Run `npm run svg` after updating.
