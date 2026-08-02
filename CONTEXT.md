# CONTEXT — lolesch.github.io Portfolio

Glossary for this project. Plain definitions only — no implementation details, no specs.

---

## Track A / Track B / Track C

The three job-search tracks the site serves. **A** — Unity/C# Engineer (games, XR, tools). **B** — UX/UI / Product Designer. **C** — the hybrid below.

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
- `/projects/rollhaus` — Project Detail: the hero case study
- `/design-system` — Design System: full docs, live system the site runs on
- `/about` — About + Contact merged: the craft-origin arc + email/LinkedIn/GitHub/CV download

URL structure is forward-designed: `/projects/rollhaus` lets a `/projects` listing page slot in at v2 without breaking the case study URL. Deferred to v2: `/projects` listing (a list of one is just a link), Playground/Experiments.

**Named Work until 2026-08-02**, in the nav label and in the route alike. "Work" reads as employment, which is the wrong promise on a grid where most entries are not jobs. The route moved with the label rather than leaving the URL arguing with the nav. Nothing is deployed at the old paths, so no redirect is owed.

## Tile Schema

The fixed shape every project entry takes, down to archive tier: three first-person lines — `Problem` / `What I did` / `What changed` — plus a metadata line (year · context · role) and lens tags. It exists because the old portfolio's core failure was showing projects but not what Leonid did in them: the old template had no slot for a decision. Recorded as the v2 standard; v1 ships one case study and no tile grid, but any v1 content that will later become a tile is written to this shape.

## Lens

One of four cross-cutting capability tags applied to project entries: `UX/UI`, `Systems & Architecture`, `Games / XR`, `AI Workflow`. A project carries several. Lenses are what the Router sorts by.

## Router

The v2 mechanism for tailoring the work grid per application: three "hiring for" presets over the four Lenses that **re-sort rather than gate** (nothing is ever hidden), swap the offered CV download, and keep state in the URL so a focused link can be sent with a specific application. Not built in v1.

## Token Pipeline

One-directional flow: `tokens/*.json` (DTCG) → Style Dictionary → CSS custom properties (consumed by the site) **and** → Figma Variables (the design artifact). Code is the source of truth; Figma is downstream output. See ADR-0002.

## Framework Adapter

The seam that keeps the framework replaceable: tokens live as CSS custom properties (not in Tailwind's JS config), and Tailwind v4 `@theme` references those variables. Remove Tailwind and the token system survives. See ADR-0003.

## Case Study Template

A flexible *superset* of possible sections (the brief's 9 are available slots), not a fixed mold. Hard rule: a section exists only if it has substance — never pad to look complete. Rollhaus is the lean instance (Hook → Context → Process → Key Decisions → Outcome → Learnings). Pending polish: add a Constraints callout box (time/team/tools) to Rollhaus.

## Source of Truth

Code (the repo). Tokens authored in DTCG JSON here; Figma and the rendered site are both generated from it. Never edit tokens in Figma. See ADR-0002.
