# CV palette and typographic roles

Date: 2026-08-01
Status: awaiting review

## Why

Leonid's opening observation: "we have the design system in place but its not really
in use on the page itself."

That is literally true, and the repo can say by how much.

**Two of eight Semantic colours render nowhere.** `--ds-color-accent` is defined,
contrast-tested, and documented in `src/content/design-system.ts:29` as "Links and
emphasis". It renders in exactly one place: its own swatch on `/design-system`.
Every link on the site is body-coloured with `hover:underline`. `--ds-color-surface`
is the same, deliberately so, because `muted` on `surface` measures 4.40:1 in light.

So `/design-system` currently makes a claim that is false about a quarter of its own
colour set:

> Tokens nothing uses are inventory rather than a system.

**The type layer names sizes, not jobs.** `--ds-text-heading` is `1.5rem`. It carries
one of the five decisions a heading makes; the other four are copy-pasted at the call
site. The cost is already in the repo: seven `<h2>` elements carry
`font-serif text-heading leading-tight`, and the eighth, `src/components/work-grid.tsx:7`,
carries `font-serif text-heading` with no `leading-tight`. Nothing could catch it.

`docs/superpowers/specs/2026-07-31-visual-direction-design.md:238` already flagged the
type scale as "a thin exhibit for a site whose pitch is design systems" and deferred it.
This spec closes both gaps together, because the fix is the same fix: give the layer
roles instead of values.

## Sources

Leonid supplied a palette from the CV Figma file (`AC814F`, `795428`, `CCCCCC`,
`999999`, `4D4D4D`, `1D1F1F`, `181A1B`), a coolors ramp pulled from a game screenshot,
and a screenshot of the CV in both themes.

Two things were established by measurement rather than by eye:

**The CVs use four colours.** Extracted from the PDF content streams of both
`CV Track B - UX-UI Designer.pdf` and `CV Track C - UX Engineer.pdf`, identically:

| Colour | Uses |
|---|---|
| `#000000` | 61 |
| `#795428` | 29 |
| `#ffffff` | 11 |
| `#181A1B` | 6 |

No green, and no `#AC814F`. The CV in the screenshot, with the green and the game
header band, is the Track A games CV. The two CVs this site serves run on near-black,
white and one bronze.

**The CV palette is already a two-theme system.** `#795428` on `#181A1B` measures
**2.59**, so it cannot be the dark-mode accent; the CV must switch to `#AC814F` there.
That is exactly the `accent` / `accent-inverse` split the Brand layer already has. The
same holds for the greys. Nothing new is needed to carry it.

## Decisions

### 1. The header image is a colour source, not an image

`C:\Users\loles\Desktop\LEONID\InventoryTetris\docs\media\header_background.png` is
1584x396, a GitHub profile banner, and a GlyphsHero screenshot.

Placing it on the site would trip two rules already written down: "every visual carries
a claim prose cannot" (`2026-07-31-visual-direction-design.md`) and the Anti-Brand
Constraint in `CONTEXT.md`. A decorative band is decoration.

**Rejected:** a full-bleed hero band captioned as his own game (most striking, but it
frames a Track C site as a game portfolio in the first screenful); the image as the
GlyphsHero lead figure (defensible, but a separate content decision that does not
belong in a token spec).

### 2. The ground is the CV's, not the screenshot's

Three grounds were derived and validated: the coolors slate `#2A2E39`, a deep moss
`#111610`, and the CV near-black `#181A1B`. All three passed AA in both themes.

Leonid's read settled it: "I think the green is more an accent to the dark greys."
The screenshot confirms it. The CV ground is flat near-black; the green marks skills
and tools while the gold marks roles.

**Rejected:** the slate ground (its own darkest value is still light enough that
`#AC814F` needs lightening to `#B68E5F` to clear AA); the moss ground (most
distinctive, ships the coolors values literally, but furthest from the CV and reads
military rather than design engineer).

### 3. The CV's two near-blacks are `bg` and `surface`

`#181A1B` and `#1D1F1F` are 5% apart in lightness. That is not a text decision; it is a
page and a raised panel. This hands `surface`, one of the two dead tokens, a job
straight out of the source.

Leonid asked for it warmer, so the panel ships as `#201E1C` rather than the CV's
slightly cool `#1D1F1F`. Recorded as a deliberate deviation.

### 4. Green becomes a capability role

Green is a second accent with its own job, mirroring the Track A CV: gold marks roles,
green marks skills and tools. On this site the analogue already exists as the Lens
chips (`UX/UI`, `Systems & Architecture`, `Games / XR`, `AI Workflow`), which currently
render in `text-muted`.

This adds a Semantic colour, which the restraint claim on `/design-system` only permits
if something renders it. The chips do.

**Rejected:** green as a quiet structural role only (hairlines, media frames); no green
at all, shipping the exact four-colour CV system.

### 5. The accents spend their contrast headroom on chroma

