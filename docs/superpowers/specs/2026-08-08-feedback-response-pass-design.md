# The feedback pass: what survives contact with the repo

*Design, 2026-08-08. Brainstormed with Leonid in session, from an external
portfolio review pasted into the conversation (not a file in either repo).
Every claim in it was checked against the live site, `src/content/**`,
`job-search/_project/decisions/0002-case-study-set.md`,
`job-search/portfolio/site_copy.md`, and
`job-search/_project/tone_of_voice.md` before being adopted or rejected.
Roughly half the review didn't survive that check.*

---

## What this is answering

An external review of `lolesch.github.io` raised seven numbered issues, a set
of concrete rewrite suggestions, and two flagged questions. Some of it was
right. Some of it was checking a stale build. One of its own suggested fixes
would have reintroduced an anti-pattern this site already paid to remove once.
This spec is the result of verifying each claim against the repo rather than
taking the review at face value, and records what's being acted on, what
isn't, and why.

---

## Part 1: already fixed, no action

**The reviewed About route (item 5)** — a two-item nav, no Design System
link, a single "Dark mode" label, no footer — does not match the live site.
Fetched `https://lolesch.github.io/about/` and `/` directly and diffed the
raw HTML: both carry the full three-item nav, the Light/Dark toggle pair, and
the complete footer contact block. No `#work` anchor exists anywhere in
`src/`. This was true at some point in the site's history and isn't now.
Nothing to do.

---

## Part 2: rejected, with reasoning

**Beholder 3 and HellClockBuilder as new tiles (item 1).** `site_copy.md` §5
has complete, tone-checked copy for Beholder 3 and would need Leonid to fill
in HellClockBuilder's still-open `[NEEDS INPUT]` Problem line. Both are
buildable. **Leonid's call: skip both.** He disagrees with the review's
framing that this is a gap needing an urgent fix; the four-tile v1 scope was
already a deliberate tracer-bullet decision (`_build-log.md`, 2026-07-30), not
an oversight, and both projects can wait for the v2 Router without cost.

