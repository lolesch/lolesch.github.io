# GlyphsHero leads with evidence, not description

*Design, 2026-08-07. Brainstormed with Leonid in session. Sources: the game repo
at `C:\Users\loles\Desktop\LEONID\AutoBattler` (`CLAUDE.md`, `Docs/agents/design-gate.md`,
`Docs/agents/night-shift.md`, `Docs/adr/0001` through `0009`, `git log`, `git branch -a`),
plus `C:\Users\loles\Claude\Projects\job-search\portfolio\projects\glyphshero\assets\TestRunner.png`,
a real capture Leonid provided in session.*

---

## What this is answering

GlyphsHero is the thinnest of the four case studies and the odd one out: Rollhaus
and FerMentor are Figma-sourced course projects with a full asset pipeline behind
them, and GlyphsHero is a live, ongoing solo repo with none of that. The page
currently runs five sections (Context, one embedded data table, two prose
sections, Outcome) and describes its own differentiator, the AI-collaboration
workflow, only in the abstract: "a grilling session," "focused task sessions,"
with nothing a reader can point at.

Investigating what the repo actually holds turned up more than expected:

- **No gameplay screenshots exist.** The game only runs from the Unity Editor
  and nobody has captured one.
- **The placeholder art is not Leonid's to publish.** The README names Backpack
  Battles as a direct inventory-management reference, and the item art in
  `Assets/Art` is `bpb_`-prefixed (`bpb_Banana.png`, `bpb_Dagger.png`,
  `bpb_Blueberries.png`). The two existing concept sketches
  (`ItemChaining-0/1.png`) use the same art, which rules them out too, confirmed
  with Leonid: the hex grid art is also placeholder.
- **The real differentiator is undocumented on the page.** `Docs/agents/design-gate.md`
  and `Docs/agents/night-shift.md` describe a genuine, working system: a one-way
  / two-way-door test for which gaps stop the work, a slice-end ledger, and an
  actual unattended night runner working a GitHub Issues queue on a quarantined
  branch. None of it is visible on the site.
- **One claim is misattributed, one is irrelevant.** `PRODUCT.md` says
  GlyphsHero is "public at `lolesch.itch.io`." The itch.io account is real,
  Leonid confirmed, it just holds four unrelated game jam projects, not this
  one: the claim was pointing at the wrong project, not fabricated. Separately,
  the copy opens two sentences with a commit count ("75 commits so far"), which
  Leonid does not consider a meaningful signal for a project still in prototype
  phase, count aside.
- **The thumb carries a generator watermark**, a faint text strip along the
  bottom of the 340x340 source, visible in the live tile.

**Decision: build the visual pass from the workflow evidence rather than from
game art.** GlyphsHero's lenses are AI Workflow and Systems & Architecture, not
UX/UI, so this is not a downgrade of ambition, it is the pass that actually fits
the project. Concept art or screenshots stay out entirely rather than being used
with a footnoted disclaimer, because a disclaimer on borrowed art the reader
cannot easily verify is a worse position than not showing it.

---

## Part 1: Fixes, independent of everything else

| What | From | To |
|---|---|---|
| `PRODUCT.md` project record | "Public at `lolesch.itch.io` and `github.com/lolesch`." | "Public at `github.com/lolesch/GlyphsHero`." |
| `whatChanged` | "75 commits so far. The work moved upstream, into defining a goal precisely enough that it can be delegated." | "The work moved upstream, into defining a goal precisely enough that it can be delegated." |
| Outcome opening line | "Seventy-five commits in, the thing that actually moved is where my time goes." | "The thing that actually moved is where my time goes." |
| Thumb | 340x340, watermark strip visible along the bottom | 340x318, cropped `[0, 0, 340, 318]`, watermark gone |

**The itch.io fix is a misattribution, not a retraction.** `lolesch.itch.io` is
a real, live page; it just hosts four game jam projects that have nothing to do
with GlyphsHero or this site. The correction is scoped to GlyphsHero's own
record, not a claim that the itch.io account itself is fake.

