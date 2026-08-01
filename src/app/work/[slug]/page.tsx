import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentSections } from '@/components/sections';
import { projects } from '@/content/projects';

// trailingSlash: true is already set, so the export emits
// out/work/<slug>/index.html rather than out/work/<slug>.html.
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
    <main className="mx-auto max-w-3xl px-gutter pt-gap pb-section">
      <p className="type-meta text-muted">
        {project.year} · {project.context} · {project.role}
      </p>

      <h1 className="mt-tight type-title text-balance">{project.title}</h1>

      <ul className="mt-gap flex flex-wrap gap-tight">
        {project.lenses.map((lens) => (
          <li
            key={lens}
            // The same chip as the tile, in the same role. Text first, colour
            // second, on `bg` because `capability` on `surface` is under AA.
            className="rounded-tag border border-capability p-tight type-meta text-capability"
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
        <Link href="/" className="text-accent underline underline-offset-4">
          Back to all work
        </Link>
      </p>
    </main>
  );
}
