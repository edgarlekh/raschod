# Quick Capture & Friction Flow — UX Addendum

Date: 2026-09-14
Status: Approved (delegated to agent judgment; user flagged the core
insight, this addendum is the agent's design response)
Parent spec: `2026-09-14-raschod-design.md` (friction engine feature),
`2026-09-14-design-system-addendum.md` (tokens, motion)

## The insight this addresses

A purchase *decision* ("I'm thinking of buying this") is not the same
event as a purchase *record* ("I already spent this"). The first is a
live, in-the-moment moment where friction is the whole point of the
product. The second is retroactive bookkeeping, where friction serves no
purpose — the money is already gone, and forcing questions on it only
trains the user to resent the app. The product must distinguish these two
paths at entry, not conflate them.

Data-model impact: **none**. `transactions.frictionLevel` and
`transactions.wasSkipped` (shipped in Plan 1) already model exactly this —
a row with `wasSkipped: true` is a captured decision that never became
money leaving; a row with `frictionLevel: 0` is one that never needed a
decision at all. What was missing was the *entry flow*, not the schema.

## Two entry points, one quick-capture surface

### Global quick-capture affordance

A single persistent action — a floating action button, always reachable
in one tap from anywhere in the app (home, history, goals) — opens a
**full-screen numeric keypad immediately**. No menu, no "what do you want
to do" screen. Enter the amount first; category is chosen *after*, as a
horizontal swipeable row of icon chips (one tap, or skip — defaults to
"Прочее"). Speed of entry is the whole point: the fewer taps between
"open app" and "amount typed", the more likely the user logs the real
number instead of guessing later.

### Mode toggle: "Сейчас" vs "Уже потратил"

A toggle at the top of the quick-capture screen, defaulting to **"Сейчас"**
(right now — a live decision):
- **"Сейчас"** → this amount+category feeds the friction engine
  (`decideFriction`) exactly as designed; a tier above `none` triggers the
  swipe-card interstitial below before the transaction is created.
- **"Уже потратил"** (already spent) → friction is skipped entirely
  regardless of amount. The transaction is created immediately with
  `frictionLevel: 0, wasSkipped: false`. This path exists specifically so
  retroactive logging (yesterday's coffee, a forgotten receipt) never
  feels punished — the decision already happened outside the app.

## The friction interstitial: swipe cards, not a form

When "Сейчас" mode triggers a friction tier above `none`, a full-screen
card sequence replaces the standard modal-with-buttons pattern:

- **One card per question**, matching `decideFriction().questionCount`.
  Each card shows the amount and category prominently, one question in
  large type, and two swipe directions: **right = "Куплю"**, **left =
  "Обойдусь"**. A light haptic fires on every swipe, matching the design
  addendum's motion principles.
- **Tier `light`** (1 question): a single card — "Точно нужно?".
- **Tier `medium`** (2 questions): two cards in sequence — the second is
  category-flavored (e.g. a food-category purchase might ask "Можешь
  подождать до завтра?").
- **Tier `heavy`** (3 questions + opportunity cost): the *last* card in
  the sequence **is** the opportunity-cost reveal, not a separate screen
  after it — it shows the active goal (icon, name), an animated progress
  ring, and the "skip → N% closer" framing from
  `calculateOpportunityCost` baked into the same card the swipe decision
  happens on. No extra tap between seeing the number and deciding.

### Outcome feedback (reinforces skipping, not spending)

- **Swipe right (bought)** → the transaction is created; a brief, calm
  confirmation animation (amount visually "flows" into a running
  spent-today total). Neutral tone — buying is not penalized, just
  acknowledged.
- **Swipe left (skipped)** → a *more celebratory* animation (spring
  bounce / confetti-scale burst) on the "saved by friction" counter and,
  if a primary goal exists, its progress ring visibly jumps. This is
  deliberate asymmetry: the product's core value is control, and control
  moments (successful skips) get the bigger reward, per the spec's
  gamification section.

## Why this, not a giant "Do I need this?" button

A single full-screen yes/no button (the illustrative example that
prompted this addendum) doesn't scale past tier 1 — tiers 2/3 need to ask
more than one thing, and stacking modals on top of a button feels like a
form with extra steps, exactly the "usual banking app" tedium the product
is trying to avoid. Swipe cards scale naturally (one card per question,
same gesture throughout, no new UI pattern introduced per tier) and match
the tactile, fast, game-like feel already decided in the design system
addendum's motion section — while still being answerable in under a
second per card, which is the actual requirement ("супер быстро").

## Scope note

This addendum defines the *interaction design* the next screen-building
plans implement. It does not change Plan 1's schema or Plan 2's design
tokens. Its first architectural consequence is immediate: the App Shell
plan (next) must reserve the floating quick-capture action as part of the
shell itself, not add it later as an afterthought to an already-built tab
bar.
