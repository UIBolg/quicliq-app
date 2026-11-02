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
