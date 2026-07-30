# Work Grid and Project Routes — Design Spec

**Status:** approved 2026-07-30, not yet planned. Two preconditions block part of it (see Preconditions).
**Supersedes:** the 2026-06-24 rejection of a work listing in v1. Reasoning and what was rejected alongside it are in `_build-log.md` under "The work grid: a scope reversal".
**Covers:** PRD stories 3 and 17 partially, plus the Home half of 1, 2 and 19.

Spec lives in `docs/specs/` rather than the `docs/superpowers/specs/` default, to match this repo's flat `docs/{adr,agents,plans}` convention.

---

## Goal

The live site is a hero and nothing under it. Put the work on it: a grid of project tiles on Home, each linking to its own route, built so that widening from four projects to eighteen is a data change and nothing else.

## Why this is small

All eighteen tiles are already written and tone-checked in `job-search/portfolio/site_copy.md` §5, to the tile schema in `CONTEXT.md`. This is assembly, not authoring, with two named exceptions (Preconditions).

## Scope

**In:** the content model, the port of four projects into this repo, the tile component, the Home grid, `/work/<slug>/` routes, the token widening those need, the Rollhaus architecture figure as a component, and the guards.

**Out:** the Router and lens filtering (v2), the other fourteen tiles (data-only, add when wanted), `/about`, the CV download, the Design System page, Figma sync, and the Rollhaus case study's full narrative depth beyond what the top-up makes verifiable.

## Preconditions

Both are `job-search`-side and block only the content they name. Everything else proceeds in parallel.

1. **Fold the Rollhaus top-up into `spiced_rollhaus.md`.** `_project/tasks.md:26` sequences this before the case-study route is built. The draft names three design principles where the top-up found four, and lacks the role split and the instructor feedback. This repo becomes canonical on copy at port time, so porting first would launder a stale draft into the source of truth. **Blocks: Rollhaus page sections only.** Not the Rollhaus tile, which is accurate and tone-checked.
2. **Author the FerMentor tile.** Its three schema lines are `[NEEDS INPUT]` on two of three. The note claiming it must stay a stub is stale: `fermentor_source_of_truth.md` holds the shipped problem statement, the fermentation-stage domain model, and the `SHOW ME` interaction. This is authoring, not a blocker, and it owes a `_project/tone_of_voice.md` pass wherever it is written. **Blocks: the FerMentor tile and page.**

---

## Content model

Content is data. It lives in `src/content/`, following the existing `hero.ts` pattern, and never contains markup.

```ts
export type Lens = 'UX/UI' | 'Systems & Architecture' | 'Games / XR' | 'AI Workflow';
export type Tier = 'featured' | 'bridge' | 'archive';
export type FigureId = 'rollhaus-architecture';

export type Section =
  | { kind: 'prose';  heading: string; body: readonly string[] }
  | { kind: 'figure'; heading: string; caption: string; src: string; alt: string;
      width: number; height: number }
  | { kind: 'embed';  heading: string; caption: string; figure: FigureId };

export type Project = {
  slug: string;
  title: string;
  year: string;        // "2026", "2020–21"
  context: string;     // "Course project, pair". The honest label, never omitted
  role: string;        // "UX + design systems"
  lenses: readonly Lens[];
  tier: Tier;

  // The three fixed schema lines from CONTEXT.md. These are the tile.
  problem: string;
  whatIDid: string;
  whatChanged: string;

  // Only what has substance. May be empty. Never padded to look complete.
  sections: readonly Section[];
};
```

`tier` rides on the record from the start even though nothing reads it yet, so the featured/bridge/archive split and the v2 Router cost no model change.

**`embed` resolves through a registry** (`FigureId` → React component), which is what keeps "content is data" true: the data names a figure, it does not carry one.

## Routes

`src/app/work/[slug]/page.tsx` with `generateStaticParams` over the project slugs, plus `generateMetadata` per route. `trailingSlash: true` is already set, so the export emits `out/work/<slug>/index.html`.

Slugs: `rollhaus`, `fermentor`, `how-to-god`, `glyphshero`.

**Naming discrepancy, resolved here:** the project is **FerMentor** (capital M). `fermentor_source_of_truth.md` uses it throughout; `site_copy.md` §5 writes "Fermentor". Per `CLAUDE.md`, the source-of-truth file wins. The slug stays lowercase `fermentor`.

Home becomes hero then grid immediately, per the locked IA. No interstitial block.

## Page composition, and the rule that keeps pages honest

