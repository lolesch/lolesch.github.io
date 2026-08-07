import Image from 'next/image';
import { FIGURES } from '@/components/figures/registry';
import { PrototypeEmbed } from '@/components/prototype-embed';
import { SectionHeading } from '@/components/section-heading';
import type { Section } from '@/content/types';

export function ContentSections({ sections }: { sections: readonly Section[] }) {
  // No lead-figure rule since 2026-08-05. Every project page now opens on a
  // hero carrying `priority`, so the first figure inside the sections is no
  // longer the LCP candidate and marking it eager would only compete with the
  // image that is.
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
          {section.inset ? (
            /*
              Indented and held short of the reading width, which is what makes
              this read as part of the section rather than as an unlabelled
              figure that lost its caption. No <figure> element and no
              <figcaption>: a figure is a thing with a caption, and this one
              deliberately says nothing. The alt still carries the description,
              because that is where a reader who cannot see it gets one.

              Padding on a wrapper rather than a margin on the image. `ml-gutter`
              with `w-full` adds the indent to a width that is already the whole
              column, so on a phone the image ran a gutter past the text it is
              indented from. Padding takes the indent out of the width instead,
              which is the only version that holds at every viewport.
            */
            <div className="pl-gutter">
              <Image
                src={section.inset.src}
                alt={section.inset.alt}
                width={section.inset.width}
                height={section.inset.height}
                sizes="(max-width: 40rem) 100vw, 26rem"
                className="h-auto w-full max-w-[26rem] rounded-card border border-border"
              />
            </div>
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
            Two up, and the notes collected underneath. This reverses what stood
            here until 2026-08-05, which put one step per row at the full reading
            width and argued that halving the width puts the editor's panel
            heading under 5px tall. That cost is real and it is still paid. It
            stopped being the deciding one on Leonid's reading of the rendered
            page: a paragraph between every pair of screenshots meant the reader
            compared four near-identical states from memory, which is the exact
            failure that made `comparison` its own kind in the first place.
            Contiguous, the four differences are one glance apart, and the panel
            at full size is what the prototype section below is for.

            An <ol> for the notes and a plain grid for the images, rather than
            two lists numbering the same four things. The order is still the
            argument and it is still in the markup: the list carries it, and the
            grid's reading order maps onto it, 1 and 2 above 3 and 4.

            `gap-tight` rather than `gap-gap`, which is what the comparison pair
            uses. That pair is two things being told apart; this is one block
            being read as a sequence, and the wider gutter makes it four.
          */}
          <div className="grid gap-tight sm:grid-cols-2">
            {section.steps.map((step) => (
              <Image
                key={step.src}
                src={step.src}
                alt={step.alt}
                width={step.width}
                height={step.height}
                sizes="(max-width: 40rem) 100vw, 22rem"
                className="h-auto w-full rounded-card border border-border"
              />
            ))}
          </div>
          <ol className="mt-gap space-y-tight type-meta text-muted">
            {section.steps.map((step, index) => (
              <li key={step.label}>
                <span className="type-emphasis text-fg">
                  {index + 1}. {step.label}
                </span>{' '}
                {step.note}
              </li>
            ))}
          </ol>
          <figcaption className="mt-gap type-meta text-muted">{section.caption}</figcaption>
        </figure>
      );

    case 'prototype':
      return (
        <figure className="mt-gap">
          {/*
            A portrait poster is a phone. Across the full reading column it
            renders at roughly twice life size, and Figma then letterboxes the
            prototype inside that box down to about a fifth of it. 22rem is the
            width the comparison renderer already gives every phone screenshot
            on this site, so a mobile prototype sits at the same size as the
            figures around it. A landscape poster is untouched and still takes
            the column, which is what Rollhaus wants.
          */}
          <div
            className={
              section.poster.height > section.poster.width ? 'mx-auto max-w-[22rem]' : undefined
            }
          >
            {/* `href` is not passed: the facade is the button, and the link
                below it is this renderer's job. */}
            <PrototypeEmbed
              embedSrc={section.embedSrc}
              poster={section.poster}
              title={section.title}
              action={section.action}
            />
          </div>
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