**The commit count is cut, not corrected.** Leonid's call: a raw commit count
is not a signal he wants attached to a project he considers still in prototype
phase, independent of whether the number is accurate. Both sentences read
cleanly without the numeric opener, so nothing is lost by dropping it rather
than swapping in 168.

**The thumb's softness is not fixed.** `G.png` in the game repo is the same
340x340 file already live, at native resolution: there is no sharper source to
crop from. This pass removes the watermark and stops there. The known gap
`PRODUCT.md` already records stays recorded.

**GlyphsHero joins the tracked-figure pipeline for the first time.** Today the
live thumb has no entry in `scripts/extract-figures.py` at all, unlike every
other figure on the site: it was hand-copied in before the pipeline had a
`glyphshero` project folder. This pass gives it one, the same provenance
discipline Rollhaus and FerMentor already have.

---

## Part 2: no Constraints callout, and that is deliberate

GlyphsHero is the only one of the four projects with no `constraints` section,
and the first draft of this spec added one to match Rollhaus and FerMentor.
**Rejected on a second look, on Leonid's instinct not to fill a gap that
shouldn't exist in the first place.**

The reason it does not survive: for Rollhaus and FerMentor, Duration and Team
are facts the reading `<dl>` at the top of the page does not otherwise carry
("Course project, pair", "5 weeks, SPICED capstone"). For GlyphsHero, that
`<dl>` already reads *"2023-present · Solo, active · Direction, architecture,
review,"* so a Constraints table's Duration and Team rows would just restate it
in a second format. Only Platform and Tools would be new information, and a
two-row table looks like an unfinished four-row one rather than a deliberate
choice. CONTEXT.md's own rule is that a section exists only if it has
substance; this one would not have carried any that the page doesn't already
show.

---

## Part 3: the new section order

| # | Section | Kind | Change |
|---|---|---|---|
| 1 | Context | `prose` | unchanged |
| 2 | How an attack is built | `embed` | unchanged |
| 3 | Why the axes are separate | `prose` | unchanged |
| 4 | How it gets built | `prose` | **trimmed 5 paragraphs to 3, gains a link out to the repo** |
| 5 | The design gate | `embed` | **new** |
| 6 | Two shifts, one backlog | `embed` | **new** |
| 7 | The suite, green | `figure` | **new**, the one real screenshot |
| 8 | Outcome | `prose` | commit count removed |

Five sections become eight. No Constraints callout (Part 2). The growth is
functionally identical to what happened to Rollhaus: prose paragraph count
barely moves (two paragraphs in section 4 fold into one), and what's added is
evidence for a claim the page was already making, not a new claim.

**Why the evidence sits after "How it gets built" rather than replacing it.**
The prose still has to carry the parts a diagram can't: that the thinking has to
be Leonid's first, that a model is asked to find gaps rather than asked whether
the work is good, that he keeps direction and code review. The three new
sections are what "grilling session" and "focused task sessions" cash out to
when a reader asks "show me." Same relationship the existing embed already has
to "Why the axes are separate": artifact first or artifact after, whichever
reads better, and here the prose has to run first because the artifacts don't
make sense without the docs-first framing.

**No `progression` or `prototype` kind.** Both exist for a Figma-sourced
UI walkthrough or an embeddable prototype, neither of which this project has.
`embed` (data-driven, on tokens, no image file) is the correct kind for two of
the three new sections, `figure` for the one real screenshot.

---

## Part 4: "How it gets built," trimmed

Current (5 paragraphs). New (3 paragraphs, one gains a link):

1. Unchanged: *"I write the design docs and the first architecture myself. No
   AI, or AI only for inspiration. The thinking has to be mine or there is
   nothing to delegate."*
2. Merges the old paragraphs 2 and 3, and points forward instead of describing:
   *"Then I hand those documents back to a model and ask it to find the gaps
   and the contradictions, a different request from asking whether they are
   good, and a grilling session keeps pushing until the plan has no soft spots
   left. What that produces is the fixed test below for which gaps are cheap to
   fill on the spot and which ones stop the work."*
