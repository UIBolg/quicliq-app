# Quicliq design system — foundations

Source: Figma file `kGcOLLGSdsq37Ova5pRIRE`, library **Quicliq [Main]**, page *Documentation* (`0:1`).
Raw values saved in `design/figma/tokens.json` (fetched 2026-11-02). Figma is read-only; re-fetch only if the library changes.
The Figma values matched the "Developer Build Prompts" doc (`docs/build-prompts.md`) everywhere I checked.

All tokens have one mode (light). Code uses the **exact Figma variable names** as keys:

```ts
const t = useTheme();
t.colors['Primary/Red']; t.spacing['spacing/24']; t.radius['radius/md']; t.stroke['stroke/xs'];
t.text('H1');            // → EN/H1 or AR/H1, depending on the locale
```

| File | Contents |
|---|---|
| `src/theme/colors.ts` | 64 colour tokens. **The only file allowed to contain hex values.** |
| `src/theme/spacing.ts` | `spacing/0 … spacing/120` |
| `src/theme/radius.ts` | `radius/none … radius/full` |
| `src/theme/stroke.ts` | `stroke/xs … stroke/8xl` |
| `src/theme/typography.ts` | 12 text styles × EN/AR + `System/Status Bar`; `getTextStyle(name, locale)` |
| `src/theme/fonts.ts` | font faces, families, and the font file map |
| `src/theme/layout.ts` | frame size, screen gutter, footer inset, minimum touch target (all from tokens) |
| `src/theme/ThemeProvider.tsx` | `ThemeProvider locale=…` + `useTheme()` |

## Colour (Figma collection "Colour")

| Group | Tokens |
|---|---|
| Primary / Secondary | `Primary/Red` #E01018 (brand, primary buttons, links) · `Secondary/Grey` #838383 |
| Neutral | `Neutral/Ink` #171717 (main text) · `Neutral/Slate` #595959 (secondary text) · `Neutral/Silver` #BFBFBF (borders, disabled) · `Neutral/Fog` #F3F3F3 (fields, surfaces) · `Neutral/White` #FFFFFF |
| Status | `Status/Success/{Default,Dark,Light}` #067647 / #054F31 / #ECFDF3 · `Status/Failure/{Default,Dark,Light}` #B42318 / #7A1A12 / #FEF3F2 |
| Brand, system, flags | `Brand/Logo Red` #EA2328 (logo only) · `System/Keyboard` #D6D7DC (keyboard mocks only) · `Flag/UK Blue` #012169 · `Flag/UK Red` #C8102E |
| Illustration | `Illustration/Skin Light`, `Skin Light Shade`, `Skin Medium`, `Skin Medium Shade`, `Skin Deep`, `Red Shade` |
| Alpha | `Alpha/Red 4/6/7/8/10/12/25%` · `Alpha/Ink 6/10/25/50%` · `Alpha/White 0…85%` (16 steps) · `Alpha/Dark 35%` |
| Dark (reserved) | `Dark/Background`, `Surface`, `Elevated`, `Border`, `Text Primary/Secondary/Tertiary`, `Red Glow`, `Success`, `Success Surface`, `Error`, `Error Surface`. **Not used in the current flows.** |

**Contrast rules from the Figma "Accessible Contrast" board:**
- Body text: `Neutral/Ink` or `Neutral/Slate` on White/Fog.
- White text only on `Primary/Red` or darker.
- `Primary/Red` on White is for headlines only.
- Don't use `Secondary/Grey` for body text (3.79:1).
- Don't put small red text on Fog (4.45:1).
- Banner and toast text: `Status/*/Dark` on `Status/*/Light`.

## Typography

Screens ask for a style name. `theme.text(name)` returns the EN or AR variant for the current locale, with the font family, size, line height and letter spacing.

