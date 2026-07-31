# Visual direction: thumbnails, card summaries, and two system diagrams

Date: 2026-07-31
Status: awaiting review

## Why

Four reference sites were reviewed against the shipped site: Adham Dannaway's
Figma design system case study, Hadass Sternberg's portfolio, Victor Berbel's
Zesty case study, and Han Nguyen's designandhan.com.

All three that are portfolios lead with images. The shipped site has none on the
home page and two figures across ~2,500 words on Rollhaus. That is the gap this
spec closes.

A second, smaller finding: the work grid renders three ~150-word tiles side by
side, which makes the site's most scannable surface its densest. That trips the
anti-brand constraint in `CONTEXT.md`: the one word the site must never be is
*cluttered*.

What the references do **not** have is a decision that could have gone the other
way. Rollhaus has a reversal, a number, and a stated limitation. The polish is
what gets added here; the judgment is not traded for it.

## Decisions

### 1. Every visual carries a claim prose cannot

The rule for admitting an asset. A visual that only decorates fails the
`Flow Over Flash` principle and the anti-brand constraint.

### 2. The Rollhaus mode switch ships as a static two-state comparison

The load-bearing claim is *"one mode switch reconfigures several linked elements
at once."* That is a claim about propagation.

A real-time screen recording would also make a claim about smoothness, and the
case study's own Learnings section says the opposite: *"nothing animates smoothly
across a variable state change."* Leading the site with a capture of the tool's
roughest behaviour argues against the page it sits on.

**Rejected:** a cut-between loop of the two states. More arresting, defensible if
labelled as a comparison, but it implies a transition quality the copy denies.

### 3. The tile carries a purpose-written summary, not the schema lines

Adding a thumbnail leaves no room for all three schema lines at readable density.

`work/[slug]/page.tsx` currently omits the three lines by design: *"the visitor
just clicked them, so the page opens where the tile stopped."* So dropping them
from the card would remove them from the site entirely, reintroducing exactly the
failure `CONTEXT.md` records the Tile Schema to prevent (the old template had no
slot for a decision).

Therefore this is a paired change:

| | Card | Detail page |
|---|---|---|
| Before | metadata, title, lenses, 3 schema lines | metadata, title, lenses, sections |
| After | **thumb**, metadata, title, lenses, **summary** | metadata, title, lenses, **3 schema lines**, sections |

The comment at `work/[slug]/page.tsx:52` inverts and must be rewritten, not
deleted: the rationale changes, it does not disappear.

**Constraint on every summary:** it names a decision, not a project. "A
roller-skate configurator" would describe the work and reproduce the
no-slot-for-a-decision problem in miniature.

**Rejected:** truncating one schema line onto the card (loses the purpose-written
hook); keeping all three under an image (leaves the grid as dense as before);
dropping prose entirely as Hadass does (removes the decision slot).

### 4. GlyphsHero carries the game and the AI workflow, game first

The record is currently framed entirely on the AI workflow and contains no game
content. Per `CLAUDE.md` guardrail 2 the AI story is this website's meta case
study, so the game material is added beneath rather than swapping one for the
other. `AI Workflow` stays in the lenses.

## Copy

New `summary` field, approved 2026-07-31. Checked against
`../job-search/_project/tone_of_voice.md`: no em-dashes, British spelling to match
existing copy, and deliberately varied in shape (tell #5 flags three
identically-shaped blurbs as an AI signature).

**Rollhaus**

> A roller-skate configurator built on Figma variables and modes, so new skate
> types extend the system instead of forcing a redraw.

**GlyphsHero**

> A tactile auto-battler where the inventory is the spell. Each item in a chain
> bends one part of an attack: what it targets, how it lands, what it spawns.

The closing triple is `CONTEXT.md`'s real axes in the game repo (Target Selection,
Delivery, Propagation), so it is concrete rather than generic.

**How to God**

> VR spellcasting and grabbing for Meta Quest. I owned UX and game feel: tuning
> gesture recognition, hand colliders and haptics until casting and grabbing felt
> right.

No summary restates a limitation. Tone tell #10: a limitation is stated once,
where it lands hardest, which is the metadata line and the Outcome section.

## The How to God attribution correction

Leonid confirmed 2026-07-31 that the shipped line overclaims: he did not invent
the gesture system, he adjusted an existing one until it felt right.

The correction already exists upstream and simply never propagated:

- `cv/cv_track_b_content.md:32` and `cv/cv_track_c_content.md:31` both read
  "Designed the gesture-spellcasting system ... **on an existing recognition
  plugin**".
- `cv/cv_track_b_content.md:74` logs it as the "Thoughtfish accuracy fix", dated
  to the June 2026 CV pass.
- `portfolio/site_copy.md:158` dropped the qualifier, and `projects.ts` inherited
  the unqualified version.

The portfolio is the only surface carrying the overclaim, and the only one about
to go public.

