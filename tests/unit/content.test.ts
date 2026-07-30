import { describe, expect, it } from 'vitest';
// Relative rather than the @/ alias: vitest.config.mts declares no path
// aliases, and adding one to run a test is a worse trade than a relative path.
import { projects } from '../../src/content/projects';

const bodies = (project: (typeof projects)[number]) =>
  project.sections.flatMap((section) =>
    section.kind === 'prose' ? [...section.body] : [section.caption],
  );

describe('project content', () => {
  it('ships at least one project', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it('gives every project a unique slug', () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  for (const project of projects) {
    describe(project.slug, () => {
      it('fills all three schema lines', () => {
        expect(project.problem.length).toBeGreaterThan(0);
        expect(project.whatIDid.length).toBeGreaterThan(0);
        expect(project.whatChanged.length).toBeGreaterThan(0);
      });

      it('never restates a tile line verbatim in a section', () => {
        // The tile said it. The page has to earn its own words.
        const lines = [project.problem, project.whatIDid, project.whatChanged];
        for (const body of bodies(project)) {
          for (const line of lines) {
            expect(body, `${project.slug} repeats a tile line verbatim`).not.toContain(line);
          }
        }
      });

      it('pads no section', () => {
        // A section exists only if it has substance (CONTEXT.md). An empty
        // heading with nothing under it is the padding this rule bans.
        for (const section of project.sections) {
          expect(section.heading.length).toBeGreaterThan(0);
          if (section.kind === 'prose') {
            expect(section.body.length).toBeGreaterThan(0);
            for (const paragraph of section.body) expect(paragraph.length).toBeGreaterThan(0);
          }
        }
      });

      it('uses no em-dash anywhere in its copy', () => {
        const everything = [
          project.title,
          project.year,
          project.context,
          project.role,
          project.problem,
          project.whatIDid,
          project.whatChanged,
          ...project.sections.map((section) => section.heading),
          ...bodies(project),
        ].join(' ');
        expect(everything).not.toContain('—');
      });
    });
  }
});
