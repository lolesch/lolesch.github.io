import Image from 'next/image';
import { FIGURES } from '@/components/figures/registry';
import type { Section } from '@/content/types';

export function ContentSections({ sections }: { sections: readonly Section[] }) {
  // `next/image` lazy-loads by default, which is exactly wrong for the first
  // image on the page: it is the LCP candidate, so deferring it delays the
  // paint it defines. Decided here rather than on the content record, because
  // which image paints first is a property of the rendered page, not of the
  // copy. Later figures keep the default and stay lazy.
  //
  // `comparison` counts. It is the lead figure on Rollhaus, and a rule that
  // only knew about `figure` would have quietly handed the most important page
  // on the site a lazily loaded LCP image.
  const lead = sections.findIndex(
    (section) => section.kind === 'figure' || section.kind === 'comparison',
  );

  return (
    <>
      {sections.map((section, index) => (
        <section key={section.heading} className="mt-section">
          <h2 className="font-serif text-heading leading-tight">{section.heading}</h2>
          <SectionBody section={section} priority={index === lead} />
        </section>
      ))}
    </>
  );
}

function SectionBody({ section, priority }: { section: Section; priority: boolean }) {
  switch (section.kind) {
    case 'prose':
      return (
        <div className="mt-gap space-y-gap text-body">
          {section.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      );

    case 'constraints':
      return (
        // Bordered rather than filled, for the reason the tile is: `muted` on
        // `surface` measures 4.40:1 in light, under AA, and every value here
        // sits under a muted label. On `bg` both pairs are already in the
        // contrast table. The decorative `border` token is correct because a
        // callout is not a control.
        <dl className="mt-gap grid gap-gap rounded-card border border-border p-gutter text-body sm:grid-cols-2">
          {section.items.map((item) => (
            <div key={item.label}>
              <dt className="text-meta text-muted">{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      );

    case 'figure':
      return (
        <figure className="mt-gap">
          <Image
            src={section.src}
            alt={section.alt}
            width={section.width}
            height={section.height}
            priority={priority}
            className="h-auto w-full rounded-card border border-border"
          />
          <figcaption className="mt-tight text-meta text-muted">{section.caption}</figcaption>
        </figure>
      );

    case 'comparison':
      return (
        <figure className="mt-gap">
          {/*
            One column until `sm`. The pair is worth more side by side, but the
            two panel states are tall portraits: half of a phone viewport each
            would make them a comparison of two illegible things.

            Nested <figure> is valid and is the right element here: each state
            is a figure with its own caption, and the outer one captions the
            comparison. items-start so a shorter state sits at the top edge
            rather than centred against a taller one, which reads as sloppy
            alignment instead of as a difference in length.
          */}
          <div className="grid gap-gap sm:grid-cols-2 sm:items-start">
            {section.items.map((state) => (
              <figure key={state.src}>
                <Image
                  src={state.src}
                  alt={state.alt}
                  width={state.width}
                  height={state.height}
                  priority={priority}
                  sizes="(max-width: 40rem) 100vw, 22rem"
                  className="h-auto w-full rounded-card border border-border"
                />
                <figcaption className="mt-tight text-meta text-muted">{state.label}</figcaption>
              </figure>
            ))}
          </div>
          <figcaption className="mt-gap text-meta text-muted">{section.caption}</figcaption>
        </figure>
      );

    case 'embed': {
      const Figure = FIGURES[section.figure];
      return (
        <figure className="mt-gap">
          <Figure />
          <figcaption className="mt-tight text-meta text-muted">{section.caption}</figcaption>
        </figure>
      );
    }

    default: {
      // Adding an arm to Section without handling it here fails the build
      // rather than rendering nothing.
      const unhandled: never = section;
      throw new Error(`unhandled section kind: ${JSON.stringify(unhandled)}`);
    }
  }
}
