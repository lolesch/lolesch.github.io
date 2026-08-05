# The visual pass: Rollhaus leads with figures, and the card stops vanishing

*Design, 2026-08-05. Brainstormed with Leonid in session, from his review of the
live site. Sources: `job-search/portfolio/projects/rollhaus/` (`assets/` for the
new exports, `source/` for the Figma PDFs, `rollhaus_source_of_truth.md` wins on
any disagreement), plus five Figma MCP reads made on 2026-08-05 and recorded
below so they never need repeating.*

---

## What this is answering

Leonid's review, in his words, compressed to six findings:

1. Clicking a project card enters a new page and the visual is gone. He expected
   a transition, or at minimum for the image to still be there.
2. The editor comparison shows two states that are "mainly the same". The
   sequence should start from almost nothing, no pattern and no skates, and add
   one thing at a time, so the visuals say what the options are.
3. Section 04 is a screenshot of text and has to go. What belongs there instead
   is the component hierarchy, the variables in the Figma editor, where they get
   set to change the modes, and the slots.
4. Section 06 tries that and does not work.
5. Section 08's before state goes. The after state becomes the visual language of
   the whole case study.
6. The prototype should be embedded, or at least mentioned.

The underlying complaint is one thing: on a case study whose primary reader is
UX/UI, the figure-to-text ratio is inverted. Rollhaus currently runs 17 prose
paragraphs against 6 images and one embedded diagram, the largest of those images
is a picture of a text tree, and the diagram describes a mechanism rather than
showing one.

---

## Scope

**Rollhaus figures in full, plus card-to-page continuity built once for all four
projects.** Chosen over doing all four projects' figures in one pass.

**Rejected: all four in one pass.** GlyphsHero carries 14 paragraphs, one
embedded diagram and no picture of the game. How to God carries 8 paragraphs and
no figure at all, against a Thoughtfish press kit holding five more screenshots.
Both are real gaps and neither is this gap. They also need asset decisions of
their own (what of GlyphsHero is showable at all, what Thoughtfish IP permits),
which would stall the Rollhaus work behind questions that have nothing to do with
it. Recorded here so the next session does not rediscover them.

---

## Part 1: the card carries into the page

### The hero

The detail page grows a hero at the top: the project's existing `thumb`, at full
content width, with the `<h1>` sitting on the same `scrimGradient` the card
already uses, at the same `em`-relative insets. Not a second image below the
title. The *same* image in the *same* treatment, so the navigation reads as the
card growing rather than as a new document arriving.

This makes the detail page's `<h1>` a scrim title, which is the one structural
change: the card's `<h3>` and the page's `<h1>` become the same component in two
sizes. `src/lib/scrim.ts` already exists for exactly this and needs no change.

### The mechanism

`ProjectTile`'s `<Link>` becomes a plain `<a href>`, restoring true document
navigation, and `globals.css` gains:

- `@view-transition { navigation: auto; }`
- a per-project `view-transition-name` on both the card thumbnail and the page
  hero, set inline as `` `thumb-${project.slug}` ``, because only one element
  carrying a given name may be visible at a time and the home grid renders four
  cards at once
- a `view-transition-name` on the pinned header, so it holds still instead of
  cross-fading with everything else
- all of it inside `@media (prefers-reduced-motion: no-preference)`, and the
  duration read from a motion token so `tests/unit/token-discipline.test.ts`
  stays green

The back link on the detail page becomes a plain `<a>` too, so the reverse
transition works.

### What it costs, stated plainly

Next's client-side routing and prefetch on project links. Four static pages under
`output: 'export'` make that a fair trade, and it is the only way to get a
transition that is not built on an API named unstable.

**Rejected: `unstable_ViewTransition`.** Next 16.2.12 and React 19.2.4 both
support it and it would keep client-side routing. It is also an experimental API
on what would become the site's flagship interaction, on a site whose argument is
that its choices are durable. The cost of the CSS route is prefetch. The cost of
the React route is a rewrite when the API moves.

**Rejected: hero image with no transition.** It answers the literal complaint and
throws away the reason the complaint is interesting.

Browser support as of 2026-08: Chrome since 126, Safari 18.2, Firefox 144.
Anything older gets an instant navigation, which is what it gets today.

