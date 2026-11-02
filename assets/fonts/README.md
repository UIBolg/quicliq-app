# Fonts (licensed — not committed by default)

Drop the font files here, then run `npm start` (fonts are registered automatically by `scripts/register-fonts.js`).

| Face (registered name)        | Figma style            | Used by |
|-------------------------------|------------------------|---------|
| Avenir-Roman                  | Avenir Roman           | EN Body Large, Body, Caption |
| Avenir-Medium                 | Avenir Medium          | EN Title, Body Medium, Overline |
| Avenir-Heavy                  | Avenir Heavy           | EN H1, H2, H3, System/Status Bar |
| Avenir-Black                  | Avenir Black           | EN Display, Numeric L, Numeric XL |
| FrutigerLTArabic-45Light      | Frutiger LT Arabic 45 Light | AR Caption |
| FrutigerLTArabic-55Roman      | Frutiger LT Arabic 55 Roman | AR Body Large, Body, Overline |
| FrutigerLTArabic-65Bold       | Frutiger LT Arabic 65 Bold  | AR H1, H2, H3, Title, Body Medium |
| FrutigerLTArabic-75Black      | Frutiger LT Arabic 75 Black | AR Display, Numeric L, Numeric XL |

Naming the files exactly as the first column (e.g. `Avenir-Heavy.ttf`) always works; other names are matched by keywords.
Missing faces fall back to the system font at the same weight.
