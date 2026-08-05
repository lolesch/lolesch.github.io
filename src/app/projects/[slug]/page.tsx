import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ContentSections } from '@/components/sections';
import { projects } from '@/content/projects';
import { scrimGradient } from '@/lib/scrim';

// trailingSlash: true is already set, so the export emits
// out/projects/<slug>/index.html rather than out/projects/<slug>.html.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

const find = (slug: string) => projects.find((project) => project.slug === slug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = find((await params).slug);
  if (!project) return {};
  return {
    // Middot rather than an em-dash, matching the root layout.
    title: `${project.title} · Leonid Schreiber`,
    description: project.problem,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = find((await params).slug);
  if (!project) notFound();

  return (
    <main className="measure pt-gap pb-section">
      {/*
        The card's image, in the card's treatment, at the top of the page it
        opens. Added 2026-08-05: Leonid's note was that clicking a card entered a
        new page and the visual was gone. Repeating the thumbnail under a
        separate heading would have answered that literally and read as two
        pictures; the same image in the same scrim reads as the card growing,
        which is also what the view transition in globals.css animates.

        A one-cell grid rather than a positioned box, matching
        src/components/project-tile.tsx exactly, so the `em`-relative scrim
        insets behave identically at both sizes. The <h1> lives inside it: the
        page had a scrim title and a separate headline for about ten minutes
        during the build, and one of them was always redundant.
      */}
      <div className="grid aspect-[16/10] w-full overflow-hidden rounded-card border border-border-media">
        <div className="relative col-start-1 row-start-1">
          <Image
            src={project.thumb.src}
            alt={project.thumb.alt}
            fill
            // The LCP on this page, so never lazy. `sizes` names the reading
            // column, which is the width this actually gets.
            priority
            sizes="(max-width: 48rem) 100vw, 48rem"
            className="object-cover"
            // Paired against the same name on the card in
            // src/components/project-tile.tsx. Only one element carrying a given
            // name may be visible at a time, which is why it is per slug rather
            // than a constant: the home grid renders four cards at once.
            style={{ viewTransitionName: `thumb-${project.slug}` }}
          />
        </div>
        <h1
          className="col-start-1 row-start-1 z-10 self-start p-[0.75em] pb-[2.25em] text-center type-display text-on-scrim"
          style={{ backgroundImage: scrimGradient }}
        >
          {project.title}
        </h1>
      </div>

      {/*
        All three, unlike the card, which dropped `role` on 2026-08-02 because
        the chips below it were already saying the same thing. Here it stays:
        this is the page that carries the full attribution, the reader has
        stopped scanning, and the two are far enough apart in the reading to be
        a statement and its summary rather than an echo.
      */}
      <p className="mt-gap type-meta text-muted">
        {project.year} · {project.context} · {project.role}
      </p>

      <ul className="mt-gap flex flex-wrap gap-tight">
        {project.lenses.map((lens) => (
          <li
            key={lens}
            // The same chip as the tile, in the same role, down to the
            // horizontal-only inset. Text first, colour second, on `bg` because
            // `capability` on `surface` is under AA.
            className="rounded-tag border border-capability px-stack type-meta text-capability"
          >
            {lens}
          </li>
        ))}
      </ul>

      {/*
        The card carries a thumbnail and a summary, not these three lines, so
        the page is where they live. Label/value pairs rather than prose for the
        same reason the constraints callout is: the reader scans them before the
        writing has to work. This inverts the rule that stood here until
        2026-07-31, when the grid became image-led.
      */}
      <dl className="mt-gap space-y-gap border-l border-border pl-gutter type-body">
        <div>
          <dt className="type-meta text-muted">Problem</dt>
          <dd>{project.problem}</dd>
        </div>
        <div>
          <dt className="type-meta text-muted">What I did</dt>
          <dd>{project.whatIDid}</dd>
        </div>
        <div>
          <dt className="type-meta text-muted">What changed</dt>
          <dd>{project.whatChanged}</dd>
        </div>
      </dl>

      {/*
        Then the sections that exist, and stop. A project with nothing verified
        to say yet is a short page, which is the no-padding rule working.
      */}
      <ContentSections sections={project.sections} />

      <p className="mt-section type-body">
        {/*
          A plain anchor rather than next/link since 2026-08-05, for the reason
          spelled out in globals.css: `@view-transition` only fires on a real
          document navigation, so a client-side route change back to the grid
          would skip the reverse morph.
        */}
        <a href="/" className="text-accent underline underline-offset-4">
          Back to all projects
        </a>
      </p>
    </main>
  );
}
