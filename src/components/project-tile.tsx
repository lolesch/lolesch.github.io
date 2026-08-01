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
          // The grid is auto-fill with a 17rem minimum, so a tile is never wider
          // than roughly a third of a 3xl container. Telling the browser that
          // stops it shipping a full-width source for a card-sized slot.
          sizes="(max-width: 40rem) 100vw, 20rem"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-tight p-gutter">
        <p className="text-meta text-muted">
          {project.year} · {project.context} · {project.role}
        </p>

        <h3 className="font-serif text-subheading leading-tight">
          <Link
            href={`/work/${project.slug}/`}
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
              className="rounded-tag border border-capability p-tight text-meta text-capability"
            >
              {lens}
            </li>
          ))}
        </ul>

        <p className="text-body">{project.summary}</p>
      </div>
    </article>
  );
}
