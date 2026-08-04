import Link from 'next/link';
import type { ReactNode } from 'react';
import { LensChip } from '@/components/lens-chip';
import { ProjectTile } from '@/components/project-tile';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Lens } from '@/content/types';
import { projects } from '@/content/projects';

/*
 * The components in place, added 2026-08-04.
 *
 * The gap this closes: /design-system documented 12 Primitives, 16 Brand tokens,
 * 9 Semantic roles, 5 space steps, 7 sizes, 11 type roles and 3 radii, and did
 * not render a single control. A design-system page with no components reads as
 * a token dump to exactly the person it is written for.
 *
 * Every specimen below is the component that ships elsewhere, imported, not a
 * copy built for this page. That is the claim in the heading and it is why
 * LensChip was extracted out of ProjectTile to get here. A gallery of
 * reproductions would document a second system that happens to look like the
 * first one today.
 *
 * States are live rather than forced. Hover and focus cannot be shown statically
 * without pinning them as separate classes, which would mean shipping a copy of
 * each style for the copy to drift from, so the copy tells the reader to hover
 * and to tab instead. On a live page that is the more honest demonstration and
 * it costs nothing.
 */

const LENSES: readonly Lens[] = ['UX/UI', 'Systems & Architecture', 'Games / XR', 'AI Workflow'];

function Specimen({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <li className="rounded-card border border-border p-gutter">
      <h3 className="type-subheading">{label}</h3>
      <p className="mt-tight type-meta text-muted">{note}</p>
      <div className="mt-gap">{children}</div>
    </li>
  );
}

export function ComponentGallery() {
  /*
   * A real record rather than a fixture: a fixture would be content authored for
   * this page, and the page's whole position is that it shows what ships.
   *
   * FerMentor rather than the lead card, and by slug rather than by index so a
   * reorder of the grid cannot quietly change it. The first draft used
   * `projects[0]`, which is Rollhaus, and the export guard caught what that
   * meant: Rollhaus's summary reads "built on Figma variables and modes", and
   * putting it here would have left this page, which documents a code-first
   * token system that ADR-0002 explicitly defers any Figma sync for, carrying
   * the word Figma. A reader is entitled to infer from that page that the two
   * are connected. They are not, yet.
   *
   * The guard in tests/export/design-system.test.ts is what keeps that true if
   * this record's copy ever changes.
   */
  const specimen = projects.find((project) => project.slug === 'fermentor') ?? projects[0];

  return (
    <ul className="mt-gap grid gap-gap">
      <Specimen
        label="Links"
        note="Underline on hover, never colour alone. The nav marks the current page with the accent and a standing underline, so that state has two channels (SC 1.4.1). The second link below is that styling; the state itself belongs to the header, which is where it is true."
      >
        <div className="flex flex-wrap items-center gap-gap">
          <Link href="/about/" className="type-body underline-offset-4 hover:underline">
            A link to somewhere
          </Link>
          {/*
            Styling without `aria-current`, and the note above says so rather
            than letting the specimen look like a full copy of the nav item.
            The first draft carried the attribute and the guard in
            tests/export/nav.test.ts caught it: two links claiming `page` tells
            a screen reader the visitor is in two places, which is worse than a
            specimen that is honest about being one.
          */}
          <span className="type-body text-accent underline underline-offset-4">
            How the current page reads
          </span>
        </div>
      </Specimen>

      <Specimen
        label="Lens chips"
        note="The site's own taxonomy, on every project card. Green is the capability role: gold marks what someone was, green marks what they can do. The name is the label and the colour is a second channel on top of it."
      >
        <ul className="flex flex-wrap gap-tight">
          {LENSES.map((lens) => (
            <LensChip key={lens} lens={lens} />
          ))}
        </ul>
      </Specimen>

      <Specimen
        label="Theme switch"
        note="The same control as the one in the header, and it drives the same setting: throw either and every Semantic swatch on this page moves while the two layers above them hold still."
      >
        <ThemeToggle />
      </Specimen>

      <Specimen
        label="Focus"
        note="Tab through this page. Every control takes a two-pixel outline in the boundary role, offset by two, which is the one pair on the contrast table held at 3:1 rather than 4.5 because SC 1.4.11 governs it. The project card below outlines as a whole rather than around its title, because the whole card is the target."
      >
        <Link
          href="/about/"
          className="inline-block rounded-control type-body underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-interactive"
        >
          Tab to me
        </Link>
      </Specimen>

      <Specimen
        label="Project card"
        note="The largest thing the system assembles, and the only specimen here that is more than one role deep: a media frame, a gradient scrim carrying a title over it, a metadata line, the chips above, and a link whose target is the entire card."
      >
        {/*
          Bridge size rather than featured. At the full frame this is a 610px
          image inside a page about tokens, and the point is the composition
          rather than the photograph.

          Held to 30rem, which is the width `size="bridge"` tells the browser to
          fetch: on this page the reading measure is 48rem and one card in an
          auto-fill grid takes the whole track, so without this the specimen
          renders half again as wide as the thing it is a specimen of. An
          arbitrary value rather than a token, for the reason /about's 200px
          portrait is one: a width that serves a single element is not a
          Semantic role, and minting one would add a fourth layer to the three
          ADR-0003 names.
        */}
        <ul className="flex max-w-[30rem]">
          <li className="flex">
            <ProjectTile project={specimen} size="bridge" />
          </li>
        </ul>
      </Specimen>
    </ul>
  );
}
