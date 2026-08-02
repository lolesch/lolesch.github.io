# FerMentor, the second featured case study

*Design, 2026-08-02. Brainstormed with Leonid in session. Sources:
`job-search/portfolio/case_studies/fermentor_source_of_truth.md` (wins on any
disagreement, per `conventions.md`), `job-search/portfolio/project_inventory.md`,
`job-search/cv/work_history.md`.*

---

## Why this project, and why now

`project_inventory.md` lists FerMentor as featured tier and calls it "the biggest
content gap." The reason is structural rather than a matter of taste: it is the
only full Double Diamond in the inventory, which is what a Track B reviewer
screens for and what Rollhaus cannot supply at any length. Rollhaus is C primary
and leads with the system. FerMentor is B primary and leads with the framing.

**Rejected: breadth over depth.** Adding the bridge and archive tiles would make
the grid look like a body of work sooner, and every one of them needs a thumb
that does not exist yet. Visual evidence is the binding constraint the inventory
already identified, so breadth costs the same per project as depth and argues
less.

**Rejected: leading FerMentor on the system** (Figma variables, the atomic
hierarchy). It is the stronger Track C signal and it makes FerMentor a second
Rollhaus, which throws away the only reason it is next in the queue.

---

## Four facts resolved

`fermentor_source_of_truth.md` §8 left four questions open. Leonid answered all
four on 2026-08-02. These answers supersede the source of truth where they
disagree with it.

1. **The colour system is real Figma variables**, not colour styles. This is the
   load-bearing Track C claim and it connects FerMentor to Rollhaus as one line
   of work rather than two unrelated course projects.
2. **The prototype reached a clickable full flow** by graduation, and Leonid will
   share a link.
3. **The split with Leith Gow was decided partway through**, not planned from the
   start. This contradicts §1 of the source of truth, which read "We decided to
   take 2 design approaches" as deliberate and built its framing on that. The
   opening beat is the research pulling two ways, not two products by design.
4. **The stage taxonomy came from desk research and AI-assisted synthesis.** Not
   from the two expert interviews. The strongest artifact in the project rests on
   the weakest evidence in it, and that has to be said where the taxonomy is
   presented.

Fact 4 brushes `CLAUDE.md` guardrail 2, which bans retrofitting the code-first AI
workflow onto any SPICED project. It does not apply here: `work_history.md`
already records AI in Leonid's discovery phase and not in screen generation, so
one factual sentence about synthesis is a disclosure. An AI-workflow narrative
would be the violation. The AI story stays on this site, per guardrail 2 and
`CONTEXT.md`'s Meta Case Study entry.

---

## The record

Second in the `projects` array, after Rollhaus. Array order is display order and
Rollhaus stays the lead, because the site is Track C primary.

```
slug:    'fermentor'
title:   'FerMentor'
year:    '2026'
context: 'Solo, after shared research'
role:    'Research, framing, product design'
lenses:  ['UX/UI', 'Systems & Architecture']
tier:    'featured'
```

`title` capitalises the M, following the design file. `project_inventory.md`
writes "Fermentor"; the design file is closer to the artifact and wins.

`context` is Leonid's wording, chosen over the drafted "Course capstone, split
from a pair". It leads with what he owned and puts the shared part where it
belongs, as the qualifier. **Rejected: "Course project, pair"**, which is the
Rollhaus label and is false here, and **"started as a pair, diverged to solo"**
from the inventory, which reads as drift rather than a decision.

The three schema lines are drafted below and are not frozen copy. They get a
tone pass against `_project/tone_of_voice.md` before they ship, the same as any
outward-facing text in this repo.

> **Problem.** Fermentation beginners cannot tell whether what they are seeing is
> normal, and opening the jar to find out is the thing most likely to ruin it.
>
> **What I did.** Reframed a confidence problem into a state and timing problem,
> then built the product on a fermentation stage taxonomy carrying the observable
> signals for each stage, on a Figma variable system.
>
> **What changed.** A clickable full flow, built on a model that answers what
> this should look like right now instead of listing steps. No usability testing:
> the capstone ran out of time.

---

## The spine

Eleven sections. `CONTEXT.md` rule holds: a section exists only if it has
substance, and none of these is padding. Section kinds are the existing union in
`src/content/types.ts`; nothing new is needed except one `FigureId`.

1. **Constraints** (`constraints`). Duration, team, platform, tools. Team names
   Leith Gow and says shared research.
2. **Context** (`prose`). What fermentation is, why it resists being a recipe,
   and the topic funnel. The board records the arc plainly as "Too broad →
   Similar but specific? → Fermentation", with a Time Management App and a
   Gardening kick-off worked through before it. **This section carries fact 3**,
   the split: shared research with Leith Gow, then a divergence decided partway
   once the research pulled toward two different users, his an experienced
   fermenter losing track across parallel batches and Leonid's a beginner in the
   first month. It is stated as what happened, not as a plan.
3. **The reframe** (`prose`). The board's own line, that lack of confidence is
   the symptom and not the problem. The three candidate framings with the written
   reasoning that separates them. The statement that shipped.
4. **Figure** (`figure`). The research board, so the framings appear as artifacts
   rather than as the write-up's summary of them.
5. **Who it is for** (`prose`). Persona, needs, How Might We. States once that
   this is a proto persona off desk research and three interviews, two of them
   with experts. **Uses Lukas Weber throughout**, including in section 7. The
   sources carry three interchangeable names for one fictional proto persona, and
   Lukas Weber is the one the persona card itself is written under in both FigJam
   and the Milestone IV deck. Milena and Christina do not appear.
6. **Embed: the stage taxonomy** (`embed`, `fermentor-stages`). Development →
   Decision → Outcome with the observable signals per stage. Carries the
   provenance limitation.
