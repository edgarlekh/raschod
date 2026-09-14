# Design System Addendum — Raschod

Date: 2026-09-14
Status: Approved (delegated to agent judgment per user: "доверяю тебе,
главное современное, красиво, реально с анимациями")
Parent spec: `2026-09-14-raschod-design.md`
References consulted: `revolut/DESIGN.md`, `wise/DESIGN.md`
(awesome-design-md) — principles taken (high contrast, pill buttons,
scarce accent, generous radius, no drop-shadows), tokens are original to
Raschod, not copied verbatim (see `DECISIONS.md` for rationale).

## Palette

Dark is the primary mode (Revolut-style high-contrast canvas); light is a
mirrored pair. Both selectable, default follows system setting.

### Dark theme

| Token | Hex | Use |
|---|---|---|
| `background` | `#0B0F0D` | App canvas |
| `surface` | `#14181A` | Cards, list rows |
| `surfaceElevated` | `#1D2422` | Modals, active/selected cards, friction sheet |
| `accent` | `#B4F461` | Primary CTA fill, active states, progress fill, brand stamp |
| `onAccent` | `#0B0F0D` | Text/icon on top of `accent` |
| `textPrimary` | `#F5F7F3` | Headings, amounts |
| `textSecondary` | `#9CA69C` | Body, labels |
| `textMuted` | `#6B756B` | Captions, placeholders, disabled |
| `border` | `rgba(255,255,255,0.08)` | Hairlines, card outlines |
| `success` | `#34D399` | Income, positive deltas, "goal reached" |
| `warning` | `#FBBF24` | Budget nearing limit, friction tier 2 |
| `danger` | `#F87171` | Expense emphasis, over-budget, destructive actions |

### Light theme

| Token | Hex | Use |
|---|---|---|
| `background` | `#F7F9F5` | App canvas |
| `surface` | `#FFFFFF` | Cards, list rows |
| `surfaceElevated` | `#EFF3EC` | Modals, active/selected cards |
| `accent` | `#4C8A1B` | Primary CTA fill/text — darker than dark-mode lime for AA contrast on white |
| `onAccent` | `#FFFFFF` | Text/icon on top of `accent` |
| `textPrimary` | `#12140F` | Headings, amounts |
| `textSecondary` | `#5B645B` | Body, labels |
| `textMuted` | `#8B948B` | Captions, placeholders, disabled |
| `border` | `rgba(0,0,0,0.08)` | Hairlines, card outlines |
| `success` | `#1E9E6B` | Income, positive deltas |
| `warning` | `#B86A00` | Budget nearing limit |
| `danger` | `#D8433D` | Expense emphasis, destructive |

Accent stays scarce (Wise principle): one primary CTA per screen, progress
fills, and the friction "skip → closer to goal" moment — never a general
theme color splashed everywhere.

## Typography

System font (SF Pro on iOS, Roboto on Android via React Native default) —
no proprietary/licensed display font, keeps bundle light and license-clean.
Weight does the "display" work instead of a second font family.

| Token | Size/Line | Weight | Use |
|---|---|---|---|
| `display` | 34/40 | 800 | Balance on home screen, goal target amount |
| `h1` | 28/34 | 700 | Screen titles |
| `h2` | 22/28 | 700 | Section headers |
| `h3` | 18/24 | 600 | Card titles, list section headers |
| `body` | 16/22 | 400 | Default body |
| `bodyStrong` | 16/22 | 600 | Emphatic body, amounts in list rows |
| `caption` | 13/18 | 400 | Metadata, timestamps, category labels |
| `button` | 16/20 | 600 | Button labels |

## Spacing (4px base)

`xxs` 4 · `xs` 8 · `sm` 12 · `md` 16 · `lg` 24 · `xl` 32 · `xxl` 48

## Radius

`sm` 8 · `md` 12 · `lg` 16 · `xl` 24 · `pill` 9999

Cards and the friction sheet use `lg`/`xl` (generous, Wise-style —
friendly pressure, not a bank-teller-window feel). Buttons and pills use
`pill`. Inputs use `md`.

## Elevation

No drop-shadows (both references agree: elevation via color-layering, not
shadow). Three flat layers: `background` → `surface` → `surfaceElevated`.

## Motion

- Standard transition: 200ms, ease-out, for screen/element enters.
- Progress bars / counters (goal progress, "saved by friction" counter):
  spring animation (Reanimated `withSpring`), not linear — reinforces the
  "gamified" feel from the spec's gamification section.
- Friction modal: slide-up sheet, 250ms ease-out; each additional question
  (tier 2/3) cross-fades in rather than the sheet resizing abruptly.
- Haptics (`expo-haptics`): light impact on every friction-question answer,
  medium/success notification on "goal milestone reached" and "skipped an
  impulsive purchase" (XP gain).

## Component primitives (Plan 2 scope)

`Button` (primary/secondary/tertiary variants, per `accent`/`surface`/
outline), `Card` (surface/elevated variants), `AmountText` (renders Money
using `display`/`bodyStrong` per context, income green / expense default),
`ThemeProvider` (resolves system color scheme, exposes tokens via a hook).
Screens themselves (home, add-transaction, friction sheet, goals, history)
are out of scope for Plan 2 — they consume these primitives in later plans.
