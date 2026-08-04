import Image from 'next/image';
import Link from 'next/link';
import { LensChip } from '@/components/lens-chip';
import type { Project } from '@/content/types';

/**
 * `featured` renders at the full frame, `bridge` two-up. The prop exists because
 * two things vary with it and neither can be derived from CSS: the `sizes` hint,
 * which has to name a real width, and the title's type role, which is a
 * different job at 976px than at 470px rather than the same job scaled.
 *
 * It takes the size rather than reading `project.tier` so the component says
 * what it renders instead of knowing the taxonomy. Which tier gets which size is
 * src/components/project-grid.tsx's decision.
 */
export type TileSize = 'featured' | 'bridge';

export function ProjectTile({
  project,
  size = 'bridge',
}: {
  project: Project;
  size?: TileSize;
}) {
  return (
    <article
      // position: relative so the link's ::after can cover the whole card, and
      // :has() so focus is visible on the card rather than only on the heading
      // text. Bordered rather than filled, and now for a different reason than
      // when it was written: `muted` on `surface` cleared AA when the CV palette
      // landed, so the constraint that decided this is the lens chip, which
      // measures 4.02:1 on `surface` in light and has to sit on `bg`.
      //
      // `w-full` is load-bearing rather than defensive. The <li> around this is
      // a flex container, so without it the article sizes to its text content,
      // which is invisible in a two-column grid where the track sets the width
      // and obvious in a one-column one where nothing does.
      className="relative flex h-full w-full flex-col overflow-hidden rounded-card border border-border-interactive has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-border-interactive"
    >
      {/*
        `border-media` rather than `border-interactive`: the image is inside the
        link but it is not the control, and borrowing the control token for
        media is a mistake _build-log.md already records once. Here it is a
        bottom edge only, because the card's own border carries the rest.

        Fixed aspect ratio with object-cover, so thumbnails of different native
        sizes present as one row. Without it the grid's rhythm follows whatever
        the source images happen to measure.
      */}
      <div className="relative aspect-[16/10] w-full border-b border-border-media">
        <Image
          src={project.thumb.src}
          alt={project.thumb.alt}
          fill
          // Both branches name the width the tile actually gets, so the browser
          // stops shipping a full-viewport source into a card-sized slot. The
          // numbers track src/components/project-grid.tsx: a featured tile is
          // the 61rem content box, a bridge tile is 29.75rem at its widest and
          // full-width below roughly 48rem, where the second column stops
          // fitting. Change the track minimum and these move with it.
          sizes={
            size === 'featured'
              ? '(max-width: 64rem) 100vw, 61rem'
              : '(max-width: 48rem) 100vw, 30rem'
          }
          className="object-cover"
        />

        {/*
          The title sits on the image rather than under it, chosen from five
          rendered variants on 2026-08-04 (see `_build-log.md`). Two of them are
          the reason this one is a gradient and not a veil: a translucent wash
          over the whole thumbnail bleaches it, and Rollhaus is a *colour*
          configurator, so the wash destroyed the one thing its thumbnail is
          there to prove.

          The stops are the accessibility argument, not decoration. The bottom
          40% is fully opaque `bg`, so the text resolves against a known colour
          and the pair is `fg` on `bg`, already measured in CONTRAST_PAIRS at
          17.48:1. Text over an arbitrary photograph is the one contrast this
          site cannot compute at build time, and a page here claims it computes
          all of them. 40% rather than the 30% the variant shipped with: at
          bridge size the scrim is only ~162px tall, and 30% of that put the top
          of the glyphs outside the opaque zone.

          Left-aligned rather than centred, which was the other live option. Every
          other block on the page starts at the same left edge, the wordmark and
          the hero included, and the layout comments treat that as deliberate.
        */}
        <h3
          className={`absolute inset-x-0 bottom-0 flex min-h-[55%] items-end p-gutter ${
            size === 'featured' ? 'type-title' : 'type-heading'
          }`}
          style={{
            backgroundImage:
              'linear-gradient(to top, var(--ds-color-bg) 0%, var(--ds-color-bg) 40%, color-mix(in srgb, var(--ds-color-bg) 60%, transparent) 70%, transparent 100%)',
          }}
        >
          <Link
            href={`/projects/${project.slug}/`}
            // The whole card is the click target. The link name stays the
            // project title, which is what a screen reader reads out of a link
            // list. Wrapping the card in one <a> instead would flatten the
            // heading out of screen-reader navigation and name the link after
            // the entire tile, thumbnail alt text and all.
            className="after:absolute after:inset-0 hover:underline focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h3>
      </div>

      <div className="flex flex-col gap-tight p-gutter">
        {/*
          Two of the three schema fields, not all three. `role` came off on
          2026-08-02 because the chips below already say it and say it better:
          Rollhaus read "UX + design systems" here and then "UX/UI" and
          "Systems & Architecture" one line down, which is the same claim in two
          voices. The lenses are also the site's own taxonomy, the thing the v2
          Router will filter on, so between the two the chips are the one that
          has a second job.

          `year` and `context` stay. Neither is duplicated anywhere on the card,
          and "Course project, pair" is the honest label guardrail 5 asks for on
          the surface most people will read instead of the page. There is a
          guard on it in tests/export/static-export.test.ts.

          `role` is not lost: the detail page still opens with all three, which
          is where full attribution belongs and where nobody is scanning.
        */}
        <p className="type-meta text-muted">
          {project.year} · {project.context}
        </p>

        <ul className="flex flex-wrap gap-tight">
          {project.lenses.map((lens) => (
            <LensChip key={lens} lens={lens} />
          ))}
        </ul>

        <p className="type-body">{project.summary}</p>
      </div>
    </article>
  );
}
