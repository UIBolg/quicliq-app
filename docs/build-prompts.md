# Quicliq - Developer Build Prompts

Oct 25, 2026 · \@Ahmad El Alkoumi

## How to use this doc

Each section below has one copy-paste prompt a developer (or a coding
assistant) can use to build that part of the Quicliq app, plus a link to
the matching Figma section. Build in this order: Documentation (tokens)
→ Components → the flows.

-   **Figma file:** [Quicliq Figma
    file](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test)

-   **Tech stack:** React Native for iOS and Android. Every prompt
    assumes this stack.

-   **Product:** Quicliq, a UK → anywhere money transfer app operated by
    Levantine Express.

-   **Two languages, one build:** every screen exists in English (LTR)
    and Arabic (RTL). Build each screen once and drive the language from
    the locale; do not build separate EN and AR screens.

-   **The Figma screen IDs** (for example 2.4) are the screen names in
    Figma. Use them as route or screen names so design and code stay
    traceable.

**Rules that apply to every prompt**

1.  Use only design tokens (colour, typography, spacing, radius,
    stroke). No hard-coded hex values, font sizes or pixel gaps.

2.  Use the shared components. Never rebuild a button, field or header
    inside a screen.

3.  All copy goes in translation files (en.json, ar.json) under keys
    named after the screen, for example registration.2_4.title.

4.  RTL: use logical properties (start/end, not left/right). Mirror
    directional icons (back arrow, chevrons). Do not mirror phone
    numbers, amounts, the logo or the flag. Keep digits as Western
    numerals (0-9) in both languages.

5.  Arabic uses the Arabic text styles (Frutiger LT Arabic), which have
    taller line heights than English. Never reuse the EN style for AR
    text.

6.  Base frame: 390 × 844 (iPhone 14). Respect safe areas. Every
    tappable target is at least 44 × 44.

7.  Screens linked by the Figma prototype are the source of truth for
    navigation. Where a prompt and the prototype disagree, the prototype
    wins.

**React Native setup (paste before the first prompt)**

The app is React Native (iOS and Android). Use:\
- Theme: tokens in src/theme (colors.js, typography.js, spacing.js,
radius.js, stroke.js) exposed through a ThemeProvider + useTheme hook.
Styles via StyleSheet.create reading tokens only.\
- Navigation: React Navigation (native stack); bottom sheets with
\@gorhom/bottom-sheet.\
- i18n: i18next + react-i18next with en.json / ar.json, ICU plurals
(i18next-icu) for Arabic dual/plural.\
- RTL: I18nManager.forceRTL(locale === \'ar\') then reload the app
(react-native-restart) when the language changes; use marginStart/End,
paddingStart/End, start/end and flexDirection \'row\' (auto-mirrors).
Mirror directional icons with transform scaleX: -1 when
I18nManager.isRTL.\
- Fonts: bundle Avenir and Frutiger LT Arabic via react-native.config.js
assets; pick the family from the locale in the typography tokens.\
- Icons/illustrations: react-native-svg (+
react-native-svg-transformer).\
- OTP: TextInput with textContentType=\"oneTimeCode\" (iOS) and
autoComplete=\"sms-otp\" (Android); keyboardType=\"number-pad\".\
- Biometrics: react-native-biometrics (Face ID / Touch ID /
BiometricPrompt); secure storage: react-native-keychain. Never store the
password.\
- Network/state: TanStack Query for API calls, NetInfo for the offline
state.\
- Component previews: Storybook for React Native, one story per variant
in EN and AR.

## Documentation (design tokens)

Build the five token sets from the Documentation page first; every later
prompt depends on them. All tokens have one mode (light). The Dark/\*
colours exist for a future dark theme and are not used in these flows
yet.

### 1. Colour palette

Figma: [Colour
Palette](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=8-9)

Create the Quicliq colour tokens as a single source of truth
(src/theme/colors.js). Name each token exactly as below (group/name) and
export them for use everywhere. No hex value may appear outside this
file.\
\
Primary/Red #E01018 (brand, primary buttons, links)\
Secondary/Grey #838383\
Neutral/Ink #171717 (main text)\
Neutral/Slate #595959 (secondary text)\
Neutral/Silver #BFBFBF (borders, disabled)\
Neutral/Fog #F3F3F3 (fields, surfaces)\
Neutral/White #FFFFFF\
Status/Success: Default #067647, Dark #054F31, Light #ECFDF3\
Status/Failure: Default #B42318, Dark #7A1A12, Light #FEF3F2\
Brand/Logo Red #EA2328 (logo only)\
Flag/UK Blue #012169, Flag/UK Red #C8102E (UK flag only)\
System/Keyboard #D6D7DC (keyboard mock-ups only)\
Illustration: Skin Light #F2C9A5, Skin Light Shade #E0B089, Skin Medium
#C68B5E, Skin Medium Shade #AD7449, Skin Deep #8A5A3B, Red Shade
#B80D14\
\
Alpha (tints and overlays, base colour + opacity):\
Alpha/Red 4%, 6%, 7%, 8%, 10%, 12%, 25% = #E01018 at that opacity\
Alpha/Ink 6%, 10%, 25%, 50% = #171717 at that opacity\
Alpha/White 0%, 14%, 16%, 18%, 20%, 25%, 30%, 35%, 40%, 45%, 50%, 60%,
70%, 75%, 80%, 85% = #FFFFFF at that opacity\
Alpha/Dark 35% = #7A1A12 at 35%\
\
Dark theme (reserved, not used yet): Background #0C0B0E, Surface
#17161B, Elevated #211F26, Border #322F38, Text Primary #F6F5F7, Text
Secondary #A7A4AE, Text Tertiary #6F6C78, Red Glow #FF4D55, Success
#3DD68C, Success Surface #0F2A1D, Error #FF6B66, Error Surface #2C1315\
\
Accessibility: body text uses Neutral/Ink or Neutral/Slate on White/Fog;
white text is only used on Primary/Red or darker.

### 2. Typography

Figma: [Typography Scale ---
Mobile](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=6-22)

