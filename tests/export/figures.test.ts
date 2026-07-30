import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { rollhausArchitecture } from '../../src/content/figures/rollhaus-architecture';
import { projects } from '../../src/content/projects';
import { body } from './rendered';

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
      const page = `out/work/${project.slug}/index.html`;

      it('renders its heading and caption', () => {
        const visible = body(page);
        expect(visible).toContain(section.heading);
        expect(visible).toContain(section.caption);
      });
    });
  }

  it('renders the Rollhaus diagram, honest limitation included', () => {
    const visible = body('out/work/rollhaus/index.html');
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
describe('image figures (Seam 2)', () => {
  const figures = projects.flatMap((project) =>
    project.sections
      .filter((section) => section.kind === 'figure')
      .map((section) => ({ project, section })),
  );

  it('ships at least one image figure, so the cases below are not vacuous', () => {
    expect(figures.length).toBeGreaterThan(0);
  });

  for (const { project, section } of figures) {
    describe(`${project.slug} / ${section.src}`, () => {
      const page = `out/work/${project.slug}/index.html`;

      it('renders its heading and caption', () => {
        const visible = body(page);
        expect(visible).toContain(section.heading);
        expect(visible).toContain(section.caption);
      });

      it('carries its alt text, which is the copy a screen reader gets', () => {
        expect(body(page)).toContain(section.alt);
      });

      it('does not lazy-load the lead figure', () => {
        // The first figure on a page sits at or near the fold, so it is the LCP
        // candidate. `next/image` lazy-loads unless told otherwise, and a
        // lazily loaded LCP image is a self-inflicted performance mark on a
        // site whose argument is design engineering.
        const tag = body(page).match(new RegExp(`<img[^>]*${section.src}[^>]*>`))?.[0] ?? '';
        expect(tag, `no <img> found for ${section.src}`).not.toBe('');
        if (project.sections.findIndex((s) => s.kind === 'figure') === project.sections.indexOf(section)) {
          expect(tag).not.toContain('loading="lazy"');
        }
      });

      it('points at a file that actually shipped', () => {
        // `next export` copies `public/` verbatim, so the asset lands at the
        // same path it is referenced by. Asserting the file rather than the
        // markup is the half the browser would otherwise discover first.
        expect(existsSync(`out${section.src}`), `${section.src} is missing from the export`).toBe(
          true,
        );
      });
    });
  }
});
