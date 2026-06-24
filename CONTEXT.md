# CONTEXT — lolesch.github.io Portfolio

Glossary for this project. Plain definitions only — no implementation details, no specs.

---

## Track C

The hybrid "Design Engineer / UX Engineer" job-search track. Highest priority target. Distinguishes candidates who design systems and implement them — not pure designer, not pure engineer.

## Meta Case Study

The portfolio site itself, treated as a Track C case study: a token-driven design system built code-first, with a Figma synchronization workflow. Ships as v2 content once the site exists.

## Hero Case Study

The single full case study that ships in v1. Currently: Rollhaus.

## Flow Over Flash

A design principle established during the Rollhaus project: anything not moving the user forward gets cut. Applied site-wide as the primary layout decision rule. The direct answer to the anti-brand constraint "never cluttered."

## Anti-Brand Constraint

The one word the site must never be: **cluttered**. Every element must earn its place.

## Static Export

The Next.js `output: 'export'` mode required by GitHub Pages hosting. Produces a pure static build — no SSR, no API routes, no ISR. See ADR-0001.

## Theme Toggle

The UI control that switches between light and dark mode. Ships in v1. Driven by the semantic token layer, not hardcoded per component.

## v1 Routes

The four pages that ship at launch, each one full (no skeleton/"coming soon" pages):

- `/` — Home: hero + Rollhaus card
- `/work/rollhaus` — Project Detail: the hero case study
- `/design-system` — Design System: full docs, live system the site runs on
- `/about` — About + Contact merged: the craft-origin arc + email/LinkedIn/GitHub/CV download

URL structure is forward-designed: `/work/rollhaus` lets a `/work` listing page slot in at v2 without breaking the case study URL. Deferred to v2: `/work` listing (a list of one is just a link), Playground/Experiments.

## Token Pipeline

One-directional flow: `tokens/*.json` (DTCG) → Style Dictionary → CSS custom properties (consumed by the site) **and** → Figma Variables (the design artifact). Code is the source of truth; Figma is downstream output. See ADR-0002.

## Framework Adapter

The seam that keeps the framework replaceable: tokens live as CSS custom properties (not in Tailwind's JS config), and Tailwind v4 `@theme` references those variables. Remove Tailwind and the token system survives. See ADR-0003.

## Case Study Template

A flexible *superset* of possible sections (the brief's 9 are available slots), not a fixed mold. Hard rule: a section exists only if it has substance — never pad to look complete. Rollhaus is the lean instance (Hook → Context → Process → Key Decisions → Outcome → Learnings). Pending polish: add a Constraints callout box (time/team/tools) to Rollhaus.

## Source of Truth

Code (the repo). Tokens authored in DTCG JSON here; Figma and the rendered site are both generated from it. Never edit tokens in Figma. See ADR-0002.