7. **From taxonomy to product** (`prose`). The `SHOW ME` button, prediction
   rather than instruction, and the appearance-first assessment principle: assess
   in the order that keeps the ferment uncontaminated, open only if needed. That
   principle is derived straight from the research finding that intervening
   carries contamination risk, which is what makes it defensible rather than
   decorative.
8. **The screens** (`figure` or `comparison`). The batch detail, and the
   dashboard across its states. `comparison` if two dashboard states carry the
   argument better than one, which is a judgement to make once the export exists
   rather than now.
9. **The system** (`prose`). Figma variables, the Sub Atomic → Screens hierarchy,
   and Consistency and Clear State as Leonid's two principles.
10. **Outcome** (`prose`). The clickable full flow, with the prototype link. No
    usability testing, stated once and here.
11. **Learnings** (`prose`).

Section 6 is the one this design would defend hardest. The taxonomy is structured
data, which is what the `embed` registry already does well for
`rollhaus-architecture`. Rendering it as a themed figure rather than a screenshot
means it survives a theme toggle, stays legible on a phone, and is the one
artifact on the page that cannot be mistaken for a screenshot of somebody else's
tool.

---

## The embed figure

Follows `rollhaus-architecture` and `glyphshero-chain` exactly, which is the
pattern that keeps "content is data" true: the data names a figure, it does not
carry one.

- `src/content/figures/fermentor-stages.ts` holds the taxonomy as data.
- `src/components/figures/fermentor-stages.tsx` draws it.
- `FigureId` in `src/content/types.ts` gains `'fermentor-stages'`.
- `FIGURES` in `src/components/figures/registry.ts` gains the entry.

`Record<FigureId, ComponentType>` means an id with no component fails the build,
which is already why the registry is shaped that way.

The data carries the two annotations that are the design insight rather than the
description: users abandon during Activation because early fermentation looks
like nothing is happening, and the risk states are where the product can be most
useful. Both are in the source verbatim as arrows on the taxonomy.

---

## Assets required from Leonid

Exported as PDF into `job-search/portfolio/case_studies/assets/`, named to match
the Rollhaus convention so `scripts/extract-figures.py` reads consistently.
Export each as a **full page**, not selected frames: the script clips regions as
fractions of the page rect, which is what lets a crop survive a re-export at a
different page size.

**Load-bearing:**

- `Capstone_Fermentor (Components).pdf` from the design file. Carries the most by
  far: the thumb, the cold open sequence, the four dashboard states, the batch
  detail with `SHOW ME`, and the atomic tiers behind section 9.
- `Capstone_Fermentor (UX Research).pdf` from the FigJam planning board, for
  section 4.

**If cheap:**

- `Capstone_Fermentor (Design System).pdf`, for the variables evidence.
- `Capstone_Fermentor (LoFi Wireframes).pdf`, for process.

**Also required:** the Figma prototype URL, and the file set to anyone with the
link. The Outcome section does not ship without it.

Nothing in this spec is blocked on the two optional exports. Sections 1 to 7 and
9 to 11 can be written from the source of truth alone; sections 4, 8 and the
thumb are blocked on the two load-bearing ones.

---

## Guardrails applied

Each of these is a rule from `CLAUDE.md` with the concrete decision it forces.

**Attribution (guardrail 4).** Leith Gow is named where the work was genuinely
shared, which is the research phase. Pattern, Contrast and Harmony are his design
principles and do not appear at all, despite sitting in the Milestone IV deck
that carries both their work. His AI prototyping story is not borrowed. The
Milestone IV deck is headed "CAPSTONE GROUP 2" and nothing in it is Leonid's by
default.

**Claim only what ships (guardrail 1).** The prototype is claimed as clickable
because it is, and linked so the reader can check. The colour system is claimed
as variables on Leonid's confirmation, which is the same correction the Rollhaus
"modes" claim needed.

**Honest limitation once (guardrail 5).** Three limitations, each in exactly one
place: the proto persona in section 5, the taxonomy provenance in section 6, no
usability testing in section 10. None is restated. Three on one page is the
ceiling before tone tell #10 fires, so no fourth gets added and none gets echoed
in the Learnings.

**Tone (guardrail 5).** The Presentation Story in §5c of the source is the
richest writing in the project and is unusable: the source itself flags em-dashes
throughout and manufactured closers, with tells #2, #5 and #6 all firing. Its
**beats** are the spine of section 7. Not one of its sentences ships.

**The six style-guide hex values stay out**, settled twice over. The source flags
them unverified, read off a screenshot with inconsistent label-to-swatch mapping.
And `token-discipline.test.ts` rule 4 bans a colour literal in application code
including comments, and the copy guards walk `src/content/**`, so they would fail
the build even if verified. Section 9 describes the four level feedback stack by
role, never by value.

**No em-dashes**, and a tone pass against `_project/tone_of_voice.md` after
drafting, per guardrail 5.

---

## Verification

The work is done when, from a clean state:

- `npm run build` passes with the new route at `out/work/fermentor/index.html`.
- Typecheck is clean and the existing suites stay green: 61 unit, 98 export, 0
  skipped as of 2026-08-01.
- `token-discipline.test.ts` passes over the new content and figure files.
- The prototype link is followed to confirm it resolves, not just that the markup
  is right. This is the CV guard lesson from 2026-07-31: a link fails invisibly
  while the markup stays perfect.
- A browser pass over `/work/fermentor` in both themes, confirming the new embed
  follows the theme the way the two existing ones do.

---

## Out of scope

- The remaining inventory projects. Breadth is a separate pass and a separate
  spec.
- The `/work` listing route. Still v2, and a list of four is closer to earning
  one than a list of one was.
- Any change to the Router, tiers or lens sorting. `tier` rides on the record and
  nothing sorts by it yet, which stays true.
