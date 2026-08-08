# How to God leads with evidence, not description

*Design, 2026-08-08. Brainstormed with Leonid in session. Sources: Thoughtfish's
official "How To God Press Kit" (Google Drive, added to Leonid's Drive as a
shortcut 2026-08-08, files downloaded to
`job-search/portfolio/projects/how-to-god/assets/`), specifically
`HowToGod-Fact Sheet.pdf` and `Visual Assets/Screenshots/*.png`;
`job-search/cv/work_history.md`'s Thoughtfish section (grounded 2026-06-23);
`PRODUCT.md`'s Evidence-on-Hand entry for How to God.*

---

## What this is answering

How to God is the only one of the four case studies with no owned source:
Rollhaus and FerMentor are Figma exports Leonid controls, GlyphsHero is his own
repo, and How to God is Thoughtfish's shipped commercial game, credited but
departed before release. The page runs three sections (Context, Making it feel
right, Outcome) and carries exactly one image, the card thumb, itself press art
with no entry in `scripts/extract-figures.py`. A prior spec
(`docs/superpowers/specs/2026-08-05-case-study-visual-pass-design.md`) flagged
this project's gap explicitly, "How to God carries 8 paragraphs and no figure
at all, against a Thoughtfish press kit holding five more screenshots," and
left "what Thoughtfish IP permits" as an open question, unresolved until this
session.

Leonid supplied the full press kit this session, an official, currently-live
Google Drive folder owned by `christina.barleben@thoughtfish.de`, "How To God
Press Kit [EXTERNAL]," downloaded to
`job-search/portfolio/projects/how-to-god/assets/`. That resolves the IP
question the same way it resolves for every other project's assets: these are
Thoughtfish's own officially-distributed press materials, meant for exactly
this kind of external use, not borrowed fan art or a screenshot lifted without
permission.

What's in it:

- Six official press screenshots (2560x1440), one already the live thumb
  (`PDPScreenshot2.png`, downscaled to `how-to-god.jpg`)
- A one-page Fact Sheet, launch trailers, press releases, logo files, and
  DLC/update assets going back to the December 2025 launch
- Nothing about the two systems Leonid actually built. The kit is marketing
  collateral, not internal docs, so unlike GlyphsHero's `design-gate.md` /
  `night-shift.md` there is no design-rationale document to source an `embed`
  figure from.

No factual error surfaced this pass. `problem`, `whatIDid`, and `whatChanged`
were checked against `work_history.md`'s Thoughtfish section and hold up
exactly as written. This pass is purely additive.

---

## Part 1: no correction, and one real link now sourced

`PRODUCT.md`'s Evidence-on-Hand entry says a public store page exists "but its
URL is not recorded in this repo: source it before linking, never reconstruct
it." `work_history.md:58` already had it:

- Meta Quest store: `https://www.meta.com/experiences/how-to-god/5997754983577827/`
- Thoughtfish project page: `https://www.thoughtfish.de/projects/how-to-god/`

This pass links the first. The Meta Quest store page is the direct proof the
game shipped and is real, which is the claim Outcome's opening line makes
("the game reached Early Access a year after that"); the Thoughtfish page is
the studio's own marketing page for the title and doesn't carry the same
evidentiary weight, and every other case study on the site carries exactly one
outward link, so this stays at one rather than two.

---

## Part 2: no Constraints callout, same reasoning as GlyphsHero's

Considered and declined, on the same logic
`docs/superpowers/specs/2026-08-07-glyphshero-case-study-pass-design.md` Part 2
already worked through for GlyphsHero. How to God's Context section opens in
prose with the studio, the dates, and the platform ("a VR god sim for Meta
Quest... made at Thoughtfish in Berlin"), so a Duration/Platform/Tools/Team
table would restate what the reader has already been told, in a second format,
one section later.

---

## Part 3: the new section order

| # | Section | Kind | Change |
|---|---|---|---|
| 1 | Context | `prose` | unchanged |
| 2 | Casting | `figure` | **new heading, was half of "Making it feel right"**: recognition-plugin and shape-training paragraphs, gains `PDPScreenshot3.png` |
| 3 | Grabbing | `figure` | **new heading, was the other half**: colliders/haptics/input-scheme paragraphs, gains `PDPScreenshot4.png` |
| 4 | Outcome | `prose` | unchanged text, gains a link to the Meta Quest store |

Three sections become four. "Making it feel right" splits along its own
existing paragraph boundary (casting is paragraphs 1-2, grabbing and haptics
and input is paragraphs 3-4) rather than being padded with new prose: the same
move FerMentor's "The system" section made, and the same reasoning, "the prose
is what the section says and the [image] is what it shows, which is one
section's worth of work rather than two," except here it runs in the other
direction. One section's worth of work becomes two, because there are two
separate systems and two separate pieces of evidence, not one of each.

**Why these two screenshots and not the other four.** `PDPScreenshot3` (a
single hand mid-cast, the alchemy recipe book open behind it) and
`PDPScreenshot4` (two hands gripping wooden building blocks) are the two
frames in the kit that most directly show the systems `whatIDid` already
names: gesture recognition and grab/collider tuning. `PDPScreenshot1` (a
god-scale hand lifting a creature holding a villager) and `PDPScreenshotEvil`
(the evil-god hand variant) both involve a grab, but of a scripted
creature-and-villager moment rather than a placed object, which sits a step
further from "tuned the colliders on the in-game hand model so grabbing felt
right." `Screenshot5` (a hand reaching toward a floating globe, a relic/upgrade
screen) shows no hand-object interaction at all. Using all six would read as
padding the page with press art rather than choosing the two that are actually
evidence.

