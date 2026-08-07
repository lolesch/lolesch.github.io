import type { Metadata } from 'next';
import Image from 'next/image';
import { ContactLinks } from '@/components/contact-links';
import { ReadingPage } from '@/components/reading-page';
import { ContentSections } from '@/components/sections';
import { about } from '@/content/about';
import { contentsOf } from '@/lib/sections';

// trailingSlash: true is already set, so the export emits out/about/index.html
// rather than out/about.html, which Pages serves more predictably.
export const metadata: Metadata = {
  // Middot rather than an em-dash, matching the root layout.
  title: 'About · Leonid Schreiber',
  description: about.intro,
};

export default function AboutPage() {
  return (
    /*
     * The frame and the gutter are on the layout, so this page says only how
     * wide its own reading is, and it sits flush left inside that frame rather
     * than centred in the viewport. Centring it would put the text 8rem inside
     * the wordmark above it.
     *
     * `measure` moved onto ReadingPage when the section rail landed, along with
     * the row it needs. All three reading pages had these exact classes.
     */
    <ReadingPage sections={contentsOf(about.sections)}>
      <div className="flex flex-wrap items-center gap-gap">
        <Image
          src={about.portrait.src}
          alt={about.portrait.alt}
          width={about.portrait.width}
          height={about.portrait.height}
          // The LCP candidate on this route. `next/image` lazy-loads by
          // default, which is exactly wrong for the image that defines the
          // paint. Decided here rather than on the content record, for the same
          // reason src/components/sections.tsx decides it for a lead figure:
          // which image paints first is a property of the page, not the copy.
          priority
          // 200px is an arbitrary value on purpose. A size that serves one
          // image is not a Semantic role, and minting a token for it would add
          // a fourth layer to the three ADR-0003 names. The 505px source caps a
          // clean render at roughly 250px at 2x, so this has headroom.
          //
          // aspect-square plus object-cover is load-bearing rather than
          // decorative: the source is 505x518, so rounded-full on the raw
          // aspect would give a slight ellipse. The crop also removes the
          // photo's dark vignette corners, which as a rectangle would read as a
          // bright square with dirty corners on the dark theme.
          // border-4 rather than the 1px hairline it shipped with: `border`
          // is the width the tile's bottom edge uses, and a ring around a
          // portrait is doing a different job from an edge between two parts
          // of a card. At 200px across, 4px is the width at which the frame
          // reads as chosen rather than as the image having an outline.
          className="size-[200px] shrink-0 rounded-full border-4 border-border-media object-cover"
        />

        <div className="flex-1 basis-64">
          <h1 className="type-title text-balance">About</h1>
          <p className="mt-gap type-lead text-muted">{about.intro}</p>
        </div>
      </div>

      <ContentSections sections={about.sections} />

      <ContactLinks contact={about.contact} cv={about.cv} />
    </ReadingPage>
  );
}
