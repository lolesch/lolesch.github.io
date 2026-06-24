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