---

## Part 4: "Making it feel right," split

Current (4 paragraphs, one section). New (2 sections, 2 paragraphs each, text
unchanged):

**Casting**

> "The recognition plugin was already in the project when I arrived. What was
> open was everything around it: which shapes the spells used, how much slack
> a shape got before it stopped counting, and how fast the game told you it
> had counted. That is the part I was hired for."
>
> "Simple, distinct shapes did most of the work, because a shape that stays
> distinguishable when it is drawn badly needs less tuning than one that does
> not. I trained the model across several people instead of only myself, which
> is the difference between a system that works and a system that works for
> the person who built it."

Figure: `PDPScreenshot3.png`. Caption wording is implementation-plan work, but
should land near "a single-hand cast mid-gesture, the alchemy recipe book open
behind it."

**Grabbing**

> "Grabbing is the same problem from the other side. The colliders on the
> in-game hand model decide whether a pickup reads as contact or as a near
> miss, and that is tuning rather than design: you adjust, you playtest, you
> adjust again. Haptics carry the result back, one signal for a success and
> another for a warning."
>
> "The input scheme follows Meta Quest's guidelines, which set what a grab, a
> trigger and a menu call are expected to do on that hardware. Deliberately
> conventional, so it is learnable."

Figure: `PDPScreenshot4.png`. Caption wording is implementation-plan work, but
should land near "two hands gripping wooden building blocks over the
village."

Exact caption wording and alt text must pass `tests/unit/copy.test.ts` and
describe the image rather than the project, the same correction the original
thumb's alt text already went through (`_build-log.md`, 2026-07-31).

---

## Part 5: `extract-figures.py`

New `how-to-god` entries. Sources now live at
`job-search/portfolio/projects/how-to-god/assets/Visual Assets/Screenshots/`,
one level deeper than the flat `assets/` layout GlyphsHero and FerMentor use.
`find_source`'s `subdir` join already handles a nested `png` path with no
script change, since `Path` joins a subpath the same as a filename; the new
entries just carry the subpath in `png`.

| Output | Source | How | Why |
|---|---|---|---|
| `public/figures/how-to-god-casting.png` | `Visual Assets/Screenshots/PDPScreenshot3.png` | png, full-bounds crop (no-op), resized to the site's real-screenshot width convention | Official Thoughtfish press art. Shows the gesture-recognition system live: a single-hand cast plus the alchemy book UI, evidencing the "simple, distinct shapes" and "trained across several people" claims in `whatIDid`. |
| `public/figures/how-to-god-grabbing.png` | `Visual Assets/Screenshots/PDPScreenshot4.png` | png, full-bounds crop (no-op), resized to the same width | Official Thoughtfish press art. Two hands gripping building blocks, evidencing the collider-tuning and grab claims in `whatIDid`. |

Exact output width and the resulting height off the source's native 2560x1440
aspect ratio are implementation-plan work; every other real-screenshot figure
on the site sits between 986px (GlyphsHero's test runner) and 1701px
(Rollhaus's debug panel), so the plan should pick a width in that range rather
than shipping either screenshot at native size.

`how-to-god.jpg`, the existing thumb, is untouched by this pass and stays
outside the tracked pipeline exactly as it is today. Giving it a provenance
entry the way GlyphsHero's thumb got one is a real gap but a separate one, out
of scope here.

---

## What this pass does not claim

- **Nothing about what survived after Leonid left.** `whatChanged`'s "I can't
  tell you what survived" stays exactly as written. The press kit's
  post-departure update history (a Good or Evil update, four Art Visual
  Upgrades, a Pico port, all dated 2026-02 through 2026-07) is real but goes
  unused: reading it to infer which of his systems shipped intact would
  contradict the hedge the page already makes, not support it.
- **No claim beyond the two screenshots shown.** Neither image is captioned as
  proof the systems always worked well, only as what they looked like once
  built.
- **The Fact Sheet's six pillars are not diagrammed.** They describe the
  shipped game's full scope, most of which Leonid did not build (creature
  training, alchemy crafting, base building, rival-god combat). Diagramming
  them the way GlyphsHero's design-gate figure diagrams a doc Leonid wrote
  himself would misattribute the whole game's feature set to his personal
  contribution.
- **Still no usage, business, or outcome metrics; still no testimonials.**
  Unchanged from the current page and from `PRODUCT.md`'s standing rule.

---

## Guardrail check

- **1, claim only what ships.** Every sentence of prose on the page after this
  pass is unchanged from before it; the only new material is two
  officially-distributed press screenshots and one officially-sourced store
  link. Nothing invented.
- **2, the AI story belongs to this site.** Not touched. How to God predates
  Leonid's AI-collaboration workflow and this pass adds no claim about how it
  was built.
- **4, attribution.** The hybrid OOP/ECS credit-not-mine paragraph in Outcome
  is untouched. Neither new screenshot is captioned as solely Leonid's work;
  both are captioned as what the system looked like, matching how `whatIDid`
  already scopes his ownership.
- **5, tone.** No em-dashes. The one existing hedge (what survived after
  departure) is not restated a second time anywhere in the new sections.
- **6, log it.** This file, plus a `_build-log.md` entry once implemented,
  covering the press-kit sourcing and the screenshots-not-used decision, the
  same kind of reusable note GlyphsHero's placeholder-art rejection left
  behind.