`#795428` measures 6.75:1 on white against a 4.5 floor. It was spending contrast as
darkness, which is why Leonid read it as brown rather than gold. `#AC814F` measures
5.00:1 on `#181A1B` against the same floor.

Both moved to use the headroom. Light mode remains physics-bound: anything clearing
4.5:1 on white must be dark, so the choice was how much chroma to spend, not how bright
to go.

**Rejected:** shipping the CV values unmodified (reads brown / dark); maximum chroma
`#BF5900` in light (reads rust, no gold left); `#F0C070` in dark (bright, but close to
the Tailwind amber the site is leaving behind).

### 6. Headings ship at weight 500

Nothing currently sets a font weight, so Tailwind's preflight leaves every heading
inheriting body weight 400. Encoding a weight makes it a decision on the record rather
than a default nobody chose.

600 was shown and rejected as "too bold and cheap". 500 keeps a visible weight step
between heading and body so hierarchy does not rest on size and family alone. Source
Serif 4 is variable across 200-900, so 500 is a drawn weight and not a synthesised one.

**Rejected:** 600 (rejected on sight); 400 with tighter display leading, which remains
a one-token change if 500 looks wrong on the real page.

## The palette

Every pair below was computed with the same WCAG formula `src/lib/contrast.ts` uses and
passes AA in both themes.

### Primitive

| Token | Value | Source |
|---|---|---|
| `neutral.0` | `#ffffff` | CV |
| `neutral.50` | `#f2f2f0` | minted |
| `neutral.300` | `#cccccc` | CV |
| `neutral.500` | `#949494` | minted |
| `neutral.700` | `#666666` | minted |
| `neutral.800` | `#4d4d4d` | CV |
| `neutral.950` | `#201e1c` | minted, warmed from CV `#1D1F1F` |
| `neutral.1000` | `#181a1b` | CV |
| `gold.300` | `#c99a5c` | from CV `#AC814F` |
| `gold.500` | `#ac6513` | from CV `#795428` |
| `green.400` | `#93a855` | from coolors |
| `green.600` | `#49851d` | from coolors |

Four minted greys, each with a reason:

- `#f2f2f0`, because the light CV is flat white and has no panel value.
- `#949494`, because CV `#999999` measures **2.85** on white, under the 3:1 control
  boundary. A CV can use it for rules because a CV has no controls; a website does.
- `#666666`, because CV `#4D4D4D` measures **2.07** on `#181A1B`, well under.
- `#201e1c`, per decision 3.

**`#999999` is merged into `#949494`.** Approved 2026-08-01. One primitive does both
jobs: the light control boundary at 3.03:1, and dark muted text at 5.76:1. Keeping the
CV's `#999999` for dark muted would have read 6.13:1, a ratio nothing needed, at the
price of shipping two greys 2% apart in lightness with one used only in light and one
only in dark. A system whose pitch is hygiene should not carry near-duplicate
primitives.

**Rejected:** keeping `#999999` for CV fidelity. The deviation is recorded here rather
than absorbed silently, because it is the one place the palette departs from its source
for a reason internal to the site.

### Brand

| Role | Light | Dark |
|---|---|---|
| `paper` / `paper-inverse` | `#ffffff` | `#181a1b` |
| `shade` / `shade-inverse` | `#f2f2f0` | `#201e1c` |
| `ink` / `ink-inverse` | `#181a1b` | `#ffffff` |
| `quiet` / `quiet-inverse` | `#4d4d4d` | `#949494` |
| `rule` / `rule-inverse` | `#cccccc` | `#4d4d4d` |
| `edge` / `edge-inverse` | `#949494` | `#666666` |
| `accent` / `accent-inverse` | `#ac6513` | `#c99a5c` |
| `capability` / `capability-inverse` | `#49851d` | `#93a855` |

### Measured

| Pair | Light | Dark | Min |
|---|---|---|---|
| `fg` on `bg` | 17.46 | 17.46 | 4.5 |
| `muted` on `bg` | 8.45 | 5.76 | 4.5 |
| `accent` on `bg` | 4.54 | 6.87 | 4.5 |
| `capability` on `bg` | 4.51 | 6.63 | 4.5 |
| `border-interactive` on `bg` | 3.03 | 3.04 | 3 |
| `border-media` on `bg` | 3.03 | 3.04 | 3 |

Deliberately absent, and the reason travels with the list the way the existing note
does: `accent` on `surface` is 4.05 light, and `capability` on `surface` is 4.02 light.
Both are under AA. Lens chips and accent text therefore sit on `bg`, never inside a
filled panel. This is the same constraint already recorded for `muted` on `surface`.

### The green split, flagged

`capability` shifts **19 degrees in hue and 31 points in saturation** between themes:
`#49851D` is a vivid grass green, `#93A855` a muted olive. Every other token changes
lightness and keeps its character; the gold pair shifts 2 degrees.

Leonid chose this knowingly after it was flagged. It is recorded here because
`/design-system` invites a reader to toggle the theme and watch the Semantic row move,
and this is the one row that will do something different.

