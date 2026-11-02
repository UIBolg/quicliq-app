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
