import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { rollhausSlots } from '../../src/content/figures/rollhaus-slots';
import { projects } from '../../src/content/projects';
import type { Section } from '../../src/content/types';
import { body, text } from './rendered';

// The `embed` arm resolves a FigureId through a registry at render time. The
// typecheck proves the registry has an entry for every id; it cannot prove the
// component produced markup. This is that half: the figure's own copy has to
// reach the exported HTML.
describe('embedded figures (Seam 2)', () => {
  const embeds = projects.flatMap((project) =>
    project.sections
      .filter((section) => section.kind === 'embed')
      .map((section) => ({ project, section })),
  );

  it('ships at least one embed, so the cases below are not vacuous', () => {
    expect(embeds.length).toBeGreaterThan(0);
  });

  for (const { project, section } of embeds) {
    describe(`${project.slug} / ${section.figure}`, () => {
      const page = `out/projects/${project.slug}/index.html`;

      it('renders its heading and caption', () => {
        const visible = body(page);
        expect(visible).toContain(section.heading);
        expect(visible).toContain(section.caption);
      });
    });
  }

  it('renders the Rollhaus slot figure, honest limitation included', () => {
    const visible = body('out/projects/rollhaus/index.html');
    expect(visible).toContain(rollhausSlots.title);
    // Every screen the one card serves has to be named, or the figure is a
    // drawing of a tree rather than evidence of reuse.
    for (const screen of rollhausSlots.screens) {
      expect(visible).toContain(screen.name);
    }
    // The footnote is the one place the ad hoc naming limitation is stated.
    // Drop it in a refactor and the page starts overclaiming, quietly.
    expect(visible).toContain('the variable naming is ad hoc');
  });
});

// The `figure` arm had never shipped before this suite existed, so nothing had
// ever proved that path renders at all. Its failure mode is also quieter than
// the embed's: a figure whose `src` does not resolve still renders a heading, a
// caption and a neat empty box, so the page looks finished while its evidence
// is a broken image.
// Both image-bearing kinds, walked as one list. `comparison` ships four of the
// images on this site and every failure mode below is identical for it, so
// giving it a parallel describe block would mean two places to remember. The
// switch is closed with `never`, so a third image kind fails typecheck here
// rather than shipping unguarded, which is the mistake this file exists about.
// Heading and caption are copied out here rather than read back off the
// section later, so nothing downstream has to re-narrow `Section` to reach
// them. A prose section has no caption, and the cast that would paper over
// that is exactly the kind of thing these guards exist to not need.
type Shipped = {
  kind: 'figure' | 'comparison' | 'progression';
  heading: string;
  caption: string;
  src: string;
  alt: string;
  label: string | null;
};

const imagesOf = (section: Section): Shipped[] => {
  switch (section.kind) {
    case 'figure': {
      const { kind, heading, caption, src, alt } = section;
      return [{ kind, heading, caption, src, alt, label: null }];
    }
    case 'comparison': {
      const { kind, heading, caption } = section;
      return section.items.map(({ src, alt, label }) => ({
        kind,
        heading,
        caption,
        src,
        alt,
        label,
      }));
    }
    case 'progression': {
      const { kind, heading, caption } = section;
      return section.steps.map(({ src, alt, label }) => ({
        kind,
        heading,
        caption,
        src,
        alt,
        label,
      }));
    }
    // Named rather than defaulted, for the reason content.test.ts spells out:
    // a `default` arm answers for kinds nobody has thought about yet.
    case 'prose':
    case 'constraints':
    case 'embed':
    // The poster is checked by the facade's own describe block below, not by
    // this walker: it is a control's label rather than a figure.
    case 'prototype':
      return [];
    default: {
      const unhandled: never = section;
      throw new Error(`section kind not reached by the figure guards: ${JSON.stringify(unhandled)}`);
    }
  }
};

// No section index since 2026-08-05: the lead-figure rule went with the hero,
// so nothing here is about position any more.
const IMAGES = projects.flatMap((project) =>
  project.sections.flatMap((section) => imagesOf(section).map((state) => ({ project, state }))),
);

