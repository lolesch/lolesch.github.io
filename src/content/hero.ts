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
} as const;
