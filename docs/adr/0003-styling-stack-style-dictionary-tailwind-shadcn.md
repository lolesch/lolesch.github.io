# ADR-0003 — Styling stack: Style Dictionary → CSS variables → Tailwind v4 → shadcn/ui

**Status:** Accepted  
**Date:** 2026-06-24

## Context

The architecture is "Tokens → Design System → Framework Adapter → UI," with a stated goal that framework choices stay replaceable. A three-layer token model (Primitive → Brand → Semantic, see project decisions) needs to reach React components.

Additional constraint surfaced during grilling: Leonid is new to web frontend and explicitly wants to **minimize hand-written CSS**, while the token system is the portfolio's headline (so the system must stay visible and owned, not hidden behind a tool).

## Decision

Layered styling stack:

1. **Tokens** — DTCG JSON in `tokens/`, three layers (Primitive → Brand → Semantic).
2. **Build** — Style Dictionary compiles tokens to **CSS custom properties** (`--color-*`, `--space-*`, …). Theme switching = swapping semantic variable values at `:root` / `[data-theme="dark"]`.
3. **Framework adapter** — **Tailwind v4** `@theme` references the generated CSS variables. Tailwind does not own the values; it consumes them.
4. **Components** — **shadcn/ui** as the unstyled-but-accessible component base, restyled via the token-backed Tailwind theme.

## Consequences

- **Minimal manual CSS:** token CSS is generated (Style Dictionary), component styling is utility classes + shadcn, component markup is AI-authored under direction. Raw CSS rules are rare.
- **Framework stays replaceable:** the tokens live in CSS variables, not in Tailwind's config. Removing Tailwind leaves the token system and visual identity intact.
- **Theme switching is token-driven**, not per-component — satisfies the design-system success criteria.
- **Static-export compatible** (ADR-0001): all of this is build-time/CSS, no server needed.
- Cost: Tailwind is a second vocabulary to learn alongside CSS, and markup carries longer `className` strings. Accepted in exchange for velocity, guardrails, the shadcn ecosystem, and demonstrable Tailwind fluency (relevant to Track C roles).

## Alternatives considered

- **CSS Modules + custom properties (no Tailwind)** — more visibly "hand-built," maximally portable, but means *more* manual CSS, which conflicts with the stated constraint. Rejected for v1; can be adopted per-component later since tokens are CSS variables either way.
- **Tailwind v3 + JS config bridge** — couples tokens to Tailwind's config format, weaker on framework-replaceability. Rejected.
- **Component token layer (4th layer)** — premature indirection for a solo portfolio; can be added non-breaking later.
