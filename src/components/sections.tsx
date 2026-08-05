import Image from 'next/image';
import { FIGURES } from '@/components/figures/registry';
import { PrototypeEmbed } from '@/components/prototype-embed';
import { SectionHeading } from '@/components/section-heading';
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
        // No `mt-section` here since 2026-08-05: SectionHeading carries it, so
        // the rule and the space above it cannot come apart.
        <section key={section.heading}>
          {/*
            1-based, because the index is read by a person rather than used as
            an offset. It counts sections on this page, which on a case study is
            the sequence the reader is actually in.
          */}
          <SectionHeading index={index + 1}>{section.heading}</SectionHeading>
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
        <div className="mt-gap space-y-gap type-body">
          {section.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          {section.link ? (
            <p>
              <a
                href={section.link.href}
                // Everything a section links to lives on someone else's domain,
                // so this is the same call the CV link makes: open elsewhere
                // rather than replace a page the reader was part-way through.
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4"
              >
                {section.link.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          ) : null}
        </div>
      );

    case 'constraints':
      return (
        // Bordered rather than filled, for the reason the tile is. `muted` on
        // `surface` clears AA on the CV palette and is in the contrast table,
        // so this could be filled now; it stays bordered because a page of
        // filled panels is the clutter CONTEXT.md's one anti-brand constraint
        // bans. The decorative `border` token is correct because a callout is
        // not a control.
        <dl className="mt-gap grid gap-gap rounded-card border border-border p-gutter type-body sm:grid-cols-2">
          {section.items.map((item) => (
            <div key={item.label}>
              <dt className="type-meta text-muted">{item.label}</dt>
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
          <figcaption className="mt-tight type-meta text-muted">{section.caption}</figcaption>
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
                <figcaption className="mt-tight type-meta text-muted">{state.label}</figcaption>
              </figure>
            ))}
          </div>
          <figcaption className="mt-gap type-meta text-muted">{section.caption}</figcaption>
        </figure>
      );

    case 'progression':
      return (
        <figure className="mt-gap">
          {/*
            One step per row at the full reading width, not two-up. At the
            two-column width these screenshots land near 350px, which puts the
            panel heading under 5px tall, and the panel changing is half of what
            the figure is for. Height is the cost and it is taken deliberately.

            <ol> rather than a stack of <figure>s: the steps are cumulative and
            the order is the argument, so it has to be in the markup rather than
            only in the layout.
          */}
          <ol className="space-y-gap">
            {section.steps.map((step, index) => (
              <li key={step.src}>
                <p className="type-meta text-muted">
                  <span className="type-emphasis text-fg">
                    {index + 1}. {step.label}
                  </span>{' '}
                  {step.note}
                </p>
                <Image
                  src={step.src}
                  alt={step.alt}
                  width={step.width}
                  height={step.height}
                  className="mt-tight h-auto w-full rounded-card border border-border"
                />
              </li>
            ))}
          </ol>
          <figcaption className="mt-gap type-meta text-muted">{section.caption}</figcaption>
        </figure>
      );

    case 'prototype':
      return (
        <figure className="mt-gap">
          {/* `href` is not passed: the facade is the button, and the link
              below it is this renderer's job. */}
          <PrototypeEmbed embedSrc={section.embedSrc} poster={section.poster} />
          <figcaption className="mt-tight type-meta text-muted">{section.caption}</figcaption>
          <p className="mt-gap type-body">
            <a
              href={section.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4"
            >
              Open the prototype in Figma
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </figure>
      );

    case 'embed': {
      const Figure = FIGURES[section.figure];
      return (
        <figure className="mt-gap">
          <Figure />
          <figcaption className="mt-tight type-meta text-muted">{section.caption}</figcaption>
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
