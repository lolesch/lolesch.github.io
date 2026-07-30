import Image from 'next/image';
import { FIGURES } from '@/components/figures/registry';
import type { Section } from '@/content/types';

export function ProjectSections({ sections }: { sections: readonly Section[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.heading} className="mt-section">
          <h2 className="font-serif text-heading leading-tight">{section.heading}</h2>
          <SectionBody section={section} />
        </section>
      ))}
    </>
  );
}

function SectionBody({ section }: { section: Section }) {
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
            className="h-auto w-full rounded-card border border-border"
          />
          <figcaption className="mt-tight text-meta text-muted">{section.caption}</figcaption>
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
