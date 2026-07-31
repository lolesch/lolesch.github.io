# Handoff: 2026-07-31, end of the review-triage and design-system-design session

Date: 2026-07-31
Status: **open.** Written so a cold session can take over without reading the
transcript.

---

## Where things stand

The site is live at `https://lolesch.github.io`, deployed from
`.github/workflows/deploy.yml` on every push to `main`.

- **Shipped routes:** `/`, `/work/rollhaus/`, `/work/glyphshero/`,
  `/work/how-to-god/`, `/about/`.
- **Missing from the locked v1 scope:** `/design-system/`. That is the whole
  gap. PRD issue #1 line 57 specifies four routes and the nav shows two links
  plus the logo.
- **Repo:** `main`, clean, pushed at `f60c61c`.
- **Guards:** 38 unit, 77 export plus 2 deliberately skipped, typecheck clean.
  The 2 skips are the CV export guards in `tests/export/about.test.ts`, which
  gate on `about.cv` being non-null. They start running the moment task 1 below
  is done, which is the point of them.

---

## Do these two things, in this order

### 1. Wire the CV link. Small, and it is the highest-value item on the site.

Follow **Task 6 of `docs/plans/2026-07-31-about-route.md`**, which is written
step by step and was gated until today. Every precondition is now cleared:

- The domain is settled: `https://lolesch.github.io`.
- The re-exported PDF exists and was verified today at
  `../job-search/cv/CV Track C - UX Engineer.pdf`: 2 pages, A4 595x842,
  selectable text on both, all five footer links live, portfolio link correct,
  no figma.com link anywhere in it.

An outside review of the live site on 2026-07-31 named the missing CV its top
finding: a hiring manager who likes the site has no way to reach the document
that shortlists him. The plan's steps include watching the new guard fail on
purpose. Do not skip that; it is the only assertion separating a working
download from a link to a 404.

**One CV, Track C.** Offering both tracks side by side was already rejected in
the plan: it asks the visitor to classify themselves, which is the v2 Router's
job.

### 2. Turn the design-system spec into an implementation plan.

**Invoke `superpowers:writing-plans` against
`docs/superpowers/specs/2026-07-31-design-system-route-design.md`.**

That spec is **approved by Leonid** and is the terminal output of a completed
brainstorming pass. Do not re-brainstorm it and do not re-open its decisions.
It carries the architecture, the file list, the page structure, the full test
plan, and the rejected alternatives with reasons.

The one idea in it worth not losing in translation: the page needs **no
`token-discipline.test.ts` exemption**, because Primitive and Brand do not vary
by theme and so render correctly from build-time resolved hex, while Semantic
renders through the same Tailwind utilities every component uses. Hit the theme
toggle and only the Semantic row moves. If an implementation finds itself adding
an exemption, it has taken a wrong turn.

---

## Decisions taken 2026-07-31. Do not re-litigate these.

1. **Domain: `lolesch.github.io`**, paid domain later if at all. Re-confirms
   `portfolio_site_spec.md` §13 from 2026-07-29. Accepted cost, stated: buying a
   domain later means re-exporting both CVs a second time.
2. **The Sorcerers Lab CV title stays "Systems Designer & Developer"**, even
   though `work_history.md:81-82` ground truth says "Software Engineer & Systems
   Designer". Reason is layout overflow. Raised as an accuracy defect and
   overruled knowingly. It has cost three passes. Do not raise it a fourth time.
3. **`/design-system` scope: tokens plus the rules that enforce them.** No
   component gallery.
4. **The page says nothing about Figma.** The ADR-0002 sync is deferred, and
   guardrail 1 says claim only what ships.
5. **Data source: parse the generated CSS**, not a Style Dictionary manifest and
   not the DTCG JSON. Both alternatives are rejected in the spec with reasons.
