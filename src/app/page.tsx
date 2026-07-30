import { hero } from '@/content/hero';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-gutter py-section">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      <h1 className="font-serif text-4xl leading-tight tracking-tight text-balance sm:text-5xl">
        {hero.headline}
      </h1>

      <div className="mt-stack space-y-stack text-lg text-muted">
        {hero.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
