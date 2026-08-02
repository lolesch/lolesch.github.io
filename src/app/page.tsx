import { ProjectGrid } from '@/components/project-grid';
import { hero } from '@/content/hero';

export default function Home() {
  return (
    /*
     * The only page with no width of its own: the layout's frame is the width,
     * because the grid below wants all of it. Only the hero is held to
     * `measure`, so the reading stays at a reading width while the cards do
     * not. The two used to be one number, which is why two cards had to share a
     * container sized for a paragraph.
     *
     * No `mx-auto` on that measure, which is the whole difference between this
     * reading as one page and as two. Centred, the hero sat 8rem inside both
     * the grid and the wordmark, so the page had three left edges and the first
     * thing anyone reads was the one that lined up with nothing. Flush left it
     * shares an edge with both, and the short line just ends early, which is
     * what a reading column is supposed to do.
     */
    <main className="pt-gap pb-section">
      <div className="measure">
        {/*
          Two roles rather than a size that grows: `title` is the h1 everywhere
          on the site, and Home is the one page where it steps up to `display`
          when there is room. text-balance stays, because wrapping is not a type
          decision and the fifth discipline rule leaves it alone.
        */}
        <h1 className="type-title text-balance sm:type-display">{hero.headline}</h1>

        <div className="mt-stack space-y-stack type-lead text-muted">
          {hero.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </div>

      <ProjectGrid />
    </main>
  );
}
