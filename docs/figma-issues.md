# Figma inconsistencies (for the designer to fix in Figma)

Found while building from file `kGcOLLGSdsq37Ova5pRIRE`. Code follows the rule noted in "What code does".
Figma is never edited from code.

| # | Where (node) | Issue | What code does |
|---|---|---|---|
| 1 | Divider / Or `280:8553`, used in AR screens e.g. `280:8594` (AR/7.0 Welcome back) | Label "أو" uses **EN/Caption** (Avenir) in Arabic screens; there is no Lang=AR variant. | Uses AR/Caption for Arabic. Suggest adding a Lang variant. |
| 2 | Avatar `280:8449` | Only Size=56 exists; it is a local component, not on the Components page. No 44 size, no Lang variant. | Adds 44 (initials in Title). |
| 3 | Button `12:16` | No Pressed or Focused state is defined (only Default/Disabled/Loading). | Pressed = Alpha/Ink 10% overlay (25% on red); focus = Ink outline at stroke/md (same as Text Field Focused). |
| 4 | Verified Tag `282:9835` Lang=AR (`282:9834`) | AR variant text is still the English "Matched" placeholder in the component. | Uses the AR string from the flow screens (see docs/components.md). |
| 5 | Button `12:16` loading spinner | Spinner is a static SVG; no animation spec. | Uses the platform spinner (approved). |
| 6 | Text styles: EN/Display, EN/Numeric L/XL use "Black" with weight 800 while EN/H1–H3 use "Heavy" with weight 900 | Avenir Black is normally heavier than Heavy; the numeric weights look swapped. | Uses the font cut by name (Black / Heavy), not the numeric weight. |
| 7 | Typography `System/Status Bar` | Not listed on the Typography Scale board (6:22); only found on screen frames. | Token kept for status-bar mocks only. |
| 8 | Switch Account `282:9874` Lang=AR (`282:9873`) | AR variant has the styles swapped: the `prompt` text is red Body Medium and the `action` text is Slate Body, and both still hold English placeholder text. The AR screens (`139:3994`) work around it by swapping the text overrides. | Same styling as EN: prompt Slate/Body, action Red/Body Medium link. AR copy from `139:3994`. |
| 9 | Agreement `281:7794` link text | The linked document text uses raw `#E01018`, 14px and fixed line heights instead of Primary/Red and the Body text style. | Uses `Primary/Red` + Body. |
| 10 | Login Method `141:4399` | Selected-tab drop shadow (0/2/8, Ink 8%) is a raw effect, not a variable or effect style. Component height is 47 (EN) / 48 (AR), off the 8px rhythm. | Shadow defined once in `src/theme/elevation.ts` from the Neutral/Ink token. Height comes from padding. |
| 11 | Text Field `21:388` | The label/value gap is a raw `2px`, not bound to `spacing/2`. | Uses `spacing/2`. |
| 12 | Password Rule `281:7369` | Component height 23 (EN) and the instance heights vary (22/24/70). Unmet indicator is an image (`Ellipse`) instead of a shape with tokens. | Height comes from content; Unmet = 20 circle, Neutral/Silver at stroke/md. |
| 13 | Text Field eye toggle | Only one `eye` icon exists; no `eyeOff` icon for the "hide password" state. | Same icon, tinted Primary/Red when the password is shown. Suggest adding `Icon/eyeOff`. |
| 14 | Build doc vs Figma: Country Prefix in Arabic | The build doc says the prefix is "after it in RTL reading order but on the leading side". In the Figma AR screens (`71:2025`) the phone row is not mirrored: +44 stays on the left. | Follows Figma: the phone row is always LTR. |
| 15 | Text Field `21:388` trailing icons | Trailing icons are flattened images without a colour variable, so their colour can't be read. | Eye/calendar/chevron = Neutral/Ink; lock = Neutral/Slate (taken from the screenshots). |
| 16 | Icons page `79:2`, title "Icons · 24px · 1.75 stroke" | Every exported icon path uses `stroke-width="1.5"` (stroke/md), not 1.75 (stroke/lg) as the page title says. | Uses the exported 1.5 artwork as-is. Designer to confirm which is intended. |
| 17 | Flag/UK `81:9` vs Flag/JO `117:1567` | Flag/UK has the Alpha/Ink 10% hairline drawn inside the artwork (inside stroke via mask); Flag/JO has no hairline. | Flag component adds the stroke/xs Alpha/Ink 10% ring only for flags whose artwork lacks it (JO). |
| 18 | Illustrations frame `79:389` | Illustration/fingerprint `89:1587` sits exactly on top of Illustration/update `79:490` (both at 440,326), and Illustration/offline `181:2643` is at x=1040, outside the 1040-wide frame, so it is clipped in page exports. Icon/fingerprint `89:1606` and Icon/globe `209:7048` also sit off the 104px icon grid. | Not affected yet (illustrations not exported in this step). Export illustrations per node when needed. |