## Typography

### Primitive

Three new families: `font.weight` (400, 500, 700), `font.leading` (1.1, 1.25, 1.5,
1.65), `font.tracking` (-0.02em, 0, 0.1em). The existing seven-step `font.size` ramp is
unchanged.

### Semantic: a `type` family of nine roles

| Role | size | weight | leading | tracking | family |
|---|---|---|---|---|---|
| `display` | 3rem | 500 | 1.1 | -0.02em | serif |
| `title` | 2rem | 500 | 1.1 | -0.02em | serif |
| `heading` | 1.5rem | 500 | 1.25 | 0 | serif |
| `subheading` | 1.25rem | 500 | 1.25 | 0 | serif |
| `lead` | 1.125rem | 400 | 1.65 | 0 | sans |
| `body` | 1rem | 400 | 1.65 | 0 | sans |
| `meta` | 0.875rem | 400 | 1.5 | 0 | sans |
| `eyebrow` | 0.875rem | 700 | 1.5 | 0.1em | sans |
| `emphasis` | inherit | 700 | inherit | inherit | inherit |

Emitted as `--ds-type-<role>-<property>`, each referencing the Primitive below it, so
`outputReferences` keeps the chain visible exactly as it does for colour.

Every role has users. `eyebrow` names the `text-meta font-bold tracking-widest uppercase`
pattern repeated four times across the figure components. `emphasis` names the bare
`font-bold` marking the changed axis in the chain diagram, six times. A role with no
renderer would fail the restraint claim the same way an unused colour does.

### Adapter

One `@utility` per role in `src/app/globals.css`, beside the existing `@theme inline`
block:

```css
@utility type-heading {
  font-family: var(--ds-type-heading-family);
  font-size: var(--ds-type-heading-size);
  font-weight: var(--ds-type-heading-weight);
  line-height: var(--ds-type-heading-leading);
  letter-spacing: var(--ds-type-heading-tracking);
}
```

Call sites collapse from `font-serif text-heading leading-tight` to `type-heading`.

### The size ramp stops being reachable

Once every call site uses a role, the bare `text-*` utilities have no users, so their
`@theme inline` mappings come out. `--ds-text-*` survives as what the roles reference.
A component chooses a role or nothing; it can no longer pick a size and improvise the
other four decisions.

`/design-system` gains a role table beside the existing size ramp, which is a better
exhibit than the ramp alone: it shows the layering rather than asserting it.

## A fifth discipline rule

`tests/unit/token-discipline.test.ts` gains one offence, in the same shape as the four
it already has: no raw `leading-*`, `tracking-*`, `font-serif`, `font-sans`, or
`font-<weight>` class anywhere under `src/`. `text-balance` stays legal, being a
wrapping hint rather than a type decision.

This converts the `work-grid.tsx` drift from unlikely to unreachable.

`ENFORCED_RULES` in `src/content/design-system.ts` gains the matching entry. That list
is maintained by hand against the test on purpose, and the existing comment says why.

## Guards that must change

Each of these fails until updated, which is the guard working rather than a problem to
route around.

| Location | Why it fails | Change |
|---|---|---|
| `tests/unit/design-system.test.ts:34` | `known = ['color','space','text','radius']` | add `type` |
| `tests/unit/design-system.test.ts:69-70` | asserts `--ds-color-accent` resolves to `#b45309` | expect `#ac6513` |
| `SEMANTIC_COLOURS` | drift guard runs both directions | document `--ds-color-capability` |
| `CONTRAST_PAIRS` | new rendered pair | add capability on bg, and the surface note |
| `scripts/build-tokens.mjs:7-13` | `base` list is explicit | add `tokens/semantic/type.json` |

## Out of scope

- **The header image as an image.** Decision 1. Revisitable as a GlyphsHero figure,
  which is a content decision.
- **Self-hosted fonts.** Deferred by the visual-direction spec and untouched here.
  Inter and Source Serif 4 stay on `next/font`.
- **Motion, elevation, shadow.** No token family is added for any of them. Nothing
  renders them.
- **A focus-ring token.** The focus treatment is composed ad hoc in
  `project-tile.tsx:12`. Real, but it is a colour-role question and this spec is already
  carrying two layers.

## Guardrails

Checked against `CLAUDE.md`.

1. **Claim only what ships.** No new capability is claimed. `/design-system` gains a
   role table describing tokens that exist and render.
2. **The AI story.** Untouched.
3. **Rollhaus.** Untouched.
4. **Attribution.** The header image is not used, so no attribution question arises.
   The CV colour extraction is from Leonid's own files.
5. **Tone.** No em-dashes in this spec. The `/design-system` copy this change requires
   is outward-facing and must be run against
   `../job-search/_project/tone_of_voice.md` when it is written, not now.
6. **Log decisions.** Rejected options are recorded inline above. `_build-log.md` gets
   the entry on implementation.
