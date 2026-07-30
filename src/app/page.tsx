import { WorkGrid } from '@/components/work-grid';
import { hero } from '@/content/hero';

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-gutter pt-gap pb-section">
      <h1 className="font-serif text-title leading-tight tracking-tight text-balance sm:text-display">
        {hero.headline}
      </h1>

      <div className="mt-stack space-y-stack text-lead text-muted">
        {hero.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>

      <WorkGrid />
    </main>
  );
}