Create the Quicliq text styles as tokens with an EN and an AR variant
for every style. The active variant is picked from the app locale
automatically, so screens only ask for \"H1\" or \"Body\".\
\
Fonts: English = Avenir. Arabic = Frutiger LT Arabic. Bundle both font
families (license required).\
\
Style \| EN (Avenir) size/line-height, weight, letter-spacing \| AR
(Frutiger LT Arabic) size/line-height, weight\
Display \| 32/40 Black, -0.16 \| 32/44 75 Black\
H1 \| 28/36 Heavy, -0.14 \| 28/40 65 Bold\
H2 \| 24/32 Heavy \| 24/36 65 Bold\
H3 \| 20/28 Heavy \| 20/32 65 Bold\
Title \| 18/26 Medium \| 18/28 65 Bold\
Body Large \| 16/24 Roman \| 16/28 55 Roman\
Body \| 14/22 Roman \| 14/24 55 Roman\
Body Medium \| 14/22 Medium \| 14/24 65 Bold\
Caption \| 12/18 Roman \| 12/20 45 Light\
Overline \| 10/14 Medium, +0.4 \| 10/16 55 Roman\
Numeric L \| 44/48 Black, -0.88 \| 44/60 75 Black\
Numeric XL \| 96/100 Black, -1.92 \| 96/120 75 Black\
System/Status Bar \| 16/20 Heavy (Avenir, both languages, status-bar
mock only)\
\
All Arabic letter-spacing is 0. Support Dynamic Type / font scaling up
to 200% without clipping.

### 3. Spacing

Figma:
[Spacing](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=15-2)

Create spacing tokens: spacing-0 = 0, spacing-2 = 2, spacing-4 = 4,
spacing-6 = 6, spacing-8 = 8, spacing-12 = 12, spacing-16 = 16,
spacing-24 = 24, spacing-32 = 32, spacing-40 = 40, spacing-48 = 48,
spacing-56 = 56, spacing-64 = 64, spacing-72 = 72, spacing-80 = 80,
spacing-96 = 96, spacing-120 = 120.\
\
Rule: \"8px rhythm, 4px details\". Layout gaps and padding use multiples
of 8; 2, 4, 6 and 12 are only for small details inside components
(icon-to-label gaps, chip padding). Screen side padding is spacing-24.
Use these tokens for every padding, margin and gap.

### 4. Radius

Figma:
[Radius](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=16-231)

Create corner radius tokens: radius-none = 0, radius-2xs = 2, radius-xs
= 4, radius-sm = 8, radius-md = 12, radius-lg = 16, radius-xl = 24,
radius-2xl = 32, radius-3xl = 40, radius-full = 999 (pills and
circles).\
\
Usage: Large buttons, banners and OTP digit boxes = radius-md; option
cards (Radio Option, Nav Option) and the country prefix = radius-lg;
Small buttons, chips, tags, avatars and icon badges = radius-full;
checkbox = radius-xs.

### 5. Stroke width

Figma: [Stroke
Width](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=150-2)

Create stroke width tokens: stroke-xs = 1, stroke-sm = 1.25, stroke-md =
1.5, stroke-lg = 1.75, stroke-xl = 2, stroke-2xl = 2.5, stroke-3xl = 3,
stroke-4xl = 4, stroke-5xl = 5, stroke-6xl = 7, stroke-7xl = 8,
stroke-8xl = 11.\
\
Usage: borders and dividers = stroke-xs; focused field border =
stroke-md; line icons use the stroke set in the icon (do not scale
strokes when resizing icons); large illustration strokes use 4xl and
above.

## Components

Figma:
[Components](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=12-3)
(page Components)

The library has 27 components. Each one that shows text has a Lang
(EN/AR) variant; in code that is one component that reads the locale,
not two.

