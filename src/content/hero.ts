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
  // Tracks the first clause of /about's intro exactly. "Design Engineer" is the
  // title tag and the Track C claim; the eyebrow carries the design half because
  // the headline and the body below it already carry the engineering half, and a
  // hero that said engineer twice would leave the UX/UI half of the arc to a
  // page most readers never open.
  eyebrow: 'UX/UI Designer · Berlin',
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
    'More than five years of building features taught me that. The expensive problems were rarely in the code. They were in what nobody had decided yet, so I went and learned to do that part.',
  ],
  // Two CTAs lived here from 2026-08-05 to 2026-08-11: "See the work" anchored
  // to the grid three lines below it, and a CV link. Removed once ProjectGrid
  // was confirmed to render immediately under this section: the anchor scrolled
  // to content already in view, so it repeated the page rather than acting on
  // it. The CV link moved into SiteFooter the same day (see the 2026-08-11 nav
  // entry in _build-log.md), reachable from every route instead of only Home,
  // so Home does not need to carry it a second time.
} as const;
