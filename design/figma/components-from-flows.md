# Components used in flow screens (not all on the Components page)

Source: get_metadata of EN flow sections (Onboarding 202:6388, Registration 102:9413, Legal 153:5034,
Login new device 102:9417, Login returning 139:3333). Instance name in flow → library component.

| Instance name in flows | Library component | Group |
|---|---|---|
| Badge | Icon Badge (280:6935) | 1 |
| Avatar | Avatar (local set 280:8449, only Size=56: Primary/Red fill, white initials EN/H3) | 1 |
| Or | Divider / Or | 1 |
| Verified | Verified Tag | 1 |
| Edit | Button Small/Tonal with leading edit icon | 1 |
| Language button | Icon Button (globe) | 1 |
| Rule | Password Rule | 2 |
| UK prefix (fixed) | Country Prefix | 2 |
| Switch | Switch Account | 2 |
| Digit 1–6 + Separator (12×2) | OTP Digit ×6 | 3 |
| Countdown | Resend Countdown | 3 |
| Keypad | Keypad (mock only → native number pad) | 3 |
| Item | List Item | 4 |
| Option · sms / Option · email / Option · EN / Option · AR | Radio Option | 4 |
| Option · Call us / Email us / Visit our office | Nav Option | 4 |
| Grabber | Sheet Grabber | 5 |
| Head | Sheet Header | 5 |
| Continue button / Next | Next Button (64 circle) — onboarding | 5 |

Local patterns (frames, not components) that repeat across screens — candidates for code components:
- **Top bar** (Legal, Contact support): 56 high, Back (40×40, arrowLeft 20) + Title text — "Nav Header".
- **Top** with a 40 Badge at start (7.7, 7.8, 7.2c) — compact header.
- **Error box** (7.10, 7.2d): Failure/Light box, alert icon 18 + message, attempts dots (16×4 ×3) + "2 attempts left".
- **Icon tile** 56 (Legal headings) — Icon Badge-like square/round tile with 28 icon.
- **Numbered step** (Fraud Warning): 24 circle with number.
- **Fingerprint sheet** (7.0c, 7.0g): title, message, 80 circle with 40 fingerprint icon, button.
- **Face ID overlay** (7.0a): 64 faceId icon + label.