Build a reusable UI component library for the Quicliq app using only the
design tokens (colour, typography, spacing, radius, stroke). Every
component must support English (LTR) and Arabic (RTL) from the app
locale: mirror layout with logical start/end, mirror directional icons,
and switch to the AR text style. Each component gets a story/preview
showing every variant in both languages.\
\
1. Button - props: label, icon (optional, leading), size (large \|
small), type (primary \| secondary \| ghost \| tonal \| disabled \|
loading). Large: 56 high, full width, radius-md, padding 0/24, gap 8,
Title text, 20px icon. Small: 32 high, hugs content, radius-full,
padding 0/12, gap 4, Body Medium text, 16px icon. Primary = Primary/Red
fill + white label; Secondary = white fill + Silver border + Ink label;
Ghost = no fill, red label; Tonal = Alpha/Red 8% fill, red label and
icon (inline actions like \"Edit\"); Disabled = Silver fill, not
tappable; Loading = Primary fill with a spinner in place of the label,
not tappable.\
2. Text Field - props: label, value, helper, trailing (eye \| calendar
\| chevron \| none), state (default \| filled \| focused \| error \|
locked). Filled style: Fog background, label inside above the value, 64
high. Focused = white + Ink outline. Error = Failure/Light fill +
Failure outline + message below. Locked = read-only with a lock look.
Eye toggles password visibility.\
3. Country Prefix - fixed \"+44\" with UK flag, 112 x 64, Fog,
radius-lg; sits before the mobile field (after it in RTL reading order
but still on the leading side).\
4. Step Header - back button, \"Step x of y\", screen title and a
segmented progress bar (completed segments in Primary/Red). Registration
uses 2 steps (\"Step 1 of 2\", \"Step 2 of 2\"); the component supports
up to 3.\
5. OTP Digit - one 46 x 60 box, radius-md; states empty, focused,
filled, error, success. A 6-digit code input is 6 of these, LTR order in
both languages, with SMS one-time-code autofill.\
6. Resend Countdown - \"Resend code in 0:30\" counting state, then an
Unlocked state with a tappable resend action.\
7. Keypad - only a design mock of the iOS number pad; in code use the
native number-pad keyboard on a TextInput with
textContentType=\"oneTimeCode\" and autoComplete=\"sms-otp\".\
8. Banner - props: text, type (info \| success \| error \| security \|
offline). Radius-md, icon + text.\
9. Checkbox (off \| on) and Agreement (checkbox + sentence with a linked
Privacy Policy or Fraud Warning document).\
10. Password Rule - one requirement row: met = green tick, unmet = grey
circle. Updates live while typing.\
11. Radio Option - selectable card with title, subtitle, optional icon,
radio; radius-lg, Fog. Nav Option - card with title, subtitle and
chevron that navigates.\
12. List Item - icon badge + one line of text (used in \"Things to
check\").\
13. Icon Badge - circle around an icon; sizes 20/32/40/44/56/72; tones
white, red tint, success, grey.\
14. Verified Tag - green \"Matched\" pill (Success/Light fill, Success
text).\
15. Avatar - initials in a circle, 44 or 56.\
16. Bottom sheet parts: Sheet Grabber (drag handle) and Sheet Header
(title, subtitle, close button).\
17. Divider / Or - line with a centred label.\
18. Login Method - segmented switch Mobile \| Email, radius-full, Fog
track.\
19. Switch Account - \"Not you? Switch account\" link row.\
20. Logo - wordmark, Brand red (#EA2328) on light, white on red/dark.
Never mirrored.\
21. Onboarding only: Pagination dots (4 steps, order reversed in RTL),
Next Button (64 circle, arrow mirrors in RTL), Skip Chip.\
22. Status Bar - design mock only; in code use the real OS status bar
(dark content on light screens, light content on red screens).\
\
Accessibility: every interactive component has an accessible label in
both languages, 44 x 44 minimum hit area, visible focus state, and
announces state changes (error, loading, checked).

## Phase 1 - flows

Figma page: [Phase
1](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=70-2).
Every section on the page is drawn twice: once in English (LTR) and once
in Arabic (RTL). Each prompt below builds one flow in both languages and
lists the copy for both. Legal sits inside Registration because it is
part of the same flow.

### 1. Onboarding

Figma: [Onboarding - English
(LTR)](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=202-6388)
· [Onboarding - Arabic
(RTL)](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=202-6715)

Screens: Splash - Loading, Onboarding 1-4 (illustrated), Onboarding -
Choose language (bottom sheet).

Build the Quicliq onboarding flow (first launch) in English (LTR) and
Arabic (RTL), using the design tokens and shared components (Button,
Pagination, Next Button, Skip Chip, Logo, Radio Option, Sheet Grabber,
Sheet Header). Match the Figma frames exactly.\
\
Screens and behaviour:\
1. Splash - Loading: full-screen Primary/Red background, white Logo,
loading indicator. Load app config (and check for forced update /
maintenance, see System flow). Then go to Onboarding 1 automatically.\
2. Onboarding 1-4: a horizontal pager of 4 slides. Each slide has an
illustration, an H1 title, a Body Large description, the Pagination dots
(step 1-4), and two fixed buttons at the bottom: Primary \"Sign up\" -\>
Registration 1.1 About you; Secondary \"Log in\" -\> Login 7.1. Swipe or
tap to go to the next slide. In RTL the pager runs right to left and dot
1 sits on the right.\
3. A language button at the top opens \"Choose language\" as a bottom
sheet (scrim + grabber + header + close). Two Radio Options: English and
العربية (subtitle \"Arabic\" / \"الإنجليزية\"). Choosing the current
language closes the sheet; choosing the other switches the whole app
locale and direction immediately, then returns to Onboarding 1. Tapping
the scrim or close dismisses. Save the choice; default to the device
language if it is Arabic, otherwise English.\
\
Copy (EN \| AR):\
- Splash tagline: (none) \| أرسل الأموال حول العالم\
- Slide 1: \"Send Money\" / \"Send money from the UK to your loved ones
abroad, quickly and securely.\" \| \"إرسال الأموال\" / \"أرسل الأموال من
المملكة المتحدة إلى أحبائك في أي مكان حول العالم، بسرعة وأمان.\"\
- Slide 2: \"Competitive Rates\" / \"Transparent exchange rates and
transfer fees, with no hidden costs.\" \| \"أسعار تنافسية\" / \"أسعار
صرف ورسوم تحويل شفافة تراها قبل الإرسال، بدون أي تكاليف خفية.\"\
- Slide 3: \"Flexible Receiving\" / \"Your family can receive money by
bank deposit or collect it as cash.\" \| \"استلام مرن\" / \"يمكن لعائلتك
استلام الأموال عبر الإيداع البنكي أو استلامها نقداً.\"\
- Slide 4: \"Secure Transfers\" / \"Secure payments, identity
verification, and real-time transaction tracking.\" \| \"تحويلات آمنة\"
/ \"مدفوعات آمنة، والتحقق من هويتك، وتتبع لحظي لكل تحويل من البداية حتى
الوصول.\"\
- Buttons: \"Sign up\" / \"Log in\" \| \"إنشاء حساب\" / \"تسجيل
الدخول\"\
- Language sheet: \"Choose your language\" / \"You can change this
anytime in Settings.\" \| \"اختر لغتك\" / \"يمكنك تغييرها في أي وقت من
الإعدادات.\"\
\
The illustrations use only Illustration/\* and brand colour tokens;
export them as SVG (or Lottie if animated) and do not mirror them in
RTL.

### 2. Registration

Figma: [New registration - English
(LTR)](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=102-9413)
· [New registration - Arabic
(RTL)](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=102-9414)

Screens: 1.1-1.7 (About you), 2.1-2.3d (Account details and number
check), 2.4-2.8 (Verify code), 2.9 / 2.9b (Account created), 3.6 / 3.1b
(Biometric setup), plus the Legal screens (Privacy Policy, Fraud
Warning) opened from step 2.

Build the Quicliq sign-up flow in English (LTR) and Arabic (RTL), using
the design tokens and shared components (Step Header, Text Field,
Country Prefix, Button, Password Rule, Agreement, Banner, Verified Tag,
List Item, Icon Badge, OTP Digit, Resend Countdown, Sheet Grabber, Sheet
Header). Match the Figma frames and prototype exactly.\
\
STEP 1 of 2 - About you (1.1-1.7)\
- Fields: First name, Middle name (optional), Last name, Date of birth
(DD / MM / YYYY). Tapping Date of birth opens a bottom-sheet wheel
picker (1.1b: day / month / year, \"Done\"), hint \"You must be 18 or
older to open an account.\"\
- Validation on Continue (1.2): names letters only (allow spaces,
hyphens, apostrophes and Arabic letters), age \>= 18. Show the error
under each field using the Text Field error state.\
- 1.3 ready -\> Continue -\> 1.3a checking: call the identity check API
(name + DOB against official records). Show the loading state on the
button and the note \"This is not a credit check and won\'t affect your
credit score.\"\
- Results (bottom sheets over the form): 1.5 Details matched (Verified
Tag \"Matched\", Continue -\> step 2); 1.6 Couldn\'t confirm (Things to
check list, \"Edit my details\" closes the sheet); 1.7 Account exists
(\"Log in\" -\> Login 7.1, \"Reset password\").\
\
STEP 2 of 2 - Account details (2.1-2.3d)\
- Fields: Country Prefix +44 (fixed) + Mobile number, Email, Password,
Confirm password, two Agreements (Privacy Policy, Fraud Warning - the
linked words open the Legal screens described below). \"Create account\"
is disabled until everything is valid and both boxes are ticked.\
- When Password is focused (2.1a) show 5 live Password Rules: 8+
characters, uppercase, lowercase, number, special character.\
- Errors (2.2): mobile must be a UK mobile starting with 7 (after +44);
passwords must match; valid email format.\
- 2.3 ready shows \"Next, we\'ll text a 6-digit code to +44 7700
900123\" -\> Create account -\> 2.3a checking the number is registered
in the user\'s name (mobile-ownership API).\
- Match -\> 2.3d sheet \"Your number checks out\" + Matched tag -\>
\"Send code\" -\> 2.4.\
- No match -\> 2.3b ONE sheet \"We couldn\'t confirm your number\" with
2 things to check, Primary \"Enter a different number\" (-\> 2.3c,
focuses the mobile field, then re-check) and Secondary \"Continue with
this number\" with the note that the sending limit will be £0 until ID
and address are verified in the app. Continue -\> 2.4g. The code step is
never skipped.\
\
Verify your number (2.4-2.8)\
- 6 OTP Digits, SMS autofill (\"From Messages\"), Resend Countdown from
0:59 (2.4 counting, 2.4b unlocked -\> 2.4c \"New code sent. It can take
up to a minute.\").\
- Number row with a Small Tonal \"Edit\" button -\> 2.4a Change mobile
number sheet (+44 field, \"Send new code\") -\> 2.4d checking ownership
-\> 2.4e confirmed (Send code -\> 2.4c) or 2.4f couldn\'t confirm (Enter
a different number -\> 2.4a).\
- Auto-submit when 6 digits are entered -\> 2.5 Verifying... -\> 2.7
\"Number verified\" + \"Creating your account...\" -\> 2.9. Wrong code
-\> 2.6 error state + \"2 attempts left\". After 3 wrong attempts, lock
and offer resend.\
- \"Didn\'t get a code?\" -\> 2.8 sheet: resend by text (available after
the timer), Change mobile number, Cancel.\
- Unverified-number branch: 2.4g / 2.7b are the same screens but the
account is flagged ID_CHECK_REQUIRED and 2.7b goes to 2.9b.\
\
Account created (2.9 / 2.9b)\
- 2.9: \"Welcome, {firstName}!\", sending limit £800 (Numeric style),
\"Raise your limit\" steps: Create your account (done), Verify your ID
and address (£12,000), Add your source of funds (£12,000+, unlocks after
ID). Primary \"Verify ID and address\", Ghost \"Maybe later\" -\> 3.6.\
- 2.9b (number not in user\'s name): Security banner, limit £0, ID and
address step marked \"Required to start sending\". Sending is blocked
until verified; Home shows a \"Verify now\" card.\
- Limits come from the API, never hard-coded.\
\
Biometric setup: 3.6 Face ID (iOS) or 3.1b Fingerprint (Android), 3
benefit rows, \"Enable\" triggers the OS biometric prompt, \"Not now\"
skips. Show the variant the device supports; skip the screen if none.\
\
Copy (EN \| AR) - put every string in en.json / ar.json:\
- Step 1 of 2 \| الخطوة 1 من 2 · Step 2 of 2 \| الخطوة 2 من 2\
- About you \| معلوماتك · Enter your name and date of birth exactly as
they appear on your ID. \| أدخل اسمك وتاريخ ميلادك كما يظهران تماماً في
هويتك.\
- First name \| الاسم الأول · Middle name \| الاسم الأوسط · Last name \|
اسم العائلة · Date of birth \| تاريخ الميلاد · DD / MM / YYYY \| يوم /
شهر / سنة · Continue \| متابعة · Done \| تم\
- You must be 18 or older to open an account. \| يجب أن يكون عمرك 18
عاماً أو أكثر لفتح حساب.\
- Use letters only. Numbers and special characters aren\'t allowed. \|
استخدم الأحرف فقط. لا يُسمح بالأرقام أو الرموز الخاصة. · Enter your
middle name. \| أدخل اسمك الأوسط. · You must be 18 or older to register.
\| يجب أن يكون عمرك 18 عاماً أو أكثر للتسجيل.\
- This is not a credit check and won\'t affect your credit score. \| هذا
ليس فحصاً ائتمانياً ولن يؤثر على تصنيفك الائتماني.\
- Your details check out \| بياناتك صحيحة · Your details match official
records and there\'s no existing account. Next, set up your login
details. \| بياناتك مطابقة للسجلات الرسمية ولا يوجد حساب سابق. الخطوة
التالية: إعداد بيانات الدخول. · Matched \| مطابق\
- We couldn\'t confirm your details \| تعذّر التأكد من بياناتك · Your
name and date of birth didn\'t match official records. Please check them
and try again. \| لم يتطابق اسمك وتاريخ ميلادك مع السجلات الرسمية. يرجى
التحقق منهما والمحاولة مرة أخرى. · Things to check \| ما يجب التحقق منه
· Edit my details \| تعديل بياناتي\
- Use your full legal name, including middle names \| استخدم اسمك
القانوني الكامل، بما في ذلك الأسماء الوسطى\
- Check the day and month aren\'t swapped \| تأكد من عدم تبديل اليوم
والشهر\
- Enter your name exactly as it appears on your ID \| أدخل اسمك كما يظهر
تماماً في هويتك\
- You already have an account \| لديك حساب بالفعل · An account with
these details already exists. Log in, or reset your password if you\'ve
forgotten it. \| يوجد حساب بهذه البيانات. سجّل الدخول، أو أعد تعيين كلمة
المرور إذا نسيتها. · Log in \| تسجيل الدخول · Reset password \| إعادة
تعيين كلمة المرور\
- Your account details \| بيانات حسابك · You\'ll use these to log in.
We\'ll text a code to verify your mobile. \| ستستخدمها لتسجيل الدخول.
سنرسل رمزاً إلى هاتفك المحمول للتحقق منه.\
- Mobile number \| رقم الهاتف المحمول · Must be a UK mobile number
registered in your name. \| يجب أن يكون رقم هاتف بريطانياً مسجّلاً باسمك. ·
Email \| البريد الإلكتروني · Password \| كلمة المرور · Create a password
\| أنشئ كلمة مرور · Confirm password \| تأكيد كلمة المرور · Re-enter
your password \| أعد إدخال كلمة المرور\
- I accept the Privacy Policy \| أوافق على سياسة الخصوصية · I\'ve read
the Fraud Warning \| قرأت تحذير الاحتيال · Create account \| إنشاء
الحساب\
- Password rules: At least 8 characters \| 8 أحرف على الأقل · One
uppercase letter \| حرف كبير واحد · One lowercase letter \| حرف صغير
واحد · One number \| رقم واحد · One special character \| رمز خاص واحد\
- Enter a UK mobile number starting with 7. \| أدخل رقم هاتف محمول
بريطاني يبدأ بالرقم 7. · Passwords don\'t match. \| كلمتا المرور غير
متطابقتين. · Passwords match \| كلمتا المرور متطابقتان\
- Next, we\'ll text a 6-digit code to {phone}. \| بعد ذلك، سنرسل رمزاً من
6 أرقام إلى رقمك المحمول.\
- Checking this number is registered in your name... \| نتحقق من أن هذا
الرقم مسجّل باسمك...\
- Your number checks out \| تم تأكيد رقمك · This number is registered in
your name. Next, we\'ll text you a 6-digit code to verify it. \| هذا
الرقم مسجّل باسمك. سنرسل لك الآن رمزاً من 6 أرقام للتحقق منه. · Registered
in your name \| مسجّل باسمك · Send code \| إرسال الرمز\
- We couldn\'t confirm your number \| تعذّر التأكد من رقم هاتفك · This
mobile number isn\'t registered to the name you gave us. Enter a UK
mobile number that\'s registered in your name. \| رقم الهاتف هذا غير
مسجّل بالاسم الذي أدخلته. أدخل رقم هاتف بريطانياً مسجّلاً باسمك.\
- Use a number in your own name, not a family member\'s or a work phone
\| استخدم رقماً مسجّلاً باسمك، وليس باسم أحد أفراد عائلتك أو رقم العمل\
- Check the number is typed correctly \| تأكد من كتابة الرقم بشكل صحيح\
- Make sure it\'s a UK mobile number starting with 07 \| تأكد أنه رقم
هاتف بريطاني يبدأ بـ 07 (2.4f only)\
- Enter a different number \| إدخال رقم آخر · Continue with this number
\| المتابعة بهذا الرقم\
- If you continue, your sending limit will be £0 until you verify your
ID and address in the app. \| إذا تابعت، سيكون حدّ الإرسال 0 £ حتى توثّق
هويتك وعنوانك داخل التطبيق.\
- Verify your number \| تحقق من رقمك · We\'ve texted a 6-digit code to
\| أرسلنا رمزاً من 6 أرقام إلى · Edit \| تعديل · Didn\'t get a code? \|
لم يصلك الرمز؟ · From Messages \| من الرسائل\
- Resend code in {m:ss} \| إعادة الإرسال خلال {m:ss} · Resend code \|
إعادة إرسال الرمز · New code sent. It can take up to a minute. \| تم
إرسال رمز جديد. قد يستغرق وصوله حتى دقيقة.\
- Change mobile number \| تغيير رقم الهاتف · We\'ll text a new code to
this number. UK mobile numbers only. \| سنرسل رمزاً جديداً إلى هذا الرقم.
أرقام المملكة المتحدة فقط. · Send new code \| إرسال رمز جديد\
- Verifying... \| جارٍ التحقق... · That code isn\'t right. Check your
messages and try again. \| الرمز غير صحيح. تحقق من رسائلك وحاول مرة
أخرى. · 2 attempts left \| تبقّت محاولتان (use plural rules: Arabic has
dual/plural forms)\
- Number verified \| تم التحقق من رقمك · Creating your account... \| جارٍ
إنشاء حسابك...\
- It can take up to a minute to arrive. Check the number below is right.
\| قد يستغرق وصوله حتى دقيقة. تأكد من صحة الرقم أدناه. · Resend by text
\| إعادة الإرسال برسالة نصية · Available in {m:ss} \| متاح خلال {m:ss} ·
Cancel \| إلغاء\
- Account created \| تم إنشاء الحساب · Welcome, {name}! You can start
sending now. \| مرحباً {name}! يمكنك البدء بإرسال الأموال الآن. · Your
sending limit \| حدّ الإرسال الحالي · Total you can send over the
lifetime of your account \| إجمالي ما يمكنك إرساله طوال عمر حسابك ·
Raise your limit \| ارفع حدّك · total \| إجمالاً · Done \| مكتمل\
- Verify your ID and address \| توثيق الهوية والعنوان · Passport or
driving licence + a recent bill · 3 min \| جواز سفر أو رخصة قيادة +
فاتورة حديثة · 3 دقائق · Add your source of funds \| إضافة مصدر الأموال
· Unlocks after ID and address \| متاح بعد توثيق الهوية والعنوان ·
Verify ID and address \| وثّق هويتك وعنوانك · Maybe later \| لاحقاً\
- 2.9b: Welcome, {name}! Verify your ID and address to start sending. \|
مرحباً {name}! وثّق هويتك وعنوانك لتبدأ الإرسال. · Your number isn\'t
registered in your name, so we need to check your ID and address first.
\| رقمك غير مسجّل باسمك، لذا نحتاج إلى التحقق من هويتك وعنوانك أولاً. ·
You can\'t send money until your ID and address are verified \| لا يمكنك
إرسال الأموال قبل توثيق هويتك وعنوانك · Required to start sending · 3
min \| مطلوب لبدء الإرسال · 3 دقائق\
- Face ID: Log in faster with Face ID \| سجّل الدخول أسرع باستخدام Face
ID · Use Face ID instead of typing your password each time. \| استخدم
Face ID بدلاً من كتابة كلمة المرور في كل مرة. · Faster, one-glance login
\| دخول أسرع بنظرة واحدة · Your face data never leaves your phone \|
بيانات وجهك لا تغادر هاتفك · Extra protection for every transfer \|
حماية إضافية لكل تحويل · Enable Face ID \| تفعيل Face ID · Not now \|
ليس الآن\
- Fingerprint: Log in faster with your fingerprint \| سجّل الدخول أسرع
باستخدام بصمتك · Use your fingerprint instead of typing your password
each time. \| استخدم بصمة إصبعك بدلاً من كتابة كلمة المرور في كل مرة. ·
Faster, one-touch login \| دخول أسرع بلمسة واحدة · Your fingerprint data
never leaves your phone \| بيانات بصمتك لا تغادر هاتفك · Enable
fingerprint \| تفعيل البصمة\
\
Phone numbers, amounts and codes stay LTR inside Arabic text (wrap them
in an LTR isolate). Format money with the locale (£800 in EN, 800 £ in
AR as in the design).

#### Legal screens (part of Registration)

Figma: [Legal - English
(LTR)](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=153-5034)
· [Legal - Arabic
(RTL)](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=153-5049)

The Privacy Policy and Fraud Warning open from the two Agreements on
step 2 (2.1 Account details) and return there. Build them together with
the Registration prompt above.

As part of the Quicliq registration flow, build the two legal screens
opened from the Agreement checkboxes on step 2 (Account details):
Privacy Policy and Fraud Warning, in English (LTR) and Arabic (RTL),
using the design tokens and shared components (Banner, List Item, Icon
Badge, Button). Match the Figma frames exactly.\
\
Layout (both screens): top bar with Back; H1 title; Body Large intro;
scrollable content of H3 section headings, Body paragraphs and icon
lists; a sticky Primary \"Done\" / \"تم\" button at the bottom. Back and
Done both return to step 2 with the form unchanged. Opening a document
does not tick its checkbox; the user ticks it.\
\
Privacy Policy / سياسة الخصوصية sections, in order: Key points (4-item
highlight card), Who we are, What this policy covers, Data we collect,
How we keep it safe, How long we keep it, Your rights (6 rows: Access,
Correction, Erasure, Restriction, Portability, Objection), Complaints,
Other websites, If our business changes hands, Changes to this policy,
Governing law, Contact us.\
Links: abdulkhadir@levexpress.co.uk and legal@levexpress.co.uk open
mail; ico.org.uk opens the browser.\
\
Fraud Warning / تحذير من الاحتيال sections, in order: Security banner
(\"The police, your bank and HMRC will never cold call you to ask for
your bank details.\"), Do (6 items, success tick), Don\'t (6 items,
failure cross), tip \"If you\'re unsure, ask a friend or relative for
advice.\", Warning signs (5), Common scams (7 cards: Fake offers and
free trials, Copycat government websites, Dating and romance scams,
Holiday fraud, Mandate fraud, Pharming, Phishing), If you think you\'ve
been scammed (numbered steps 1-3), company footer (Levantine Express
Ltd, Office 117a, Building 3, Chiswick Park, 566 Chiswick High Road,
London W4 5YA; FCA FRN 940437; company no. 11630563) and the
disclaimer.\
\
Copy: take every string verbatim from the EN and AR Figma frames into
en.json / ar.json (keys legal.privacy.\* and legal.fraud.\*). Better
still, serve both documents from the CMS/API so legal can update them
without an app release; keep a bundled copy for offline use.\
\
The office address stays in English in both languages (as in the
design). Numbered steps and list icons sit on the start side and mirror
in RTL. Content must be readable by screen readers in order, with
headings marked as headings.

### 3. Login (new device)

Figma: [Login - English
(LTR)](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=102-9417)
· [Login - Arabic
(RTL)](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=102-9418)

Screens: 7.1-7.6 (login and errors), 7.2a-7.2e (verify login), 7.7-7.11
(new device), 7.7c (Contact support).

Build the Quicliq login flow for a user who is not yet logged in on this
phone, in English (LTR) and Arabic (RTL), using the design tokens and
shared components (Logo, Login Method, Text Field, Country Prefix,
Button, Banner, OTP Digit, Resend Countdown, Radio Option, Nav Option,
Icon Badge, List Item, Sheet Header). Match the Figma frames and
prototype exactly.\
\
Login (7.1 / 7.1b)\
- Login Method switch: Mobile number (+44 prefix + number) or Email.
Password field with eye toggle. \"Forgot password?\" link. Primary \"Log
in\". Footer link \"Don\'t have an account? Sign up\" -\> Registration
1.1.\
- Log in -\> 7.2 loading (button Loading state) -\> 2-step
verification:\
- Mobile login -\> 7.2a \"Verify it\'s you\": code sent by text, OTP
input with SMS autofill.\
- Email login -\> 7.2e -\> 7.2b: code sent by email to a masked address
(j•••••@email.com).\
- \"Try another way\" -\> 7.2c sheet: Radio Options Text message / Email
-\> Send code.\
- Wrong code -\> 7.2d error state with attempts left.\
- Errors: 7.3 Error banner \"Incorrect mobile number or password\"; 7.4
after 5 failed attempts login pauses 15 minutes with a live countdown
\"Try again in 14:59\" and \"Reset password\"; 7.5 Offline state (no
network) with \"Try again\"; 7.6 ID expired sheet after login (\"Verify
my identity\", \"Remind me later\").\
\
New device (7.7-7.11) - when the account is already active on another
phone:\
- 7.7 \"New device detected\": 3 steps (confirm your personal details,
enter the code we send you, this becomes your trusted device) and the
warning that only one device can be active; the other device will be
logged out.\
- 7.8 confirm identity: First, Middle, Last name, Date of birth exactly
as on the ID; note \"We\'ll send a 6-digit code to +44 •••• ••0123\".\
- 7.8b details don\'t match -\> Error with attempts left (3 attempts
total). 7.8c after 3 failed attempts: blocked on this phone, \"Contact
support\" -\> 7.7c and \"Back to log in\".\
- 7.8d \"Where should we send your code?\" (text or email, only if email
is verified) -\> 7.9 (text) or 7.9b (email) -\> OTP. Wrong code -\>
7.10. Correct -\> 7.11 \"Device verified\" -\> Continue to Home.
Register this device as the trusted device on the server.\
\
Contact support (7.7c): Call +44 208 073 10 90, Email
info@levexpress.co.uk, Office Chiswick Park, London W4 5YA; Security
banner \"Never share your password or verification code with anyone.\";
\"Call support\" opens the dialler, \"Email support\" opens mail.\
\
Mask phone numbers and emails everywhere outside the field the user
typed into. Never reveal whether the mobile number or the password was
wrong.\
\
Copy (EN \| AR):\
- Log in \| تسجيل الدخول · Log in to send money in seconds. \| سجّل
الدخول لإرسال الأموال في ثوانٍ.\
- Mobile number \| رقم الهاتف · Email \| البريد الإلكتروني · Password \|
كلمة المرور · Forgot password? \| نسيت كلمة المرور؟ · Don\'t have an
account? Sign up \| ليس لديك حساب؟ إنشاء حساب\
- Incorrect mobile number or password. Please try again. \| رقم الهاتف
أو كلمة المرور غير صحيحة. حاول مرة أخرى.\
- Too many attempts. For your security, login is paused for 15 minutes.
\| محاولات كثيرة. لحمايتك، تم إيقاف تسجيل الدخول لمدة 15 دقيقة. · Try
again in {mm:ss} \| حاول مجدداً بعد {mm:ss} · Reset password \| إعادة
تعيين كلمة المرور\
- You\'re offline \| أنت غير متصل بالإنترنت · Connect to Wi-Fi or mobile
data to log in to Quicliq. \| اتصل بالإنترنت عبر الواي فاي أو بيانات
الجوال لتسجيل الدخول. · Try again \| حاول مرة أخرى\
- Your ID has expired \| انتهت صلاحية هويتك · To keep sending money,
verify your identity with a valid ID. It only takes a couple of minutes.
\| لمواصلة إرسال الأموال، وثّق هويتك باستخدام هوية سارية. يستغرق ذلك
دقيقتين فقط. · Verify my identity \| توثيق هويتي · Remind me later \|
ذكّرني لاحقاً\
- Verify it\'s you \| تحقق من هويتك · For your security, we\'ve texted a
6-digit code to \| لحمايتك، أرسلنا رمزاً من 6 أرقام إلى · For your
security, we\'ve emailed a 6-digit code to \| لحمايتك، أرسلنا رمزاً من 6
أرقام إلى بريدك الإلكتروني · Try another way \| جرّب طريقة أخرى\
- How should we verify you? \| كيف تريد التحقق من هويتك؟ · We\'ll send a
one-time code to make sure it\'s really you. \| سنرسل لك رمزاً لمرة واحدة
للتأكد من أنك صاحب الحساب. · Text message \| رسالة نصية · Send code \|
إرسال الرمز\
- Enter your code \| أدخل الرمز · We\'ve emailed a 6-digit code to \|
أرسلنا رمزاً من 6 أرقام إلى بريدك الإلكتروني\
- New device detected \| تم اكتشاف جهاز جديد · For your security, we
need to confirm it\'s you before using this device. \| لحمايتك، نحتاج
إلى التأكد من هويتك قبل استخدام هذا الجهاز.\
- Confirm your personal details \| تأكيد بياناتك الشخصية · Enter the
code we send you \| إدخال الرمز الذي سنرسله إليك · This becomes your
trusted device \| يصبح هذا الجهاز جهازك الموثوق\
- Only one device can be active at a time. You\'ll be logged out of your
other device. \| يمكن تفعيل جهاز واحد فقط في كل مرة. سيتم تسجيل خروجك من
جهازك الآخر.\
- Enter these details exactly as they appear on your ID. \| أدخل هذه
البيانات كما تظهر تماماً في هويتك. · We\'ll send a 6-digit code to
{maskedPhone}. \| سنرسل رمزاً من 6 أرقام إلى رقم هاتفك المنتهي بـ
{last4}.\
- These details don\'t match our records. You have 2 attempts left. \|
هذه البيانات لا تطابق سجلاتنا. تبقّت لديك محاولتان.\
- We couldn\'t verify you \| تعذّر التحقق من هويتك · You\'ve used all 3
attempts. For your security, you can\'t log in on this phone right now.
Contact support to continue. \| لقد استخدمت المحاولات الثلاث. لحمايتك،
لا يمكنك تسجيل الدخول على هذا الهاتف حالياً. تواصل مع الدعم للمتابعة. ·
Back to log in \| العودة لتسجيل الدخول\
- Where should we send your code? \| إلى أين نرسل الرمز؟ · Your email
address is verified, so you can get your code by text or by email. \|
بريدك الإلكتروني موثّق، لذا يمكنك استلام الرمز برسالة نصية أو عبر البريد
الإلكتروني.\
- Device verified \| تم التحقق من الجهاز · This device is now linked to
your account. We\'ll ask you to verify again if you log in on another
device. \| تم ربط هذا الجهاز بحسابك. سنطلب منك التحقق مجدداً عند تسجيل
الدخول من جهاز آخر. · Continue \| متابعة\
- Contact support \| التواصل مع الدعم · We\'re here to help \| نحن هنا
لمساعدتك · Get in touch and we\'ll help you with your account. \| تواصل
معنا وسنساعدك في كل ما يخص حسابك. · Call us \| اتصل بنا · Email us \|
راسلنا عبر البريد الإلكتروني · Visit our office \| زر مكتبنا · Never
share your password or verification code with anyone. \| لا تشارك كلمة
المرور أو رمز التحقق مع أي شخص. · Call support \| اتصل بالدعم · Email
support \| راسلنا عبر البريد\
- Code-entry strings (Edit, Didn\'t get a code?, Resend code in, wrong
code, attempts left) reuse the Registration keys.