describe('image figures (Seam 2)', () => {
  it('ships image figures of both kinds, so the cases below are not vacuous', () => {
    expect(IMAGES.length).toBeGreaterThan(0);
    expect(IMAGES.some(({ state }) => state.kind === 'figure')).toBe(true);
    expect(IMAGES.some(({ state }) => state.kind === 'comparison')).toBe(true);
  });

  it('ships a progression whose steps stay in order', () => {
    const page = text('out/projects/rollhaus/index.html');
    const progression = projects
      .flatMap((project) => project.sections)
      .find((section) => section.kind === 'progression');
    expect(progression, 'no progression section ships').toBeDefined();
    if (progression?.kind !== 'progression') throw new Error('unreachable');

    // Order is the whole reason this is a separate kind from `comparison`: the
    // steps are cumulative, so a reader who gets them shuffled is reading a
    // different argument. Since 2026-08-05 it has to hold in two places rather
    // than one, because the images sit in a 2x2 grid and the notes are a list
    // underneath it. Both are asserted: a grid that reflowed and a list that
    // reordered are different bugs and only one of them is visible.
    const ordered = (needles: string[], what: string) => {
      const positions = needles.map((needle) => page.indexOf(needle));
      expect(positions.every((at) => at >= 0), `a ${what} is missing`).toBe(true);
      expect([...positions].sort((a, b) => a - b), `the ${what}s are out of order`).toEqual(
        positions,
      );
    };

    ordered(
      progression.steps.map((step) => step.src),
      'step image',
    );
    // The note rather than the label, and that is not incidental. Three of the
    // four labels are words that appear in the alt text of the images above
    // ("Select Your Pattern active"), so searching for a label finds the figure
    // and not the list, and the case passes or fails on which of the two the
    // string happens to hit first. The notes are prose that appears once.
    ordered(
      progression.steps.map((step) => step.note),
      'step note',
    );
  });

  for (const { project, state } of IMAGES) {
    describe(`${project.slug} / ${state.src}`, () => {
      const page = `out/projects/${project.slug}/index.html`;

      it('renders its heading and caption', () => {
        const visible = body(page);
        expect(visible).toContain(state.heading);
        expect(visible).toContain(state.caption);
      });

      it('carries its alt text, which is the copy a screen reader gets', () => {
        // `text`, not `body`: alt is an attribute, so React escapes the quotes
        // and apostrophes in it. Against raw markup this assertion passed only
        // for as long as no alt on the site contained either, which is a guard
        // that works until the first time it matters.
        expect(text(page)).toContain(state.alt);
      });

      if (state.label !== null) {
        it('names which state it is, or the pair is just two pictures', () => {
          expect(body(page)).toContain(state.label);
        });
      }

      it('is allowed to lazy-load, because the hero above it is the LCP', () => {
        const tag = body(page).match(new RegExp(`<img[^>]*${state.src}[^>]*>`))?.[0] ?? '';
        expect(tag, `no <img> found for ${state.src}`).not.toBe('');
      });

      it('points at a file that actually shipped', () => {
        // `next export` copies `public/` verbatim, so the asset lands at the
        // same path it is referenced by. Asserting the file rather than the
        // markup is the half the browser would otherwise discover first.
        expect(existsSync(`out${state.src}`), `${state.src} is missing from the export`).toBe(true);
      });
    });
  }
});

describe('the prototype facade (Seam 2)', () => {
  const page = 'out/projects/rollhaus/index.html';

  it('ships the poster and the outward link without the iframe', () => {
    const markup = body(page);
    // The whole point of a facade: nothing third-party is requested until the
    // reader asks. An <iframe> in the exported HTML means the facade regressed
    // into a plain embed, which loads Figma's application for someone who never
    // clicked.
    expect(markup).not.toContain('embed.figma.com');
    expect(markup).toContain('figma.com/proto/');
    expect(markup).toContain('rollhaus-editor-wheels.jpg');
  });
});

describe('the project hero (Seam 2)', () => {
  for (const project of projects) {
    it(`${project.slug} paints its card image eagerly at the top of the page`, () => {
      const markup = body(`out/projects/${project.slug}/index.html`);
      const tag = markup.match(new RegExp(`<img[^>]*${project.thumb.src}[^>]*>`))?.[0] ?? '';
      expect(tag, `no hero <img> found for ${project.thumb.src}`).not.toBe('');
      // The hero is the LCP on every project page now, so deferring it delays
      // the paint it defines. This is the rule the old lead-figure computation
      // used to carry, moved to the element that actually earns it.
      expect(tag).not.toContain('loading="lazy"');
    });
  }
});