A page renders the sections that exist and stops. `CONTEXT.md` already states the rule: the case-study template is a flexible superset, and a section exists only if it has substance.

**A page never restates the three tile lines verbatim.** The visitor just clicked them. The page opens where the tile stopped: fuller context, and the decisions the tile compressed. This is enforced by a test, not left to discipline.

Expect two substantial pages (Rollhaus, FerMentor) and two short ones (How to God, GlyphsHero). That is the no-padding rule working, not a defect.

## The Rollhaus architecture figure

`job-search/portfolio/case_studies/assets/rollhaus_architecture.html` is 8.8 KB of pure HTML and CSS. No JavaScript, no external assets.

**Port it to a token-driven component at `src/components/figures/rollhaus-architecture.tsx`. Do not iframe it.** The file carries its own `:root` token block (`--brand:#ffd942`, `--teal`, `--radius`, `--font`), so an iframe would ship a second conflicting token system inside a site whose argument is that it has one, and it would sit theme-blind directly below the theme toggle.

**Split chrome from content when porting:**
- The figure's *chrome* (surfaces, rules, type, spacing) uses site Semantic tokens and follows the theme.
- The Rollhaus brand yellow and teal it *depicts* are content. They move into the project's content data as literal values, because they are what the diagram is about.

That second half needs an explicit exemption note where it lands, because the existing token-discipline test only bans `--ds-primitive-*` and `--ds-brand-*` and would wave a raw hex straight through. See Guards.

---

## Token additions

The walking skeleton deliberately used Tailwind built-ins (`text-4xl`, `rounded`) and recorded that Plan 2 replaces them. The grid is where that comes due. Add only what the tile and page consume.

**Precedent to follow:** `tokens/semantic/space.json` references Primitives directly, skipping Brand, because spacing has no rebrand surface. Type, radius and spacing additions do the same. Colour continues to route through Brand.

| Layer | File | Adds |
|---|---|---|
| Primitive | `tokens/primitive/font.json` | seven sizes, enumerated below |
| Primitive | `tokens/primitive/radius.json` | `0`, small, medium, `full` |
| Brand | `tokens/brand/color.json` | `edge`, `edge-inverse` |
| Semantic | `tokens/semantic/text.json` | `display`, `title`, `heading`, `subheading`, `lead`, `body`, `meta` |
| Semantic | `tokens/semantic/radius.json` | `card`, `control`, `tag` |
| Semantic | `tokens/semantic/space.json` | `gap`, `tight` |
| Semantic | `tokens/semantic/color.{light,dark}.json` | `border-interactive` |

Each new Semantic key is bridged into Tailwind through the existing `@theme inline` block in `globals.css`.

**The font ramp**, using the numeric-scale naming the colour primitives already use, because unlike `primitive.size` these are not a multiplier ladder:

| Primitive | Value | Semantic role that consumes it |
|---|---|---|
| `font.size.100` | `0.875rem` | `text.meta` |
| `font.size.200` | `1rem` | `text.body` |
| `font.size.300` | `1.125rem` | `text.lead` |
| `font.size.400` | `1.25rem` | `text.subheading` (tile title) |
| `font.size.500` | `1.5rem` | `text.heading` (section h2) |
| `font.size.600` | `2rem` | `text.title` (page h1) |
| `font.size.700` | `3rem` | `text.display` (hero h1) |

The hero currently renders at Tailwind's `text-4xl`/`sm:text-5xl`. Moving it onto `text.display` is part of this work, and the Seam 2 hero assertions must stay green across the change.

**`border-interactive` is the earned one.** `_build-log.md` records that the theme toggle's border used the decorative-rule token at 1.48:1 against the 3:1 that WCAG 2.2 SC 1.4.11 requires to identify a control, and that splitting decorative-rule from interactive-boundary was deferred until there was more than one control. Four linked tiles is that moment. Candidate for both `brand.edge` and `brand.edge-inverse` is `{primitive.neutral.500}`, which measures roughly 4.6:1 on light and 3.7:1 on dark. **Measure and record rather than trusting those numbers.**

---

## Component design and accessibility

**Tile.** An `<article>` carrying the metadata line, the lens tags, and the three schema lines under a heading. The link lives on the heading, with `a::after { position: absolute; inset: 0 }` over a `position: relative` card to make the whole card clickable.

Rejected: wrapping the card in a single `<a>`. It is legal but it flattens the headings out of screen-reader navigation and produces a link name made of the entire tile.

