import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { rollhausArchitecture } from '../../src/content/figures/rollhaus-architecture';
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

  it('renders the Rollhaus diagram, honest limitation included', () => {
    const visible = body('out/projects/rollhaus/index.html');
    expect(visible).toContain(rollhausArchitecture.title);
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
      return [];
    default: {
      const unhandled: never = section;
      throw new Error(`section kind not reached by the figure guards: ${JSON.stringify(unhandled)}`);
    }
  }
};

// The section index rides along, because the lead-figure rule below is about
// position rather than about the image.
const IMAGES = projects.flatMap((project) =>
  project.sections.flatMap((section, index) =>
    imagesOf(section).map((state) => ({ project, index, state })),
  ),
);

// Which section owns the LCP image, by the same rule sections.tsx uses. Kept
// as its own function so the two cannot drift apart silently: they did once,
// when `comparison` became the lead figure on Rollhaus and this file still
// only looked for `figure`.
const leadIndex = (project: (typeof projects)[number]) =>
  project.sections.findIndex(
    (section) => section.kind === 'figure' || section.kind === 'comparison',
  );

describe('image figures (Seam 2)', () => {
  it('ships image figures of both kinds, so the cases below are not vacuous', () => {
    expect(IMAGES.length).toBeGreaterThan(0);
    expect(IMAGES.some(({ state }) => state.kind === 'figure')).toBe(true);
    expect(IMAGES.some(({ state }) => state.kind === 'comparison')).toBe(true);
  });

  it('ships a progression whose steps are numbered in order', () => {
    const page = body('out/projects/rollhaus/index.html');
    const progression = projects
      .flatMap((project) => project.sections)
      .find((section) => section.kind === 'progression');
    expect(progression, 'no progression section ships').toBeDefined();
    if (progression?.kind !== 'progression') throw new Error('unreachable');

    // An <ol> rather than a stack of <figure>s is the whole reason this is a
    // separate kind: the steps are cumulative, so a screen reader has to get
    // the order. Asserting the labels appear in source order is what proves
    // the list was not reshuffled by a grid.
    const positions = progression.steps.map((step) => page.indexOf(step.label));
    expect(positions.every((at) => at >= 0), 'a step label is missing').toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  for (const { project, index, state } of IMAGES) {
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

      it('does not lazy-load the lead figure', () => {
        // The first figure on a page sits at or near the fold, so it is the LCP
        // candidate. `next/image` lazy-loads unless told otherwise, and a
        // lazily loaded LCP image is a self-inflicted performance mark on a
        // site whose argument is design engineering.
        const tag = body(page).match(new RegExp(`<img[^>]*${state.src}[^>]*>`))?.[0] ?? '';
        expect(tag, `no <img> found for ${state.src}`).not.toBe('');
        if (leadIndex(project) === index) {
          expect(tag).not.toContain('loading="lazy"');
        }
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