---

## Part 2: the Rollhaus section order

| # | Section | Kind | Change |
|---|---|---|---|
| 1 | Constraints | `constraints` | unchanged |
| 2 | The editor | **`progression`** (4 states) | replaces the quad/inline `comparison` |
| 3 | Try it | **`prototype`** | the click-to-load facade, at the moment of most interest |
| 4 | Context | `prose` | unchanged |
| 5 | What you can actually change | `figure` | Skates Atoms replaces the option-tree screenshot |
| 6 | One system, not a screen per option | `prose` | one sentence repointed; no new paragraph |
| 7 | Where the configuration is defined | `figure` | the Figma variables panel |
| 8 | And where it is read | `figure` | the debug readout on the cart screen |
| 9 | One card, four screens | `embed` | `rollhaus-architecture` rewritten as the real `Base Card` tree plus the token inventory |
| 10 | What testing changed | `prose` | **no figure** |
| 11 | Outcome | `prose` | unchanged |
| 12 | The same boot on a different mount | `figure` | unchanged |
| 13 | Learnings | `prose` | unchanged |

Thirteen sections against eleven. **Prose paragraph count does not move**, and
that is worth stating because the first draft of this spec assumed it would: the
option tree the retired screenshot depicted is *already* enumerated in section 6,
down to the ball bearings, so that figure was restating a paragraph at a lower
resolution rather than carrying anything the prose lacked. Images go from 6 to 8,
plus a prototype nobody could reach before. The ratio moves less than those counts
suggest; what changes is weight and position. Four full-width screenshots and a
playable prototype become the first things after the constraints callout.

**Section 09 loses its figure.** Leonid's instruction taken literally, confirmed
by him on 2026-08-05. The reworked panel is what every screenshot from section 02
onward already shows, so exhibiting it again as the right half of a before/after
would be the third time the reader sees it. The prose still carries the finding,
the 68% misclick rate and the structural fix. Both `rollhaus-panel-before.jpg`
and `rollhaus-panel-after.jpg` retire. This also retires the open provenance
caveat recorded against the before image, that nothing in the sources proves it
is the screen the 18 Maze participants clicked.

**Sections 06 and 07 are two full-width figures, not one `comparison`.** Both
images are wide landscape strips: the variables panel crops to 1600x386 and the
debug readout to 1701x304. The `comparison` renderer is a two-column grid with a
`sizes` hint of 22rem, which would put each of them at roughly 470px wide and
make both illegible. The type decision follows the rendering, not the taxonomy.

**The slot photo is cut.** The three screens carrying it sit at different heights
with dead canvas between them, so every crop tight enough to be legible clips one
of the three. Four boxes were tried and rejected. The slot argument moves whole
into section 08's embed, which is where the mechanism belongs anyway.

---

## Part 3: the new section kind

```ts
| { kind: 'progression'; heading: string; caption: string;
    steps: readonly ProgressionStep[] }

| { kind: 'prototype'; heading: string; caption: string;
    href: string; embedSrc: string;
    poster: { src: string; alt: string; width: number; height: number } }

type ProgressionStep = {
  label: string;   // "Shoe model"
  note: string;    // what this step added
  src: string; alt: string; width: number; height: number;
};
```

**Not `comparison` reused.** That type is a fixed pair whose entire argument is
the difference between two things, which is why it is typed as a tuple and
rendered as a two-column grid. A progression is ordered and cumulative: each step
keeps what the last one added, and the reader is meant to follow it in sequence
rather than compare across it. It renders as a numbered `<ol>`, which also hands
a screen reader the order for free.

**One step per row at full content width, not two-up.** Two-up was specced first
and fails on arithmetic. The project page is `measure`, a 48rem reading column,
not the 64rem `frame`, so full width here is 768px and a two-column step is about
350px. At that size the panel heading ("Select Your Pattern") is roughly 5px
tall. The panel changing is half of what the figure is for, so a layout that
makes it unreadable defeats the section. Full width gives each step 768x545, and
the cost is height, taken deliberately.

**Rejected: breaking the progression out to `frame`.** Every figure on every case
study is currently held to `measure`, and widening one of them is a page-layout
decision that wants its own argument rather than riding in on a figure pass.

