import { ProjectTile } from '@/components/project-tile';
import { projects } from '@/content/projects';

export function WorkGrid() {
  return (
    <section aria-labelledby="work" className="mt-section">
      <h2 id="work" className="font-serif text-heading">
        Work
      </h2>

      {/*
        auto-fill + minmax, so eighteen tiles need no layout change: the column
        count follows the container. min(100%, 17rem) stops the track exceeding
        the viewport on a narrow phone. No fixed heights, no truncation: tiles
        stretch to the row and the copy decides how tall a row is.
      */}
      <ul className="mt-gap grid grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))] gap-gap">
        {projects.map((project) => (
          <li key={project.slug} className="flex">
            <ProjectTile project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
