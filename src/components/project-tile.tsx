import Link from 'next/link';
import type { Project } from '@/content/types';

export function ProjectTile({ project }: { project: Project }) {
  return (
    <article
      // position: relative so the link's ::after can cover the whole card, and
      // :has() so focus is visible on the card rather than only on the heading
      // text. Bordered rather than filled: `muted` on `surface` measures 4.40:1
      // in light, under AA, and this tile carries a muted metadata line.
      className="relative flex h-full flex-col gap-tight rounded-card border border-border-interactive p-gutter has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-border-interactive"
    >
      <p className="text-meta text-muted">
        {project.year} · {project.context} · {project.role}
      </p>

      <h3 className="font-serif text-subheading leading-tight">
        <Link
          href={`/work/${project.slug}/`}
          // The whole card is the click target. The link name stays the project
          // title, which is what a screen reader reads out of a link list.
          // Wrapping the card in one <a> instead would flatten the heading out
          // of screen-reader navigation and name the link after the entire tile.
          className="after:absolute after:inset-0 hover:underline focus-visible:outline-none"
        >
          {project.title}
        </Link>
      </h3>

      <ul className="flex flex-wrap gap-tight">
        {project.lenses.map((lens) => (
          <li
            key={lens}
            // Text, never colour-coded alone. The decorative `border` token is
            // correct here: a chip is not a control.
            className="rounded-tag border border-border p-tight text-meta text-muted"
          >
            {lens}
          </li>
        ))}
      </ul>

      <dl className="mt-tight space-y-tight text-body">
        <div>
          <dt className="text-meta text-muted">Problem</dt>
          <dd>{project.problem}</dd>
        </div>
        <div>
          <dt className="text-meta text-muted">What I did</dt>
          <dd>{project.whatIDid}</dd>
        </div>
        <div>
          <dt className="text-meta text-muted">What changed</dt>
          <dd>{project.whatChanged}</dd>
        </div>
      </dl>
    </article>
  );
}