`steps` is a list rather than a tuple because four is this instance's number, not
the kind's. The renderer takes what it is given.

**No `link` on `progression`.** It was specced with one, on the argument that the
prototype belongs at the editor rather than buried in Outcome. That argument was
right about placement and wrong about shape: an embedded application is not a
caption on a figure. `prototype` is its own kind and its own section, sitting
directly under the progression, which puts the prototype where the reader most
wants it and keeps a figure a figure.

---

## Part 4: the figures

Every box below was rendered and inspected on 2026-08-05 before being written
down. All four editor exports arrived at an identical 2916x2086, so they share
the crop the existing editor figures already use.

| Output | Source | How | Argues |
|---|---|---|---|
| `rollhaus-editor-shoe.jpg` | `rollhaus_editor_00.png` | crop `[22, 18, 2886, 2050]`, w1400 | the boot alone, no base at all |
| `rollhaus-editor-pattern.jpg` | `rollhaus_editor_01.png` | same crop, w1400 | pattern applied, still no base |
| `rollhaus-editor-skates.jpg` | `rollhaus_editor_02.png` | same crop, w1400 | the quad appears; the four thumbnails are the *configured* boot on four mounts |
| `rollhaus-editor-wheels.jpg` | `rollhaus_editor_03.png` | same crop, w1400 | wheels recolour |
| `rollhaus-thumb.jpg` | `rollhaus_editor_03.png` | crop `[22, 295, 2830, 2050]`, w1120 | re-derived so the card and the hero are one image |
| `rollhaus-atoms.jpg` | Components PDF | clip `[0.0045, 0.1228, 0.1825, 0.2665]`, w1400 | the option space as parts |
| `rollhaus-variables.png` | `Variable.png` | crop `[0, 38, 1920, 500]`, w1600 | collections, modes, linked values |
| `rollhaus-debug.png` | Hi-Fi PDF | clip `[0.4190, 0.2250, 0.5530, 0.2620]`, w1700 | the same variables live on a product screen |

Retired: `rollhaus-options.png`, `rollhaus-panel-before.jpg`,
`rollhaus-panel-after.jpg`, `rollhaus-editor-quad.jpg`,
`rollhaus-editor-inline.jpg`.

### What the progression turned out to show

Two things the exports gave that no plan predicted, both worth a caption:

- **The icon rail fills left to right across the four steps.** The step indicator
  is visible as a sequence rather than asserted, which is the copy principle
  "progress reads as readiness" made literal.
- **Step 03's four thumbnails are the already-configured boot** on quad, inline,
  ice and plain. The current caption claims each thumbnail is an instance of the
  product rather than a static icon. This is the first figure that shows it.

**The price reads 124 EUR in all four states.** The selections Leonid made happen
to be price-neutral, so no caption may claim the price ticks up. Named here
because it is the obvious thing to write and it would be false.

### What the variables panel shows

The single strongest artifact in the case study, and the one Leonid was unsure
was useful:

- **Eleven collections scoped by domain**, not one flat bag: Color 31, System 5,
  Cart 5, EditorSidePanel 2, Test Radio Buttons 5, Pattern 2, Shoe 3, Skates 2,
  Wheels 3.
- **Modes as columns** on the Wheels collection: Default, Yellow, Green, Water
  blue, Blue, Orange, Black.
- **Each mode carries three linked values.** Green gives `WheelColor: Green`,
  `WheelType: Outdoor`, `WheelPrice: 26`. Black gives Black, Outdoor, 17.

That last row is the record's own sentence, *"one mode switch reconfigures
several linked elements at once"*, proven in one image. It is also the only
evidence anywhere for modes, which the case study has until now been able to
assert and not show.

The browser tab strip is cropped off the top, because it carried unrelated tabs
(Resume, CoverLetter, GlyphsHero UI). **`Test Radio Buttons` and the two empty
collections stay in.** They corroborate the footnote the page already ships, that
this was a first variables project and the naming is ad hoc. Cropping them would
be tidying the evidence.

### One judgment call to confirm

The atoms crop carries Figma's dashed violet component-set outlines around each
of the three groups. They are editor chrome that leaked into the PDF export, and
`extract-figures.py` elsewhere pulls boxes in specifically to avoid shipping
them. They are kept here on the argument that a UX/UI reader reads a dashed
violet boundary as "component set" instantly, which is the section's whole point.
Reversible: tightening the box is not possible without cutting content, so
reversing this means dropping the figure.