**The "Test Radio Buttons" cut and "naming is ad hoc" (part of item 4).**
Checked where this text actually lives: it's inside the **alt text** of the
Rollhaus variables-panel screenshot (`src/content/projects.ts`, the
`rollhaus-variables` figure), describing a Figma collection that is really
named that in the file. It is not a self-deprecating sentence sitting in
prose. Cutting it would make the alt text *less* accurate, which directly
contradicts the thing the same review praised as a site strength ("every
image carries a description that describes the artifact, not the file").
Not actioned.

**Rollhaus proportion trim (item 7).** Real disparity: 13 sections against
How to God's 4 (5, after Part 5 below). But Rollhaus-first and
Rollhaus-deepest are the direct consequence of a locked decision
(`_build-log.md`, 2026-07-29: "Track C is the highest-weighted track and
Rollhaus is its strongest artifact"). Trimming it is a change to the site's
central argument, not a copy edit, and isn't part of this pass. Worth a
separate conversation if Leonid wants to reopen it later.

**CV single-column ATS variant (item 6).** Confirmed real: only one CV PDF
exists (`public/cv/leonid-schreiber-ux-engineer.pdf`), two-column, matching
the review's text-extraction complaint. This is a `job-search` repo
deliverable (CV production lives there per `CLAUDE.md`'s content-sources
rule), not this repo's. Out of scope here; flagged for that project.

**Moving How to God's `whatChanged` limitation to Outcome (item 4,
originally).** Superseded. The premise was wrong: How to God did have
testing (roughly twenty playtesters), it just wasn't in the case study yet.
The fix is Part 5 below, not a placement change.

---

## Part 3: one label, everywhere

Confirmed four different self-descriptions live in the repo right now:

| Surface | File | Current |
|---|---|---|
| `<title>` | `src/app/layout.tsx` | "Leonid Schreiber · Design Engineer" |
| Meta description | `src/app/layout.tsx` | "...UX/UI designer in Berlin..." |
| Hero eyebrow | `src/content/hero.ts` | "UX/UI Designer · Berlin" |
| About intro | `src/content/about.ts` | "I'm a UX/UI designer in Berlin..." |
| CV filename | `public/cv/` | `...-ux-engineer.pdf` |

This isn't only execution drift: `CONTEXT.md` itself names the hybrid track
"Design Engineer / UX Engineer" without picking one, so the ambiguity starts
upstream of the copy. **Leonid's call: UX Engineer**, matching the CV and
`job-search`'s own decision log ("C-primary (UX Engineer)").

Changes:

- `src/app/layout.tsx` — `title: 'Leonid Schreiber · UX Engineer'`
- `src/app/layout.tsx` — description: `'Portfolio of Leonid Schreiber, UX Engineer in Berlin. Case studies in UX, design systems and interaction, plus the design system this site runs on.'`
- `src/content/hero.ts` — `eyebrow: 'UX Engineer · Berlin'`
- `src/content/about.ts` — intro: `"I'm a UX Engineer in Berlin, and I still write the code. Five years as a Unity developer before this, and a metalworker's apprenticeship before that."`

The hero eyebrow's own comment already documents that it "tracks the first
clause of /about's intro exactly," so both have to move together for the
file to keep being true — this isn't a new coupling, it's honoring one that's
already there. The inline comments explaining the old "Design Engineer is the
title tag, UX/UI Designer is the eyebrow" split need updating to record this
decision and why it reverses the earlier one.

`Lens` tags ("UX/UI" as a project category) are a different taxonomy and are
untouched — this is only the personal title label, not the content lenses.

---

## Part 4: hero body, headline unchanged

The review's own suggested replacement — *"I design the system and I build
it. Five years shipping games..."* — opens with the exact proposition-then-
claim shape (state it, then substantiate it) that the 2026-08-04 hero rewrite
was specifically written to escape, after seven earlier drafts were rejected
for reading "constructed" (`hero.ts`'s own header comment, `_build-log.md`).
That fix isn't usable as written, even though the underlying complaint is
fair: "the expensive problems were rarely in the code... I went and learned
to do that part" narrates five years of engineering as a closed chapter, at
the exact moment a Track C reader needs it to read as a live skill.

**Decision: keep the headline, rewrite only the body.** "The hard part
happens before anyone starts building" doesn't rank code below decisions, it
sequences them — that's compatible with Track C. The fix belongs in the body,
which currently narrates the five years in the past tense with no present-day
claim attached.

Current:
> "More than five years of building features taught me that. The expensive
> problems were rarely in the code. They were in what nobody had decided
> yet, so I went and learned to do that part."

New (draft, open to editing before implementation):
> "Five years of building features taught me that, and I haven't stopped
> building. The expensive problems were rarely in the implementation. They
> were in what nobody had decided yet, so I learned to do that part too."

What moved and why: "I haven't stopped building" lands the present-tense
claim right after the five-year fact, instead of letting the sentence end
without one. "In the implementation" replaces "in the code" in the second
sentence — the original phrasing devalues code twice in one paragraph, which
now directly contradicts the sentence in front of it. "So I learned to do
that part too" replaces "so I went and learned to do that part" — "too"
signals addition, "went and learned" reads as a departure. Deliberately not
reusing About's exact "I still write the code" phrasing (Part 3): the two
pages would otherwise carry an identical sentence, which is the kind of
repetition `_build-log.md` and the export tests already treat as a defect
elsewhere on Home (the "one job" phrase guard).

Still three plain sentences, no subordinate clauses, matching the shape the
2026-08-04 decision settled on. No em-dash. No use of "one job."

---

## Part 5: How to God gets its missing evidence

The review's caveat-inventory claimed How to God ends on an unaddressed gap
the way the other three do. Checked against Leonid directly: the premise is
wrong. Thoughtfish ran roughly twenty playtesters during his time there; he
wasn't running the sessions, but the findings drove real changes to quest
lines, game feel, and visuals. None of that is in the case study — the page
currently only says "playtested and merged to main" in the summary `dl` and
nothing further. This is a missing-content problem, not a placement problem,
and fixing it also partly answers item 7's proportion complaint: How to God
goes from 4 sections to 5, with real material instead of a placeholder
clause.

New section, inserted between "Grabbing" and "Outcome" in
`src/content/projects.ts`'s `how-to-god` project:

```ts
{
  kind: 'prose',
  heading: 'What testing changed',
  body: [
    "Roughly twenty playtesters came through during my time on the " +
    "project. I wasn't running those sessions myself, but the findings " +
    "came back to the team and changed real things: quest lines were " +
    "rewritten where feedback showed people getting stuck or missing the " +
    "point, and both game feel and visuals were adjusted wherever players " +
    "expected an interaction to work that we hadn't built, or expected " +
    "nothing where we had.",
  ],
},
```

(Written above as a concatenation only to show the line; the implementation
plan should write it as one plain double-quoted string, matching the file's
existing convention for copy carrying an apostrophe.)

Checked against `tests/unit/content.test.ts`'s guards: no em-dash, doesn't
restate `problem`/`whatIDid`/`whatChanged` verbatim, non-empty body. The
existing `whatChanged` line ("The interaction layer was playtested and
merged to main. I left a year before Early Access, so I can't tell you what
survived.") stays as written — it's a provenance statement, not the testing
gap the review flagged, and doesn't need to move.

---

## Part 6: test updates required

`tests/export/static-export.test.ts`, the hero-body assertion (lines 44-46),
hardcodes strings that Part 4 changes:

```ts
expect(paragraphs[0]).toContain('UX/UI Designer');
expect(paragraphs[1]).toContain('The expensive problems were rarely in the code.');
expect(paragraphs[1]).toContain('so I went and learned to do that part');
```

These need to become the new eyebrow and body strings. No other test file
hardcodes the title tag, meta description, About's intro (asserted by
reference to `about.intro`, so it moves automatically), or any FerMentor/How
to God copy — confirmed by search before writing this spec, not assumed.

---

## Part 7: FerMentor, one sentence shorter

**Leonid's call: cut, don't relocate.** The review's original suggestion was
to move the no-testing line into Outcome; Leonid's reasoning is sharper than
that — omitting it reads better than disclosing it, provided nothing else on
the page implies testing happened. Checked: nothing does. `whatIDid` and the
"Who it is for" section already scope the research honestly (proto persona,
desk research, three interviews) without claiming usability testing on the
product itself, so removing the sentence doesn't create a false impression.

`src/content/projects.ts`, `fermentor.whatChanged`:

Current:
> "A clickable full flow, built on a model that answers what this should
> look like right now instead of listing steps. No usability testing: the
> capstone ran out of time."

New:
> "A clickable full flow, built on a model that answers what this should
> look like right now instead of listing steps."

The code comment above `whatChanged` (currently explaining the tell-#10
reasoning for stating the limitation once, in the `dl`) needs to be replaced
with the reasoning above: cutting it rather than relocating it, and why that
doesn't misrepresent anything else on the page.

---

## Verification plan

- `npm run typecheck` clean.
- `npm run build` (regenerates `out/`, which the export tests read from
  rather than the content modules directly).
- `npm test` — unit and export suites, including the two updated
  `static-export.test.ts` assertions and `content.test.ts`'s guards against
  the new How to God section.
- Checked in a browser against the built export: Home's hero renders the new
  eyebrow and body, `<title>` and the meta description read "UX Engineer" in
  view-source, About's intro reads "UX Engineer," FerMentor's summary block
  no longer carries the cut sentence, How to God's section rail shows five
  entries with "What testing changed" between Grabbing and Outcome.

---

## Guardrail check

- **1, claim only what ships.** The How to God addition states a real fact
  Leonid confirmed this session (roughly twenty playtesters, not run by him);
  nothing invented. The label change claims a title already true of him
  (matches the CV). No new metric, testimonial, or claim beyond what's
  sourced.
- **2, the AI story stays on this site.** Untouched by every change here.
- **4, attribution.** Not implicated; no team-work claims change.
- **5, tone.** No em-dashes in any new copy. The hero rewrite specifically
  avoids reintroducing the setup-and-reveal and manufactured-closer patterns
  the review's own suggested fix would have brought back. FerMentor's cut is
  the tell-#10 "honesty dosage" rule applied one level further than the
  2026-08-06 decision took it: not just stated once, but only stated where
  its absence would otherwise mislead.
- **6, log it.** This file, plus a `_build-log.md` entry once implemented,
  covering what was verified stale, what was adopted, and what was rejected
  and why — the review disagreements are worth keeping on the record as much
  as the agreements are.

---

## What this pass does not do

- No new tiles (Beholder 3, HellClockBuilder deferred to v2, Leonid's call).
- No Rollhaus trim.
- No CV rebuild (out of this repo).
- No reordering of the project grid.
- No further hero changes beyond the body; the headline stands.
