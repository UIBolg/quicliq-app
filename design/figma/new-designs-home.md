# Home frames in "New Designs" (Dxr5Ajr1A5uk1cgQDI6iEJ) — Page 4 (6:2128)

Built with `use_figma` (only file Claude may write to — see CLAUDE.md). Everything is linked to the published
**Quicliq [Kitchen]** library; nothing was created, edited or removed in the library or the copied design-system pages
(audit: 0 local components / variable collections / styles in the file).

| Frame | Node | Notes |
|---|---|---|
| Home — Verified (EN) | 19:253 | Limit card, Send money, 5 recipients, recent transfers, tab bar |
| Home — Verified (AR) | 21:75 | RTL order, AR text styles, amounts in EN styles |
| Home — Not verified (EN) | 22:103 | Setup card, send calculator, empty state |
| Home — Not verified (AR) | 22:222 | RTL order, AR text styles |

Audit (read back after build): every frame auto layout; 0 unlinked colours (all fills/strokes bound to Colour variables);
0 text without a library text style; padding/gap/radius/stroke bound to Spacing/Radius/Stroke variables; no images.
Library instances: Status Bar, Avatar (44/56), Icon Button (bell), Button (Primary / Secondary Small / Disabled, EN/AR
variants), Icon Badge (44 White, 40 Grey), Icon/* for tabs.

Library gaps (closest library option used, nothing added): no Inverse button → Secondary Small "Continue setup";
Avatar only solid → recipients use Avatar 56; no Icon Badge 44 Grey → 40 Grey; no card effect style → cards without shadow;
Icon Button white fill on Fog pages is an instance override.

## Home by limit level (2026-11-04)
Page 4 (6:2128) of New Designs, built with use_figma from Quicliq [Kitchen] variables, text styles, icons and components:
- 48:160 — Home — Basic (Level 1): blue info banner, light-red limit card (Alpha/Red 10% + 12% border)
- 48:335 — Home — Plus (Level 2): blue banner (source of funds), Primary/Red limit card
- 48:505 — Home — Premium (Level 3): no banner, burgundy limit card (Status/Failure/Dark), no progress bar
Raw (non-variable) values: blue banner (#EAF2FD / #1D5BBF / #123A7A — no Info variables, figma-issues #49), plane artwork,
tab-bar shadow, card padding 20. Icon Badge uses Size=40 Red tint (no 44 Red tint variant).
- Arabic Home frames (cloned + mirrored): 54:190 Basic AR · 54:351 Plus AR · 54:512 Premium AR

## Transfers history (2026-11-04)
- 66:351 — 11.1 Transfers history (EN) · 66:527 — 11.1 Transfers history (AR)
H2 title, search field (Fog, radius 12 raw), Status / Sending type / Date chips, month groups (Overline) of transfer cards
(Fog + Dark Fog stroke, Icon Badge 40 Red tint), floating tab bar with History active. Amounts/dates keep EN styles in AR.
