import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectSections } from '@/components/project-sections';
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
      <p className="text-meta text-muted">
        {project.year} · {project.context} · {project.role}
      </p>

      <h1 className="mt-tight font-serif text-title leading-tight tracking-tight text-balance">
        {project.title}
      </h1>

      <ul className="mt-gap flex flex-wrap gap-tight">
        {project.lenses.map((lens) => (
          <li key={lens} className="rounded-tag border border-border p-tight text-meta text-muted">
            {lens}
          </li>
        ))}
      </ul>

      {/*
        The page renders the sections that exist and stops. It never restates
        the three tile lines: the visitor just clicked them, so the page opens
        where the tile stopped. A project with nothing verified to say yet is a
        short page, which is the no-padding rule working.
      */}
      <ProjectSections sections={project.sections} />

      <p className="mt-section text-body">
        <Link href="/" className="underline underline-offset-4">
          Back to all work
        </Link>
      </p>
    </main>
  );
}