### 4. Login - returning customer

Figma: [Returning customer - English
(LTR)](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=139-3333)
· [Returning customer - Arabic
(RTL)](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=139-3887)

Screens: 7.0 Welcome back, 7.0a-7.0b and 7.0f (Face ID), 7.0c, 7.0g-7.0h
(fingerprint), 7.0d-7.0e (password errors), 7.0i (both biometrics).

Build the Quicliq \"Welcome back\" login for a customer already linked
to this phone, in English (LTR) and Arabic (RTL), using the design
tokens and shared components (Avatar, Text Field, Button, Divider / Or,
Banner, Switch Account, Icon Badge). Match the Figma frames and
prototype exactly.\
\
- 7.0 Welcome back: Avatar with initials (e.g. JC), \"Welcome back,
{firstName}\", masked number (+44 •••• ••0123 / رقمك ينتهي بـ 0123),
Password field, \"Forgot password?\", Primary \"Log in\", Divider
\"or\", Secondary \"Log in with Face ID\" (or fingerprint). Switch
Account row \"Not you? Switch account\" -\> clears the stored user and
goes to Login 7.1.\
- Show the biometric button only if the user enabled it at sign-up (3.6
/ 3.1b). 7.0i shows both Face ID and fingerprint when the device
supports both.\
- Face ID: 7.0a scanning (system prompt) -\> success logs in to Home.
7.0b not recognised: Error banner with attempts left + \"Try Face ID
again\". After 3 failures -\> 7.0f banner and fall back to the password
field.\
- Fingerprint: 7.0c sheet \"Log in with fingerprint\" / \"Touch the
fingerprint sensor\" / \"Use password\". 7.0g not recognised with
attempts left; after 3 failures -\> 7.0h password fallback.\
- Password: 7.0d wrong password with attempts left (5 total); 7.0e after
5 -\> login paused 15 minutes, live countdown, \"Reset password\".\
- Use react-native-biometrics for Face ID / fingerprint and keep the
session token in react-native-keychain; never store the password.\
\
Copy (EN \| AR):\
- Welcome back, {name} \| أهلاً بعودتك يا {name} · Password \| كلمة
المرور · Forgot password? \| نسيت كلمة المرور؟ · Log in \| تسجيل الدخول
· or \| أو\
- Log in with Face ID \| الدخول باستخدام Face ID · Fingerprint \| البصمة
· Not you? \| لست أنت؟ · Switch account \| تبديل الحساب\
- Face ID didn\'t recognise you. You have 2 attempts left. \| لم يتعرّف
Face ID عليك. تبقّت لديك محاولتان. · Try Face ID again \| إعادة المحاولة
بـ Face ID\
- Face ID didn\'t work 3 times. Enter your password to log in. \| لم
ينجح Face ID ثلاث مرات. أدخل كلمة المرور لتسجيل الدخول.\
- Log in with fingerprint \| الدخول بالبصمة · Touch the fingerprint
sensor \| المس مستشعر البصمة · Use password \| استخدام كلمة المرور\
- Not recognised. Try again. 2 attempts left. \| لم يتم التعرّف على
البصمة. حاول مجدداً. تبقّت محاولتان.\
- Fingerprint didn\'t work 3 times. Enter your password to log in. \| لم
تنجح البصمة ثلاث مرات. أدخل كلمة المرور لتسجيل الدخول.\
- Incorrect password. 4 attempts left. \| كلمة المرور غير صحيحة. تبقّت 4
محاولات.\
- Too many attempts. For your security, login is paused for 15 minutes.
\| محاولات كثيرة. لحمايتك، تم إيقاف تسجيل الدخول لمدة 15 دقيقة. · Try
again in {mm:ss} \| حاول مجدداً بعد {mm:ss} · Reset password \| إعادة
تعيين كلمة المرور\
\
Use ICU plural rules for \"attempts left\": Arabic needs dual (محاولتان)
and plural (4 محاولات) forms.

