# About Route — Design Spec

**Status:** approved 2026-07-31, not yet planned. One precondition blocks the copy port, one blocks the CV link (see Preconditions).
**Covers:** PRD story 5 (contact at launch, CV when precondition 2 clears), stories 11 and 19 for this route, and the mitigation the build log records for the Rollhaus-only v1 risk ("the About page carries the arc in prose").
**Rejected alongside:** a bespoke About component with prose inline. See Decisions.

Spec lives in `docs/specs/` rather than the `docs/superpowers/specs/` default, to match this repo's flat `docs/{adr,agents,plans,specs}` convention.

---

## Goal

The site has no contact information anywhere. A reviewer convinced by the Rollhaus page has no way to act on it. This route closes that, and carries the career arc that a Rollhaus-only v1 otherwise makes invisible.

## Why this is small

The copy is written. `job-search/portfolio/site_copy.md` §2 holds the whole About page, tone-checked on 2026-07-28 with all six flags resolved. This is a port plus one unwritten sentence, not an authoring job.

## Scope

**In:** the `/about/` route, the About content model, the portrait, the four contact links, the Track C CV download, header navigation, one new Semantic token, and the guards.

**Out:** the Design System page, the Figma sync, the v2 Router (which is the mechanism specified to swap which CV is offered), a German version, and the metalwork photos (deferred to Phase 3 by Leonid's call, `_project/tasks.md:30`).

## Preconditions

Both are Leonid-side and block only what they name. Everything else proceeds in parallel.

1. **Write the metalwork systems-origin sentence.** `_project/tasks.md:27` records the decision from 2026-07-29: one sentence, in "How that happened", after the bayonet description, explicitly not on a tile. It has never been written. This repo becomes canonical for copy at port time, so porting without it would freeze an incomplete draft as the source of truth, which is exactly what the Rollhaus precondition existed to prevent. The line was also cut once already for reaching, under tone tell #4 (false analogies), so it is not a line to write casually. **Blocks: the copy port.** Plan step 1 drafts candidates in `site_copy.md` §2 for Leonid to pick or reject.

2. **Re-export the Track C CV to the final portfolio URL.** `_project/tasks.md:28` records both CV PDFs pointing their portfolio link at the old Figma prototype (`figma.com/proto/pmDcP36DoMbeP2qcYXJ6Zx/WebPage`), verified 2026-07-29. `lolesch.github.io` is now live, so the URL is final and the re-export is unblocked. Manual Figma step, Leonid exports. **Blocks: the CV link only.** The guard below enforces this rather than trusting it.

---

## Content model

Content is data, per the existing `hero.ts` and `projects.ts` pattern, and never contains markup. About reuses `Section` unchanged: the copy is four headed prose blocks, which is exactly what the `prose` arm models.

```ts
export type ContactLink = {
  label: string;   // "Email", "LinkedIn"
  value: string;   // what the visitor reads
  href: string;
  external: boolean; // false for mailto, which is not a new tab either
};

export type About = {
  intro: string;              // the opening line, above the sections
  sections: readonly Section[];
  portrait: { src: string; alt: string; width: number; height: number };
  contact: readonly ContactLink[];
  cv: { label: string; href: string } | null; // null until precondition 2 clears
};
```

`cv` is nullable so the page is shippable before the re-export exists, and the guard below only fires when it is non-null. That is the difference between a page that waits and a page that ships a broken link.

## Copy source

| Piece | Source | State |
|---|---|---|
| Intro and four sections | `site_copy.md` §2 | Tone-checked 2026-07-28, all flags resolved |
| Metalwork sentence | Does not exist | Precondition 1 |
| Contact values | `HANDOFF_portfolio_site.md:75` | Verified from the shipped PDFs |

Verified contact links, unchanged from source:

- `leonid.schreiber@yahoo.de`
- `linkedin.com/in/leonid-schreiber`
- `github.com/lolesch`
- `lolesch.itch.io`

itch.io is in, past the three the PRD names. A Rollhaus-only v1 makes the entire Unity and games half of the arc invisible, and itch.io is its only public evidence. Approved 2026-07-31.

## The portrait

Source file is `Desktop/LEONID/InventoryTetris/docs/media/Schreiber_Leonid_Photo.jpg`, 505x518 at 96 DPI, 58 KB, black and white. Copied to `public/leonid-schreiber.jpg`.

**Rendered as a circle at 200px**, inside an `aspect-square` wrapper with `object-cover`. The wrapper is load-bearing: the source is 505x518 rather than square, so `rounded-full` on the raw image would give a slight ellipse.

200px against a 505px source stays sharp at 2x device pixel ratio with headroom. The file caps a clean render at roughly 250px, which rules out a large hero-style portrait and is recorded here so it is not rediscovered.

`priority` is set. It is the LCP candidate on this route, and `next/image` lazy-loads by default. Same reasoning `src/components/project-sections.tsx` already carries for a lead figure, and for the same reason it is decided in the component rather than on the content record: which image paints first is a property of the page, not of the copy.

The circular crop also solves a theming problem rather than only a stylistic one. The photo has a light background with a soft dark vignette in the corners, so as a rectangle it would read as a bright square with dirty corners on the dark theme. The crop removes the corners and the vignette together.

## Token addition

One new Semantic role.

```json
// tokens/semantic/color.light.json
"border-media": { "$value": "{brand.edge}" }

// tokens/semantic/color.dark.json
"border-media": { "$value": "{brand.edge-inverse}" }
```

Bridged into Tailwind as `--color-border-media` in the existing `@theme inline` block, giving `border-border-media` by the same 1:1 mapping that produced `border-border-interactive`.

**Why a third border token.** The two that exist are both wrong for a photograph:

| Token | Light | Dark | Why not |
|---|---|---|---|
| `border` (decorative) | 1.48:1 | 1.70:1 | Correct role, invisible. A light photo on a light page would show no border at all |
| `border-interactive` | 4.83:1 | 3.67:1 | Visible, but it is the token that identifies a control, and a portrait is not one |

`border-media` points at the same Brand token as `border-interactive`, so the values are identical today. They are two roles that happen to agree, which is what the Semantic layer is for, and they can diverge later without touching a component. The precedent is in `_build-log.md`: when the theme toggle needed a visible boundary, darkening the shared `border` token was rejected and the role was split instead.

The theme half of "a border that changes with the theme" needs no code. Every Semantic colour carries a light and a dark value, so the toggle already moves it.

**Contrast entry, with an honesty note.** `border-media` on `bg` goes into `tests/unit/contrast.test.ts` at a 3:1 floor, commented as **design intent rather than a WCAG requirement**. SC 1.4.11 governs controls and meaningful graphics; it does not govern a decorative photo frame. Recording the distinction keeps the table from implying obligations that do not exist.

## Navigation

`SiteHeader` gains a nav: **Work** (`/#work`) and **About** (`/about/`). Work anchors to the existing `<h2 id="work">` on Home, so it works from any route. Design System slots in as a third link when it ships.

The nav is a client component (`src/components/site-nav.tsx`) so `usePathname` can set `aria-current="page"` on About. The site already ships client JS for the theme toggle, so the boundary costs nothing new, and a nav that never says where you are is a small miss on a site arguing for care. `aria-current` is set for About only, not for Work, because a fragment link into Home has no unambiguous current state.

## Link behaviour

Contact links stay in the same tab. The CV opens in a new one, because a PDF replacing the site is a dead end for a reader who was about to email. External links carry `rel="noopener noreferrer"`.

No `download` attribute on the CV. Opening inline in the browser's viewer is friendlier for a reviewer skimming, and forcing a download to disk is a decision better left to them.

---

## File structure

| File | Responsibility |
|---|---|
| `src/content/about.ts` | The About content. Data only, no markup |
| `src/content/types.ts` | Add `About` and `ContactLink`. `Section` reused unchanged. **Modified** |
| `src/app/about/page.tsx` | The route. Static `metadata`, no params |
| `src/components/site-nav.tsx` | Work and About, client, `aria-current` |
| `src/components/site-header.tsx` | Hosts the nav. **Modified** |
| `src/components/contact-links.tsx` | The contact block and the CV link |
| `src/components/sections.tsx` | `ContentSections`. **Replaces** `project-sections.tsx`, which is deleted |
| `src/app/work/[slug]/page.tsx` | Import updated for the rename. **Modified** |
| `tokens/semantic/color.{light,dark}.json` | Add `border-media`. **Modified** |
| `src/app/globals.css` | Bridge `--color-border-media`. **Modified** |
| `public/leonid-schreiber.jpg` | The portrait |
| `public/cv/leonid-schreiber-ux-engineer.pdf` | Track C, after precondition 2 |
| `tests/unit/copy.test.ts` | The recursive copy walker |
| `tests/export/about.test.ts` | Route, portrait, CV, contact, nav |
| `tests/unit/contrast.test.ts` | Add the `border-media` pair. **Modified** |

**On the rename.** `ProjectSections` was never project-specific; it takes a `Section[]` and renders it. About is the second consumer, so the name becomes wrong the moment this ships. Renaming now costs one import site.

---

## Guards

### The copy walker, and why it is not a fourth patch

`_build-log.md` records the same gap three times: figure captions, then constraints labels and values, then figure `alt`. Each time, copy shipped through a path the guards did not walk, and each time it was patched at that path. About would be the fourth, because every rule in `tests/unit/content.test.ts` iterates `projects` and About is not a project.

`tests/unit/copy.test.ts` closes the class instead. It globs `src/content/**/*.ts`, dynamically imports every module, walks every exported value recursively, and runs the em-dash rule and the placeholder rule over every string it reaches. A new content module is covered the moment it exists, with no registration step and nothing for a future session to remember.

It will also walk strings that are not copy: slugs, image paths, figure ids, and the literal hex values in `src/content/figures/rollhaus-architecture.ts`. Harmless, because none of them can contain an em-dash or a placeholder marker either.

This does not replace `content.test.ts`. The no-repeat rule and the no-padding rule are project-shaped and stay where they are.

### `tests/export/about.test.ts`

Asserted against the exported artifact, not the source:

- `out/about/index.html` exists
- the `<h1>` carries the page title
- the portrait `src`, read out of the markup with Next's cache-busting query stripped, resolves to a file on disk in `out/`
- **if `cv` is non-null**, its `href` resolves to a file on disk in `out/`. This is the favicon lesson: asserting a link exists stays green over a 404, which is the only way the link actually fails
- all four contact links are present, each with a non-empty accessible name
- the `mailto:` matches the verified address exactly
- **both nav links appear on every exported route.** They live in the layout, so one regression would drop them everywhere at once, and a Home-only check would not see it

Every new guard is watched failing on purpose before it is believed, per repo discipline. Specifically: the portrait assertion proved by moving the asset aside, the CV assertion proved the same way, the copy walker proved by putting an em-dash into `about.ts` where no existing guard can see it, and the nav assertion proved by dropping a link from the layout.

## Accessibility

WCAG 2.2 AA, per the standing constraint. Text pairs on this route are `fg` on `bg` and `muted` on `bg`, both already in the contrast table. The portrait border is decorative and is entered at a design-intent floor, as noted above.

The portrait's `alt` is `Leonid Schreiber`. On an About page the photograph identifies the subject, so it is informative rather than decorative and an empty `alt` would be wrong.

---

## Decisions, and what was rejected

- **Rejected: a bespoke About page with the prose inline in the component.** Faster, and it needs no rename. It also puts markup back where the content model exists to keep it out, and it puts About's copy outside every guard that walks `src/content/`. The second cost is the one that mattered.
- **Rejected: `border` for the portrait ring.** Correct role, and at 1.48:1 in light it is not a visible border, which is what was asked for.
- **Rejected: `border-interactive` for the portrait ring.** Visible in both themes and already exists, so it is the cheap answer. Leonid rejected it on the right grounds: the picture is not interactive. Borrowing a token for the wrong role is the mistake the log already records once, when the theme toggle borrowed `muted`, a text colour, for a border.
- **Rejected: both CVs offered side by side.** Covers a Track B reviewer directly, but it asks the visitor to classify themselves, which is the job `CONTEXT.md` already assigns to the v2 Router. One link, Track C, matching what the whole site argues.
- **Rejected: shipping the existing CV PDF as-is.** It points its own portfolio link at the old Figma prototype, so it would hand a reviewer a document that contradicts the site they are reading.
- **Rejected: a footer contact block instead of header nav.** It would catch a reader at the end of the Rollhaus page, which is a real argument, but it leaves `/about/` unreachable except by URL. Revisit as an addition once there is more than one long page.
- **Rejected: text-only, no portrait.** It was the recommendation, on the grounds that no portrait existed anywhere in `job-search`. Leonid supplied one, so the premise was wrong rather than the reasoning.

## Open items

- **The domain.** `_project/tasks.md:29` records that a paid domain must be settled before the first application, because the URL is baked into every sent CV. The CV re-export in precondition 2 is the step that bakes it in, so doing the re-export against `lolesch.github.io` means doing it twice if a domain is bought soon. Worth a decision at the same time, and it is Leonid's rather than this spec's.
- **The metalwork photos.** Phase 3, deferred. When they land, the About page is where the bayonet shelf and the pocket knife belong, as a `figure` section that needs no model change.
- **A German version.** `HANDOFF_portfolio_phase0.md:67` lists "English only or English plus German" as an unresolved site-spec question. Out of scope here; noted so it is not lost.