**`whatIDid`, corrected** (restores the CV's qualifier, changes nothing else):

> Designed the gesture set around simple, distinct shapes on an existing
> recognition plugin, and trained the model across several people rather than only
> myself. Tuned the colliders on the in-game hand model so grabbing felt right,
> added haptics as success and warning signals, and built the input scheme to Meta
> Quest's guidelines.

**`problem`, refocused** from population coverage to intuitiveness, per Leonid's
steer that the role was UX and the subject is feel:

> In VR you cast spells by gesture and pick objects up with your hands. Neither
> works if the player has to think about how to do it.

`whatChanged` is unchanged and remains accurate.

The detail section currently headed "Designing for hands that vary" is built on
the same unqualified claim and the same population-coverage angle. It is rewritten
toward game feel. It does **not** restate the plugin qualifier, which now lives in
`whatIDid`: same caveat twice on one page is tone tell #10.

`portfolio/site_copy.md` in the sibling repo should receive the same correction so
the two do not drift again.

## Data model

```ts
export type Project = {
  // ...existing fields
  summary: string;   // the card hook; names a decision, not a project
  thumb: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};
```

`thumb` is a required object rather than an optional string: every project in the
grid needs one, and alt text is not optional on an image that is the primary
link target.

`FigureId` gains `glyphshero-chain`.

## Assets

Ranked. Each row names the claim it carries.

| # | Asset | Carries | Status |
|---|---|---|---|
| 1 | Rollhaus mode-switch two-state comparison | "one mode switch reconfigures several linked elements at once" | to capture |
| 2 | Rollhaus side-panel before/after | the 68% misclick finding and the re-cut that followed | to capture |
| 3 | Rollhaus extension strip (quad / inline / ice / shoe-only) | "grew by extension rather than duplication" | to capture |
| 4 | GlyphsHero chain diagram | "each item reclassifies exactly one axis" | to build |
| 5 | Replacement Rollhaus editor figure | replaces a placeholder with a visible typo | to capture |
| 6 | How to God press image | the shipped game | to source |
| 7 | GlyphsHero thumbnail (`G.png`) | placeholder | available |

**On #2:** static side-by-side, not a slider. The difference is structural (a
merged list becomes a category selector above an option grid), so both states must
be visible at once. Sliders suit photographic diffs where the reader hunts pixel
changes.

**On #5:** `projects.ts:49` records the current figure as a placeholder captured
into a slide rather than exported. The panel heading reads "Patten" and the summary
card is clipped. It is the first image on the most important page.

**On #6:** the Thoughtfish press kit is a Google Drive folder linked from
`thoughtfish.de/projects/how-to-god/` with no stated usage terms. The game launched
December 2025; Leonid left December 2024; the "Good or Evil" update and a PICO port
landed after. Press images therefore show a build well past his involvement, in art
that was never his. The caption carries this:

> How to God, released 2025. I built the interaction layer in the pre-release
> build.

This is consistent with `whatChanged`, which already says he cannot tell what
survived.

**On #7:** `G.png` from `Assets/Art/` in the game repo, AI-generated from Leonid's
own prompts. Alt text describes the image and does not attribute the art to him as
hand-made work. Provenance is recorded the way `scripts/extract-figures.py` records
the Rollhaus crops, since that script exists precisely so nothing in
`public/figures/` is a mystery asset. Treated as a placeholder pending asset #4.

## The chain diagram

One new built figure. A React component on the site's tokens, following the theme,
registered through `FIGURES`. This is the pattern `rollhaus-architecture` already
proves. Assets 1, 2, 3 and 5 are captures, not components.

**`glyphshero-chain`** shows that each chain item reclassifies exactly one axis:

| Chain | Targets | Delivers | Spawns |
|---|---|---|---|
| Weapon | Nearest | Single | (none) |
| Weapon + Converter | Nearest | **Line** | (none) |
| Weapon + Converter + Payload | Nearest | Line | **Aoe child** |

One item added per row, exactly one column changing. Vocabulary is taken from the
game repo's `CONTEXT.md` so the diagram and the code agree.

Note the two lead assets make the same underlying argument: **one input, a scoped
and visible change.** Rollhaus shows it in a design tool, GlyphsHero in a combat
system. That through-line is what the site currently lacks.

## Out of scope

Deferred, with reasons:

- **Typography.** The scale is font-size only, with no line-height, weight, or
  tracking tokens, and tops out at 3rem. For a site whose pitch is design systems
  this is a thin exhibit, but it is a token-layer change and does not belong in a
  content and layout spec.
- **Self-hosted fonts.** Inter and Source Serif 4 read as tasteful defaults.
  Collletttivo and Fontshare are free and self-hostable; Grilli Type is paid and
  its trials are licensed for mockups, not live sites. An open-source face is
  on-message for a code-as-source-of-truth site. Separate decision.
- **21st.dev components.** Not used. The site's argument is that code is the
  source of truth and tokens flow outward; a community component undercuts it at
  the exact point a Track C reader would inspect. Its value here is interaction
  patterns to reimplement on the site's own tokens, not code to import.
- **Motion.** No motion is specified. Decision 2 removes the one place it was
  under consideration.

## Guardrails

- Guardrail 1, claim only what ships: the How to God correction, and no visual
  claims a capability that is not built.
- Guardrail 2, the AI story: stays the meta case study; GlyphsHero gains game
  content rather than losing the workflow section.
- Guardrail 4, attribution: the plugin qualifier restored; `G.png` not attributed
  as hand-made; the press image captioned to Leonid's actual involvement.
- Guardrail 5, tone: no em-dashes, tells #5 and #10 checked against.
- Guardrail 6, log decisions: rejected options recorded above; `_build-log.md`
  gets the entry on implementation.
