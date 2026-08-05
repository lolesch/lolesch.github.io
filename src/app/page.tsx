import { ProjectGrid } from '@/components/project-grid';
import { hero } from '@/content/hero';

export default function Home() {
  return (
    /*
     * The only page with no width of its own: the layout's frame is the width,
     * because the grid below wants all of it.
     *
     * What changed on 2026-08-05 is which parts are held to `measure`. It used
     * to be the whole hero, headline included, and at 1440px that left a 447px
     * empty stripe down the right of every line of the first thing anyone reads,
     * with a 48px headline sitting in it. Restraint and an unfinished column
     * look identical from the outside, and this page was being read as the
     * second one.
     *
     * Now the headline takes the frame and only the reading does not. That is
     * the distinction `frame` and `measure` were split for in the first place:
     * a paragraph has a width past which it stops being readable, and a
     * headline is not a paragraph.
     *
     * No `mx-auto` on the measure, which is unchanged and is still the whole
     * difference between this reading as one page and as two. Centred, the lead
     * sat 8rem inside both the grid and the wordmark, so the page had three left
     * edges and the first thing anyone reads was the one that lined up with
     * nothing. Flush left it shares an edge with both, and the short line just
     * ends early, which is what a reading column is supposed to do.
     */
    <main className="pt-section pb-section">
      {/*
        The eyebrow answers who, which the headline deliberately does not. `mb`
        is `tight` rather than `stack`: it is a label *on* the headline, and at
        stack it read as a line of its own with a gap under it.
      */}
      <p className="type-eyebrow text-accent">{hero.eyebrow}</p>

      {/*
        One role, `hero`, at every width. It was `type-title sm:type-display`
        until 2026-08-05, which stepped 32px to 48px at a breakpoint; the role
        is fluid instead, so the size follows the viewport with no jump in the
        middle of the largest thing on the site. See the note on the utility in
        globals.css.

        text-balance stays. Wrapping is a hint about this sentence rather than a
        type decision, which is why the fifth discipline rule leaves it alone,
        and it matters more here than it did at 48px: at the top of the ramp an
        unbalanced last line is one orphaned word at 88px.
      */}
      <h1 className="mt-tight type-hero text-balance">{hero.headline}</h1>

      <div className="measure">
        <div className="mt-stack space-y-stack type-lead text-muted">
          {hero.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        {/*
          Both controls are the same shape and differ by fill, which is the
          smallest difference that still reads as an order. The filled one is
          `text-bg` on `bg-accent` rather than a white that would be a literal:
          the page background is white in light and near-black in dark, which is
          exactly the direction the type on gold has to move to stay legible in
          both. Measured at 4.54:1 light and 6.87:1 dark, and listed in
          CONTRAST_PAIRS so the build holds it there.

          `border-border-interactive` on the second, because these are the only
          two controls on the page and SC 1.4.11 wants the boundary at 3:1. The
          filled one needs no border: its own fill is the boundary.
        */}
        <div className="mt-gap flex flex-wrap gap-tight">
          {hero.actions.map((action) => (
            <a
              key={action.href}
              href={action.href}
              // The CV is the one that leaves, and it opens elsewhere for the
              // reason ContactLinks gives: a PDF replacing the site is a dead
              // end for a reader who was about to keep reading.
              target={action.primary ? undefined : '_blank'}
              rel={action.primary ? undefined : 'noopener noreferrer'}
              className={`rounded-control px-gutter py-tight type-body transition-[background-color,border-color] motion-state ${
                action.primary
                  ? 'bg-accent text-bg hover:bg-fg'
                  : 'border border-border-interactive hover:border-fg'
              }`}
            >
              {action.label}
              {action.primary ? null : <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          ))}
        </div>
      </div>

      <ProjectGrid />
    </main>
  );
}
