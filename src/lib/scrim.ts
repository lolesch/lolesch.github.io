/*
 * The gradient that carries a project title over its thumbnail, and the one
 * number the whole arrangement rests on.
 *
 * It lives here rather than inline in the component because two things need the
 * same number and they must not be able to disagree about it: the component
 * that paints the scrim, and the guard in tests/unit/contrast.test.ts that
 * proves the title is legible over it. A peak edited in one place and not the
 * other is exactly the drift this site argues against, and it would fail
 * silently, on top of a photograph, where nobody would check.
 *
 * ---
 *
 * Why this is provable at all, when the comment it replaces said it was not.
 *
 * The scrim used to be fully opaque where the text sat, and the argument was
 * that text over an arbitrary photograph is the one contrast this site cannot
 * compute at build time, so the pixel under the glyphs had to be a known
 * colour. That argument was true about *opacity* and wrong about *computation*.
 *
 * A partly transparent scrim composites over the image, so the result depends on
 * the image. But it does not depend on it without limit: the worst the image can
 * do is put its most hostile pixel underneath, and there are only two candidates
 * for that, pure black and pure white. Bound the composite against the one that
 * pulls hardest toward the text colour and the ratio holds for every photograph
 * that could ever be dropped in, including ones that do not exist yet.
 *
 * There is now one bound rather than one per theme, because the scrim does not
 * follow the theme. See the note on the tokens below.
 *
 * The numbers are computed rather than quoted here; see the test.
 */

/**
 * Peak opacity of the scrim, at the top edge where the title sits.
 *
 * 0.9, and unlike every earlier value this one is not a taste setting with a
 * contrast consequence. It is the other way round: the title is the brand gold,
 * and gold is a mid-tone, so the peak is whatever makes gold legible over any
 * photograph. The AA floor for this pairing is 0.861. Below that the title fails
 * on a bright thumbnail and the failure is invisible on a dark one, which is the
 * worst way for it to fail.
 *
 * The history is worth keeping because it is the argument for computing this at
 * all. It went 0.8, then 0.7 on a reading of the rendered cards, then 0.9 when
 * the title turned gold. At 0.7 gold measures 2.53:1 and is unreadable on
 * FerMentor's pale phone screenshots while looking perfectly fine on Rollhaus,
 * whose thumbnail happens to be dark. Three different peaks were each right for
 * what the title was at the time.
 *
 * The cost is paid in the photograph, and it is the real one: at 0.9 the top of
 * the image is nearly gone where the title sits. That was the objection to the
 * opaque scrim this whole line of work started from, and the difference is that
 * the veil now ends. It is a band at the top rather than a floor under the text,
 * it fades to nothing well before the middle of the frame, and the subject of
 * every thumbnail in the grid sits below it.
 */
export const PEAK = 0.9;

/*
 * Seven stops, not three.
 *
 * The first draft faded from PEAK to nothing over three stops and left a visible
 * horizontal seam across the photograph. The eye reads a discontinuity in the
 * *rate* of change, not only in the value, so a linear ramp over a short runway
 * announces where it ends. These offsets and shares approximate a decelerating
 * curve, and the scrim has no bottom edge.
 *
 * `share` is a fraction of PEAK rather than an absolute alpha, so moving the
 * peak moves the whole curve with it and the shape survives.
 */
const STOPS: readonly { offset: number; share: number }[] = [
  { offset: 0, share: 1 },
  { offset: 34, share: 1 },
  { offset: 47, share: 0.86 },
  { offset: 60, share: 0.63 },
  { offset: 73, share: 0.38 },
  { offset: 86, share: 0.16 },
  { offset: 100, share: 0 },
];

/*
 * `scrim`, which is its own Semantic role and is dark in both themes. This
 * replaced `bg` on 2026-08-05, and the change is the more interesting half of
 * that day's work.
 *
 * Following the page background meant the veil flipped with the theme: a white
 * wash over a thumbnail in light mode, a dark one in dark mode. Rendered, the
 * light version was the weaker of the two by a distance. A pale band over a pale
 * card has nothing to separate it from the card, so it read as the card
 * spilling upward into the image rather than as something laid over it. Dark, it
 * reads as media chrome, which is what it is: the same move a subtitle makes,
 * and the reason subtitles do not invert with the surrounding page either.
 *
 * So the scrim is one of two Semantic colours on this site that do not vary by
 * theme, and `on-scrim` is the other. They have to move together. A title that
 * kept `fg` would be dark ink on a dark band in light mode, which is the exact
 * failure the pair exists to make unsayable.
 *
 * It also collapses the bound to a single number. The scrim, the text on it and
 * the worst pixel beneath it are now all theme-independent, so there is one
 * ratio rather than one per theme, and the test asserts that invariance directly
 * rather than measuring the same thing twice and trusting the numbers to agree.
 */
const stop = ({ offset, share }: { offset: number; share: number }) =>
  share === 0
    ? `transparent ${offset}%`
    : `color-mix(in srgb, var(--ds-color-scrim) ${Math.round(PEAK * share * 100)}%, transparent) ${offset}%`;

/** Top-anchored: opaque at the top edge, gone before the image is half spent. */
export const scrimGradient = `linear-gradient(to bottom, ${STOPS.map(stop).join(', ')})`;
