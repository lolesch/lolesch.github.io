# Product

<!-- impeccable:product-schema 1 -->

Product truth for the impeccable skill, which loads this file and nothing else.
It holds only what no other doc holds. Terminology and definitions are in
`CONTEXT.md`, technical decisions in `docs/adr/`, working rules and content
guardrails in `CLAUDE.md`, and the decision narrative in `_build-log.md`. Those
four are canonical for what they cover; do not copy them back into here.

## Platform

web

## Users

Hiring managers, recruiters, and design or engineering leads evaluating Leonid
Schreiber for a role. They arrive from an application, a LinkedIn profile, or a
CV link, with a specific vacancy in mind. The first pass is a short scan against
that vacancy; the site is read properly only if the scan pays off.

Track C is primary and stays primary by explicit decision: retargeting the front
door to Track B was offered on 2026-08-05 and rejected, and the craft layer was
added underneath Track C instead. Track definitions are in `CONTEXT.md`.

## Product Purpose

A personal portfolio that doubles as a design-engineering case study. It exists
to get Leonid into interviews by showing not just what he shipped but what he
decided, which is the diagnosed failure of the previous portfolio: it showed
projects with no slot for a decision.

## Positioning

The site is the artifact it argues for. It runs on the token-driven design
system it documents, so `/design-system` is a live surface rather than a
description of one. Not a designer showing screenshots and not an engineer
showing repos, but one system authored once and rendered into both. The pipeline
that makes this true is ADR-0002.

## Capabilities and Constraints

**Shipped surfaces:** `/`, `/projects/[slug]`, `/design-system`, `/about`. Four
project records ship: FerMentor, Rollhaus, GlyphsHero, How to God.

**Current milestone:** v1 surfaces all ship and the next build is v2, which is
the Router, a `/projects` listing, and the meta case study. In flight ahead of
that is the case study visual pass specced in
`docs/superpowers/specs/2026-08-05-case-study-visual-pass-design.md`, so Rollhaus
figures are being reworked and are not settled.

**Runtime dependencies are not restricted** (confirmed 2026-08-05). The absence
of UI libraries in `package.json` is circumstance, not policy. A well-chosen
library is available when it earns its place.

Technical constraints are in `docs/adr/`. Brand, voice, attribution, and content
guardrails are in `CLAUDE.md`.

## Evidence on Hand

**Real and citable:**

- **Rollhaus interactive Figma prototype**, already live and linked from the
  case study at `src/content/projects.ts:175`.
- **How to God, released commercially.** Reached Early Access roughly a year
  after Leonid left Thoughtfish in December 2024. A public store page exists,
  but its URL is not recorded in this repo: source it before linking, never
  reconstruct it.
- **GlyphsHero**, a real and active repo carrying a `CLAUDE.md`, nine ADRs, and
  an Obsidian doc vault. Public at `lolesch.itch.io` and `github.com/lolesch`.
- **Thoughtfish press kit**, source of `/figures/how-to-god.jpg` and available
  for further imagery on that project.
- **In-repo assets:** CV PDF in `public/cv/`, figures in `public/figures/`,
  portrait at `public/leonid-schreiber.jpg`.

**Absent, and never to be fabricated:**

- **No usage, business, or outcome metrics exist for any project.** The shipped
  Rollhaus copy says so outright at `src/content/projects.ts:395`: no live users
  and no business numbers. No conversion rate, adoption figure, or performance
  gain may be written for any entry.
- **No testimonials, quotes, or named referees.** Nothing attributed to Yassine,
  to Thoughtfish, or to any colleague may appear.
- **No client list, press coverage, awards, or pricing.**

**Known asset gaps**, both Leonid's call: the Rollhaus tile, where the overlay
title collides with the screenshot's embedded "Select Your Skates" text, and
GlyphsHero, whose 340x340 source upscales soft into a 16:10 tile.

## Accessibility & Inclusion

WCAG AA is the committed floor and is enforced by contrast tests rather than by
eye. Where a contrast constraint cannot be met, the design changes rather than
the constraint being waived.
