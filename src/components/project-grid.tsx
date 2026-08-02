import { ProjectTile } from '@/components/project-tile';
import { projects } from '@/content/projects';

export function ProjectGrid() {
  return (
    <section aria-labelledby="projects" className="mt-section">
      <h2 id="projects" className="type-heading">
        Projects
      </h2>

      {/*
        auto-fill + minmax, so eighteen tiles need no layout change: the column
        count follows the container. min(100%, 22rem) stops the track exceeding
        the viewport on a narrow phone. No fixed heights, no truncation: tiles
        stretch to the row and the copy decides how tall a row is.

        22rem rather than the 17rem this shipped with, and the number is doing
        one specific job. The grid sits on `frame` now rather than `measure`, so
        the content box is 61rem, and three 17rem tracks plus two gaps fit
        inside that: widening the page would have made the cards narrower.
        Above 19.4rem a third column no longer fits, at or below 29.75rem a
        second one still does, and 22rem sits inside both, so two columns arrive
        at roughly a 48rem viewport instead of waiting for a desktop. On the
        full frame a tile is 29.75rem, against 22rem before.
      */}
      <ul className="mt-gap grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] gap-gap">
        {projects.map((project) => (
          <li key={project.slug} className="flex">
            <ProjectTile project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