---

## Part 5: `extract-figures.py`

Gains nothing structural. Every new figure resolves through the existing `png`
and `clip` modes, and the sibling repo's `assets/` and `source/` folders already
hold every source.

**Rejected: a `node` mode recording Figma file keys and node ids** for figures
pulled live. Nothing in this pass needs it, and the Figma MCP is on a free tier
of roughly six calls total, so a mode that invites live reads is a mode that
invites exhausting the quota. The five reads made on 2026-08-05 are transcribed
into this spec instead, which is the durable form.

**One provenance casualty.** `rollhaus_editor_02.png` in `assets/` used to be the
inline-selected editor state and is now the new Skates export. So
`rollhaus-editor-inline.jpg` can no longer be regenerated from its recorded
source. The figure is retiring in this pass, so nothing on the site breaks, but
its entry has to come out rather than sit in the file describing a crop that
would now produce a different picture.

---

## Part 6: the prototype

Public as of 2026-08-05, verified by oEmbed returning 200 (it returned 404 before
Leonid changed the share setting). The shipped URL drops the session token and
viewport parameters, which are ephemeral:

```
https://www.figma.com/proto/y7bE7LrAbTqplVEh7y44ID/Project3_Rollhaus-Copy?node-id=1927-3157&starting-point-node-id=1927%3A3157&scaling=scale-down&content-scaling=fixed
```

It ships as its own section directly under the progression, as a **click-to-load
facade**: the wheels step rendered as a static image with a load affordance,
which on click swaps in

```
https://embed.figma.com/proto/y7bE7LrAbTqplVEh7y44ID/Project3_Rollhaus-Copy?node-id=1927-3157&starting-point-node-id=1927%3A3157&scaling=scale-down&content-scaling=fixed&embed-host=lolesch-github-io
```

Nothing third-party loads until the reader asks for it, the facade is an image
the page needs anyway, and the section reads completely without it. The
`SectionLink` on the same section stays, so a reader who does not want an
embedded app still gets the prototype.

**Rejected: a bare iframe.** It loads Figma's application on page load, does not
follow the theme, and makes a third-party request on behalf of a reader who never
asked for one, on a page whose stated constraint is that nothing is cluttered.

**Rejected: link only.** It was the state Leonid reviewed and objected to.

Open: `embed-host` is a Figma-side identifier and the value above is a guess. If
Figma rejects it the facade falls back to the link and the section still works.

---

## What this pass does not claim

- **The page gets longer, by roughly 1,300px.** Measured against the 768px
  reading column rather than the 976px frame, which is the correction that
  matters: retiring the option tree, the before/after panels and the old editor
  pair saves about 3,200px of rendered height, while the progression, the
  prototype facade, the atoms and the two variable figures add about 4,500px.
  Leading with visuals costs vertical space. That is the trade, not a side effect
  of it, and two-up progression steps were the version that would have saved
  height instead.
- **Modes are shown for the Wheels collection only.** The variables panel
  screenshot has one collection expanded. Nothing claims the other ten are
  structured the same way, because nothing shows it.
- **The debug readout is corroboration, not a second argument.** It is the first
  thing to cut if section 06 and 07 read as one beat stretched over two headings.
- **No live users, no business numbers.** Unchanged from the current page, and
  the Outcome section already says so.

---

## Guardrail check

- **1, claim only what ships.** The three claims this pass upgrades (modes, the
  token system's breadth, thumbnails as product instances) each gain a figure
  that shows them. Nothing new is asserted without one.
- **3, Rollhaus is C-primary.** The pass makes the systems story more visual, not
  less systemic. It leads with the mechanism throughout.
- **4, attribution.** Nothing here narrows or widens the two-person framing. The
  editor and its variable setup are already recorded as Leonid's.
- **5, tone.** The ad hoc variable naming stays stated once, in the embed's
  footnote. The no-testing and no-users limits stay where they are. No
  em-dashes.
- **6, log it.** This file, plus an append to `_build-log.md` covering the Figma
  MCP overspend and the four rejected slot crops.