| Style | EN (Avenir) size/line, cut, tracking | AR (Frutiger LT Arabic) size/line, cut |
|---|---|---|
| Display | 32/40 Black, −0.16 | 32/44 75 Black |
| H1 | 28/36 Heavy, −0.14 | 28/40 65 Bold |
| H2 | 24/32 Heavy | 24/36 65 Bold |
| H3 | 20/28 Heavy | 20/32 65 Bold |
| Title | 18/26 Medium | 18/28 65 Bold |
| Body Large | 16/24 Roman | 16/28 55 Roman |
| Body | 14/22 Roman | 14/24 55 Roman |
| Body Medium | 14/22 Medium | 14/24 65 Bold |
| Caption | 12/18 Roman | 12/20 45 Light |
| Overline | 10/14 Medium, +0.4 | 10/16 55 Roman |
| Numeric L | 44/48 Black, −0.88 | 44/60 75 Black |
| Numeric XL | 96/100 Black, −1.92 | 96/120 75 Black |
| System/Status Bar | 16/20 Heavy (Avenir in both languages; status-bar mock only) | — |

- Arabic letter spacing is always 0.
- Arabic line heights are taller than English, so never reuse an EN style for Arabic text.
- Digits stay Western (0–9) in both languages.
- Support font scaling up to 200% without clipping.

### Fonts

- **English:** Avenir. **Arabic:** Frutiger LT Arabic. Both are licensed, so the files are not in the repo.
- Drop the `.ttf`/`.otf` files into `assets/fonts/`. `scripts/register-fonts.js` runs automatically before `npm start`, `web`, `ios` and `android`. It matches files to the 8 faces below and generates `src/theme/fontFiles.generated.ts`, which `App.tsx` loads with `expo-font`.
- Each Figma cut is its own registered face, so Android never has to pick a cut from `fontWeight`:
  - `Avenir-Roman`, `Avenir-Medium`, `Avenir-Heavy`, `Avenir-Black`
  - `FrutigerLTArabic-45Light`, `FrutigerLTArabic-55Roman`, `FrutigerLTArabic-65Bold`, `FrutigerLTArabic-75Black`
- A face whose file is missing falls back to the system font at the matching weight, so the app runs before the fonts arrive.
- The family comes from the locale: `ThemeProvider locale="ar"` makes every `theme.text()` call resolve to the AR style and font.

## Spacing — "8px rhythm, 4px details"

`spacing/0, 2, 4, 6, 8, 12, 16, 24, 32, 40, 48, 56, 64, 72, 80, 96, 120`

- Layout gaps and padding use multiples of 8.
- 2, 4, 6 and 12 are only for small details inside components: icon-to-label gaps, chip padding, field-to-helper text.
- `spacing/120` is for the Figma canvas only and is never used in the app.

Typical uses, from Figma:

| Token | Use |
|---|---|
| 8 | Icon to label, page-indicator dots |
| 12 | Between list rows, option cards and keypad keys |
| 16 | Headline to message, stacked buttons, label to field |
| 24 | Screen margin, button and card padding |
| 32 | Footer bottom padding, space before a group of actions |
| 40 | Between sections |
| 48 | Top bar height and touch target |

## Radius

| Token | Value |
|---|---|
| `radius/none` | 0 |
| `radius/2xs` | 2 |
| `radius/xs` | 4 |
| `radius/sm` | 8 |
| `radius/md` | 12 |
| `radius/lg` | 16 |
| `radius/xl` | 24 |
| `radius/2xl` | 32 |
| `radius/3xl` | 40 |
| `radius/full` | 999 |

Where each one is used:
- `radius/md`: large buttons, banners, OTP digit boxes
- `radius/lg`: option cards (Radio Option, Nav Option) and the country prefix
- `radius/full`: small buttons, chips, tags, avatars, icon badges
- `radius/xs`: checkbox

## Stroke width