6. **The restraint line ships** ("This system covers what the site renders and
   stops there..."). It is not a hedge; see the note below.
7. **The code to Figma Variables sync (ADR-0002, Seam 3) is deferred.**

---

## Things that have misled previous agents. Read this part.

**`../job-search/_project/tasks.md` was stale for weeks and caused real damage.**
It told two separate reviews that the hero line was unresolved and that GitHub
Pages had never been enabled, both of which had been closed days earlier. It
also carried a domain contradiction against its own §13 answer, and it held an
accuracy flag that failed to travel with the CV export it was supposed to gate.

It is now synced and opens with a note explaining why. **If you close something
that lives there, write it back.** That file is read by both this repo and the
`job-search` project, and no amount of process substitutes for the write-back.

**The hero line is settled.** `hero.ts` records it, `_build-log.md:40-51` carries
the full adjudication with two rejections. Any document implying otherwise is
stale.

**Do not cut more honest limitations.** The 2026-07-31 review flagged that three
case studies each close on one. One was cut, How to God's, and only because it
stated the same limitation twice on one page, which guardrail 5 already banned.
The other two stay. The three sentences describe genuinely different situations:
Rollhaus was tested by 18 Maze participants and carries real usability numbers,
How to God shipped and reached Early Access, and only GlyphsHero is truly
unvalidated. The aggregate pattern is largely an artifact of three similar
sentence shapes. **It is a ratio problem, and ratios are fixed by adding
projects that reached users, not by deleting true sentences.**

**The restraint line on `/design-system` is not a fourth hedge.** The three above
are all "this was not validated by use". That one is "the system covers what the
site renders and stops there", which belongs to the `CONTEXT.md:72` no-padding
rule, not to the hedge family.

---

## Open, roughly by value

- **The lens filter.** Games/XR, UX/UI and AI Workflow are tangled on one page,
  so a Track A reader gets diluted signal. Called out by the review, already
  recorded as accepted risk, and it is the v2 Router's job. Nothing about the
  review moves it forward.
- **Rollhaus polish.** Leonid, 2026-07-31: "there are several things i dislike"
  about the page, unspecified, and he chose to defer. GitHub issue #2 tracks
  three known items: a clean editor export, an exploded hero, a prototype link.
- **The side-panel caption.** `public/figures/rollhaus-panel-before.jpg` is
  captioned as one of two panel structures rather than as a test artefact,
  because nothing proves it is the exact screen the 18 Maze participants
  clicked. The question is recorded beside the crop in `scripts/extract-figures.py`.
  Needs Leonid to confirm against the Maze build.
- **The root `../job-search/CV.pdf`.** Looks obsolete (1 page, "Unity Software
  Engineer", 2026-06-09, still Figma-linked) and Leonid asked for outdated CVs
  to be deleted, but `job_search_project.md:107` lists it as the reference for
  **Track A**, which is unbuilt. Held back deliberately. Needs one word.
- **Layout.** Leonid, 2026-07-31: the current visual design is a starting point
  and may change to be more pleasing. Not scoped, not started. Note that the
  no-padding rule is a content rule and a layout change does not touch it, but
  a layout that puts pages side by side makes their unequal lengths visible, and
  at that point short pages have to look deliberate rather than unfinished.
- **More projects.** Leonid intends to add tiles. The inventory has 18. Adding
  ones that reached real users is also the structural fix for the hedge ratio
  above: Beholder 3 shipped commercially, Sorcerers Lab shipped a roguelite in
  about five months, Grimbart shipped.
- **`job-search` side, unchanged:** the Project 2 attribution questions still
  block the fitness-tracker tile, and the metalwork systems-origin sentence is
  written but the Phase 3 photos are not shot.

---

## What this session changed

1. **Triaged an outside review of the live site.** Three of four findings held.
   The missing CV was real but blocked on a decision rather than on code. The
   hero-line finding was stale for the second time. Full record in
   `_build-log.md` under the 2026-07-31 review entry.
2. **Cut the duplicate hedge on How to God** (`0725a61`).
3. **Settled the domain** and unblocked the CV re-export.
4. **Synced `tasks.md`** to shipped reality and gave it a header explaining the
   write-back rule.
5. **Merged the re-exported CVs.** Leonid exported one PDF per page because the
   combined export put both frames on one page. Merged with `pymupdf`, verified
   before overwriting, and the per-page files were deleted. Both kits are ready
   to send.
6. **Designed `/design-system`** and committed the spec (`f60c61c`).
