# Design: the `/design-system` route

Date: 2026-07-31
Status: design approved, not implemented.

The fourth and last route in the locked v1 scope. PRD issue #1 line 57: *"Routes
(v1): `/` (Home), `/work/rollhaus`, `/design-system` (live docs), `/about`. Nav
shows only these four."* Three exist. This is the missing one.

It answers two PRD user stories:

- **7.** *"As a design leader, I want a Design System page that documents the
  real tokens and components the site runs on, so that I can judge systems
  thinking from evidence, not claims."*
- **20.** *"I want the Design System page to render live from the same
  tokens/components used site-wide, so that documentation can never drift from
  reality."*

Story 20 is the load-bearing one. "Can never drift" is a structural claim, so
the design has to make drift impossible rather than merely unlikely.

---

## Decisions taken before the design

Four, all Leonid's, all on 2026-07-31.

1. **Scope: tokens plus the rules that enforce them.** Not tokens alone, which
   is what most portfolio design-system pages are and which is a claim rather
   than evidence. Not tokens plus a component gallery either. **Rejected: the
   component gallery**, because the site's components are thin (five section
   kinds, a nav, a tile, a toggle) and a gallery of them would pad, which is the
   one thing `CONTEXT.md:72` bans outright.
2. **Say nothing about Figma.** `CONTEXT.md:64` describes the pipeline as
   one-directional into CSS custom properties *and* Figma Variables. The CSS
   half ships. The Figma half is ADR-0002 and is deferred. Guardrail 1 says
   claim only what ships, so the page documents the CSS output and stops.
   **Rejected: naming it as designed-but-not-built**, which is maximally
   transparent and would have added a fourth honest-limitation line to a site an
   outside review had, that same day, called out for carrying three.
   **Rejected: a roadmap marker**, which invites "when" and has no answer. The
   page gains the second arrow when the sync ships.
3. **Data source: parse the generated CSS.** See below.
4. **State the system's smallness once, as restraint.** See "The restraint
   line".

---

## Architecture

### Where the data comes from

`src/lib/tokens.ts` reads `src/styles/generated/tokens.css` and
`tokens.dark.css` at build time and resolves the `var()` chain the way a browser
would.

This is possible only because `build-tokens.mjs` sets `outputReferences: true`,
which keeps the whole Primitive to Brand to Semantic chain visible as nested
`var()` in the emitted file. `tokens.test.ts:16` already asserts that property
for its own reasons. The page now depends on the same thing the guard protects,
which is a good coupling rather than a bad one.

`contrast.test.ts` already contains exactly this logic, as `declarations()` and
`resolve()`. Both move into `src/lib/tokens.ts` and the test imports them, so
the page and the contrast guard run one implementation. The refactor is proved
correct by `contrast.test.ts` staying green through it, with no assertion
changed.

**Rejected: emitting a token manifest from Style Dictionary** as a second build
output. It would carry DTCG metadata the CSS loses. Checked: the token JSON
files contain no `$description` fields at all, only `$type` and `$value`, so
there is no metadata to lose and the manifest would buy a new build artifact and
a format to maintain in exchange for nothing. Revisit if descriptions are ever
authored.

**Rejected: importing the DTCG JSON directly.** The dark build applies a filter
(`build-tokens.mjs`, `token.filePath.includes('color.dark')`), so a token can
exist in JSON and never reach the CSS. The page would then document something
that does not ship, inverting story 20 precisely.

### The model

```ts
export type Layer = 'primitive' | 'brand' | 'semantic';

export type Token = {
  /** Full custom-property name, e.g. `--ds-color-accent`. */
  name: string;
  layer: Layer;
  /** Segment after the layer, e.g. `color`, `space`, `text`, `neutral`. */
  family: string;
  /** What this points at in `:root`. null for a leaf, which is every Primitive. */
  reference: string | null;
  /** Fully resolved leaf value in the light cascade, e.g. `#b45309`, `1.5rem`. */
  value: string;
  /** What this points at under `[data-theme="dark"]`, or null when it does not vary. */
  darkReference: string | null;
  /** Resolved leaf value under dark, or null when it does not vary. */
  darkValue: string | null;
};