| Token | Value |
|---|---|
| `stroke/xs` | 1 |
| `stroke/sm` | 1.25 |
| `stroke/md` | 1.5 |
| `stroke/lg` | 1.75 |
| `stroke/xl` | 2 |
| `stroke/2xl` | 2.5 |
| `stroke/3xl` | 3 |
| `stroke/4xl` | 4 |
| `stroke/5xl` | 5 |
| `stroke/6xl` | 7 |
| `stroke/7xl` | 8 |
| `stroke/8xl` | 11 |

Where each one is used:
- `stroke/xs`: borders and dividers
- `stroke/md`: focused field border
- `stroke/lg` (1.75): line icons. Don't scale the stroke when you resize an icon.
- `stroke/4xl` and above: large illustration strokes

## Icons & illustrations (page `79:2`)

- **Icons:** 68 line icons, 24 px, 1.75 stroke. Recolour them through the stroke colour.
- **Spot illustrations:** 12, at 160 px (shown at 108 px inside sheets).
- **Flags:** UK and JO.
- Names and node IDs are in `design/figma/icons-manifest.json`.
- **Pipeline:** export the SVGs into `assets/icons|illustrations|flags/`, then run `npm run svg`. That generates `src/assets/*.generated.ts`, which is rendered with `react-native-svg`'s `SvgXml`. Ink strokes become `currentColor` so they can be recoloured. This works on iOS, Android and web; the Metro SVG transformer is not compatible with Expo SDK 58.
- **RTL:** mirror directional icons (`arrowLeft`, `arrowRight`, `chevronLeft`, `chevronRight`, `send`, `backspace`, …) with `scaleX: -1`. Never mirror the logo, flags, phone numbers or amounts.
- ⚠️ **Not exported yet.** This environment's network policy blocks `www.figma.com`, where Figma serves the SVG files.

## Layout rules (from the flow frames)

**Base frame:** 390 × 844 (iPhone 14). Some long forms are taller, for example `2.1a` at 1014 tall, so screens must scroll. Respect safe areas. Every tappable target is at least 44 × 44.

**Side padding:** `spacing/24` on the left and right. Content is 342 wide at 390.

**Screen structure.** Every flow frame follows the same stack:

```
Status Bar      47   (Figma mock only — use the real OS status bar)
Header          Step Header 132 (with title + progress) / 64 (compact: back + "Step x of y")
Content         flex: 1, scrolls; padding 0 / spacing/24, first item 8 from the top
Footer          104 = spacing/16 top + Button 56 + spacing/32 bottom; sticks to the bottom
```

- Fields in the content stack are 64 tall with 16 gaps (`spacing/16`).
- When a screen needs a keypad, such as `2.4 Verify`, the Keypad (316 tall) replaces the Footer.

**Bottom sheets.** Seen in 1.5, 1.6, 1.7, 2.3b, 2.3d, 2.8 and others:
- The screen behind stays rendered. A full-screen **Scrim** in `Alpha/Ink 50%` covers it.
- The sheet is `Neutral/White`, anchored to the bottom, with rounded top corners (`radius/xl`, judged from the screenshot; this will be confirmed when the component is read in Phase 2).
- Content order:
  1. **Grabber**: 4 high, 16 from the top, inset `spacing/24`
  2. Optional **spot illustration** (108 × 108), or a **Sheet Header** with a close button
  3. Title (`H2`) and message (`Body Large`, Slate), with `spacing/8` between them
  4. Optional content card (Fog, `radius/lg`)
  5. Full-width large **Button**, with `spacing/32` padding below it
- Implementation: `@gorhom/bottom-sheet` (per the build doc).

## Implementation notes

- **Stack:** Expo SDK 58 (React Native 0.88, TypeScript) with web support.
- **RTL preview:** the dev preview flips with `direction: 'rtl'`. Phase 4 adds `I18nManager.forceRTL` and an app reload, as the build doc requires.
- **Preview screenshots:** `docs/img/foundations-en.png` and `docs/img/foundations-ar.png`, rendered with the system-font fallback.