### 5. System

Figma: [System - English
(LTR)](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=158-4856)
· [System - Arabic
(RTL)](https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test?node-id=158-4860)

Screens: 9.1 Update required, 9.2 Maintenance.

Build two blocking system screens for Quicliq in English (LTR) and
Arabic (RTL), using the design tokens and shared components (Icon Badge,
Banner, Button). Match the Figma frames exactly. Both are full-screen
with no back navigation.\
\
Trigger: on launch (Splash) and on app resume, call the app-config
endpoint. It returns minSupportedVersion, latestVersion, maintenance
(true/false) and maintenanceEndsAt.\
\
9.1 Update required - shown when the installed version \<
minSupportedVersion.\
- Version card: \"Your version\" {installed} and \"Latest version\"
{latest}.\
- Success-tone note that the account is safe. Primary \"Update now\"
opens the App Store / Play Store page.\
\
9.2 Maintenance - shown when maintenance = true.\
- \"Expected back by\" {time} shown in UK time (Europe/London),
formatted for the locale.\
- Primary \"Try again\" re-calls the config endpoint and continues if
maintenance is over. Secondary \"Contact support\" -\> Contact support
7.7c.\
\
Copy (EN \| AR):\
- Update required \| التحديث مطلوب\
- This version of Quicliq is no longer supported. Update to the latest
version to keep sending money. \| لم يعد هذا الإصدار من التطبيق مدعوماً.
حدّث إلى أحدث إصدار لتواصل إرسال الأموال.\
- Your version \| إصدارك الحالي · Latest version \| أحدث إصدار\
- Your account and transfers are safe. Updating takes about a minute. \|
حسابك وتحويلاتك بأمان. يستغرق التحديث حوالي دقيقة.\
- Update now \| حدّث الآن\
- We\'ll be back soon \| سنعود قريباً\
- We\'re doing planned maintenance to make Quicliq better. You can\'t
log in or send money until we\'re finished. \| نقوم بأعمال صيانة مجدولة
لتحسين التطبيق. لا يمكنك تسجيل الدخول أو إرسال الأموال حتى ننتهي.\
- Expected back by \| نتوقع العودة بحلول · {time} UK time \| {time}
بتوقيت المملكة المتحدة\
- Your account and money are safe. \| حسابك وأموالك بأمان.\
- Try again \| حاول مرة أخرى · Contact support \| التواصل مع الدعم
