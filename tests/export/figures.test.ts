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
