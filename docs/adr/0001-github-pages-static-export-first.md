# ADR-0001 — GitHub Pages (static export) as v1 host, Vercel as optional migration

**Status:** Accepted  
**Date:** 2026-06-24

## Context

The repo is named `lolesch.github.io`, which GitHub treats as a user-site and serves at `https://lolesch.github.io`. GitHub Pages requires a fully static build — no server-side rendering, no API routes, no ISR.

The intended stack is Next.js (Phase 9). Next.js supports a static export mode (`output: 'export'` in `next.config.ts`) that produces a pure HTML/CSS/JS build compatible with GitHub Pages.

Vercel (free for personal projects) would host the same repo without these constraints and support full Next.js features.

## Decision

Start on GitHub Pages with `output: 'export'`. If a feature requires SSR, API routes, or dynamic capabilities, migrate to Vercel at that point by removing `output: 'export'` and connecting the repo to Vercel.

## Consequences

**v1 constraints (GitHub Pages / static export):**
- No `getServerSideProps` / Server Components that fetch at request time
- No Next.js API routes (`/api/*`)
- No dynamic OG image generation via `@vercel/og`
- No ISR (`revalidate`)
- All data must be fetched at build time or client-side

**What still works:**
- Static Site Generation (`generateStaticParams`, `getStaticProps`)
- Client-side data fetching
- All design-system / token rendering (static by nature)
- The Design System page and all case studies (static content)

**Migration path:** remove `output: 'export'` from `next.config.ts`, connect repo to Vercel. Zero component rewrites needed if no static-incompatible patterns were introduced.

## Alternatives considered

- **Vercel from day one** — removes all constraints, free for personal projects. Rejected for v1 because GitHub Pages is simpler (no additional account/service), the v1 content is fully static anyway, and the constraint can be revisited when a real need for SSR arises.
