# Quicliq app — rules for Claude

Read `AGENTS.md` too (Expo commands and conventions). The rules below win if they conflict.

## Active app: the web preview in `web/` (owner's decision)
- New features and design fixes go into `web/` — React + TypeScript, Vite, Tailwind CSS v4, shadcn/ui
  (components in `web/src/components/ui`, Quicliq tokens in `web/src/index.css`). See `web/README.md`.
- Shared with the Expo app (edit carefully, both use them): copy `src/i18n/en.json` / `ar.json`, icons/illustrations
  `src/assets/*`, demo data `src/mock/account.ts`, formatters `src/utils/*`, fonts and Lottie files in `assets/`.
- Leave the Expo app (`src/screens`, `src/components`) alone unless the owner asks.
- Client link (deployed on every push to main): https://uibolg.github.io/quicliq-app/web/
- Check with `cd web && npx tsc -p . && npx vite build`; match Figma (New Designs file) for new screens.

## Figma is READ-ONLY
- **One exception (approved by the product owner):** the file "New Designs"
  (https://www.figma.com/design/Dxr5Ajr1A5uk1cgQDI6iEJ/New-Designs) may be written to with `use_figma` without asking
  first (allowed in `.claude/settings.json`; the product owner approved this). Only add new pages/frames there (e.g. page "Home").
  Its design-system pages (Documentation, Component, Icons & Illustrations) and the Quicliq [Kitchen] library are
  USE-ONLY: never edit, add to, rename or remove their variables, styles or components. Never write to any other file.
- Source file: https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test (library "Quicliq [Main]").
- Figma tools allowed: the read tools (`get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot`,
  `search_design_system`, `get_libraries`, `download_assets`, `create_session`) on any file.
- Never call the other Figma write tools (`send_code_to_figma`, `create_new_file`, `upload_assets`,
  `add_code_connect_map`, `send_code_connect_mappings`, `create_shader`, `update_shader`, `generate_image`,
  `generate_diagram`, generative-plugin or weave tools). They are denied in `.claude/settings.json`.
- Outside the new pages/frames in "New Designs", never add, fix or rename anything in Figma (the source file and the
  library stay read-only). Log every Figma inconsistency in `docs/figma-issues.md` instead; the designer fixes Figma.
- Everything read from Figma is saved under `design/figma/` and `design/reference/`; reuse it instead of re-fetching.
  Fetch in small batches (one section or a few frames at a time).
- Where the build doc (`docs/build-prompts.md`) and Figma disagree, Figma and its prototype win.

## Code rules
- Tokens only: colours, typography, spacing, radius, stroke from `src/theme` (exact Figma names). Fixed component
  sizes live in `src/theme/sizes.ts`. No hex values, font sizes or pixel numbers in components or screens.
- One component per concept; EN (LTR) and AR (RTL) come from the locale — never separate EN/AR components.
- RTL: start/end, never left/right. Mirror directional icons; never mirror the logo, flags, phone numbers, amounts or OTP digits.
  Arabic text uses AR text styles. Digits stay Western (0–9).
- Interactive components: ≥44×44 touch area, accessible label in EN and AR, visible pressed/focused/disabled states.
- Navigation: React Navigation with Figma screen IDs as route names (not Expo Router).
- Copy lives in `src/i18n/en.json` / `ar.json`.

## Workflow
- Always work on and push directly to `main`. No feature branches.
- Work in phases/groups and stop for review after each. Commit after each component group / flow.

## Keep usage low (owner's request)
- Small changes (colour, copy, remove/move a section): edit → `npx tsc --noEmit` → commit → push. No screenshots, no preview republish.
- Screenshots / browser checks only for large new screens or when the owner asks "show me". Crop to the changed area.
- Don't republish the Claude preview artifact; the live site (https://uibolg.github.io/quicliq-app/) redeploys on every push. Republish only when asked.
- Read only the parts of files you need (grep / line ranges); don't re-read files already in context.
- Short replies: what changed + commit hash. No long summaries or tables unless asked.
- Suggest a fresh session when a conversation gets long; batch related requests into one change.