- Link text is the project title. Never "read more".
- Focus is visible on the card, via `:has(a:focus-visible)`, not only on the heading text.
- Lens tags are text, never colour-coded alone.
- The metadata line ("Course project, pair") is content, not decoration. It never drops at small sizes.

**Grid.** CSS grid, responsive by `minmax`, no fixed tile heights and no truncation. Must hold eighteen tiles without layout change.

---

## Guards

Repo discipline: every guard is watched failing on purpose before it is believed.

1. **Placeholder guard (new).** No placeholder marker may reach the export. Enumerated, not "similar markers":

   ```
   /\[[A-Z][A-Z ]+\]/     bracketed caps: [NEEDS INPUT], [PLACEHOLDER], [TODO]
   /\bTODO\b/  /\bTBD\b/  /\bFIXME\b/  /\bXXX\b/
   /Lorem ipsum/i
   ```

   Runs over the rendered text of `out/**/*.html` with script tags stripped, reusing the existing `rendered()` helper so it cannot pass on inlined RSC payload.

   Deliberately **not** matching a bare `[...]`, which is the standard elision mark inside a quotation and these case studies quote sources heavily. A guard that cries wolf on legitimate copy gets disabled, and then it guards nothing.

   **This is a spell-check, not a tone check.** It says nothing about whether copy is good, and copy authored on this side still owes a `tone_of_voice.md` pass. Stated here so the guard is not mistaken for coverage it does not have.

2. **Raw-colour guard (extends `token-discipline.test.ts`).** No hex, `rgb()` or `hsl()` literal in `src/**/*.{ts,tsx,css}`, excepting `src/styles/generated/` and `src/content/**` where depicted brand colours are legitimately content. Without this the existing discipline test means less than everyone assumes: it bans reaching past Semantic, but waves through hardcoding a colour outright.

3. **Seam 2, extended.** For each slug: `out/work/<slug>/index.html` exists, carries the project title in an `<h1>`, and is linked from `out/index.html`.

4. **No-repeat guard (new).** For each project, no section body may contain `problem`, `whatIDid` or `whatChanged` verbatim. Encodes the page-lead rule as a test rather than a convention.

5. **Contrast.** Every new token pair measured in both themes before it ships: 4.5:1 for text, 3:1 for control boundaries per SC 1.4.11. Fix at the Brand layer, never at the component.

---

## Copy guardrails

Binding on every line that ships. From `CLAUDE.md` and the source-of-truth files.

- No em-dashes.
- Course projects carry the label. It is metadata, not an apology, and it appears once.
- **Attribution.** "We" only where the team genuinely did it: Rollhaus is a pair with Yassine Alikhbari; FerMentor was shared research with Leith Gow, then a deliberate split into two products.
- **FerMentor traps.** Pattern / Contrast / Harmony are Leith's principles, not Leonid's; his are Consistency and Clear State. The visible AI-prototyping story is Leith's. No usability testing was run, for time reasons: state it plainly once, in the Outcome, and do not hedge it repeatedly. Persona names are interchangeable proto personas; pick one and say so.
- **How to God.** Do not claim VR performance work, and do not claim the shipped Early Access release. He left a year before it.
- **Rollhaus.** Frame around the slot system, not generic atomic design. Peers and the instructor gave that note independently.
- Anything newly authored repo-side gets a `tone_of_voice.md` pass, and the sources it came from get superseded-pointers in `job-search` as part of the same change, not after it.

---

## Sequencing

1. Tokens, with contrast measured and recorded.
2. Content model, plus the port of the two unblocked projects (How to God, GlyphsHero).
3. Tile component and the Home grid.
4. `/work/<slug>/` routes and page composition.
5. The architecture figure component.
6. Rollhaus and FerMentor content, once their preconditions clear.

Steps 1 to 4 are unblocked today.

## Open items

- Which persona name FerMentor's page uses. Either is correct; consistency is the requirement.
- FerMentor's colour-token claim ("real Figma variables or colour styles?") is unresolved in `fermentor_source_of_truth.md` §8 and is load-bearing Track C evidence. **Do not state it either way until Leonid confirms.** It may simply be omitted from v1.
- The remaining fourteen tiles are data-only whenever wanted.

---

## Handoff

Next session: run `superpowers:writing-plans` against this spec to produce a task-by-task implementation plan under `docs/plans/`, then execute it with `superpowers:executing-plans`. Follow the walking-skeleton plan's shape: a failing test first at each step, and verify against the built artifact rather than the source.

Read first: this spec, `CLAUDE.md` (content guardrails), `CONTEXT.md` (tile schema, case-study template), and the last three entries of `_build-log.md`.