export function readTokens(): Token[];
```

A flat list rather than a nested tree. The page groups by `layer` and `family`
as it likes, and a flat list is what the guards want to walk.

`layer` is classified by prefix: `--ds-primitive-*`, `--ds-brand-*`, everything
else Semantic. That last arm is deliberately the catch-all, because
`--ds-color-*`, `--ds-space-*`, `--ds-text-*` and `--ds-radius-*` are all
Semantic and a future family should land there without a code change. The guard
below is what stops the catch-all hiding a genuinely unknown prefix.

**The two nullable dark fields carry the mechanism.** They are non-null for
exactly the eight tokens re-declared under `[data-theme="dark"]` and null for
everything else. So the data itself says which tokens are theme-dependent, and
the page renders that rather than asserting it. `--ds-color-bg` points at
`--ds-brand-paper` in light and `--ds-brand-paper-inverse` in dark, and the
table can show both columns.

### Failure behaviour

No fallbacks anywhere. `resolve()` already throws on an undeclared name, and
`readFileSync` throws if the generated CSS is absent. Both fail the build, which
is correct: a page whose data step quietly returned nothing still renders every
heading and a set of neat empty boxes, which is exactly the failure mode
`figures.test.ts:44` exists to describe. Keep the throw.

---

## Rendering, and why no token-discipline exemption is needed

`token-discipline.test.ts` bans application code from referencing Primitive or
Brand tokens, from composing a token name at runtime, from Tailwind's built-in
palette, and from raw hex. A page documenting the token system looks like it
must break the first and fourth of those.

It does not, because the three layers want different rendering for reasons that
are true about the layers rather than convenient for the page.

**Primitive and Brand render from the resolved hex read at build time.** Those
layers do not vary by theme: only Semantic is re-declared under
`[data-theme="dark"]`, which `tokens.test.ts:24` proves by asserting the dark
file declares no Primitive and no Brand. So a fixed value is the *correct*
rendering, not a workaround. The hex arrives as build-time data and appears
nowhere as a source literal, so the raw-hex rule is untouched.

**Semantic renders through the ordinary Tailwind utilities** that `@theme
inline` generates: `bg-accent`, `text-muted`, `border-border-interactive`. This
is the identical mechanism every component on the site uses, is already
permitted, and live-switches with the existing theme toggle through the cascade
with no client JS added.

The result is that the page's construction *is* the argument. Hit the theme
toggle and only the Semantic row moves, because that is the only layer that
varies. A visitor watches the architecture work instead of reading a claim that
it does.

**Rejected: exempting `/design-system` in `token-discipline.test.ts`.** It is
the obvious move and it is wrong twice over: it weakens the guard at the exact
place the page brags about it, and it would have hidden the fact that the
layer-appropriate rendering was available and better.

### The drift risk moves, so a guard follows it

Rendering Semantic through utilities means a hand-written list of
token-to-utility pairs, and a hand-written list can fall behind the token set.
That is where drift now lives, so that is where the guard goes: a unit test
asserts the documented list and the `--ds-color-*` set in the generated CSS are
the same set, in both directions. Add a Semantic colour without documenting it
and the build fails. Document one that no longer exists and the build fails.

This is story 20 enforced rather than promised.

---

## Files

| File | Job | New |
|---|---|---|
| `src/lib/tokens.ts` | Read and resolve the generated CSS. Shared with `contrast.test.ts`. | yes |
| `src/content/design-system.ts` | Authored prose, the documented Semantic list, the contrast pairs. | yes |
| `src/components/design-system.tsx` | Display components. Split if it passes ~200 lines. | yes |
| `src/app/design-system/page.tsx` | The route. | yes |
| `tests/unit/design-system.test.ts` | Drift and classification guards. | yes |
| `tests/export/design-system.test.ts` | The route ships and its data step ran. | yes |
| `tests/unit/contrast.test.ts` | Imports the resolver instead of defining it. | edit |
| `src/components/site-nav.tsx` | Third link. | edit |

`src/lib/` does not exist yet and earns its existence here: this is the first
logic on the site that is neither content nor a component, and a CSS parser does
not belong in either.

### Two things move into content, on purpose

**The contrast pairs.** `contrast.test.ts` currently defines `PAIRS` privately.
It moves to `src/content/design-system.ts` and both the test and the page import
it. The table a reader sees and the table the build enforces then cannot
disagree, because they are one list. The existing comment recording that
`muted` on `surface` measures 4.40:1 and is deliberately absent travels with it,
since it explains the list's shape at its new home.

**The Semantic list**, as `{ token, utility, role }`. `role` is copy and belongs
in content so `copy.test.ts` guards it. `utility` is a class name and is not
copy, which is a mild impurity accepted to keep one list instead of two. There
is precedent: `copy.test.ts:36` already notes it walks slugs, image paths,
figure ids and hex values, and none of them can carry an em-dash or a
placeholder either. Keeping the utility here also keeps it inside Tailwind v4's
`source("../")` scan, so the class is generated.

### Prose

Authored blocks typed as the existing `prose` arm of `Section`, so the markup
and the copy guards match what the rest of the site uses, but placed explicitly
by the page rather than walked as a `Section[]`. The page interleaves prose and
generated tables, which a linear `Section[]` walk cannot express.

**Rejected: adding `token-table` and `swatch-grid` kinds to `Section`.** Every
project page's switch is closed with `never` and would have to grow arms for
kinds no project will ever contain.

`copy.test.ts` needs no change: its `import.meta.glob('../../src/content/**/*.ts')`
puts the new module inside the em-dash and placeholder rules the moment the file
exists, with nothing for a future session to register.

---

## The page

**Intro.** What this is: the system the site runs on, read out of the file the
browser receives. Short.

**The three layers.** The spine, colour first because colour is where the chain
is legible. Three rows top to bottom: Primitive swatches with their hex, Brand
swatches naming the Primitive each points at, Semantic swatches naming the Brand
each points at in light and in dark. Only the bottom row changes with the theme
toggle.

**The other families.** Space, text and radius as specimens rather than numbers:
space as bars at each step, the type ramp rendered at its own sizes, radius as
three boxes. Each labelled name, Primitive, value.

**The rules.** The section that makes the page evidence instead of inventory.
The contrast table, every rendered pair with its measured ratio and its required
minimum, computed by the resolver rather than transcribed. The four things
`token-discipline.test.ts` bans, each with why, including that the
runtime-composition rule exists specifically to stop a component evading the
first rule. And why `border`, `border-interactive` and `border-media` are three
roles pointing at two values, which is the Semantic layer doing its job.

**How it is built.** The pipeline, code as source of truth, one direction. No
Figma.

### The restraint line

The system is small: 11 Primitives, 13 Brand, 8 Semantic colours. A design
leader will notice, so the page says it first, once, as a decision:

> This system covers what the site renders and stops there. Tokens nothing uses
> are inventory rather than a system.

That is the shipping wording unless the `tone_of_voice.md` check run during
implementation flags it, in which case the revision is recorded in
`_build-log.md` rather than made quietly.

**This is deliberately not a hedge, and the distinction is the reason it ships.**
The three limitation lines an outside review flagged on 2026-07-31 are all one
shape, "this was not validated by use". This one is a restraint claim, and it
belongs to the same family as the `CONTEXT.md:72` no-padding rule that governs
every case-study page: a section exists only if it has substance, and a token
exists only if something renders it. It pre-empts "this is a small system" by
showing the smallness was chosen, which is the difference between judgment and
inexperience to the exact reader this route is written for.

---

## Nav

Add Design System between Work and About in `site-nav.tsx`. Three visible links
plus the logo is the four the PRD specifies.

`aria-current` handling follows the About precedent: set on exact-path match
after stripping the trailing slash, and carried visually as well, because
`aria-current` alone is invisible and a screen-reader-only cue is not a cue.

---

## Testing

### Unit, `tests/unit/design-system.test.ts`

1. Every `--ds-color-*` in the generated CSS has an entry in the documented
   Semantic list.
2. Every entry in that list names a token the generated CSS declares. Both
   directions, because one direction catches only half of drift.
3. Every token `readTokens()` returns classifies into exactly one layer, so the
   Semantic catch-all cannot silently swallow an unknown prefix.
4. Exactly the tokens re-declared in `tokens.dark.css` carry a non-null
   `darkReference`, and no others.
5. A known chain resolves end to end: `--ds-color-accent` to
   `--ds-brand-accent` to `--ds-primitive-amber-700` to `#b45309`.
