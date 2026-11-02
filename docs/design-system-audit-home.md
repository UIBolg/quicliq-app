# Design System Audit — Home (proposal)

Checked `src/screens/home/HomeScreen.tsx` against CLAUDE.md rules and `src/theme`.

> Update: the unverified variant was removed and Home was redesigned with a red header, the "Verify your ID and address" Action Banner, a rate card and colourful recipient avatars (docs/figma-issues.md #35–#36). Findings below about the unverified variant no longer apply.

## Summary
**Patterns reviewed:** 9 | **Issues found:** 14 | **Score before:** 72/100 → **after:** 94/100

## Token coverage
| Category | Before | After |
|---|---|---|
| Colours | Tokens only | Tokens only |
| Spacing / radius / stroke | Tokens only | Tokens only (one `padding: 0` TextInput reset, as in Text Field) |
| Typography | Tab labels in Overline (10px, meant for uppercase labels) | Caption |
| Sizes | `setupProgress` + `limitProgress` for one concept | `sizes.progress { sm, md, minFill }` |
| Copy | `"1 GBP = … JOD"`, `"£"`, `"Send to …"` in code; first names via `split(' ')` | `home.calc.rateLine`, `formatMoney()` (Intl, en-GB digits), `home.recipientShort` |

## Rule: one component per concept (no rebuilding in screens)
| Inline pattern (count) | New shared component |
|---|---|
| Progress bar (2) | `ProgressBar` — `size` sm/md, `tone` default/onBrand, stub at 0, a11y label + value |
| Title + "See all" (2) | `SectionHeader` — action announced as "See all, Recent transfers" |
| Transfer row (3) | `TransferRow` — one spoken label, pressed overlay |
| Avatar + name (5) | `RecipientTile` — pressed overlay, "Send money: Layla Haddad" |
| Bottom tab bar (1, needed on every main screen) | `TabBar` — Caption labels, pressed colour, `accessibilityState.selected` |
| LTR isolate / £ helpers (Home + mask.ts) | `src/utils/format.ts` — `ltr`, `formatMoney`, `formatAmount` |

## States & accessibility
| Before | After |
|---|---|
| Recipient tiles, transfer rows, "See all", tabs had no pressed state | All have pressed states |
| Transfer rows read as fragments | One label: name, method, date, amount, status |
| Setup progress bar had no spoken label | "0 of 2 steps complete" |
| Fee shown without currency ("Fee 0.00") | "Fee £0.00" |

## Still open (needs design decisions — see docs/figma-issues.md)
1. Home has no Figma frame (#30); all new components above are code additions to confirm or replace (#32, #33).
2. Disabled Button (white on Neutral/Silver) is ~1.8:1 contrast — below WCAG AA; Figma-defined, flagged for the designer.
3. Currency labels in the calculator look like buttons but are not pickers (see review notes).
