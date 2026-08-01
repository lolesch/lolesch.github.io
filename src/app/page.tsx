import { WorkGrid } from '@/components/work-grid';
import { hero } from '@/content/hero';

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-gutter pt-gap pb-section">
      {/*
        Two roles rather than a size that grows: `title` is the h1 everywhere on
        the site, and Home is the one page where it steps up to `display` when
        there is room. text-balance stays, because wrapping is not a type
        decision and the fifth discipline rule leaves it alone.
      */}
      <h1 className="type-title text-balance sm:type-display">{hero.headline}</h1>

      <div className="mt-stack space-y-stack type-lead text-muted">
        {hero.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>

      <WorkGrid />
    </main>
  );
}
