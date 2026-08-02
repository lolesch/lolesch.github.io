import { describe, expect, it } from 'vitest';
// Relative rather than the @/ alias: vitest.config.mts declares no path
// aliases, and adding one to run a test is a worse trade than a relative path.
import { fermentor, projects } from '../../src/content/projects';
import type { Project } from '../../src/content/types';

// Every record that has been written, including the ones not in the array yet.
// FerMentor is authored and held back until its thumbnail exists, and a record
// waiting on an asset is exactly the one most likely to drift: nothing renders
// it, so nothing would catch an em-dash or an empty section in it until the day
// it ships. The thumbnail rules run separately below, over the shipped array.
const AUTHORED: readonly Omit<Project, 'thumb'>[] = [...projects, fermentor];

// Every string a visitor reads inside a section, whatever kind it is. A new
// section kind whose copy is not reachable from here ships past every rule
// below, which is exactly how figure copy escaped these guards once already.
//
// There is no `default` arm on purpose, and that is the whole point of this
// shape. A `default` is what let the same bug land three times: it silently
// answers for kinds nobody has thought about yet, so `constraints` shipped
// label/value pairs past these rules, and `figure` shipped `alt` past them.
// `alt` is copy: it reaches screen readers and it sits in the exported HTML.
// With every kind named explicitly and `never` closing the switch, adding an
// arm to `Section` fails typecheck here until its copy is accounted for.
const bodies = (project: Omit<Project, 'thumb'>) =>
  project.sections.flatMap((section): string[] => {
    switch (section.kind) {
      case 'prose':
        return [...section.body];
      case 'constraints':
        return section.items.flatMap((item) => [item.label, item.value]);
      case 'figure':
        return [section.caption, section.alt];
      case 'comparison':
        // Both alts and both labels, not just the caption. The label is the
        // only thing telling a reader which state is which, so it is copy in
        // the same sense the alt is.
        return [section.caption, ...section.items.flatMap((s) => [s.label, s.alt])];
      case 'embed':
        return [section.caption];
      default: {
        const unhandled: never = section;
        throw new Error(`section kind not reached by the copy guards: ${JSON.stringify(unhandled)}`);
      }
    }
  });

describe('project content', () => {
  it('ships at least one project', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it('gives every project a unique slug', () => {
    // Across everything authored, not just what ships: a held-back record that
    // collides with a live slug would take the route with it when it lands.
    const slugs = AUTHORED.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  for (const project of projects) {
    describe(`${project.slug} thumbnail`, () => {
      it('carries a thumbnail with alt text', () => {
        // The thumb is inside the card's link target, so its alt is the copy a
        // screen reader gets for the image half of that link. An empty alt here
        // is not a decorative image, it is a missing description.
        expect(project.thumb.src.startsWith('/')).toBe(true);
        expect(project.thumb.alt.length).toBeGreaterThan(0);
        expect(project.thumb.width).toBeGreaterThan(0);
        expect(project.thumb.height).toBeGreaterThan(0);
      });

      it('uses no em-dash in its alt text', () => {
        expect(project.thumb.alt).not.toContain('—');
      });
    });
  }

  for (const project of AUTHORED) {
    describe(project.slug, () => {
      it('fills all three schema lines', () => {
        expect(project.problem.length).toBeGreaterThan(0);
        expect(project.whatIDid.length).toBeGreaterThan(0);
        expect(project.whatChanged.length).toBeGreaterThan(0);
      });

      it('carries a summary that is not a schema line', () => {
        // The card hook is written for the card. Reusing a schema line here
        // would put the same sentence in two places and make the detail page
        // opener read as an echo.
        expect(project.summary.length).toBeGreaterThan(0);
        for (const line of [project.problem, project.whatIDid, project.whatChanged]) {
          expect(project.summary).not.toBe(line);
        }
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
          if (section.kind === 'comparison') {
            // The type already fixes the pair at two. What it cannot say is
            // that each state is actually pointing at something and named: an
            // unlabelled state turns a comparison into two pictures.
            for (const state of section.items) {
              expect(state.label.length).toBeGreaterThan(0);
              expect(state.alt.length).toBeGreaterThan(0);
              expect(state.src.startsWith('/')).toBe(true);
              expect(state.width).toBeGreaterThan(0);
              expect(state.height).toBeGreaterThan(0);
            }
            // Two states of one screen have to be told apart by the label.
            const [first, second] = section.items;
            expect(first.label).not.toBe(second.label);
            expect(first.src).not.toBe(second.src);
          }
          if (section.kind === 'constraints') {
            // A callout with no rows, or a labelled row with nothing in it, is
            // the same padding the rule above bans in prose.
            expect(section.items.length).toBeGreaterThan(0);
            for (const item of section.items) {
              expect(item.label.length).toBeGreaterThan(0);
              expect(item.value.length).toBeGreaterThan(0);
            }
          }
        }
      });

      it('uses no em-dash anywhere in its copy', () => {
        const everything = [
          project.title,
          project.year,
          project.context,
          project.role,
          project.summary,
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