3. Merges the old paragraphs 4 and 5, drops the CLAUDE.md/Obsidian sentence
   (already carried by `whatIDid` in the `<dl>` above the sections, so it was
   already being said twice on one page), and adds the link:
   *"From there it runs focused task sessions under red-green testing, during
   the day with me at the keyboard and overnight without me, on the rhythm
   below. I keep direction, decisions and code review. The repo is public,
   CLAUDE.md, ADRs and all."*
   `link: { label: 'View the repo on GitHub', href: 'https://github.com/lolesch/GlyphsHero' }`

---

## Part 5: the two new `embed` figures

Same technique as the existing `glyphshero-chain` and `rollhaus-slots` figures:
real content, typed as data, rendered on Semantic tokens by a small component.
No image file, no Figma dependency, sourced from docs that exist in the repo
today.

### 5a. The design gate

Source: `Docs/agents/design-gate.md`.

- Section `heading`: **"The design gate"**
- Section `caption`: *"The rule that decides when a gap gets filled on the spot
  and when it stops the work. Not every undefined edge is a fork: the test is
  whether undoing it three slices later would be cheap."*

Content:

| Door | Trigger | What happens |
|---|---|---|
| Two-way | Cheap to reverse: a tuning value, an ordering tiebreak, a default | Decide it, but log it in the slice-end ledger for veto |
| One-way | Expensive to unwind once code depends on it, or it contradicts an accepted decision, or it defines a previously undefined rule | Stop. Surface it as `needs-design`. Do not settle it silently |

Then the slice-end ledger, the fixed block every implementation session ends
with, whether or not a fork came up:

- **Assumptions made**: two-way doors decided, open for review or veto
- **Decisions I took**: anything that leaned on judgement, with the door-test
  result
- **Gaps left open**: one-way doors not filled, each a `needs-design` candidate

