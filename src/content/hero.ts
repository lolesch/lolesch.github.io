// Rewritten 2026-08-04, superseding the 2026-07-30 approval. The decision and
// the seven rejected drafts behind it are in `_build-log.md`; the short version
// is that every draft in the old shape stated a proposition and then claimed it
// ("X is Y. I do Z"), which is essay structure and reads as constructed. Nothing
// in Leonid's own writing does that. So the headline is a point of view about
// the work and the body is where it came from, which also stops the two
// repeating each other.
//
// Do not reword either without a new decision recorded in `_build-log.md`.
export const hero = {
  // Added 2026-08-05 with the hero composition. The headline is a point of view
  // and deliberately says nothing about who holds it, which works in the middle
  // of a page and not at the top of one: a first-time reader arrived at a
  // sentence with no name, no discipline and no city attached. This is the same
  // job layout.tsx's `description` does for a search result, and it is answered
  // the same way.
  //
  // Tracks the first clause of /about's intro exactly, which is a coupling the
  // eyebrow's own comment has documented since 2026-08-05: both have to move
  // together for that claim to keep being true. Was "Design Engineer" until
  // 2026-08-08, when it split from the title tag and gave the eyebrow the
  // design half on its own, on the theory that the headline and body below
  // already carried the engineering half. An external review caught that this
  // repo carried four different self-descriptions across four surfaces, which
  // traced back to CONTEXT.md itself never picking between "Design Engineer"
  // and "UX Engineer" for the hybrid track. Resolved to "UX Engineer"
  // everywhere, matching the CV and job-search's decision log. See
  // docs/superpowers/specs/2026-08-08-feedback-response-pass-design.md Part 3.
  eyebrow: 'UX Engineer · Berlin',
  headline: 'The hard part happens before anyone starts building.',
  body: [
    // Three plain sentences, no subordinate clause. "what nobody had decided
    // yet" states a condition rather than naming a culprit: the earlier draft
    // put the failure on former teams, which a hiring manager reads as a
    // candidate blaming his colleagues. About already carries the braver
    // version, where Leonid owns the same failure himself.
    //
    // "More than five years" tracks `cv/work_history.md` and the About intro.
    // It is a fact about a duration, so it moves only when that does.
    //
    // Rewritten 2026-08-08 (Part 4 of the spec above). The review's own
    // suggested fix opened with a proposition-then-claim shape ("I design the
    // system and I build it...") this rewrite was specifically written to
    // escape, so it wasn't usable as written, but the underlying complaint was
    // fair: the old wording narrated five years of engineering as a closed
    // chapter, right where a Track C reader needs it to read as a live skill.
    // "I haven't stopped building" lands a present-tense claim the old sentence
    // never made. "In the implementation" replaces "in the code": the old
    // phrasing devalued code twice in one paragraph, contradicting the sentence
    // in front of it. "Learned to do that part too" replaces "went and learned
    // to do that part": "too" signals addition where "went and learned" read as
    // a departure. Deliberately not reusing About's "I still write the code"
    // verbatim, so Home and About don't carry an identical sentence, which is
    // the kind of repetition the "one job" guard above exists to catch
    // elsewhere on this page.
    //
    // Note 2026-08-11: About's "I still write the code" was cut in that file's
    // own rewrite the same day, so there is no live duplicate left to avoid.
    // Left as history rather than deleted; the constraint could recur if
    // About's intro changes again.
    "Five years of building features taught me that, and I haven't stopped building. The expensive problems were rarely in the implementation. They were in what nobody had decided yet, so I learned to do that part too.",
  ],
  // Two CTAs lived here from 2026-08-05 to 2026-08-11: "See the work" anchored
  // to the grid three lines below it, and a CV link. Removed once ProjectGrid
  // was confirmed to render immediately under this section: the anchor scrolled
  // to content already in view, so it repeated the page rather than acting on
  // it. The CV link moved into SiteFooter the same day (see the 2026-08-11 nav
  // entry in _build-log.md), reachable from every route instead of only Home,
  // so Home does not need to carry it a second time.
} as const;