6. Every token named by the contrast list is declared in the generated CSS, so
   a renamed token breaks the documented table loudly instead of dropping a row.
   Note the limit honestly: *whether the site renders a given pair* is a human
   judgement, recorded in the comment that travels with the list, and no test
   here proves it.

### Export, `tests/export/design-system.test.ts`

1. `out/design-system/index.html` exists.
2. Its body contains a known Primitive's resolved hex. **This is the load-bearing
   one.** It proves the build-time read actually ran, which asserting a heading
   does not: a data step that returned an empty array renders every heading and
   every empty box without complaint.
3. Its body contains the Semantic utility class for accent, proving the adapter
   path renders rather than only the fixed-hex path.
4. The restraint line reaches the body.
5. Every exported page's nav links to `/design-system/`.

### Regression

`contrast.test.ts` stays green through the resolver extraction with no assertion
changed. That is the proof the refactor preserved behaviour.

### Practice

Each new guard is watched failing on purpose before it is believed, per the
standing practice `_build-log.md:69` records. The one that most needs it is
export guard 2, because it is the only assertion separating a working page from
a convincing empty one.

---

## Out of scope

- **The code to Figma Variables sync** (ADR-0002, Seam 3). Deferred by Leonid on
  2026-07-31. This route does not mention it.
- **A component gallery.** Scope decision 1.
- **The lens filter and the Router.** v2, and untouched by this work.
- **Layout overhaul.** Leonid, 2026-07-31: the current visual design is a
  starting point and may change. This route uses the existing tokens and page
  shell, so a later overhaul reaches it the same way it reaches every other
  page.