Footnote, the real example (from `night-shift.md`'s own counter-example and
`design-gate.md`'s lived example, both citing the same ADR): *"The real fork
this caught: a change that looked like a small pool tweak to how a payload's
propagation cost worked turned out to hide an undecided rule, and became
ADR-0006 instead of a silent call made mid-implementation."*

### 5b. Two shifts, one backlog

Source: `Docs/agents/night-shift.md`, confirmed against real branches
(`night-base`, `night/2026-07-01`, `night/2026-07-02` all exist via
`git branch -a`).

- Section `heading`: **"Two shifts, one backlog"**
- Section `caption`: *"Day shift decides what's safe to hand off. Night shift,
  an unattended Claude session working a GitHub Issues queue, only ever touches
  what's been cleared."*

Content:

| Shift | Where | Role |
|---|---|---|
| Day shift | Interactive, on `main` | Has priority and authority. Curates the backlog and decides what the night runner is allowed to touch. |
| Night shift | Unattended, on `night-base` | Only ever pulls an issue labeled `ready-for-agent`. Work lands on a `night/<date>` branch, never on `main`. |

Then the park-don't-guess protocol, what happens when the runner hits an
undecided fork mid-task:

1. Commit only the already-decided safe part
2. Open a `needs-design` issue capturing the fork
3. Strip `ready-for-agent` from the original issue
4. Move to the next eligible issue

Footnote: *"Nothing reaches `main` on its own. A human reads the morning
summary, runs the Unity Test Runner (the one step the agent cannot do), and
merges only what survives review."*

### Data shape (for the implementation plan to type exactly)

```ts
// glyphshero-design-gate.ts
{
  title: string; standfirst: string;
  doors: readonly { kind: string; trigger: string; result: string }[];
  ledgerLabel: string;
  ledger: readonly { line: string; detail: string }[];
  footnote: string;
}

// glyphshero-night-shift.ts
{
  title: string; standfirst: string;
  shifts: readonly { name: string; where: string; role: string }[];
  protocolLabel: string;
  protocol: readonly string[];
  footnote: string;
}
```

`FigureId` gains `'glyphshero-design-gate'` and `'glyphshero-night-shift'`,
four ids total.

---

## Part 6: the one real figure

- Section `heading`: **"The suite, green"**
- `caption`: *"213 EditMode tests, split along the same module boundaries the
  code is: Combat, Inventory, Pawns, Statistics, UI, Utility. The one step the
  agent cannot do itself, since the Unity Test Runner only runs inside the
  Editor. A human runs this before anything merges."*
- `src`: `/figures/glyphshero-test-runner.png`
- `alt`: *"The Unity Test Runner window, EditMode tab, showing 213 of 213 tests
  passing with zero failures. The suite is grouped by module: Combat 51 tests,
  Inventory 47, Pawns 10, Statistics 24, UI 77, and Utility 4, every group and
  test marked with a green checkmark."*
- `width` / `height`: 986 / 749, native resolution of the capture, no upscale

Source: `job-search/portfolio/projects/glyphshero/assets/TestRunner.png`,
Leonid's own capture, provided in session 2026-08-07. `png` mode always
destructures a `crop`, so this ships with the full-bounds no-op crop
`[0, 0, 986, 749]`, at native size.

**Why this is the only real screenshot and it is enough.** It is Leonid's own
code and Leonid's own test names, zero borrowed art in frame, and it is direct
evidence for a claim the page already makes (red-green testing) rather than a
new claim invented to have something to show.

---

## Part 7: `extract-figures.py`

New `glyphshero` project entries. Sources live in
`job-search/portfolio/projects/glyphshero/assets/`, matching the per-project
convention `find_source` already expects.

| Output | Source | How | Why |
|---|---|---|---|
| `public/figures/glyphshero-runes.png` | `glyphshero-runes.png` (to be copied from the game repo's `Assets/Art/G.png`, the same file already live) | png, crop `[0, 0, 340, 318]`, width 340 | Removes a generator watermark strip along the bottom edge. The 340x340 source's known softness (`PRODUCT.md`'s recorded gap) is untouched; this pass does not claim to fix it. |
| `public/figures/glyphshero-test-runner.png` | `TestRunner.png` | png, crop `[0, 0, 986, 749]` (full bounds, no-op), width 986 | Leonid's own capture. 213 green EditMode tests, evidencing the red-green claim already in `whatIDid`. |

**Task 0, before either entry can be written:** copy
`C:\Users\loles\Desktop\LEONID\AutoBattler\Assets\Art\G.png` to
`job-search/portfolio/projects/glyphshero/assets/glyphshero-runes.png`. The
thumb currently has no tracked source anywhere; this is what closes that gap.

---

## What this pass does not claim

- **No gameplay is shown.** Not a downgrade decided reluctantly: the game has
  no screenshots to show and the art it does have isn't Leonid's to publish.
  The page's own lenses, AI Workflow and Systems & Architecture, are what this
  pass leans into instead.
- **No coverage or quality metric beyond the one screenshot shows.** "213
  EditMode tests, zero failures" is what the capture proves. Nothing here
  claims a coverage percentage, mutation score, or CI pipeline; none of that
  is pictured and none is asserted.
- **The night-shift system is described as it exists in the docs, not as a
  track record.** No claim about how many issues the night runner has closed
  or how often it runs. `night/2026-07-01` and `night/2026-07-02` exist and are
  cited as evidence the branches are real, not as a tally.
- **Still no players, still no business numbers.** Unchanged from the current
  page.

---

## Guardrail check

- **1, claim only what ships.** Every new sentence traces to a file that exists
  today: two docs, nine ADRs (one cited by number), a real screenshot, a real
  git history. The itch.io correction points GlyphsHero's own claim at the
  right project rather than adding a new one, and the commit count comes out
  rather than being corrected, on Leonid's read that it is not a meaningful
  signal for a project he considers still prototype-phase.
- **2, the AI story belongs to this site.** GlyphsHero already carries the AI
  Workflow lens and already claims to use AI in its own build; this pass makes
  an existing claim concrete, it does not import the meta-narrative from
  anywhere it doesn't belong.
- **4, attribution.** GlyphsHero is solo throughout; nothing here touches a
  claim about anyone else's work.
- **5, tone.** No em-dashes. The two stated limitations (softness not fixed,
  no players) each land once. No new hedge is introduced.
- **6, log it.** This file, plus a `_build-log.md` entry covering the
  ItemChaining/placeholder-art rejection, since that's a reusable lesson
  ("check what's actually in frame before treating an asset as safe") worth
  keeping for the next project pass.
