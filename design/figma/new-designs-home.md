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

## Transfers history — Filter cases, Arabic (2026-11-05)
- 76:692 — section "Transfer History — Filter cases — Arabic (RTL)", cloned from 69:619 and mirrored:
  76:693 Default · 76:853 Status sheet · 76:1041 Sending type sheet · 76:1229 Date range sheet · 76:1535 Filters applied · 76:1602 No results.
  AR text styles (H2, Overline, Body, Body Medium, Caption, Title), Arabic month names in dates, amounts keep EN styles.
  Still English (fix pass not applied yet): sheet titles/descriptions/options, Apply / Clear, calendar weekday letters.

## Account (Profile) — English (2026-11-05)
Section 93:1301 "Account (Profile) — English (LTR)" on page 6:2128, built with use_figma from Quicliq [Kitchen]
components, Colour / Spacing / Radius / Stroke variables and EN text styles (Avenir):
- 93:1302 12.1 Account (profile card, Account / Preferences / Support groups, Log out, tab bar) · 93:2094 12.1a Log out sheet
- 93:1441 12.2 Personal details (Text Field Locked / Filled + Chevron, Info Banner)
- 93:1587 12.3 Change password (Text Field Eye, Focused; rule list with Icon Badge 20 Success; Button Disabled)
- 93:1696 12.4 Saved cards (payment card visuals, Verified Tag "Default", "Set as default" pill, Button Ghost Small + trash, Add card)
- 93:1804 12.5 Security (Face ID switch, Change password, Active device) · 93:1873 12.6 Language (Radio Option)
- 93:1907 12.7 Legal (Nav Option ×3) · 93:1961 13.1 Help (Nav Option ×3) · 93:2014 13.2 Notifications (Banner, Tonal Small, rows)
Built manually (no library component): list group/row, switch, payment card, set-as-default pill, tab bar (shadow not
tokenised), log-out sheet. See figma-issues #38, #42, #47.

## Account (Profile) — Arabic (2026-11-05)
Section 96:1527 "Account (Profile) — Arabic (RTL)" below the English one: same 10 screens with Lang=AR library variants,
AR text styles (Frutiger LT Arabic), Arabic copy from src/i18n/ar.json, RTL order (rows, top bar, tab bar mirrored;
back = arrowRight, chevrons = chevronLeft). Names, emails, phone numbers, card details and amounts keep EN styles;
£ amounts inside Arabic sentences carry LRM marks so they read "£12,000".
96:1528 Account · 96:2334 Log out sheet · 96:1667 Personal details · 96:1813 Change password · 96:1922 Saved cards ·
96:2030 Security · 96:2099 Language (العربية selected) · 96:2133 Legal · 96:2196 Help · 96:2254 Notifications
