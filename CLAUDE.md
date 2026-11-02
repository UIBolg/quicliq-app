# Quicliq app — rules for Claude

Read `AGENTS.md` too (Expo commands and conventions). The rules below win if they conflict.

## Figma is READ-ONLY
- Source file: https://www.figma.com/design/kGcOLLGSdsq37Ova5pRIRE/Test (library "Quicliq [Main]").
- Only use Figma **read** tools: `get_metadata`, `get_design_context`, `get_variable_defs`,
  `get_screenshot`, `search_design_system`, `get_libraries`, `download_assets`, `create_session` (session bookkeeping only).
- Never call a Figma write tool (`use_figma`, `send_code_to_figma`, `create_new_file`, `upload_assets`,
  `add_code_connect_map`, `send_code_connect_mappings`, `create_shader`, `update_shader`, `generate_image`,
  `generate_diagram`, generative-plugin or weave tools). They are denied in `.claude/settings.json`.
- Never add, fix or rename anything in Figma. Log every Figma inconsistency in `docs/figma-issues.md` instead;
  the designer fixes Figma.
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
