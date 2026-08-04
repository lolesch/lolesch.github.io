import { ProjectTile } from '@/components/project-tile';
import { projects } from '@/content/projects';

/*
 * Split by tier since 2026-08-04. `Project.tier` has carried
 * featured/bridge/archive since the model was written and nothing sorted by it;
 * this is the first thing that does, which is why the split cost no change to
 * the content.
 *
 * The reason is scanning rather than taste. Four equal cards say the four
 * projects are equally worth your time, and this site is Track C primary: the
 * two featured ones are the argument and the two bridge ones are the evidence
 * that the games and Unity half of the arc happened. Size says that faster than
 * order does, and it also keeps the page near 1900px, against roughly 3000 if
 * all four ran full width.
 *
 * `archive` renders nowhere yet because nothing carries it. When something does
 * it needs its own decision rather than falling into `bridge` by default, so the
 * filters below name the tiers they want instead of treating one as the else.
 */
const featured = projects.filter((project) => project.tier === 'featured');
const bridge = projects.filter((project) => project.tier === 'bridge');

export function ProjectGrid() {
  return (
    <section aria-labelledby="projects" className="mt-section">
      <h2 id="projects" className="type-heading">
        Projects
      </h2>

      {/*
        One column, so each tile is the full 61rem content box. A grid rather
        than a plain list because the gap token then applies the same way it
        does below, and the two groups sit on one rhythm.
      */}
      <ul className="mt-gap grid gap-gap">
        {featured.map((project) => (
          <li key={project.slug} className="flex">
            <ProjectTile project={project} size="featured" />
          </li>
        ))}
      </ul>

      {/*
        auto-fill + minmax, unchanged from when this held every project, so
        eighteen bridge tiles would need no layout change: the column count
        follows the container. min(100%, 22rem) stops the track exceeding the
        viewport on a narrow phone. No fixed heights, no truncation.

        22rem is doing one specific job. The grid sits on `frame`, so the content
        box is 61rem: above 19.4rem a third column no longer fits, at or below
        29.75rem a second one still does, and 22rem sits inside both, so two
        columns arrive at roughly a 48rem viewport instead of waiting for a
        desktop.

        No heading between the two groups. "Other work" would signal *lesser* on
        the two projects carrying the games half of the arc, and the size
        difference already says which to read first.
      */}
      <ul className="mt-gap grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] gap-gap">
        {bridge.map((project) => (
          <li key={project.slug} className="flex">
            <ProjectTile project={project} size="bridge" />
          </li>
        ))}
      </ul>
    </section>
  );
}
