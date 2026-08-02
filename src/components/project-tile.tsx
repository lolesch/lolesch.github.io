import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/content/types';

export function ProjectTile({ project }: { project: Project }) {
  return (
    <article
      // position: relative so the link's ::after can cover the whole card, and
      // :has() so focus is visible on the card rather than only on the heading
      // text. Bordered rather than filled, and now for a different reason than
      // when it was written: `muted` on `surface` cleared AA when the CV palette
      // landed, so the constraint that decided this is the lens chip, which
      // measures 4.02:1 on `surface` in light and has to sit on `bg`.
      className="relative flex h-full flex-col overflow-hidden rounded-card border border-border-interactive has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-border-interactive"
    >
      {/*
        `border-media` rather than `border-interactive`: the image is inside the
        link but it is not the control, and borrowing the control token for
        media is a mistake _build-log.md already records once. Here it is a
        bottom edge only, because the card's own border carries the rest.

        Fixed aspect ratio with object-cover, so three thumbnails of different
        native sizes present as one row. Without it the grid's rhythm follows
        whatever the source images happen to measure.
      */}
      <div className="relative aspect-[16/10] w-full border-b border-border-media">
        <Image
          src={project.thumb.src}
          alt={project.thumb.alt}
          fill
          // The grid is auto-fill with a 22rem minimum on a 61rem content box,
          // so a tile is 29.75rem at its widest and full-width below roughly
          // 48rem, where the second column stops fitting. Telling the browser
          // that stops it shipping a full-width source for a card-sized slot.
          // Both numbers track src/components/project-grid.tsx: change the
          // track minimum and these move with it.
          sizes="(max-width: 48rem) 100vw, 30rem"
          className="object-cover"
        />
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

        <h3 className="type-subheading">
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

        <ul className="flex flex-wrap gap-tight">
          {project.lenses.map((lens) => (
            <li
              key={lens}
              // Text, never colour-coded alone: the lens name is the label and
              // the colour is a second channel on top of it. `capability` is the
              // role, because gold marks what someone was and green marks what
              // they can do. It sits on `bg` rather than inside a filled panel,
              // which is 4.02:1 in light.
              //
              // Horizontal only. A uniform `tight` inset read as tall and
              // narrow, because a full radius spends the horizontal space on
              // the curve and `meta`'s line box already supplies the height. So
              // the height comes from the role and the width is set here, which
              // is the one of the two a capsule actually has to decide.
              className="rounded-tag border border-capability px-stack type-meta text-capability"
            >
              {lens}
            </li>
          ))}
        </ul>

        <p className="type-body">{project.summary}</p>
      </div>
    </article>
  );
}
