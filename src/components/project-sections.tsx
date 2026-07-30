import Image from 'next/image';
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

    default: {
      // Adding an arm to Section without handling it here fails the build
      // rather than rendering nothing.
      const unhandled: never = section;
      throw new Error(`unhandled section kind: ${JSON.stringify(unhandled)}`);
    }
  }
}
