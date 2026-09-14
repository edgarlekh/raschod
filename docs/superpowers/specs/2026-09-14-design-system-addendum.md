# Design System Addendum — Raschod

Date: 2026-09-14
Status: Approved (delegated to agent judgment per user: "доверяю тебе,
главное современное, красиво, реально с анимациями")
Parent spec: `2026-09-14-raschod-design.md`
References consulted: `revolut/DESIGN.md`, `wise/DESIGN.md`
(awesome-design-md) — principles taken (high contrast, pill buttons,
scarce accent, generous radius, no drop-shadows). **Superseded 2026-09-14**
by `docs/superpowers/specs/references/2026-09-14-product-spec-v1.docx` for
palette and visual direction specifically — that document is now the
source of truth for color/mood (see `DECISIONS.md`); this file's structure
(typography scale, spacing, radius, motion durations) still stands.

## Palette

Dark is the primary mode — a cold, deep blue-black canvas with an icy-blue
glow accent, per the product spec's visual direction ("сдержанный тёмный
интерфейс, глубокий сине-чёрный фон, холодные голубые/ледяные подсветки").
Not a colorful palette; the mountain/road/flag goal visualization is the
one place with more than one hue, and even there stays cold-toned. Light
is a mirrored pair for the system-setting case. **Correction from this
addendum's first version**: the lime-green accent (`#B4F461`) is replaced
— it read as a fintech-generic "growth" color, not the calmer, more
cinematic mood the product spec asks for.

### Dark theme

| Token | Hex | Use |
|---|---|---|
| `background` | `#05070C` | App canvas — deep blue-black |
| `surface` | `#0D1420` | Cards, list rows |
| `surfaceElevated` | `#131C2C` | Modals, active/selected cards, friction sheet |
| `accent` | `#7EC8F2` | Primary CTA fill, active states, progress fill, road/particle glow |
| `onAccent` | `#06121C` | Text/icon on top of `accent` |
| `textPrimary` | `#F2F6FA` | Headings, amounts |
| `textSecondary` | `#93A3B8` | Body, labels |
| `textMuted` | `#5C6B80` | Captions, placeholders, disabled |
| `border` | `rgba(255,255,255,0.08)` | Hairlines, card outlines |
| `success` | `#5EEAD4` | Income, positive deltas, "goal reached" — cold teal, not green |
| `warning` | `#F5C563` | Budget nearing limit, friction tier 2 — muted, not alarm-colored |
| `danger` | `#EF6F6F` | Destructive actions only — muted coral, never used to shame a spend (per spec: "красный цвет не использовать как единственный способ сообщить о проблеме") |

### Light theme

| Token | Hex | Use |
|---|---|---|
| `background` | `#F4F7FB` | App canvas — cool off-white |
| `surface` | `#FFFFFF` | Cards, list rows |
| `surfaceElevated` | `#E8EEF5` | Modals, active/selected cards |
| `accent` | `#1E7FB8` | Primary CTA fill/text — deeper cold blue for AA contrast on white |
| `onAccent` | `#FFFFFF` | Text/icon on top of `accent` |
| `textPrimary` | `#0B1420` | Headings, amounts |
| `textSecondary` | `#4B5A6B` | Body, labels |
| `textMuted` | `#7C8A99` | Captions, placeholders, disabled |
| `border` | `rgba(0,0,0,0.08)` | Hairlines, card outlines |
| `success` | `#1F9E8A` | Income, positive deltas |
| `warning` | `#B8791E` | Budget nearing limit |
| `danger` | `#C24B5C` | Destructive actions only, muted |

Accent stays scarce: one primary CTA per screen, progress fills, and the
friction "skip → closer to goal" moment — never a general theme color
splashed everywhere. Per the product spec: soft, local glow only, no cheap
neon; large rounded corners without a "childish" bounce.

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
